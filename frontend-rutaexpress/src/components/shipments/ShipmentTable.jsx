import React from 'react';

const ESTADOS_VALIDOS = ['Creado', 'Aceptado', 'En Bodega', 'En Ruta', 'Entregado', 'Cancelado'];

export default function ShipmentTable({ shipments, onStatusChange, onViewTimeline }) {
    const formatDate = (dateString) => {
        if (!dateString) return 'Hoy';
        try {
            return new Date(dateString).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });
        } catch {
            return '2026-10-17';
        }
    };

    if (!shipments || shipments.length === 0) {
        return <div className="p-8 text-center text-slate-500 font-medium">No hay envíos registrados.</div>;
    }

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Entregado': return 'bg-green-50 text-green-700 border-green-200';
            case 'En Ruta': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'En Bodega': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'Aceptado': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
            case 'Cancelado': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="overflow-x-auto bg-white rounded-2xl">
            <table className="w-full text-left border-collapse font-sans">
                <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tracking Code</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Destinatario</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Dirección Destino</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado de Trazabilidad</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha Creación</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {shipments.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="p-4 text-sm font-bold text-slate-900 font-mono">
                                {s.trackingCode || `RE-100${s.id}`}
                            </td>
                            <td className="p-4 text-sm font-semibold text-slate-800">
                                {s.recipientName}
                            </td>
                            <td className="p-4 text-sm text-slate-600">
                                {s.destination || s.origin || 'Santiago'}
                            </td>
                            <td className="p-4 text-sm">
                                <select
                                    value={s.status || 'Creado'}
                                    onChange={(e) => onStatusChange(s.id, e.target.value)}
                                    className={`text-xs font-bold rounded-lg px-3 py-1.5 border outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer ${getStatusStyle(s.status)}`}
                                >
                                    {ESTADOS_VALIDOS.map(estado => (
                                        <option key={estado} value={estado}>{estado}</option>
                                    ))}
                                </select>
                            </td>
                            <td className="p-4 text-sm text-slate-500">
                                {formatDate(s.createdAt)}
                            </td>
                            <td className="p-4 flex gap-2">
                                <button 
                                    onClick={() => onViewTimeline && onViewTimeline(s.id)}
                                    className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
                                >
                                    🔍 Ver Timeline
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}