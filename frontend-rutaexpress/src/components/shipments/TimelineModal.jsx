import React, { useEffect, useState } from 'react';
import { getShipmentHistory } from '../../services/shipmentService';
import { X, Clock, Package, Truck, CheckCircle } from 'lucide-react';

export default function TimelineModal({ shipmentId, onClose }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (shipmentId) {
            setLoading(true);
            getShipmentHistory(shipmentId).then(data => {
                // Ordenamos para que el evento más reciente quede arriba
                setHistory(data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
                setLoading(false);
            });
        }
    }, [shipmentId]);

    if (!shipmentId) return null;

    // Asignar un ícono dinámico según el estado
    const getStatusIcon = (status) => {
        switch (status) {
            case 'Creado': return <Package size={16} className="text-blue-600" />;
            case 'En Ruta': return <Truck size={16} className="text-amber-500" />;
            case 'Entregado': return <CheckCircle size={16} className="text-green-600" />;
            default: return <Clock size={16} className="text-slate-500" />;
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col max-h-[80vh]">
                
                {/* Cabecera del Modal */}
                <div className="flex justify-between items-center p-5 border-b border-slate-100">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Historial del Envío</h2>
                        <p className="text-sm text-slate-500">ID: RE0012{shipmentId}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Cuerpo con la Línea de Tiempo */}
                <div className="p-6 overflow-y-auto">
                    {loading ? (
                        <div className="flex justify-center p-4"><Clock className="animate-spin text-slate-400" /></div>
                    ) : history.length === 0 ? (
                        <p className="text-center text-slate-500">No hay eventos registrados.</p>
                    ) : (
                        <div className="relative border-l-2 border-slate-200 ml-3 space-y-8">
                            {history.map((event, index) => (
                                <div key={event.id} className="relative pl-6">
                                    {/* Punto en la línea */}
                                    <div className="absolute -left-[11px] top-1 bg-white border-2 border-slate-200 p-1 rounded-full">
                                        {getStatusIcon(event.status)}
                                    </div>
                                    
                                    {/* Contenido del evento */}
                                    <div className={`p-4 rounded-xl border ${index === 0 ? 'bg-blue-50 border-blue-100' : 'bg-white border-slate-100 shadow-sm'}`}>
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-bold text-slate-900">{event.status}</span>
                                            <span className="text-xs font-medium text-slate-500">
                                                {new Date(event.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-2">Ubicación: {event.location}</p>
                                        <p className="text-xs text-slate-400">Actualizado por: {event.user}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}