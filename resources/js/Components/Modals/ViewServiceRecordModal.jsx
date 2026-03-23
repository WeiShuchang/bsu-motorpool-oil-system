// Components/Modals/ViewServiceRecordModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Car, User, Calendar, Gauge, Droplets, Wrench, DollarSign, FileText, Check } from 'lucide-react';

export default function ViewServiceRecordModal({ isOpen, onClose, record }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) setIsVisible(true);
        else        setIsVisible(false);
    }, [isOpen]);

    if (!isOpen || !record) return null;

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 200);
    };

    const Field = ({ icon: Icon, label, value }) => (
        <div className="flex items-start gap-2.5">
            <div className="size-7 rounded bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="size-3.5 text-green-600" />
            </div>
            <div className="min-w-0">
                <p className="text-xs text-gray-400 leading-none mb-0.5">{label}</p>
                <p className="text-sm text-gray-800 font-medium break-words">{value || '—'}</p>
            </div>
        </div>
    );

    const CheckItem = ({ label, checked }) => (
        <div className="flex items-center gap-2">
            <div className={`size-4 rounded border flex items-center justify-center flex-shrink-0 ${
                checked ? 'bg-green-600 border-green-600' : 'border-gray-300 bg-white'
            }`}>
                {checked && <Check className="size-3 text-white" />}
            </div>
            <span className={`text-xs ${checked ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>{label}</span>
        </div>
    );

    return (
        <div className={`fixed inset-0 z-50 overflow-y-auto transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">

                <div
                    className={`fixed inset-0 transition-opacity duration-300 ${isVisible ? 'bg-gray-500 bg-opacity-75' : 'bg-gray-500 bg-opacity-0'}`}
                    onClick={handleClose}
                />
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

                <div
                    className={`inline-block align-bottom bg-white text-left overflow-hidden shadow-xl transform transition-all duration-300 sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${
                        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95'
                    }`}
                    style={{ borderRadius: '8px' }}
                >
                    {/* Green header */}
                    <div className="bg-green-600 px-5 py-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-semibold text-white">Service Record Details</h3>
                            <button onClick={handleClose} className="text-white/80 hover:text-white transition-colors">
                                <X className="size-4" />
                            </button>
                        </div>
                    </div>

                    <div className="px-5 py-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">

                        {/* ── Vehicle & Driver side by side ── */}
                        <div className="grid grid-cols-2 gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                            {/* Vehicle */}
                            <div className="flex items-center gap-2.5">
                                {record.vehicle_image ? (
                                    <img src={record.vehicle_image} alt={record.plate_number} className="w-12 h-8 rounded object-cover border border-green-200 flex-shrink-0" />
                                ) : (
                                    <div className="w-12 h-8 rounded bg-green-100 border border-green-200 flex items-center justify-center flex-shrink-0">
                                        <Car className="size-4 text-green-600" />
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <p className="text-xs text-gray-400 leading-none mb-0.5">Vehicle</p>
                                    <p className="text-sm font-semibold text-green-700 truncate">{record.plate_number ?? '—'}</p>
                                </div>
                            </div>

                            {/* Driver */}
                            <div className="flex items-center gap-2.5">
                                {record.driver_image ? (
                                    <img src={record.driver_image} alt={record.driver_name} className="size-8 rounded-full object-cover border border-green-200 flex-shrink-0" />
                                ) : (
                                    <div className="size-8 rounded-full bg-green-100 border border-green-200 flex items-center justify-center flex-shrink-0">
                                        <User className="size-4 text-green-600" />
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <p className="text-xs text-gray-400 leading-none mb-0.5">Driver</p>
                                    <p className="text-sm font-semibold text-green-700 truncate">{record.driver_name ?? '—'}</p>
                                </div>
                            </div>
                        </div>

                        {/* ── Service details ── */}
                        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                            <Field icon={Calendar}   label="Service Date"     value={record.service_date} />
                            <Field icon={Gauge}      label="Mileage"          value={record.mileage ? `${Number(record.mileage).toLocaleString()} km` : null} />
                            <Field icon={Droplets}   label="Lubrication Type" value={record.lubrication_type} />
                            <Field icon={Droplets}   label="Oil Type"         value={record.oil_type} />
                            <Field icon={Droplets}   label="Quantity"         value={record.quantity ? `${record.quantity} L` : null} />
                            <Field icon={Droplets}   label="Coolant"          value={record.coolant ? `${record.coolant} L` : null} />
                            <Field icon={Wrench}     label="Service Provider" value={record.service_provider} />
                            <Field icon={DollarSign} label="Cost"             value={record.cost ? `₱ ${Number(record.cost).toLocaleString('en-PH', { minimumFractionDigits: 2 })}` : null} />
                        </div>

                        {/* ── Additional items ── */}
                        <div className="border-t border-green-100 pt-3">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Additional Items</p>
                            <div className="grid grid-cols-2 gap-2">
                                <CheckItem label="Brake Cleaner"   checked={!!record.break_cleaner} />
                                <CheckItem label="Wiper Washer"    checked={!!record.wiper_washer} />
                                <CheckItem label="Engine Flush"    checked={!!record.engine_flush} />
                                <CheckItem label="Penetrating Oil" checked={!!record.penetrating_oil} />
                            </div>
                        </div>

                        {/* ── Notes ── */}
                        {record.notes && (
                            <div className="border-t border-green-100 pt-3">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <FileText className="size-3.5 text-green-600" />
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</p>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded px-3 py-2 border border-gray-100">
                                    {record.notes}
                                </p>
                            </div>
                        )}

                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-5 py-3 flex justify-end border-t border-gray-100">
                        <button
                            onClick={handleClose}
                            className="px-4 py-1.5 border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-100"
                            style={{ borderRadius: '4px' }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}