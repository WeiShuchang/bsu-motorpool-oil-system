<?php

namespace App\Http\Controllers;

use App\Exports\ServiceRecordsExport;
use App\Exports\VehiclesExport;
use App\Models\ServiceRecordModel;
use App\Models\VehicleModel;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class ReportsController extends Controller
{
         public function showExportPage(): Response
    {
        return Inertia::render('Admin/Export', [
            'vehicles' => VehicleModel::select('id', 'make', 'model', 'plate_number')->get(),
        ]);
    }


    public function export(Request $request)
    {
        $request->validate([
            'type'       => 'required|in:service,vehicle',
            'format'     => 'required|in:pdf,xlsx',
            'period'     => 'required_if:type,service|in:today,week,month,year,overall',
            'vehicle_id' => 'nullable|exists:vehicle_models,id',
        ]);

        $type      = $request->input('type');
        $format    = $request->input('format');
        $period    = $request->input('period', 'month');
        $vehicleId = $request->input('vehicle_id');

        return match (true) {
            $type === 'service' && $format === 'pdf'  => $this->serviceRecordsPdf($period),
            $type === 'service' && $format === 'xlsx' => $this->serviceRecordsXlsx($period),
            $type === 'vehicle' && $format === 'pdf'  => $this->vehiclesPdf($vehicleId),
            $type === 'vehicle' && $format === 'xlsx' => $this->vehiclesXlsx($vehicleId),
        };
    }

    private function serviceRecordsPdf(string $period)
    {
        $records = ServiceRecordModel::with(['vehicle', 'driver'])  // driver eager-loaded correctly
            ->whereBetween('service_date', $this->dateRange($period))
            ->orderBy('service_date', 'desc')
            ->get();

        $pdf = Pdf::loadView('reports.service-records', [
            'records'     => $records,
            'periodLabel' => $this->periodLabel($period),
        ])->setPaper('a4', 'landscape');

        $filename = "service-records-{$period}-" . now()->format('Ymd') . '.pdf';
        return $pdf->download($filename);
    }

    private function serviceRecordsXlsx(string $period)
    {
        $filename = "service-records-{$period}-" . now()->format('Ymd') . '.xlsx';
        return Excel::download(new ServiceRecordsExport($period), $filename);
    }

    private function vehiclesPdf(?int $vehicleId)
    {
        $query = VehicleModel::with('drivers');

        if ($vehicleId) {
            $query->where('id', $vehicleId);
        }

        $vehicles = $query->orderBy('make')->get()->map(function ($vehicle) {
            $vehicle->encoded_image = $this->encodeVehicleImage($vehicle);
            return $vehicle;
        });

        $slug     = $vehicleId ? "vehicle-{$vehicleId}" : 'all-vehicles';
        $filename = "{$slug}-" . now()->format('Ymd') . '.pdf';

        $pdf = Pdf::loadView('reports.vehicles', [
            'vehicles' => $vehicles,
        ])->setPaper('a4', 'landscape');

        return $pdf->download($filename);
    }

    private function encodeVehicleImage(VehicleModel $vehicle): ?string
    {
        if (!$vehicle->driver_images) return null;

        try {
            $images = json_decode($vehicle->driver_images, true);
            if (empty($images)) return null;

            $path = storage_path('app/public/' . $images[0]);
            if (!file_exists($path)) return null;

            $mime = mime_content_type($path);
            $data = base64_encode(file_get_contents($path));

            return "data:{$mime};base64,{$data}";
        } catch (\Throwable) {
            return null;
        }
    }

    private function vehiclesXlsx(?int $vehicleId)
    {
        $slug     = $vehicleId ? "vehicle-{$vehicleId}" : 'all-vehicles';
        $filename = "{$slug}-" . now()->format('Ymd') . '.xlsx';

        return Excel::download(new VehiclesExport($vehicleId), $filename);
    }

    // ── Helpers ────────────────────────────────────────────────────

    private function dateRange(string $period): array
    {
        return match ($period) {
            'today'   => [Carbon::today(),             Carbon::now()],
            'week'    => [Carbon::now()->subDays(7),   Carbon::now()],
            'month'   => [Carbon::now()->subDays(30),  Carbon::now()],
            'year'    => [Carbon::now()->subDays(365), Carbon::now()],
            default   => [Carbon::createFromTimestamp(0), Carbon::now()],
        };
    }

    private function periodLabel(string $period): string
    {
        return match ($period) {
            'today'   => 'Today (' . now()->format('F d, Y') . ')',
            'week'    => 'Last 7 Days',
            'month'   => 'Last 30 Days',
            'year'    => 'Last 365 Days',
            default   => 'All Time',
        };
    }

       
}
