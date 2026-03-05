import { useState } from 'react';
import { X, AlertTriangle, Car } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/Hooks/useToast';

export default function DeleteVehicleModal({ isOpen, onClose, vehicle, onSuccess }) {
    const { showToast } = useToast();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        
        try {
            await axios.delete(`/admin/vehicles/${vehicle.id}/delete`);
            
            showToast('Vehicle deleted successfully', 'success');
            
            if (onSuccess) {
                onSuccess(vehicle.id);
            }
            
            onClose();
        } catch (error) {
            setIsDeleting(false);
            showToast('Failed to delete vehicle', 'error');
        }
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
                                    This action cannot be undone. This will permanently delete this vehicle.
                                </p>
                            </div>
                        </div>


                 {/* Vehicle Details - Image and Plate Number only */}
<div className="bg-gray-50 rounded-lg p-4 mb-6 flex flex-col items-center text-center gap-3">
    <div className="size-20 rounded-lg bg-green-100 flex items-center justify-center overflow-hidden">
        {vehicle.driver_images ? (
            <img 
                src={`/storage/${JSON.parse(vehicle.driver_images)[0]}`}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="size-20 object-cover"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.parentElement.innerHTML = '<div class="size-10 text-green-600"><Car /></div>';
                }}
            />
        ) : (
            <Car className="size-10 text-green-600" />
        )}
    </div>
    <div>
        <p className="text-sm font-medium text-gray-700">{vehicle.make} {vehicle.model}</p>
        <p className="text-sm text-gray-500">Plate: {vehicle.plate_number}</p>
    </div>
</div>
                        {/* Form Actions */}
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isDeleting}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
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