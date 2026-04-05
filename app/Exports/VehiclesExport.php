<?php

namespace App\Exports;

use App\Models\VehicleModel;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class VehiclesExport implements
    FromCollection,
    WithHeadings,
    WithMapping,
    WithStyles,
    WithTitle,
    ShouldAutoSize
{
    public function __construct(private ?int $vehicleId = null) {}

    public function collection()
    {
        $query = VehicleModel::with('drivers');

        if ($this->vehicleId) {
            $query->where('id', $this->vehicleId);
        }

        return $query->orderBy('make')->get();
    }

    public function headings(): array
    {
        return [
            '#',
            'Plate Number',
            'Make',
            'Model',
            'Status',
            'Transmission',
            'Seat Capacity',
            'Current Oil in Engine',
            'Overall Oil Capacity',
            'Coolant',
            'Brake Cleaner',
            'Wiper Washer',
            'Engine Flush',
            'Penetrating Oil',
            'Assigned Drivers',
        ];
    }

    public function map($row): array
    {
        static $i = 0;
        $i++;

        $drivers = $row->drivers
            ->pluck('driver_full_name')   // ← was map(fn($d) => trim($d->first_name . ' ' . $d->last_name))
            ->filter()
            ->join(', ');

        return [
            $i,
            $row->plate_number,
            $row->make,
            $row->model,
            ucfirst($row->status),
            ucfirst($row->transmission),
            $row->seat_capacity,
            $row->current_oil_in_engine   ?? '—',
            $row->overall_oil_engine_capacity ?? '—',
            $row->coolant       ? 'Yes' : 'No',
            $row->break_cleaner ? 'Yes' : 'No',
            $row->wiper_washer  ? 'Yes' : 'No',
            $row->engine_flush  ? 'Yes' : 'No',
            $row->penetrating_oil ? 'Yes' : 'No',
            $drivers ?: '—',
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            1 => [
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF'], 'size' => 10],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '1D4ED8']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
            ],
        ];
    }

    public function title(): string
    {
        return 'Vehicle Info';
    }
}