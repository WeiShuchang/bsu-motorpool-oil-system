<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: DejaVu Sans, sans-serif; font-size: 8px; color: #1a1a1a; }

    .header {
        background: #1D4ED8; color: white;
        padding: 18px 24px 14px; margin-bottom: 16px;
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
        flex: 1; background: #eff6ff; border: 1px solid #bfdbfe;
        border-radius: 6px; padding: 8px 10px; text-align: center;
    }
    .stat-box .val { font-size: 14px; font-weight: bold; color: #1D4ED8; }
    .stat-box .lbl { font-size: 7px; color: #3b5fa0; margin-top: 1px; }

    table {
        width: 100%; border-collapse: collapse;
        margin: 0 0 20px 0; font-size: 7.5px;
    }
    thead tr th {
        background: #1D4ED8; color: white;
        padding: 6px 6px; text-align: left;
        font-weight: bold; font-size: 7px; letter-spacing: 0.2px;
    }
    tbody tr:nth-child(even) { background: #eff6ff; }
    tbody tr td { padding: 5px 6px; border-bottom: 1px solid #e5e7eb; vertical-align: middle; }
    tbody tr:last-child td { border-bottom: none; }

    .vehicle-img {
        width: 48px; height: 36px;
        object-fit: cover; border-radius: 3px;
        border: 1px solid #e5e7eb;
    }
    .no-img {
        width: 48px; height: 36px;
        background: #eff6ff; border-radius: 3px;
        border: 1px solid #bfdbfe;
        display: flex; align-items: center; justify-content: center;
        font-size: 6px; color: #93c5fd; text-align: center;
        line-height: 1.2;
    }

    .badge {
        display: inline-block; padding: 1px 5px; border-radius: 9px;
        font-size: 6.5px; font-weight: bold;
    }
    .badge-active   { background: #dcfce7; color: #166534; }
    .badge-inactive { background: #fee2e2; color: #991b1b; }
    .badge-yes { background: #dbeafe; color: #1D4ED8; }
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
    <h1>BSU Motorpool — Vehicle Information Report</h1>
    <p>{{ $vehicles->count() }} vehicle(s) listed</p>
    <div class="meta-row">
        <span>Generated: {{ now()->addHours(8)->format('F d, Y h:i A') }}</span>
        <span>Prepared by: BSU Motorpool System</span>
    </div>
</div>



<div class="page-wrap">
<table>
    <thead>
        <tr>
            <th style="width:54px;">Photo</th>
            <th>#</th>
            <th>Plate</th>
            <th>Make</th>
            <th>Model</th>
            <th>Status</th>
            <th>Trans.</th>
            <th>Seats</th>
            <th>Curr. Oil</th>
            <th>Oil Cap.</th>
            <th>Coolant</th>
            <th>Brake Clnr</th>
            <th>Wiper Wash</th>
            <th>Eng Flush</th>
            <th>Pen Oil</th>
            <th>Assigned Drivers</th>
        </tr>
    </thead>
    <tbody>
        @forelse ($vehicles as $i => $v)
        <tr>
            <td>
                @if ($v->encoded_image)
                    <img src="{{ $v->encoded_image }}" class="vehicle-img" alt="{{ $v->plate_number }}" />
                @else
                    <div class="no-img">No Photo</div>
                @endif
            </td>
            <td>{{ $i + 1 }}</td>
            <td><strong>{{ $v->plate_number }}</strong></td>
            <td>{{ $v->make }}</td>
            <td>{{ $v->model }}</td>
            <td>
                <span class="badge {{ $v->status === 'active' ? 'badge-active' : 'badge-inactive' }}">
                    {{ ucfirst($v->status) }}
                </span>
            </td>
            <td>{{ ucfirst($v->transmission) }}</td>
            <td>{{ $v->seat_capacity }}</td>
            <td>{{ $v->current_oil_in_engine ?? '—' }}</td>
            <td>{{ $v->overall_oil_engine_capacity ?? '—' }}</td>
            <td><span class="badge {{ $v->coolant ? 'badge-yes' : 'badge-no' }}">{{ $v->coolant ? 'Yes' : 'No' }}</span></td>
            <td><span class="badge {{ $v->break_cleaner ? 'badge-yes' : 'badge-no' }}">{{ $v->break_cleaner ? 'Yes' : 'No' }}</span></td>
            <td><span class="badge {{ $v->wiper_washer ? 'badge-yes' : 'badge-no' }}">{{ $v->wiper_washer ? 'Yes' : 'No' }}</span></td>
            <td><span class="badge {{ $v->engine_flush ? 'badge-yes' : 'badge-no' }}">{{ $v->engine_flush ? 'Yes' : 'No' }}</span></td>
            <td><span class="badge {{ $v->penetrating_oil ? 'badge-yes' : 'badge-no' }}">{{ $v->penetrating_oil ? 'Yes' : 'No' }}</span></td>
            <td>{{ $v->drivers->pluck('driver_full_name')->filter()->join(', ') ?: '—' }}</td>
        </tr>
        @empty
        <tr>
            <td colspan="16" style="text-align:center; padding:20px; color:#9ca3af;">
                No vehicles found.
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