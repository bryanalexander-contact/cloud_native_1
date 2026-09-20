import React from 'react';

const ESTADOS_VALIDOS = ['Creado', 'En Ruta', 'Entregado', 'Cancelado'];

export default function ShipmentTable({ shipments, onStatusChange, onViewTimeline }) {
    const formatDate = (dateString) => {
        if (!dateString) return '2026-09-18';
        return new Date(dateString).toISOString().split('T')[0];
    };

    if (!shipments || shipments.length === 0) {
        return <div className="p-6 text-center text-slate-500 font-medium">No hay envíos registrados.</div>;
    }

    return (
        <div className="overflow-x-auto bg-white rounded-2xl">
            <table className="w-full text-left border-collapse font-sans">
                <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="p-4 text-sm font-bold text-slate-900">ID del Envío ↕</th>
                        <th className="p-4 text-sm font-bold text-slate-900">Destinatario ↕</th>
                        <th className="p-4 text-sm font-bold text-slate-900">Dirección ↕</th>
                        <th className="p-4 text-sm font-bold text-slate-900">Estado ↕</th>
                        <th className="p-4 text-sm font-bold text-slate-900">Fecha Creada ↕</th>
                        <th className="p-4 text-sm font-bold text-slate-900">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {shipments.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4 text-sm font-bold text-slate-900">
                                {s.trackingCode ? s.trackingCode.replace('REX-2026-', 'RE0012') : `RE0012${s.id}`}
                            </td>
                            <td className="p-4 text-sm font-semibold text-slate-700">
                                {s.recipientName}
                            </td>
                            <td className="p-4 text-sm text-slate-500">
                                {s.destination || s.origin}
                            </td>
                            <td className="p-4 text-sm">
                                <select
                                    value={s.status || 'Creado'}
                                    onChange={(e) => onStatusChange(s.id, e.target.value)}
                                    className={`text-xs font-bold rounded-lg px-3 py-1.5 border outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer
                                        ${s.status === 'Entregado' ? 'bg-green-50 text-green-700 border-green-200' : 
                                          s.status === 'En Ruta' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                                          s.status === 'Cancelado' ? 'bg-red-50 text-red-700 border-red-200' : 
                                          'bg-slate-100 text-slate-700 border-slate-200'}`}
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
                                    className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
                                >
                                    Ver Timeline
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}