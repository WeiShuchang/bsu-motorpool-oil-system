// Components/Modals/AddServiceRecordModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronDown, Check, Car, User, FileText } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/Hooks/useToast';

export default function AddServiceRecordModal({ isOpen, onClose, onSave, vehicles = [], drivers = [] }) {
    const { showToast } = useToast();

    const [formData, setFormData] = useState({
        vehicle_id: '',
        driver_id: '',
        service_date: '',
        mileage: '',
        lubrication_type: '',
        oil_type: '',
        quantity: '',
        cost: '',
        service_provider: '',
        notes: '',
        coolant: '',
        break_cleaner: false,
        wiper_washer: false,
        engine_flush: false,
        penetrating_oil: false,
    });

    const [isVisible, setIsVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const [vehicleDropdownOpen, setVehicleDropdownOpen] = useState(false);
    const [driverDropdownOpen, setDriverDropdownOpen] = useState(false);

    const vehicleDropdownRef = useRef(null);
    const driverDropdownRef = useRef(null);

    const lubricationOptions = ['Engine Oil', 'Gear Oil', 'Brake Fluid', 'Transmission Fluid', 'Differential Oil'];

    // ── Validation ─────────────────────────────────────────────────────────────
    const validateField = (name, value) => {
        switch (name) {
            case 'vehicle_id':    return !value ? 'Vehicle is required' : '';
            case 'driver_id':     return !value ? 'Driver is required' : '';
            case 'service_date':  return !value ? 'Service date is required' : '';
            case 'mileage':
                if (!value) return 'Mileage is required';
                if (isNaN(value) || Number(value) < 0) return 'Mileage must be a positive number';
                return '';
            case 'lubrication_type': return !value ? 'Lubrication type is required' : '';
            case 'oil_type':         return !value ? 'Oil type is required' : '';
            case 'quantity':
                if (!value) return 'Quantity is required';
                if (isNaN(value) || Number(value) <= 0) return 'Quantity must be greater than 0';
                return '';
            case 'cost':
                if (!value) return 'Cost is required';
                if (isNaN(value) || Number(value) < 0) return 'Cost must be a positive number';
                return '';
            case 'service_provider': return !value ? 'Service provider is required' : '';
            default: return '';
        }
    };

    const validateForm = () => {
        const required = ['vehicle_id', 'driver_id', 'service_date', 'mileage', 'lubrication_type', 'oil_type', 'quantity', 'cost', 'service_provider'];
        const newErrors = {};
        required.forEach((key) => {
            const err = validateField(key, formData[key]);
            if (err) newErrors[key] = err;
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleBlur = (field) => {
        setTouched({ ...touched, [field]: true });
        const err = validateField(field, formData[field]);
        if (err) setErrors({ ...errors, [field]: err });
        else {
            const { [field]: _, ...rest } = errors;
            setErrors(rest);
        }
    };

    // ── Lifecycle ──────────────────────────────────────────────────────────────
    useEffect(() => {
        if (isOpen) { setIsVisible(true); resetForm(); }
        else         { setIsVisible(false); }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (vehicleDropdownRef.current && !vehicleDropdownRef.current.contains(e.target)) setVehicleDropdownOpen(false);
            if (driverDropdownRef.current  && !driverDropdownRef.current.contains(e.target))  setDriverDropdownOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!isOpen) return null;

    const resetForm = () => {
        setFormData({
            vehicle_id: '', driver_id: '', service_date: '', mileage: '',
            lubrication_type: '', oil_type: '', quantity: '', cost: '',
            service_provider: '', notes: '', coolant: '',
            break_cleaner: false, wiper_washer: false, engine_flush: false, penetrating_oil: false,
        });
        setErrors({});
        setTouched({});
    };

    const handleClose = () => {
        setIsVisible(false);
        resetForm();
        setTimeout(onClose, 200);
    };

    // ── Helpers ────────────────────────────────────────────────────────────────
    const getVehicleImage = (vehicle) => {
        if (!vehicle?.driver_images) return null;
        try {
            const images = JSON.parse(vehicle.driver_images);
            return images.length > 0 ? `/storage/${images[0]}` : null;
        } catch { return null; }
    };

    const selectedVehicle = vehicles.find(v => v.id === formData.vehicle_id);
    const selectedDriver  = drivers.find(d => d.id === formData.driver_id);

    const inputClass = (field) =>
        `w-full px-3 py-1.5 text-sm border ${
            touched[field] && errors[field] ? 'border-red-500' : 'border-gray-200'
        } focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-400`;

    // ── Submit ─────────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        const allTouched = {};
        Object.keys(formData).forEach(k => { allTouched[k] = true; });
        setTouched(allTouched);

        if (!validateForm()) { showToast('Please fix the validation errors', 'error'); return; }

        setIsSubmitting(true);
        try {
            await axios.post(`/service-records/${formData.vehicle_id}`, {
                ...formData,
                break_cleaner:   formData.break_cleaner   ? 1 : 0,
                wiper_washer:    formData.wiper_washer    ? 1 : 0,
                engine_flush:    formData.engine_flush    ? 1 : 0,
                penetrating_oil: formData.penetrating_oil ? 1 : 0,
            });

            showToast('Service record created successfully', 'success');
            if (onSave) onSave();
            resetForm();
            onClose();
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
                showToast('Please fix the validation errors', 'error');
            } else {
                showToast(error.response?.data?.message || 'An unexpected error occurred', 'error');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className={`fixed inset-0 z-50 overflow-y-auto transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className={`fixed inset-0 transition-opacity duration-300 ${isVisible ? 'bg-gray-500 bg-opacity-75' : 'bg-gray-500 bg-opacity-0'}`}
                    onClick={handleClose}
                />
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

                <div
                    className={`inline-block align-bottom bg-white text-left overflow-hidden shadow-xl transform transition-all duration-300 sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full ${
                        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95'
                    }`}
                    style={{ borderRadius: '8px' }}
                >
                    {/* Header */}
                    <div className="bg-green-600 px-5 py-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-semibold text-white">Add Service Record</h3>
                            <button onClick={handleClose} className="text-white/80 hover:text-white transition-colors">
                                <X className="size-4" />
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white">
                        <div className="px-5 py-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">

                            {/* ── Vehicle & Driver dropdowns ── */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                                {/* Vehicle */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Vehicle <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative" ref={vehicleDropdownRef}>
                                        <button
                                            type="button"
                                            onClick={() => setVehicleDropdownOpen(!vehicleDropdownOpen)}
                                            onBlur={() => handleBlur('vehicle_id')}
                                            className={`w-full px-3 py-1.5 text-sm border ${
                                                touched.vehicle_id && errors.vehicle_id ? 'border-red-500' : 'border-gray-200'
                                            } bg-white hover:bg-gray-50 flex items-center justify-between gap-2`}
                                            style={{ borderRadius: '4px' }}
                                        >
                                            {selectedVehicle ? (
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <div className="size-5 rounded bg-green-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                        {getVehicleImage(selectedVehicle) ? (
                                                            <img src={getVehicleImage(selectedVehicle)} alt="" className="size-5 object-cover" />
                                                        ) : (
                                                            <Car className="size-3 text-green-600" />
                                                        )}
                                                    </div>
                                                    <span className="truncate text-gray-700">{selectedVehicle.plate_number} — {selectedVehicle.make} {selectedVehicle.model}</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">Select vehicle</span>
                                            )}
                                            <ChevronDown className={`size-4 text-gray-400 flex-shrink-0 transition-transform ${vehicleDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {vehicleDropdownOpen && (
                                            <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-48 overflow-y-auto" style={{ boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
                                                {vehicles.map(vehicle => (
                                                    <div
                                                        key={vehicle.id}
                                                        onClick={() => { setFormData({ ...formData, vehicle_id: vehicle.id }); setVehicleDropdownOpen(false); }}
                                                        className={`px-3 py-2 hover:bg-green-50 cursor-pointer flex items-center justify-between ${formData.vehicle_id === vehicle.id ? 'bg-green-50' : ''}`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <div className="size-7 rounded bg-green-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                                {getVehicleImage(vehicle) ? (
                                                                    <img src={getVehicleImage(vehicle)} alt="" className="size-7 object-cover" />
                                                                ) : (
                                                                    <Car className="size-4 text-green-600" />
                                                                )}
                                                            </div>
                                                            <span className="text-sm text-gray-700">{vehicle.plate_number} — {vehicle.make} {vehicle.model}</span>
                                                        </div>
                                                        {formData.vehicle_id === vehicle.id && <Check className="size-4 text-green-600 flex-shrink-0" />}
                                                    </div>
                                                ))}
                                                {vehicles.length === 0 && <p className="px-3 py-2 text-sm text-gray-400">No vehicles available</p>}
                                            </div>
                                        )}
                                    </div>
                                    {touched.vehicle_id && errors.vehicle_id && <p className="text-xs text-red-600 mt-1">{errors.vehicle_id}</p>}
                                </div>

                                {/* Driver */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Driver <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative" ref={driverDropdownRef}>
                                        <button
                                            type="button"
                                            onClick={() => setDriverDropdownOpen(!driverDropdownOpen)}
                                            onBlur={() => handleBlur('driver_id')}
                                            className={`w-full px-3 py-1.5 text-sm border ${
                                                touched.driver_id && errors.driver_id ? 'border-red-500' : 'border-gray-200'
                                            } bg-white hover:bg-gray-50 flex items-center justify-between gap-2`}
                                            style={{ borderRadius: '4px' }}
                                        >
                                            {selectedDriver ? (
                                                <div className="flex items-center gap-2">
                                                    <User className="size-3 text-green-600 flex-shrink-0" />
                                                    <span className="truncate text-gray-700">{selectedDriver.driver_full_name}</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">Select driver</span>
                                            )}
                                            <ChevronDown className={`size-4 text-gray-400 flex-shrink-0 transition-transform ${driverDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {driverDropdownOpen && (
                                            <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-48 overflow-y-auto" style={{ boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
                                                {drivers.map(driver => (
                                                    <div
                                                        key={driver.id}
                                                        onClick={() => { setFormData({ ...formData, driver_id: driver.id }); setDriverDropdownOpen(false); }}
                                                        className={`px-3 py-2 hover:bg-green-50 cursor-pointer flex items-center justify-between ${formData.driver_id === driver.id ? 'bg-green-50' : ''}`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <User className="size-4 text-green-600 flex-shrink-0" />
                                                            <span className="text-sm text-gray-700">{driver.driver_full_name}</span>
                                                        </div>
                                                        {formData.driver_id === driver.id && <Check className="size-4 text-green-600 flex-shrink-0" />}
                                                    </div>
                                                ))}
                                                {drivers.length === 0 && <p className="px-3 py-2 text-sm text-gray-400">No drivers available</p>}
                                            </div>
                                        )}
                                    </div>
                                    {touched.driver_id && errors.driver_id && <p className="text-xs text-red-600 mt-1">{errors.driver_id}</p>}
                                </div>
                            </div>

                            {/* ── Service details ── */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Service Date <span className="text-red-500">*</span></label>
                                    <input
                                        type="date"
                                        value={formData.service_date}
                                        onChange={(e) => setFormData({ ...formData, service_date: e.target.value })}
                                        onBlur={() => handleBlur('service_date')}
                                        className={inputClass('service_date')}
                                        style={{ borderRadius: '4px' }}
                                    />
                                    {touched.service_date && errors.service_date && <p className="text-xs text-red-600 mt-1">{errors.service_date}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Mileage (km) <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        value={formData.mileage}
                                        onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                                        onBlur={() => handleBlur('mileage')}
                                        className={inputClass('mileage')}
                                        placeholder="e.g. 45000"
                                        style={{ borderRadius: '4px' }}
                                    />
                                    {touched.mileage && errors.mileage && <p className="text-xs text-red-600 mt-1">{errors.mileage}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Lubrication Type <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        list="lubrication-options"
                                        value={formData.lubrication_type}
                                        onChange={(e) => setFormData({ ...formData, lubrication_type: e.target.value })}
                                        onBlur={() => handleBlur('lubrication_type')}
                                        className={inputClass('lubrication_type')}
                                        placeholder="e.g. Engine Oil"
                                        style={{ borderRadius: '4px' }}
                                    />
                                    <datalist id="lubrication-options">
                                        {lubricationOptions.map(o => <option key={o} value={o} />)}
                                    </datalist>
                                    {touched.lubrication_type && errors.lubrication_type && <p className="text-xs text-red-600 mt-1">{errors.lubrication_type}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Oil Type <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={formData.oil_type}
                                        onChange={(e) => setFormData({ ...formData, oil_type: e.target.value })}
                                        onBlur={() => handleBlur('oil_type')}
                                        className={inputClass('oil_type')}
                                        placeholder="e.g. 10W-40 Synthetic"
                                        style={{ borderRadius: '4px' }}
                                    />
                                    {touched.oil_type && errors.oil_type && <p className="text-xs text-red-600 mt-1">{errors.oil_type}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Quantity (L) <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                        onBlur={() => handleBlur('quantity')}
                                        className={inputClass('quantity')}
                                        placeholder="e.g. 4.5"
                                        style={{ borderRadius: '4px' }}
                                    />
                                    {touched.quantity && errors.quantity && <p className="text-xs text-red-600 mt-1">{errors.quantity}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Cost (₱) <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.cost}
                                        onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                                        onBlur={() => handleBlur('cost')}
                                        className={inputClass('cost')}
                                        placeholder="e.g. 1500.00"
                                        style={{ borderRadius: '4px' }}
                                    />
                                    {touched.cost && errors.cost && <p className="text-xs text-red-600 mt-1">{errors.cost}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Service Provider <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={formData.service_provider}
                                        onChange={(e) => setFormData({ ...formData, service_provider: e.target.value })}
                                        onBlur={() => handleBlur('service_provider')}
                                        className={inputClass('service_provider')}
                                        placeholder="e.g. BSU Motorpool Shop"
                                        style={{ borderRadius: '4px' }}
                                    />
                                    {touched.service_provider && errors.service_provider && <p className="text-xs text-red-600 mt-1">{errors.service_provider}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Coolant (L)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={formData.coolant}
                                        onChange={(e) => setFormData({ ...formData, coolant: e.target.value })}
                                        className={inputClass('coolant')}
                                        placeholder="e.g. 1.0"
                                        style={{ borderRadius: '4px' }}
                                    />
                                </div>
                            </div>

                            {/* ── Checkboxes ── */}
                            <div className="border-t border-green-100 pt-3">
                                <label className="block text-xs font-medium text-gray-700 mb-2">Additional Items</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { key: 'break_cleaner',   label: 'Brake Cleaner'   },
                                        { key: 'wiper_washer',    label: 'Wiper Washer'    },
                                        { key: 'engine_flush',    label: 'Engine Flush'    },
                                        { key: 'penetrating_oil', label: 'Penetrating Oil' },
                                    ].map(({ key, label }) => (
                                        <label key={key} className="flex items-center gap-2 cursor-pointer group">
                                            <div
                                                className={`size-4 rounded border flex items-center justify-center transition-colors ${
                                                    formData[key] ? 'bg-green-600 border-green-600' : 'border-gray-300 group-hover:border-green-400'
                                                }`}
                                                onClick={() => setFormData({ ...formData, [key]: !formData[key] })}
                                            >
                                                {formData[key] && <Check className="size-3 text-white" />}
                                            </div>
                                            <span className="text-xs text-gray-700">{label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* ── Notes ── */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    rows="3"
                                    className="w-full px-3 py-1.5 text-sm border border-gray-200 focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-400"
                                    placeholder="Any additional notes about this service..."
                                    style={{ borderRadius: '4px' }}
                                />
                            </div>

                        </div>

                        {/* Footer */}
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
                                {isSubmitting ? <><span className="animate-spin">⏳</span> Saving...</> : 'Add Record'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}