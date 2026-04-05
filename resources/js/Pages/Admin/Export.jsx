import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminHeader from '@/Components/AdminHeader';
import {
    FileText, Download, Calendar, Clock, TrendingUp,
    FileSpreadsheet, Loader2, CheckCircle, AlertCircle, Car, Wrench
} from 'lucide-react';
import axios from 'axios';

const PERIODS = [
    { key: 'today',   label: 'Today',      sub: 'Last 24 hours',    icon: Clock      },
    { key: 'week',    label: 'This Week',  sub: 'Last 7 days',      icon: Calendar   },
    { key: 'month',   label: 'This Month', sub: 'Last 30 days',     icon: Calendar   },
    { key: 'year',    label: 'This Year',  sub: 'Last 365 days',    icon: TrendingUp },
    { key: 'overall', label: 'All Time',   sub: 'Complete history', icon: FileText   },
];

const REPORT_TYPES = [
    {
        key: 'service',
        label: 'Service Records',
        sub: 'Oil changes, maintenance logs',
        icon: Wrench,
        color: 'green',
    },
    {
        key: 'vehicle',
        label: 'Vehicle Info',
        sub: 'Fleet details & specs',
        icon: Car,
        color: 'blue',
    },
];

export default function Reports({ vehicles = [] }) {
    const [reportType, setReportType]         = useState('service');
    const [selectedPeriod, setSelectedPeriod] = useState('month');
    const [exportFormat, setExportFormat]     = useState('pdf');
    const [vehicleScope, setVehicleScope]     = useState('all');   // 'all' | 'specific'
    const [selectedVehicle, setSelectedVehicle] = useState('');
    const [isExporting, setIsExporting]       = useState(false);
    const [exportStatus, setExportStatus]     = useState(null);
    const [statusMessage, setStatusMessage]   = useState('');

    const isVehicle = reportType === 'vehicle';
    const selectedPeriodData = PERIODS.find(p => p.key === selectedPeriod);

    const canExport = !isExporting && (
        !isVehicle || vehicleScope === 'all' || (vehicleScope === 'specific' && selectedVehicle)
    );

    const handleExport = async () => {
        if (!canExport) return;
        setIsExporting(true);
        setExportStatus(null);

        try {
            const params = {
                format: exportFormat,
                type: reportType,
                ...(reportType === 'service' && { period: selectedPeriod }),
                ...(reportType === 'vehicle' && vehicleScope === 'specific' && { vehicle_id: selectedVehicle }),
            };

            const response = await axios.get('/admin/reports/export', {
                params,
                responseType: 'blob',
            });

            const contentDisposition = response.headers['content-disposition'];
            let filename = `${reportType}-report.${exportFormat}`;
            if (contentDisposition) {
                const match = contentDisposition.match(/filename="?(.+)"?/);
                if (match) filename = match[1];
            }

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            setExportStatus('success');
            setStatusMessage(`Report exported successfully as ${exportFormat.toUpperCase()}`);
        } catch {
            setExportStatus('error');
            setStatusMessage('Failed to export report. Please try again.');
        } finally {
            setIsExporting(false);
            setTimeout(() => setExportStatus(null), 4000);
        }
    };

    return (
        <>
            <Head title="Reports - BSU Motorpool" />

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
                <AdminHeader />

                <main className="max-w-5xl mx-auto px-2 sm:px-6 lg:px-8 py-10">

                    {/* Page Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <FileText className="size-5 text-green-700" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">Service Reports</h1>
                        </div>
                        <p className="text-sm text-gray-500 ml-12">
                            Export vehicle service records for a selected time period
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">

                        {/* ── Left: Config Panel ── */}
                        <div className="md:col-span-2 space-y-5">

                            {/* ── Report Type ── */}
                            <div className="bg-white rounded-xl border border-green-100 shadow-sm p-5">
                                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                                    <FileText className="size-4 text-green-600" />
                                    Report Type
                                </h2>
                                <div className="grid grid-cols-2 gap-3">
                                    {REPORT_TYPES.map(({ key, label, sub, icon: Icon, color }) => {
                                        const active = reportType === key;
                                        const colorMap = {
                                            green: {
                                                border: active ? 'border-green-500 bg-green-50 ring-1 ring-green-400' : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50',
                                                icon: active ? 'bg-green-600' : 'bg-gray-100',
                                                iconText: active ? 'text-white' : 'text-gray-500',
                                                label: active ? 'text-green-700' : 'text-gray-700',
                                                check: 'text-green-600',
                                            },
                                            blue: {
                                                border: active ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-400' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50',
                                                icon: active ? 'bg-blue-600' : 'bg-gray-100',
                                                iconText: active ? 'text-white' : 'text-gray-500',
                                                label: active ? 'text-blue-700' : 'text-gray-700',
                                                check: 'text-blue-600',
                                            },
                                        };
                                        const c = colorMap[color];
                                        return (
                                            <button
                                                key={key}
                                                onClick={() => setReportType(key)}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all ${c.border}`}
                                            >
                                                <div className={`p-1.5 rounded-md ${c.icon}`}>
                                                    <Icon className={`size-3.5 ${c.iconText}`} />
                                                </div>
                                                <div>
                                                    <p className={`text-sm font-medium ${c.label}`}>{label}</p>
                                                    <p className="text-xs text-gray-400">{sub}</p>
                                                </div>
                                                {active && <CheckCircle className={`size-4 ml-auto flex-shrink-0 ${c.check}`} />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* ── Period Selection (Service only) ── */}
                            {!isVehicle && (
                                <div className="bg-white rounded-xl border border-green-100 shadow-sm p-5">
                                    <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                                        <Calendar className="size-4 text-green-600" />
                                        Select Time Period
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {PERIODS.map(({ key, label, sub, icon: Icon }) => (
                                            <button
                                                key={key}
                                                onClick={() => setSelectedPeriod(key)}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all ${
                                                    selectedPeriod === key
                                                        ? 'border-green-500 bg-green-50 ring-1 ring-green-400'
                                                        : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
                                                }`}
                                            >
                                                <div className={`p-1.5 rounded-md ${selectedPeriod === key ? 'bg-green-600' : 'bg-gray-100'}`}>
                                                    <Icon className={`size-3.5 ${selectedPeriod === key ? 'text-white' : 'text-gray-500'}`} />
                                                </div>
                                                <div>
                                                    <p className={`text-sm font-medium ${selectedPeriod === key ? 'text-green-700' : 'text-gray-700'}`}>
                                                        {label}
                                                    </p>
                                                    <p className="text-xs text-gray-400">{sub}</p>
                                                </div>
                                                {selectedPeriod === key && (
                                                    <CheckCircle className="size-4 text-green-600 ml-auto flex-shrink-0" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ── Vehicle Scope (Vehicle Info only) ── */}
                            {isVehicle && (
                                <div className="bg-white rounded-xl border border-blue-100 shadow-sm p-5">
                                    <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                                        <Car className="size-4 text-blue-600" />
                                        Vehicle Selection
                                    </h2>

                                    {/* All vs Specific toggle */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        {[
                                            { key: 'all',      label: 'All Vehicles',      sub: 'Export entire fleet' },
                                            { key: 'specific', label: 'Specific Vehicle',  sub: 'Choose one vehicle'  },
                                        ].map(({ key, label, sub }) => (
                                            <button
                                                key={key}
                                                onClick={() => { setVehicleScope(key); setSelectedVehicle(''); }}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all ${
                                                    vehicleScope === key
                                                        ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-400'
                                                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                                                }`}
                                            >
                                                <div className={`p-1.5 rounded-md ${vehicleScope === key ? 'bg-blue-600' : 'bg-gray-100'}`}>
                                                    <Car className={`size-3.5 ${vehicleScope === key ? 'text-white' : 'text-gray-500'}`} />
                                                </div>
                                                <div>
                                                    <p className={`text-sm font-medium ${vehicleScope === key ? 'text-blue-700' : 'text-gray-700'}`}>
                                                        {label}
                                                    </p>
                                                    <p className="text-xs text-gray-400">{sub}</p>
                                                </div>
                                                {vehicleScope === key && (
                                                    <CheckCircle className="size-4 text-blue-600 ml-auto flex-shrink-0" />
                                                )}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Dropdown — only shown when Specific is selected */}
                                    {vehicleScope === 'specific' && (
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1.5">
                                                Choose a vehicle
                                            </label>
                                            <select
                                                value={selectedVehicle}
                                                onChange={e => setSelectedVehicle(e.target.value)}
                                                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                                            >
                                                <option value="">— Select a vehicle —</option>
                                                {vehicles.map(v => (
                                                    <option key={v.id} value={v.id}>
                                                        {v.make} {v.model} — {v.plate_number}
                                                    </option>
                                                ))}
                                            </select>
                                            {!selectedVehicle && (
                                                <p className="mt-1.5 text-xs text-amber-600 flex items-center gap-1">
                                                    <AlertCircle className="size-3" />
                                                    Please select a vehicle to continue.
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ── Format Selection ── */}
                            <div className="bg-white rounded-xl border border-green-100 shadow-sm p-5">
                                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                                    <Download className="size-4 text-green-600" />
                                    Export Format
                                </h2>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setExportFormat('pdf')}
                                        className={`flex flex-col items-center gap-2 py-4 px-3 rounded-lg border transition-all ${
                                            exportFormat === 'pdf'
                                                ? 'border-red-400 bg-red-50 ring-1 ring-red-300'
                                                : 'border-gray-200 hover:border-red-200 hover:bg-red-50/30'
                                        }`}
                                    >
                                        <div className={`p-2 rounded-lg ${exportFormat === 'pdf' ? 'bg-red-500' : 'bg-gray-100'}`}>
                                            <FileText className={`size-5 ${exportFormat === 'pdf' ? 'text-white' : 'text-gray-400'}`} />
                                        </div>
                                        <div className="text-center">
                                            <p className={`text-sm font-semibold ${exportFormat === 'pdf' ? 'text-red-700' : 'text-gray-600'}`}>PDF</p>
                                            <p className="text-xs text-gray-400">Printable document</p>
                                        </div>
                                        {exportFormat === 'pdf' && <CheckCircle className="size-4 text-red-500" />}
                                    </button>

                                    <button
                                        onClick={() => setExportFormat('xlsx')}
                                        className={`flex flex-col items-center gap-2 py-4 px-3 rounded-lg border transition-all ${
                                            exportFormat === 'xlsx'
                                                ? 'border-emerald-400 bg-emerald-50 ring-1 ring-emerald-300'
                                                : 'border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/30'
                                        }`}
                                    >
                                        <div className={`p-2 rounded-lg ${exportFormat === 'xlsx' ? 'bg-emerald-500' : 'bg-gray-100'}`}>
                                            <FileSpreadsheet className={`size-5 ${exportFormat === 'xlsx' ? 'text-white' : 'text-gray-400'}`} />
                                        </div>
                                        <div className="text-center">
                                            <p className={`text-sm font-semibold ${exportFormat === 'xlsx' ? 'text-emerald-700' : 'text-gray-600'}`}>Excel</p>
                                            <p className="text-xs text-gray-400">Spreadsheet data</p>
                                        </div>
                                        {exportFormat === 'xlsx' && <CheckCircle className="size-4 text-emerald-500" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* ── Right: Summary & Export ── */}
                        <div className="space-y-4">
                            <div className="bg-white rounded-xl border border-green-100 shadow-sm p-5">
                                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                                    Export Summary
                                </h2>

                                <div className="space-y-3 mb-5">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="text-xs text-gray-500">Report Type</span>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                            isVehicle ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                        }`}>
                                            {isVehicle ? 'Vehicle Info' : 'Service Records'}
                                        </span>
                                    </div>

                                    {!isVehicle && (
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-xs text-gray-500">Period</span>
                                            <span className="text-xs font-medium text-gray-800">
                                                {selectedPeriodData?.label}
                                            </span>
                                        </div>
                                    )}

                                    {isVehicle && (
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-xs text-gray-500">Scope</span>
                                            <span className="text-xs font-medium text-gray-800">
                                                {vehicleScope === 'all'
                                                    ? 'All Vehicles'
                                                    : selectedVehicle
                                                        ? vehicles.find(v => String(v.id) === String(selectedVehicle))
                                                            ? `${vehicles.find(v => String(v.id) === String(selectedVehicle)).make} ${vehicles.find(v => String(v.id) === String(selectedVehicle)).plate_number}`
                                                            : 'Selected'
                                                        : 'Not selected'}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="text-xs text-gray-500">Format</span>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                            exportFormat === 'pdf' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                                        }`}>
                                            {exportFormat.toUpperCase()}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-xs text-gray-500">Includes</span>
                                        <span className="text-xs font-medium text-gray-800">All records</span>
                                    </div>
                                </div>

                                {/* What's included */}
                                <div className="bg-gray-50 rounded-lg p-3 mb-4 space-y-1.5">
                                    <p className="text-xs font-medium text-gray-600 mb-2">Report includes:</p>
                                    {(isVehicle ? [
                                        'Make, model & plate number',
                                        'Seat capacity & transmission',
                                        'Oil & engine capacity',
                                        'Status & other fluids',
                                        'Assigned drivers',
                                    ] : [
                                        'Vehicle & plate info',
                                        'Driver details',
                                        'Service date & mileage',
                                        'Oil type & quantity',
                                        'Cost & service provider',
                                        'Additional items used',
                                    ]).map(item => (
                                        <div key={item} className="flex items-center gap-2">
                                            <div className={`size-1.5 rounded-full flex-shrink-0 ${isVehicle ? 'bg-blue-500' : 'bg-green-500'}`} />
                                            <span className="text-xs text-gray-500">{item}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Export Button */}
                                <button
                                    onClick={handleExport}
                                    disabled={!canExport}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                                >
                                    {isExporting ? (
                                        <><Loader2 className="size-4 animate-spin" /> Exporting...</>
                                    ) : (
                                        <><Download className="size-4" /> Export {exportFormat.toUpperCase()}</>
                                    )}
                                </button>

                                {exportStatus && (
                                    <div className={`mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${
                                        exportStatus === 'success'
                                            ? 'bg-green-50 text-green-700 border border-green-200'
                                            : 'bg-red-50 text-red-700 border border-red-200'
                                    }`}>
                                        {exportStatus === 'success'
                                            ? <CheckCircle className="size-3.5 flex-shrink-0" />
                                            : <AlertCircle className="size-3.5 flex-shrink-0" />}
                                        {statusMessage}
                                    </div>
                                )}
                            </div>

                            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="size-4 text-green-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-medium text-green-800 mb-1">Note</p>
                                        <p className="text-xs text-green-700 leading-relaxed">
                                            Reports are generated in real-time based on current database records.
                                            Large date ranges may take a moment to process.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}