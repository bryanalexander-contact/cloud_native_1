import React, { useState } from 'react';

export default function CreateShipmentModal({ isOpen, onClose, onSubmit }) {
    // Estado inicial que coincide con el DTO esperado por Spring Boot
    const initialState = { 
        origin: 'Bodega Central, Santiago', 
        destination: '', 
        recipientName: '',
        description: '' 
    };
    
    const [formData, setFormData] = useState(initialState);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData(initialState); // Limpia el formulario tras el envío exitoso
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center p-4 z-50">
            <div className="bg-white p-7 rounded-2xl shadow-xl max-w-md w-full space-y-6">
                
                <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-bold text-slate-800">Crear Nuevo Envío</h2>
                    <p className="text-sm text-slate-500 mt-1">Ingresa los detalles para registrar la encomienda en el sistema.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Destinatario */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nombre del Destinatario</label>
                        <input
                            type="text" 
                            placeholder="Ej. María González" 
                            required
                            value={formData.recipientName} 
                            onChange={e => setFormData({ ...formData, recipientName: e.target.value })}
                            className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-slate-50 focus:bg-white transition-colors"
                        />
                    </div>

                    {/* Destino y Origen */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Punto de Origen</label>
                            <input
                                type="text" 
                                required
                                value={formData.origin} 
                                onChange={e => setFormData({ ...formData, origin: e.target.value })}
                                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-slate-50 focus:bg-white transition-colors text-slate-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Dirección de Destino</label>
                            <input
                                type="text" 
                                placeholder="Ej. Av. Providencia 123" 
                                required
                                value={formData.destination} 
                                onChange={e => setFormData({ ...formData, destination: e.target.value })}
                                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-slate-50 focus:bg-white transition-colors"
                            />
                        </div>
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Descripción del Paquete</label>
                        <input
                            type="text" 
                            placeholder="Ej. Caja pequeña, frágil" 
                            required
                            value={formData.description} 
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-slate-50 focus:bg-white transition-colors"
                        />
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            className="px-5 py-2.5 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium shadow-sm transition-colors"
                        >
                            Confirmar y Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}