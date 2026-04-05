<?php

namespace App\Exports;

use App\Models\ServiceRecordModel;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;

class ServiceRecordsExport implements
    FromCollection,
    WithHeadings,
    WithMapping,
    WithStyles,
    WithTitle,
    ShouldAutoSize
{
    public function __construct(private string $period) {}

    public function collection()
    {
        return ServiceRecordModel::with(['vehicle', 'driver'])
            ->whereBetween('created_at', $this->dateRange())  // ← service_date → created_at
            ->orderBy('created_at', 'desc')                   // ← service_date → created_at
            ->get();
    }

    public function headings(): array
    {
        return [
            '#',
            'Service Date',
            'Plate Number',
            'Vehicle',
            'Driver',
            'Mileage (km)',
            'Lubrication Type',
            'Oil Type',
            'Qty (L)',
            'Cost (₱)',
            'Service Provider',
            'Coolant',
            'Brake Cleaner',
            'Wiper Washer',
            'Engine Flush',
            'Penetrating Oil',
            'Notes',
        ];
    }

    public function map($row): array
    {
        static $i = 0;
        $i++;

        return [
            $i,
            Carbon::parse($row->service_date)->format('M d, Y'),
            $row->vehicle?->plate_number ?? '—',
            trim(($row->vehicle?->make ?? '') . ' ' . ($row->vehicle?->model ?? '')) ?: '—',
            $row->driver?->driver_full_name ?? '—',   // ← was first_name . last_name
            number_format($row->mileage),
            $row->lubrication_type ?? '—',
            $row->oil_type ?? '—',
            $row->quantity,
            number_format($row->cost, 2),
            $row->service_provider ?? '—',
            $row->coolant         ? 'Yes' : 'No',
            $row->break_cleaner   ? 'Yes' : 'No',
            $row->wiper_washer    ? 'Yes' : 'No',
            $row->engine_flush    ? 'Yes' : 'No',
            $row->penetrating_oil ? 'Yes' : 'No',
            $row->notes ?? '—',
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            1 => [
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF'], 'size' => 10],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '166534']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
            ],
        ];
    }

    public function title(): string
    {
        return 'Service Records';
    }

    private function dateRange(): array
    {
        return match ($this->period) {
            'today'   => [Carbon::today(),              Carbon::now()],
            'week'    => [Carbon::now()->subDays(7),    Carbon::now()],
            'month'   => [Carbon::now()->subDays(30),   Carbon::now()],
            'year'    => [Carbon::now()->subDays(365),  Carbon::now()],
            default   => [Carbon::createFromTimestamp(0), Carbon::now()],
        };
    }
}