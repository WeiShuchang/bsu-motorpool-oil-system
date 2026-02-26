import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, User, Camera, ChevronDown, Check } from 'lucide-react';

export default function EditDriverModal({ isOpen, onClose, onSave, driver }) {
    const [formData, setFormData] = useState({
        id: null,
        name: '',
        email: '',
        contact: '',
        licenseNumber: '',
        address: '',
        status: 'Active',
        image: null,
        assignedVehicles: []
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [vehicleDropdownOpen, setVehicleDropdownOpen] = useState(false);
    const [selectedVehicles, setSelectedVehicles] = useState([]);
    
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    // Dummy vehicle data
    const availableVehicles = [
        { id: 1, name: 'Toyota Hilux', plate: 'ABC-1234', status: 'available' },
        { id: 2, name: 'Mitsubishi Xpander', plate: 'XYZ-5678', status: 'available' },
        { id: 3, name: 'Nissan Urvan', plate: 'DEF-9012', status: 'available' },
        { id: 4, name: 'Ford Ranger', plate: 'GHI-3456', status: 'maintenance' },
        { id: 5, name: 'Hyundai H-100', plate: 'JKL-7890', status: 'available' },
        { id: 6, name: 'Toyota Innova', plate: 'MNO-1234', status: 'available' },
    ];

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setVehicleDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (driver) {
            // Simulate some pre-assigned vehicles for existing drivers
            let assignedVehicles = [];
            if (driver.id === 1) {
                assignedVehicles = [availableVehicles[0], availableVehicles[2]];
            } else if (driver.id === 2) {
                assignedVehicles = [availableVehicles[1]];
            } else if (driver.id === 3) {
                assignedVehicles = [availableVehicles[3], availableVehicles[4]];
            }

            setFormData({
                id: driver.id || null,
                name: driver.name || '',
                email: driver.email || '',
                contact: driver.contact || '',
                licenseNumber: driver.licenseNumber || '',
                address: driver.address || '',
                status: driver.status || 'Active',
                image: driver.image || null,
                assignedVehicles: assignedVehicles
            });
            setSelectedVehicles(assignedVehicles);
            
            if (driver.image) {
                setImagePreview(driver.image);
            }
        }
    }, [driver]);

    if (!isOpen || !driver) return null;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleVehicleSelect = (vehicle) => {
        if (!selectedVehicles.find(v => v.id === vehicle.id)) {
            const updatedSelection = [...selectedVehicles, vehicle];
            setSelectedVehicles(updatedSelection);
            setFormData({ ...formData, assignedVehicles: updatedSelection });
        }
        setVehicleDropdownOpen(false);
    };

    const handleVehicleRemove = (vehicleId) => {
        const updatedSelection = selectedVehicles.filter(v => v.id !== vehicleId);
        setSelectedVehicles(updatedSelection);
        setFormData({ ...formData, assignedVehicles: updatedSelection });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleClose = () => {
        setIsVisible(false);
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
                    className={`inline-block align-bottom bg-white text-left overflow-visible shadow-xl transform transition-all duration-300 sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${
                        isVisible 
                            ? 'translate-y-0 opacity-100' 
                            : 'translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95'
                    }`}
                    style={{ borderRadius: '8px' }}
                >
                    {/* Green header */}
                    <div className="bg-green-600 px-5 py-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-semibold text-white">Edit Driver</h3>
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
                            {/* Image Upload - Rounded image */}
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
                                        htmlFor="edit-image-upload" 
                                        className="absolute -bottom-1 -right-1 bg-green-600 rounded-full p-1.5 cursor-pointer hover:bg-green-700 shadow-sm"
                                    >
                                        <Camera className="size-3 text-white" />
                                    </label>
                                    <input
                                        type="file"
                                        id="edit-image-upload"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500">
                                        Update photo (JPG, PNG, GIF. Max 2MB)
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => document.getElementById('edit-image-upload').click()}
                                        className="mt-1 inline-flex items-center gap-1 px-3 py-1 border border-green-200 text-xs font-medium text-green-700 hover:bg-green-50"
                                        style={{ borderRadius: '4px' }}
                                    >
                                        <Upload className="size-3" />
                                        Change Photo
                                    </button>
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
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-1.5 text-sm border border-gray-200 focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-400"
                                        placeholder="Juan Dela Cruz"
                                        style={{ borderRadius: '4px' }}
                                    />
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
                                        className="w-full px-3 py-1.5 text-sm border border-gray-200 focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-400"
                                        placeholder="juan@bsumotorpool.edu"
                                        style={{ borderRadius: '4px' }}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Contact <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.contact}
                                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                        className="w-full px-3 py-1.5 text-sm border border-gray-200 focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-400"
                                        placeholder="+63 912 345 6789"
                                        style={{ borderRadius: '4px' }}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        License # <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.licenseNumber}
                                        onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                                        className="w-full px-3 py-1.5 text-sm border border-gray-200 focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-400"
                                        placeholder="D01-23-456789"
                                        style={{ borderRadius: '4px' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Address
                                </label>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    rows="2"
                                    className="w-full px-3 py-1.5 text-sm border border-gray-200 focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-400"
                                    placeholder="Complete address"
                                    style={{ borderRadius: '4px' }}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-3 py-1.5 text-sm border border-gray-200 focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-400"
                                    style={{ borderRadius: '4px' }}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>

                            {/* Vehicle Assignment Section */}
                            <div className="border-t border-green-100 pt-4">
                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                    Assigned Vehicles
                                </label>
                                
                                {/* Selected Vehicles Tags */}
                                {selectedVehicles.length > 0 ? (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {selectedVehicles.map(vehicle => (
                                            <div 
                                                key={vehicle.id}
                                                className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 border border-green-200 rounded"
                                            >
                                                <span className="text-xs text-green-700">{vehicle.name}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleVehicleRemove(vehicle.id)}
                                                    className="text-green-500 hover:text-green-700"
                                                >
                                                    <X className="size-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 mb-3">No vehicles assigned</p>
                                )}

                                {/* Vehicle Dropdown - Fixed positioning */}
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        type="button"
                                        ref={buttonRef}
                                        onClick={() => setVehicleDropdownOpen(!vehicleDropdownOpen)}
                                        className="w-full px-3 py-1.5 text-sm border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-between"
                                        style={{ borderRadius: '4px' }}
                                    >
                                        <span className="text-gray-600">Add more vehicles</span>
                                        <ChevronDown className={`size-4 text-gray-400 transition-transform ${vehicleDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu - Now with higher z-index and positioned absolutely relative to the button */}
                                    {vehicleDropdownOpen && (
                                        <div 
                                            className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-y-auto"
                                            style={{
                                                top: '100%',
                                                left: 0,
                                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
                                            }}
                                        >
                                            {availableVehicles.map(vehicle => {
                                                const isSelected = selectedVehicles.find(v => v.id === vehicle.id);
                                                return (
                                                    <div
                                                        key={vehicle.id}
                                                        onClick={() => !isSelected && handleVehicleSelect(vehicle)}
                                                        className={`px-3 py-2 hover:bg-green-50 cursor-pointer flex items-center justify-between ${
                                                            isSelected ? 'bg-green-50 opacity-50' : ''
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <div className={`text-xs px-1.5 py-0.5 rounded ${getVehicleStatusColor(vehicle.status)}`}>
                                                                {vehicle.status}
                                                            </div>
                                                            <span className="text-sm">{vehicle.name}</span>
                                                            <span className="text-xs text-gray-500">{vehicle.plate}</span>
                                                        </div>
                                                        {isSelected && (
                                                            <Check className="size-4 text-green-600" />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Select additional vehicles to assign to this driver
                                </p>
                            </div>
                        </div>

                        {/* Form Actions - Fixed at bottom */}
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
                                className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium shadow-sm"
                                style={{ borderRadius: '4px' }}
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}