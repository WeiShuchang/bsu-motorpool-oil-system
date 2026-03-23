// Pages/ServiceRecords/Index.jsx
import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminHeader from '@/Components/AdminHeader';
import { Search, Plus, Eye, Trash2, Filter, FileText, Car, User } from 'lucide-react';
import AddServiceRecordModal from '@/Components/Modals/AddServiceRecordModal';
import ViewServiceRecordModal from '@/Components/Modals/ViewServiceRecordModal';
import DeleteServiceRecordModal from '@/Components/Modals/DeleteServiceRecordModal';
import { useToast } from '@/Hooks/useToast';

// ─── Skeleton loader ──────────────────────────────────────────────────────────
const TableSkeleton = () => (
    <>
        {[1, 2, 3, 4, 5].map((item) => (
            <tr key={item} className="animate-pulse border-b border-green-50">
                {/* Vehicle: image block + plate text */}
                <td className="py-3 px-4 text-center">
                    <div className="flex flex-col items-center gap-1.5">
                        <div className="w-16 h-10 rounded-lg bg-gray-200" />
                        <div className="h-3 w-16 rounded bg-gray-200" />
                    </div>
                </td>
                {/* Driver: avatar + name */}
                <td className="py-3 px-4 text-center">
                    <div className="flex flex-col items-center gap-1.5">
                        <div className="size-10 rounded-full bg-gray-200" />
                        <div className="h-3 w-20 rounded bg-gray-200" />
                    </div>
                </td>
                {/* Service Date */}
                <td className="py-3 px-4">
                    <div className="h-4 w-24 rounded bg-gray-200" />
                </td>
                {/* Service Type */}
                <td className="py-3 px-4">
                    <div className="h-4 w-28 rounded bg-gray-200" />
                </td>
                {/* Notes: three lines */}
                <td className="py-3 px-4">
                    <div className="space-y-1.5">
                        <div className="h-3 w-full rounded bg-gray-200" />
                        <div className="h-3 w-4/5 rounded bg-gray-200" />
                        <div className="h-3 w-2/3 rounded bg-gray-200" />
                    </div>
                </td>
                {/* Status pill */}
                <td className="py-3 px-4">
                    <div className="h-5 w-20 rounded-full bg-gray-200" />
                </td>
                {/* Actions */}
                <td className="py-3 px-4">
                    <div className="flex gap-2">
                        <div className="size-4 rounded bg-gray-200" />
                        <div className="size-4 rounded bg-gray-200" />
                    </div>
                </td>
            </tr>
        ))}
    </>
);

// ─── Main component ───────────────────────────────────────────────────────────
export default function ServiceRecord({ records, filters, vehicles, drivers }) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [showAddModal, setShowAddModal] = useState(false);
    const [viewingRecord, setViewingRecord] = useState(null);
    const [deletingRecord, setDeletingRecord] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const { showToast } = useToast();

    const handleSearch = (value) => {
        setSearchTerm(value);
        router.get(
            '/service-records',
            { search: value },
            { preserveState: true, replace: true }
        );
    };

    const handleAddRecord = () => {
        setIsLoading(true);
        router.reload({
            only: ['records'],
            onFinish: () => setIsLoading(false),
        });
    };

    const handleDeleteRecord = () => {
        setIsLoading(true);
        router.reload({
            only: ['records'],
            onSuccess: () => {
                setIsLoading(false);
                setDeletingRecord(null);
            },
            onError: () => setIsLoading(false),
        });
    };

    const getStatusBadge = (status) => {
        const map = {
            Completed: { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200'  },
            Pending:   { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
            Overdue:   { bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200'    },
        };
        const cfg = map[status] || map.Completed;
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
            <Head title="Service Records" />
            <AdminHeader />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* ── Header card ── */}
                <div className="bg-white rounded-xl border border-green-100 shadow-sm mb-6">
                    <div className="p-4 border-b border-green-100">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Service Records</h2>
                                <p className="text-sm text-gray-600 mt-1">Track and manage vehicle maintenance history</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by vehicle, driver..."
                                        value={searchTerm}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="pl-9 pr-4 py-2 text-sm border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 w-full sm:w-64"
                                    />
                                </div>
                                <button className="p-2 border border-green-200 rounded-lg hover:bg-green-50">
                                    <Filter className="size-4 text-gray-600" />
                                </button>
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                                >
                                    <Plus className="size-4" />
                                    Add Record
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ── Table ── */}
                    <div className="p-4">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-green-100">
                                        <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                                        <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                                        <th className="text-left   py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Service Date</th>
                                        <th className="text-left   py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                                        <th className="text-left   py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Notes</th>
                                        <th className="text-left   py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="text-left   py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-green-50">
                                    {isLoading ? (
                                        <TableSkeleton />
                                    ) : records.data && records.data.length > 0 ? (
                                        records.data.map((record) => (
                                            <tr key={record.id} className="hover:bg-green-50/50 transition-colors">

                                                {/* Vehicle — image + plate stacked */}
                                                <td className="py-3 px-4 text-center">
                                                    <div className="flex flex-col items-center gap-1.5">
                                                        {record.vehicle_image ? (
                                                            <img
                                                                src={record.vehicle_image}
                                                                alt={record.plate_number}
                                                                className="w-16 h-10 rounded-lg object-cover border border-green-100"
                                                            />
                                                        ) : (
                                                            <div className="w-16 h-10 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center">
                                                                <Car className="size-5 text-green-400" />
                                                            </div>
                                                        )}
                                                        <span className="font-medium text-green-700 text-xs whitespace-nowrap">
                                                            {record.plate_number ?? '—'}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Driver — avatar + name stacked */}
                                                <td className="py-3 px-4 text-center">
                                                    <div className="flex flex-col items-center gap-1.5">
                                                        {record.driver_image ? (
                                                            <img
                                                                src={record.driver_image}
                                                                alt={record.driver_name}
                                                                className="size-10 rounded-full object-cover border border-green-100"
                                                            />
                                                        ) : (
                                                            <div className="size-10 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
                                                                <User className="size-5 text-green-400" />
                                                            </div>
                                                        )}
                                                        <span className="text-xs text-gray-600 whitespace-nowrap">
                                                            {record.driver_name ?? '—'}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="py-3 px-4 text-gray-600 text-sm whitespace-nowrap">
                                                    {record.service_date ?? '—'}
                                                </td>

                                                <td className="py-3 px-4 text-gray-600 text-sm whitespace-nowrap">
                                                    {record.lubrication_type ?? '—'}
                                                </td>

                                                <td className="py-3 px-4 text-gray-600 text-sm leading-relaxed">
                                                    {record.notes
                                                        ? <span className="line-clamp-2">{record.notes}</span>
                                                        : <span className="text-gray-400">—</span>
                                                    }
                                                </td>

                                                <td className="py-3 px-4 whitespace-nowrap">
                                                    {getStatusBadge('Completed')}
                                                </td>

                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => setViewingRecord(record)}
                                                            className="text-gray-400 hover:text-green-600 transition-colors"
                                                            title="View Record"
                                                        >
                                                            <Eye className="size-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeletingRecord(record)}
                                                            className="text-gray-400 hover:text-red-600 transition-colors"
                                                            title="Delete Record"
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : null}
                                </tbody>
                            </table>
                        </div>

                        {/* ── Empty state ── */}
                        {!isLoading && (!records.data || records.data.length === 0) && (
                            <div className="text-center py-12">
                                <FileText className="size-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No service records found</h3>
                                <p className="text-gray-500 mb-4">Start tracking maintenance by adding the first record</p>
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2"
                                >
                                    <Plus className="size-4" />
                                    Add Record
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Pagination ── */}
                {records.last_page > 1 && records.data && records.data.length > 0 && (
                    <div className="bg-white rounded-xl border border-green-100 shadow-sm p-4">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <p className="text-sm text-gray-600">
                                Showing {records.from ?? 0} to {records.to ?? 0} of {records.total ?? 0} results
                            </p>
                            <div className="flex gap-2">
                                {records.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() => link.url && router.get(link.url)}
                                        disabled={!link.url}
                                        className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                                            link.active
                                                ? 'bg-green-600 text-white'
                                                : 'bg-white border border-green-200 text-gray-600 hover:bg-green-50'
                                        } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* ── Modals ── */}
            <AddServiceRecordModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSave={handleAddRecord}
                vehicles={vehicles}
                drivers={drivers}
            />

            <ViewServiceRecordModal
                isOpen={!!viewingRecord}
                onClose={() => setViewingRecord(null)}
                record={viewingRecord}
            />

            <DeleteServiceRecordModal
                isOpen={!!deletingRecord}
                onClose={() => setDeletingRecord(null)}
                onSuccess={handleDeleteRecord}
                record={deletingRecord}
            />
        </div>
    );
}