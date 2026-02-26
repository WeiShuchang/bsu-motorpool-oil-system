import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { X, Upload, XCircle, Camera, Car } from 'lucide-react';

export default function EditVehicleModal({ isOpen, onClose, vehicle }) {
    const [formData, setFormData] = useState({
        make: '',
        model: '',
        seat_capacity: '',
        status: 'available',
        transmission: 'manual',
        images: [],
        existing_images: []
    });
    const [imagePreviews, setImagePreviews] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    useEffect(() => {
        if (vehicle && isOpen) {
            setFormData({
                make: vehicle.make || '',
                model: vehicle.model || '',
                seat_capacity: vehicle.seat_capacity || '',
                status: vehicle.status || 'available',
                transmission: vehicle.transmission || 'manual',
                images: [],
                existing_images: vehicle.images || []
            });
            
            // Load existing image previews
            if (vehicle.images && vehicle.images.length > 0) {
                const previews = vehicle.images.map(img => `/storage/${img}`);
                setImagePreviews(previews);
            }
        }
    }, [vehicle, isOpen]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...previews]);
        
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...files]
        }));
    };

    const removeImage = (index) => {
        // If it's an existing image (from server)
        if (index < formData.existing_images.length) {
            setFormData(prev => ({
                ...prev,
                existing_images: prev.existing_images.filter((_, i) => i !== index)
            }));
        } else {
            // If it's a newly uploaded image
            const newImageIndex = index - formData.existing_images.length;
            URL.revokeObjectURL(imagePreviews[index]);
            setFormData(prev => ({
                ...prev,
                images: prev.images.filter((_, i) => i !== newImageIndex)
            }));
        }
        
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        const submitData = new FormData();
        submitData.append('_method', 'PUT');
        submitData.append('make', formData.make);
        submitData.append('model', formData.model);
        submitData.append('seat_capacity', formData.seat_capacity);
        submitData.append('status', formData.status);
        submitData.append('transmission', formData.transmission);
        
        // Append existing images to keep
        formData.existing_images.forEach((image, index) => {
            submitData.append(`existing_images[${index}]`, image);
        });
        
        // Append new images
        formData.images.forEach((image, index) => {
            submitData.append(`new_images[${index}]`, image);
        });

        router.post(route('admin.vehicles.update', vehicle.id), submitData, {
            onSuccess: () => {
                setIsSubmitting(false);
                handleClose();
            },
            onError: (errors) => {
                setIsSubmitting(false);
                setErrors(errors);
            }
        });
    };

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 200);
    };

    if (!isOpen || !vehicle) return null;

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
                    className={`inline-block align-bottom bg-white text-left overflow-hidden shadow-xl transform transition-all duration-300 sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${
                        isVisible 
                            ? 'translate-y-0 opacity-100' 
                            : 'translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95'
                    }`}
                    style={{ borderRadius: '8px' }}
                >
                    {/* Green header for edit */}
                    <div className="bg-green-600 px-5 py-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-semibold text-white">Edit Vehicle</h3>
                            <button 
                                onClick={handleClose} 
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <X className="size-4" />
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white">
                        <div className="px-5 py-4 space-y-4">
                            {/* Image Upload - Compact design */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                    Vehicle Images
                                </label>
                                <div className="border border-gray-200 bg-gray-50 p-3">
                                    {/* Image Previews */}
                                    {imagePreviews.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {imagePreviews.map((preview, index) => (
                                                <div key={index} className="relative">
                                                    <img 
                                                        src={preview} 
                                                        alt={`Preview ${index + 1}`}
                                                        className="h-16 w-16 object-cover border border-gray-200"
                                                        style={{ borderRadius: '4px' }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-sm p-0.5 hover:bg-red-600 shadow-sm"
                                                    >
                                                        <XCircle className="size-3.5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    
                                    {/* Upload Area */}
                                    <div className="flex items-center gap-3">
                                        <div className="relative flex-shrink-0">
                                            <div className="size-12 bg-green-50 border border-green-200 flex items-center justify-center">
                                                <Car className="size-6 text-green-500" />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500">
                                                Add more photos (JPG, PNG. Max 2MB each)
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => document.getElementById('edit-vehicle-image-upload').click()}
                                                className="mt-1 inline-flex items-center gap-1 px-3 py-1 border border-green-200 text-xs font-medium text-green-700 hover:bg-green-50"
                                                style={{ borderRadius: '4px' }}
                                            >
                                                <Camera className="size-3" />
                                                Add Images
                                            </button>
                                            <input
                                                type="file"
                                                id="edit-vehicle-image-upload"
                                                multiple
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        </div>
                                    </div>
                                </div>
                                {errors.images && (
                                    <p className="mt-1 text-xs text-red-600">{errors.images}</p>
                                )}
                            </div>

                            {/* Make and Model */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Make <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="make"
                                        value={formData.make}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-1.5 text-sm border border-gray-200 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                                        placeholder="e.g., Toyota"
                                        style={{ borderRadius: '4px' }}
                                        required
                                    />
                                    {errors.make && (
                                        <p className="mt-1 text-xs text-red-600">{errors.make}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Model <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="model"
                                        value={formData.model}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-1.5 text-sm border border-gray-200 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                                        placeholder="e.g., Hiace"
                                        style={{ borderRadius: '4px' }}
                                        required
                                    />
                                    {errors.model && (
                                        <p className="mt-1 text-xs text-red-600">{errors.model}</p>
                                    )}
                                </div>
                            </div>

                            {/* Seat Capacity and Transmission */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Seat Capacity <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="seat_capacity"
                                        value={formData.seat_capacity}
                                        onChange={handleInputChange}
                                        min="1"
                                        className="w-full px-3 py-1.5 text-sm border border-gray-200 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                                        placeholder="e.g., 12"
                                        style={{ borderRadius: '4px' }}
                                        required
                                    />
                                    {errors.seat_capacity && (
                                        <p className="mt-1 text-xs text-red-600">{errors.seat_capacity}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Transmission
                                    </label>
                                    <select
                                        name="transmission"
                                        value={formData.transmission}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-1.5 text-sm border border-gray-200 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                                        style={{ borderRadius: '4px' }}
                                    >
                                        <option value="manual">Manual</option>
                                        <option value="automatic">Automatic</option>
                                        <option value="cvt">CVT</option>
                                    </select>
                                    {errors.transmission && (
                                        <p className="mt-1 text-xs text-red-600">{errors.transmission}</p>
                                    )}
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Vehicle Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-1.5 text-sm border border-gray-200 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                                    style={{ borderRadius: '4px' }}
                                >
                                    <option value="available">Available</option>
                                    <option value="in_use">In Use</option>
                                    <option value="maintenance">Maintenance</option>
                                    <option value="out_of_service">Out of Service</option>
                                </select>
                                {errors.status && (
                                    <p className="mt-1 text-xs text-red-600">{errors.status}</p>
                                )}
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="bg-gray-50 px-5 py-3 flex justify-end gap-2 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-4 py-1.5 border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-100"
                                style={{ borderRadius: '4px' }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ borderRadius: '4px' }}
                            >
                                {isSubmitting ? 'Updating...' : 'Update Vehicle'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}