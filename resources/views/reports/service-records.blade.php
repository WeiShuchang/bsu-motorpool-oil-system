<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: DejaVu Sans, sans-serif; font-size: 8px; color: #1a1a1a; }

    .header {
        background: #166534;
        color: white;
        padding: 18px 24px 14px;
        margin-bottom: 16px;
    }
    .header h1 { font-size: 16px; font-weight: bold; letter-spacing: 0.5px; }
    .header p  { font-size: 8px; opacity: 0.8; margin-top: 2px; }
    .meta-row  {
        display: flex; justify-content: space-between;
        margin-top: 8px; font-size: 7.5px; opacity: 0.9;
    }

    .summary-bar {
        display: flex; gap: 12px; margin: 0 24px 14px;
    }
    .stat-box {
        flex: 1; background: #f0fdf4; border: 1px solid #bbf7d0;
        border-radius: 6px; padding: 8px 10px; text-align: center;
    }
    .stat-box .val { font-size: 14px; font-weight: bold; color: #166534; }
    .stat-box .lbl { font-size: 7px; color: #4b7a5c; margin-top: 1px; }

    table {
        width: 100%; border-collapse: collapse;
        margin: 0 0 20px 0;
        font-size: 7.5px;
    }
    thead tr th {
        background: #166534; color: white;
        padding: 6px 6px; text-align: left;
        font-weight: bold; font-size: 7px; letter-spacing: 0.2px;
    }
    tbody tr:nth-child(even) { background: #f0fdf4; }
    tbody tr td { padding: 5px 6px; border-bottom: 1px solid #e5e7eb; }
    tbody tr:last-child td { border-bottom: none; }

    .badge {
        display: inline-block; padding: 1px 5px; border-radius: 9px;
        font-size: 6.5px; font-weight: bold;
    }
    .badge-yes { background: #dcfce7; color: #166534; }
    .badge-no  { background: #f3f4f6; color: #6b7280; }

    .footer {
        position: fixed; bottom: 0; left: 0; right: 0;
        background: #f9fafb; border-top: 1px solid #e5e7eb;
        padding: 6px 24px; font-size: 7px; color: #9ca3af;
        display: flex; justify-content: space-between;
    }

    .page-wrap { padding: 0 24px; }
</style>
</head>
<body>

<div class="header">
    <h1>BSU Motorpool — Service Records Report</h1>
    <p>{{ $periodLabel }} &nbsp;|&nbsp; {{ $records->count() }} record(s)</p>
    <div class="meta-row">
        <span>Generated: {{ now()->addHours(8)->format('F d, Y h:i A') }}</span>
        <span>Prepared by: BSU Motorpool System</span>
    </div>
</div>


<div class="page-wrap">
<table>
    <thead>
        <tr>
            <th>#</th>
            <th>Date</th>
            <th>Plate</th>
            <th>Vehicle</th>
            <th>Driver</th>
            <th>Mileage</th>
            <th>Lube Type</th>
            <th>Oil Type</th>
            <th>Qty(L)</th>
            <th>Cost(₱)</th>
            <th>Provider</th>
            <th>Coolant</th>
            <th>Brake Clnr</th>
            <th>Wiper Wash</th>
            <th>Eng Flush</th>
            <th>Pen Oil</th>
        </tr>
    </thead>
    <tbody>
        @forelse ($records as $i => $r)
        <tr>
            <td>{{ $i + 1 }}</td>
            <td>{{ \Carbon\Carbon::parse($r->service_date)->format('M d, Y') }}</td>
            <td><strong>{{ $r->vehicle?->plate_number ?? '—' }}</strong></td>
            <td>{{ trim(($r->vehicle?->make ?? '') . ' ' . ($r->vehicle?->model ?? '')) ?: '—' }}</td>
            <td>{{ $r->driver?->driver_full_name ?? '—' }}</td>
            <td>{{ number_format($r->mileage) }}</td>
            <td>{{ $r->lubrication_type ?? '—' }}</td>
            <td>{{ $r->oil_type ?? '—' }}</td>
            <td>{{ $r->quantity }}</td>
            <td>{{ number_format($r->cost, 2) }}</td>
            <td>{{ $r->service_provider ?? '—' }}</td>
            <td><span class="badge {{ $r->coolant ? 'badge-yes' : 'badge-no' }}">{{ $r->coolant ? 'Yes' : 'No' }}</span></td>
            <td><span class="badge {{ $r->break_cleaner ? 'badge-yes' : 'badge-no' }}">{{ $r->break_cleaner ? 'Yes' : 'No' }}</span></td>
            <td><span class="badge {{ $r->wiper_washer ? 'badge-yes' : 'badge-no' }}">{{ $r->wiper_washer ? 'Yes' : 'No' }}</span></td>
            <td><span class="badge {{ $r->engine_flush ? 'badge-yes' : 'badge-no' }}">{{ $r->engine_flush ? 'Yes' : 'No' }}</span></td>
            <td><span class="badge {{ $r->penetrating_oil ? 'badge-yes' : 'badge-no' }}">{{ $r->penetrating_oil ? 'Yes' : 'No' }}</span></td>
        </tr>
        @empty
        <tr>
            <td colspan="16" style="text-align:center; padding: 20px; color: #9ca3af;">
                No service records found for this period.
            </td>
        </tr>
        @endforelse
    </tbody>
</table>
</div>

<div class="footer">
    <span>BSU Motorpool Management System</span>
    <span>CONFIDENTIAL — For internal use only</span>
</div>

</body>
</html>