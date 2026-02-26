import { useState } from 'react';
import { router } from '@inertiajs/react';
import { X, AlertTriangle } from 'lucide-react';

export default function DeleteVehicleModal({ isOpen, onClose, vehicle }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        setIsDeleting(true);
        
        router.delete(route('admin.vehicles.destroy', vehicle.id), {
            onSuccess: () => {
                setIsDeleting(false);
                onClose();
            },
            onError: () => {
                setIsDeleting(false);
            }
        });
    };

    if (!isOpen || !vehicle) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

                <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="px-6 py-4 bg-red-600 flex justify-between items-center">
                        <h3 className="text-lg font-medium text-white">Delete Vehicle</h3>
                        <button onClick={onClose} className="text-white hover:text-gray-200">
                            <X className="size-5" />
                        </button>
                    </div>

                    <div className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex-shrink-0">
                                <AlertTriangle className="size-12 text-red-600" />
                            </div>
                            <div>
                                <h4 className="text-lg font-medium text-gray-900">
                                    Are you sure?
                                </h4>
                                <p className="text-sm text-gray-500 mt-1">
                                    This action cannot be undone. This will permanently delete the vehicle
                                    <span className="font-medium text-gray-700"> {vehicle.make} {vehicle.model}</span>.
                                </p>
                            </div>
                        </div>

                        {/* Vehicle Details Summary */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <dl className="grid grid-cols-2 gap-4">
                                <div>
                                    <dt className="text-xs font-medium text-gray-500 uppercase">Make</dt>
                                    <dd className="text-sm font-medium text-gray-900">{vehicle.make}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs font-medium text-gray-500 uppercase">Model</dt>
                                    <dd className="text-sm font-medium text-gray-900">{vehicle.model}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs font-medium text-gray-500 uppercase">Seats</dt>
                                    <dd className="text-sm font-medium text-gray-900">{vehicle.seat_capacity}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs font-medium text-gray-500 uppercase">Transmission</dt>
                                    <dd className="text-sm font-medium text-gray-900">{vehicle.transmission}</dd>
                                </div>
                            </dl>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isDeleting ? 'Deleting...' : 'Delete Vehicle'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}