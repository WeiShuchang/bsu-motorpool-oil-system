import React, { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';

export default function DeleteDriverModal({ isOpen, onClose, onConfirm, driverName }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 200);
    };

    const handleConfirm = () => {
        onConfirm();
        handleClose();
    };

    return (
        <div 
            className={`fixed inset-0 z-50 overflow-y-auto transition-opacity duration-300 ${
                isVisible ? 'opacity-100' : 'opacity-0'
            }`}
        >
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div 
                    className={`fixed inset-0 transition-opacity duration-300 ${
                        isVisible ? 'bg-gray-500 bg-opacity-75' : 'bg-gray-500 bg-opacity-0'
                    }`} 
                    onClick={handleClose} 
                />

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

                {/* Modal panel */}
                <div 
                    className={`inline-block align-bottom bg-white text-left overflow-hidden shadow-xl transform transition-all duration-300 sm:my-8 sm:align-middle sm:max-w-md sm:w-full ${
                        isVisible 
                            ? 'translate-y-0 opacity-100' 
                            : 'translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95'
                    }`}
                    style={{ borderRadius: '8px' }}
                >
                    {/* Red header for delete modal */}
                    <div className="bg-red-600 px-5 py-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-semibold text-white">Delete Driver</h3>
                            <button 
                                onClick={handleClose} 
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <X className="size-4" />
                            </button>
                        </div>
                    </div>

                    <div className="px-5 py-4">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                                <div className="size-10 bg-red-100 flex items-center justify-center">
                                    <AlertTriangle className="size-5 text-red-600" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-700">
                                    Are you sure you want to delete driver <span className="font-semibold">{driverName}</span>?
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                    This action cannot be undone. The driver will be permanently removed from the system.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="bg-gray-50 px-5 py-3 flex justify-end gap-2 border-t border-gray-100">
                        <button
                            onClick={handleClose}
                            className="px-4 py-1.5 border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-100"
                            style={{ borderRadius: '4px' }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium shadow-sm"
                            style={{ borderRadius: '4px' }}
                        >
                            Delete Driver
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}