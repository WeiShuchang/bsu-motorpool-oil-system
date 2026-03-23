import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, User, Camera, ChevronDown, Check, Car } from 'lucide-react';
import { router } from '@inertiajs/react';
import { useToast } from '@/Hooks/useToast';
import axios from 'axios';

export default function AddDriverModal({ isOpen, onClose, onSave, availableVehicles = [] }) {
    const { showToast } = useToast();

    console.log('AddDriverModal - availableVehicles:', availableVehicles);
console.log('AddDriverModal - availableVehicles length:', availableVehicles?.length);
    
    const [formData, setFormData] = useState({
        driver_full_name: '',
        email: '',
        contact_number: '',
        license_number: '',
        address: '',
        status: 'Active',
        driver_image: null,
        vehicle_ids: []
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [vehicleDropdownOpen, setVehicleDropdownOpen] = useState(false);
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    
    const dropdownRef = useRef(null);
    const statusDropdownRef = useRef(null);
    const buttonRef = useRef(null);
    const fileInputRef = useRef(null);

    const statusOptions = ['Active', 'Inactive'];

    // Validation rules
    const validateField = (name, value) => {
        switch (name) {
            case 'driver_full_name':
                if (!value) return 'Full name is required';
                if (value.length < 2) return 'Name must be at least 2 characters';
                if (value.length > 255) return 'Name must not exceed 255 characters';
                return '';
            
            case 'email':
                if (!value) return 'Email is required';
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) return 'Please enter a valid email address';
                return '';
            
            case 'contact_number':
                if (!value) return 'Contact number is required';
                const phoneRegex = /^[\d\s\+\-\(\)]{10,20}$/;
                if (!phoneRegex.test(value)) return 'Please enter a valid contact number';
                return '';
            
            case 'license_number':
                if (!value) return 'License number is required';
                if (value.length < 5) return 'License number must be at least 5 characters';
                return '';
            
            case 'address':
                if (value && value.length > 1000) return 'Address must not exceed 1000 characters';
                return '';
            
            case 'status':
                if (!value) return 'Status is required';
                if (!statusOptions.includes(value)) return 'Invalid status value';
                return '';
            
            case 'driver_image':
                if (value && value.size > 2 * 1024 * 1024) return 'Image must not exceed 2MB';
                if (value && !['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].includes(value.type)) {
                    return 'Image must be JPG, PNG, or GIF format';
                }
                return '';
            
            default:
                return '';
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        Object.keys(formData).forEach(key => {
            if (key !== 'vehicle_ids' && key !== 'address') {
                const error = validateField(key, formData[key]);
                if (error) newErrors[key] = error;
            }
        });
        
        if (formData.address) {
            const addressError = validateField('address', formData.address);
            if (addressError) newErrors.address = addressError;
        }
        
        if (formData.driver_image) {
            const imageError = validateField('driver_image', formData.driver_image);
            if (imageError) newErrors.driver_image = imageError;
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleBlur = (field) => {
        setTouched({ ...touched, [field]: true });
        const error = validateField(field, formData[field]);
        if (error) {
            setErrors({ ...errors, [field]: error });
        } else {
            const { [field]: removed, ...rest } = errors;
            setErrors(rest);
        }
    };

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            resetForm();
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    const resetForm = () => {
        setFormData({
            driver_full_name: '',
            email: '',
            contact_number: '',
            license_number: '',
            address: '',
            status: 'Active',
            driver_image: null,
            vehicle_ids: []
        });
        setImagePreview(null);
        setErrors({});
        setTouched({});
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setVehicleDropdownOpen(false);
            }
            if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
                setStatusDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!isOpen) return null;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const error = validateField('driver_image', file);
            if (error) {
                showToast(error, 'error');
                return;
            }
            
            setFormData({ ...formData, driver_image: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleVehicleSelect = (vehicle) => {
        if (!formData.vehicle_ids.includes(vehicle.id)) {
            const updatedIds = [...formData.vehicle_ids, vehicle.id];
            setFormData({ ...formData, vehicle_ids: updatedIds });
        }
        setVehicleDropdownOpen(false);
    };

    const handleVehicleRemove = (vehicleId) => {
        const updatedIds = formData.vehicle_ids.filter(id => id !== vehicleId);
        setFormData({ ...formData, vehicle_ids: updatedIds });
    };

  // Replace the handleSubmit function
const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach(key => {
        allTouched[key] = true;
    });
    setTouched(allTouched);
    
    // Validate form
    if (!validateForm()) {
        showToast('Please fix the validation errors', 'error');
        return;
    }
    
    setIsSubmitting(true);

    // Create FormData object for file upload
    const submitData = new FormData();
    
    // Append all form fields
    submitData.append('driver_full_name', formData.driver_full_name);
    submitData.append('email', formData.email);
    submitData.append('contact_number', formData.contact_number);
    submitData.append('license_number', formData.license_number);
    submitData.append('address', formData.address || '');
    submitData.append('status', formData.status);
    
    if (formData.driver_image) {
        submitData.append('driver_image', formData.driver_image);
    }
    
    // Append vehicle_ids as array
    formData.vehicle_ids.forEach(id => {
        submitData.append('vehicle_ids[]', id);
    });

    try {
        // Use axios to submit the form
        const response = await axios.post('/drivers', submitData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        // Handle success
        setIsSubmitting(false);
        showToast('Driver created successfully', 'success');
        
        // Call onSave with the new driver data if provided
        if (onSave) {
            onSave(response.data.driver || response.data);
        }
        
        resetForm();
        onClose(); // Close the modal
        
    } catch (error) {
        setIsSubmitting(false);
        
        // Handle validation errors
        if (error.response && error.response.data.errors) {
            setErrors(error.response.data.errors);
            showToast('Failed to create driver', 'error');
        } else if (error.response && error.response.data.message) {
            showToast(error.response.data.message, 'error');
        } else {
            showToast('An unexpected error occurred', 'error');
        }
        
        console.log('Error:', error);
    }
};

// Also update the success message in the JSX if you want to change it

    const handleClose = () => {
        setIsVisible(false);
        resetForm();
        setTimeout(onClose, 200);
    };

    const getVehicleStatusColor = (status) => {
        switch(status) {
            case 'available': return 'text-green-600 bg-green-50';
            case 'maintenance': return 'text-yellow-600 bg-yellow-50';
            case 'in_use': return 'text-blue-600 bg-blue-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'Active': return 'text-green-600 bg-green-50';
            case 'Inactive': return 'text-gray-600 bg-gray-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    // Helper to get selected vehicle details
    const getSelectedVehicleDetails = (vehicleId) => {
        return availableVehicles.find(v => v.id === vehicleId);
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
                    className={`inline-block align-bottom bg-white text-left overflow-hidden shadow-xl transform transition-all duration-300 sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${
                        isVisible 
                            ? 'translate-y-0 opacity-100' 
                            : 'translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95'
                    }`}
                    style={{ borderRadius: '8px' }}
                >
                    {/* Green header */}
                    <div className="bg-green-600 px-5 py-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-semibold text-white">Add New Driver</h3>
                            <button 
                                onClick={handleClose} 
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <X className="size-4" />
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white">
                        <div className="px-5 py-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                            {/* Image Upload */}
                            <div className="flex items-center gap-4">
                                <div className="relative flex-shrink-0">
                                    <div className="size-16 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center overflow-hidden">
                                        {imagePreview ? (
                                            <img 
                                                src={imagePreview} 
                                                alt="Preview" 
                                                className="size-16 object-cover"
                                            />
                                        ) : (
                                            <User className="size-8 text-green-400" />
                                        )}
                                    </div>
                                    <label 
                                        htmlFor="image-upload" 
                                        className="absolute -bottom-1 -right-1 bg-green-600 rounded-full p-1.5 cursor-pointer hover:bg-green-700 shadow-sm"
                                    >
                                        <Camera className="size-3 text-white" />
                                    </label>
                                    <input
                                        type="file"
                                        id="image-upload"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/jpeg,image/png,image/jpg,image/gif"
                                        onChange={handleImageChange}
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500">
                                        Upload photo (JPG, PNG, GIF. Max 2MB)
                                    </p>
                                    {touched.driver_image && errors.driver_image && (
                                        <p className="text-xs text-red-600 mt-1">{errors.driver_image}</p>
                                    )}
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.driver_full_name}
                                        onChange={(e) => setFormData({ ...formData, driver_full_name: e.target.value })}
                                        onBlur={() => handleBlur('driver_full_name')}
                                        className={`w-full px-3 py-1.5 text-sm border ${
                                            touched.driver_full_name && errors.driver_full_name ? 'border-red-500' : 'border-gray-200'
                                        } focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-400`}
                                        placeholder="Juan Dela Cruz"
                                        style={{ borderRadius: '4px' }}
                                    />
                                    {touched.driver_full_name && errors.driver_full_name && (
                                        <p className="text-xs text-red-600 mt-1">{errors.driver_full_name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        onBlur={() => handleBlur('email')}
                                        className={`w-full px-3 py-1.5 text-sm border ${
                                            touched.email && errors.email ? 'border-red-500' : 'border-gray-200'
                                        } focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-400`}
                                        placeholder="juan@bsumotorpool.edu"
                                        style={{ borderRadius: '4px' }}
                                    />
                                    {touched.email && errors.email && (
                                        <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Contact <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.contact_number}
                                        onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                                        onBlur={() => handleBlur('contact_number')}
                                        className={`w-full px-3 py-1.5 text-sm border ${
                                            touched.contact_number && errors.contact_number ? 'border-red-500' : 'border-gray-200'
                                        } focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-400`}
                                        placeholder="+63 912 345 6789"
                                        style={{ borderRadius: '4px' }}
                                    />
                                    {touched.contact_number && errors.contact_number && (
                                        <p className="text-xs text-red-600 mt-1">{errors.contact_number}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        License # <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.license_number}
                                        onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                                        onBlur={() => handleBlur('license_number')}
                                        className={`w-full px-3 py-1.5 text-sm border ${
                                            touched.license_number && errors.license_number ? 'border-red-500' : 'border-gray-200'
                                        } focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-400`}
                                        placeholder="D01-23-456789"
                                        style={{ borderRadius: '4px' }}
                                    />
                                    {touched.license_number && errors.license_number && (
                                        <p className="text-xs text-red-600 mt-1">{errors.license_number}</p>
                                    )}
                                </div>
                            </div>

                            {/* Status Dropdown */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Status <span className="text-red-500">*</span>
                                </label>
                                <div className="relative" ref={statusDropdownRef}>
                                    <button
                                        type="button"
                                        onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                                        onBlur={() => handleBlur('status')}
                                        className={`w-full px-3 py-1.5 text-sm border ${
                                            touched.status && errors.status ? 'border-red-500' : 'border-gray-200'
                                        } bg-white hover:bg-gray-50 flex items-center justify-between`}
                                        style={{ borderRadius: '4px' }}
                                    >
                                        <span>{formData.status}</span>
                                        <ChevronDown className={`size-4 text-gray-400 transition-transform ${statusDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {statusDropdownOpen && (
                                        <div 
                                            className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-y-auto"
                                            style={{
                                                top: '100%',
                                                left: 0,
                                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                                            }}
                                        >
                                            {statusOptions.map(status => (
                                                <div
                                                    key={status}
                                                    onClick={() => {
                                                        setFormData({ ...formData, status });
                                                        setStatusDropdownOpen(false);
                                                    }}
                                                    className="px-3 py-2 hover:bg-green-50 cursor-pointer flex items-center justify-between"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className={`text-xs px-1.5 py-0.5 rounded ${getStatusColor(status)}`}>
                                                            {status}
                                                        </div>
                                                    </div>
                                                    {formData.status === status && (
                                                        <Check className="size-4 text-green-600" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {touched.status && errors.status && (
                                    <p className="text-xs text-red-600 mt-1">{errors.status}</p>
                                )}
                            </div>
                                {/* Vehicle Assignment Section */}
                            <div className="border-t border-green-100 pt-4">
                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                    Assign Vehicles
                                </label>
                                
                                {/* Selected Vehicles Tags */}
                                {formData.vehicle_ids.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                 {formData.vehicle_ids.map(vehicleId => {
                                    const vehicle = getSelectedVehicleDetails(vehicleId);
                                    return vehicle ? (
                                        <div 
                                            key={vehicleId}
                                            className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 border border-green-200 rounded"
                                        >
                                            {/* Add vehicle image */}
                                            <div className="size-5 rounded bg-green-100 flex items-center justify-center overflow-hidden">
                                                {(() => {
                                                    let vehicleImage = null;
                                                    if (vehicle.driver_images) {
                                                        try {
                                                            const images = JSON.parse(vehicle.driver_images);
                                                            vehicleImage = images.length > 0 ? `/storage/${images[0]}` : null;
                                                        } catch (e) {
                                                            vehicleImage = null;
                                                        }
                                                    }
                                                    return vehicleImage ? (
                                                        <img 
                                                            src={vehicleImage} 
                                                            alt={vehicle.make}
                                                            className="size-5 object-cover"
                                                        />
                                                    ) : (
                                                        <Car className="size-3 text-green-600" />
                                                    );
                                                })()}
                                            </div>
                                            <span className="text-xs text-green-700">{vehicle.make} {vehicle.model}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleVehicleRemove(vehicleId)}
                                                className="text-green-500 hover:text-green-700"
                                            >
                                                <X className="size-3" />
                                            </button>
                                        </div>
                                    ) : null;
                                })}
                                    </div>
                                )}

                                {/* Vehicle Dropdown */}
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        type="button"
                                        ref={buttonRef}
                                        onClick={() => setVehicleDropdownOpen(!vehicleDropdownOpen)}
                                        className="w-full px-3 py-1.5 text-sm border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-between"
                                        style={{ borderRadius: '4px' }}
                                    >
                                        <span className="text-gray-600">
                                            {formData.vehicle_ids.length > 0 
                                                ? `${formData.vehicle_ids.length} vehicle(s) selected` 
                                                : 'Select vehicles to assign'}
                                        </span>
                                        <ChevronDown className={`size-4 text-gray-400 transition-transform ${vehicleDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                            {vehicleDropdownOpen && availableVehicles && (
                            <div 
                                className="absolute z-[9999] w-full mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-y-auto"
                                style={{
                                    top: '100%',
                                    left: 0,
                                    right: 0,
                                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                                    maxHeight: '240px'
                                }}
                            >
                            {availableVehicles.map(vehicle => {
                                console.log('Vehicle in dropdown:', vehicle);
                                const isSelected = formData.vehicle_ids.includes(vehicle.id);
                                
                                // Parse images if they exist - it's stored as a JSON string array
                                let vehicleImage = null;
                                if (vehicle.driver_images) {
                                    try {
                                        const images = JSON.parse(vehicle.driver_images);
                                        vehicleImage = images.length > 0 ? `/storage/${images[0]}` : null;
                                    } catch (e) {
                                        vehicleImage = null;
                                    }
                                }
                                
                                return (
                                    <div
                                        key={vehicle.id}
                                        onClick={() => !isSelected && handleVehicleSelect(vehicle)}
                                        className={`px-3 py-2 hover:bg-green-50 cursor-pointer flex items-center justify-between ${
                                            isSelected ? 'bg-green-50 opacity-50' : ''
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {/* Vehicle Image - small size */}
                                            <div className="size-8 rounded bg-green-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                {vehicleImage ? (
                                                    <img 
                                                        src={vehicleImage} 
                                                        alt={`${vehicle.make} ${vehicle.model}`}
                                                        className="size-8 object-cover"
                                                    />
                                                ) : (
                                                    <Car className="size-4 text-green-600" />
                                                )}
                                            </div>
                                            
                                            {/* Vehicle Details */}
                                            <div className="flex items-center gap-2">
                                        
                                                <span className="text-sm font-medium text-gray-700">{vehicle.make} {vehicle.model}</span> - 
                                                <span className="text-sm font-medium text-gray-700">{vehicle.plate_number}</span>

                                            </div>
                                        </div>
                                        {isSelected && (
                                            <Check className="size-4 text-green-600 flex-shrink-0" />
                                        )}
                                    </div>
                                );
                            })}
                                        </div>
                                    )}
                                </div>
                                {errors.vehicle_ids && (
                                    <p className="text-xs text-red-600 mt-1">{errors.vehicle_ids}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Address
                                </label>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    onBlur={() => handleBlur('address')}
                                    rows="2"
                                    className={`w-full px-3 py-1.5 text-sm border ${
                                        touched.address && errors.address ? 'border-red-500' : 'border-gray-200'
                                    } focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-400`}
                                    placeholder="Complete address"
                                    style={{ borderRadius: '4px' }}
                                />
                                {touched.address && errors.address && (
                                    <p className="text-xs text-red-600 mt-1">{errors.address}</p>
                                )}
                            </div>

                        
                        </div>

                        {/* Form Actions */}
                        <div className="bg-gray-50 px-5 py-3 flex justify-end gap-2 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={isSubmitting}
                                className="px-4 py-1.5 border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                                style={{ borderRadius: '4px' }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium shadow-sm disabled:opacity-50 flex items-center gap-2"
                                style={{ borderRadius: '4px' }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="animate-spin">⏳</span>
                                        Saving...
                                    </>
                                ) : (
                                    'Add Driver'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}