import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Truck, MapPin, User, Fuel, AlertCircle, CheckCircle, Clock, PlusCircle, X } from 'lucide-react';

const ESTADOS_CAMION = ['Disponible', 'En Ruta', 'En Mantenimiento', 'Fuera de Servicio'];

const statusColor = (status) => {
    switch (status) {
        case 'Disponible': return { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' };
        case 'En Ruta': return { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' };
        case 'En Mantenimiento': return { bg: '#fef3c7', text: '#d97706', border: '#fde68a' };
        case 'Fuera de Servicio': return { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' };
        default: return { bg: '#f1f5f9', text: '#475569', border: '#e2e8f0' };
    }
};

const initialTrucks = [
    { id: 1, plate: 'BPGK-12', model: 'Mercedes Actros 2651', driver: 'Carlos Rodríguez', status: 'En Ruta', location: 'Autopista Central, Santiago', fuel: 78, lastUpdate: new Date().toISOString() },
    { id: 2, plate: 'BPGK-13', model: 'Volvo FH 460', driver: 'Ana Martínez', status: 'Disponible', location: 'Bodega Central, Maipú', fuel: 95, lastUpdate: new Date().toISOString() },
    { id: 3, plate: 'BPGK-14', model: 'Scania R 500', driver: 'Pedro González', status: 'En Mantenimiento', location: 'Taller Noreste, La Pintana', fuel: 40, lastUpdate: new Date().toISOString() },
    { id: 4, plate: 'BPGK-15', model: 'MAN TGX 18.480', driver: 'Luis Soto', status: 'En Ruta', location: 'Ruta 68, Valparaíso', fuel: 62, lastUpdate: new Date().toISOString() },
    { id: 5, plate: 'BPGK-16', model: 'DAF XF 480', driver: 'María López', status: 'Disponible', location: 'Bodega Central, Maipú', fuel: 100, lastUpdate: new Date().toISOString() },
    { id: 6, plate: 'BPGK-17', model: 'Iveco S-Way 570', driver: 'Sin asignar', status: 'Fuera de Servicio', location: 'Taller Sur, San Bernardo', fuel: 20, lastUpdate: new Date().toISOString() },
];

export default function FleetPage() {
    const [trucks, setTrucks] = useState(() => {
        const saved = localStorage.getItem('rutaexpress_fleet');
        return saved ? JSON.parse(saved) : initialTrucks;
    });
    const [filter, setFilter] = useState('Todos');
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        plate: '',
        model: 'Volvo FH 460',
        driver: '',
        status: 'Disponible',
        location: 'Bodega Central, Maipú',
        fuel: 100
    });
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        localStorage.setItem('rutaexpress_fleet', JSON.stringify(trucks));
    }, [trucks]);

    // Opcionalmente sincronizar catálogo desde ms-catalog
    useEffect(() => {
        api.get('/api/v1/catalog/category/TRUCK')
            .then(res => {
                if (Array.isArray(res.data) && res.data.length > 0) {
                    console.log('✅ Camiones sincronizados desde ms-catalog:', res.data);
                }
            })
            .catch(() => {
                // Fallback silencioso a la flota local
            });
    }, []);

    const handleCreateTruck = async (e) => {
        e.preventDefault();
        if (!formData.plate || !formData.driver) {
            alert('Por favor complete patente y conductor');
            return;
        }

        const newTruck = {
            id: Date.now(),
            plate: formData.plate.toUpperCase().trim(),
            model: formData.model,
            driver: formData.driver.trim(),
            status: formData.status,
            location: formData.location.trim(),
            fuel: Number(formData.fuel),
            lastUpdate: new Date().toISOString()
        };

        // Guardar localmente
        setTrucks(prev => [newTruck, ...prev]);

        // Intentar persistir en ms-catalog si está activo
        try {
            await api.post('/api/v1/catalog', {
                name: newTruck.plate + ' - ' + newTruck.model,
                description: 'Conductor: ' + newTruck.driver + ' | Ubicación: ' + newTruck.location,
                category: 'TRUCK'
            });
        } catch (err) {
            console.log('ms-catalog no disponible, almacenado en frontend');
        }

        setShowModal(false);
        setFormData({ plate: '', model: 'Volvo FH 460', driver: '', status: 'Disponible', location: 'Bodega Central, Maipú', fuel: 100 });
        setSuccessMessage(`Camión ${newTruck.plate} registrado exitosamente.`);
        setTimeout(() => setSuccessMessage(''), 4000);
    };

    const handleStatusChange = (truckId, newStatus) => {
        setTrucks(prev => prev.map(t => {
            if (t.id === truckId) {
                return { ...t, status: newStatus, lastUpdate: new Date().toISOString() };
            }
            return t;
        }));
    };

    const stats = {
        total: trucks.length,
        enRuta: trucks.filter(t => t.status === 'En Ruta').length,
        disponible: trucks.filter(t => t.status === 'Disponible').length,
        mantenimiento: trucks.filter(t => t.status === 'En Mantenimiento').length,
    };

    const filtered = trucks.filter(t => {
        const matchesFilter = filter === 'Todos' || t.status === filter;
        const matchesSearch = t.plate.toLowerCase().includes(search.toLowerCase()) ||
            t.driver.toLowerCase().includes(search.toLowerCase()) ||
            t.model.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="flex flex-col gap-6">
            {successMessage && (
                <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm font-medium flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-600" /> {successMessage}
                </div>
            )}

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                {[
                    { label: 'Total Flota', value: stats.total, icon: '🚛', color: '#3b82f6' },
                    { label: 'En Ruta', value: stats.enRuta, icon: '🟢', color: '#2563eb' },
                    { label: 'Disponibles', value: stats.disponible, icon: '✅', color: '#16a34a' },
                    { label: 'Mantenimiento', value: stats.mantenimiento, icon: '🔧', color: '#d97706' },
                ].map(kpi => (
                    <div key={kpi.label} style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>{kpi.label}</span>
                            <span style={{ fontSize: '24px' }}>{kpi.icon}</span>
                        </div>
                        <div style={{ fontSize: '32px', fontWeight: '800', color: kpi.color, marginTop: '8px' }}>{kpi.value}</div>
                    </div>
                ))}
            </div>

            {/* Acciones, Filtros y Búsqueda */}
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '280px', flexWrap: 'wrap' }}>
                        <input
                            type="text"
                            placeholder="Buscar por patente, conductor o modelo..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ flex: 1, minWidth: '220px', padding: '9px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' }}
                        />
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {['Todos', ...ESTADOS_CAMION].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    style={{
                                        padding: '7px 14px',
                                        borderRadius: '20px',
                                        border: '1px solid',
                                        borderColor: filter === f ? '#2563eb' : '#e2e8f0',
                                        backgroundColor: filter === f ? '#eff6ff' : '#fff',
                                        color: filter === f ? '#2563eb' : '#64748b',
                                        fontWeight: '600',
                                        fontSize: '12px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-xl hover:bg-blue-700 transition shadow-sm text-sm"
                    >
                        <PlusCircle size={18} /> Registrar Camión
                    </button>
                </div>
            </div>

            {/* Tabla de camiones */}
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '700', fontSize: '15px', color: '#0f172a' }}>
                        🚛 Flota de Camiones ({filtered.length} unidades)
                    </span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                        Haz click en el estado para actualizarlo en tiempo real
                    </span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                {['Patente', 'Modelo', 'Conductor', 'Estado', 'Ubicación Actual', 'Combustible', 'Última Actualización', 'Acciones'].map(h => (
                                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '700', color: '#475569', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="8" style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>
                                        No se encontraron camiones que coincidan con la búsqueda.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((truck) => {
                                    const sc = statusColor(truck.status);
                                    const fuelColor = truck.fuel > 60 ? '#16a34a' : truck.fuel > 30 ? '#d97706' : '#dc2626';
                                    return (
                                        <tr key={truck.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.15s' }}>
                                            <td style={{ padding: '14px 16px', fontWeight: '700', color: '#0f172a', fontFamily: 'monospace', fontSize: '15px' }}>{truck.plate}</td>
                                            <td style={{ padding: '14px 16px', color: '#334155' }}>{truck.model}</td>
                                            <td style={{ padding: '14px 16px', color: '#334155' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <span>👤</span>
                                                    {truck.driver}
                                                </div>
                                            </td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <select
                                                    value={truck.status}
                                                    onChange={(e) => handleStatusChange(truck.id, e.target.value)}
                                                    style={{
                                                        backgroundColor: sc.bg,
                                                        color: sc.text,
                                                        border: `1px solid ${sc.border}`,
                                                        padding: '4px 8px',
                                                        borderRadius: '10px',
                                                        fontSize: '12px',
                                                        fontWeight: '700',
                                                        cursor: 'pointer',
                                                        outline: 'none'
                                                    }}
                                                >
                                                    {ESTADOS_CAMION.map(st => (
                                                        <option key={st} value={st}>{st}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td style={{ padding: '14px 16px', color: '#64748b', maxWidth: '200px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <span>📍</span>
                                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{truck.location}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <div style={{ width: '60px', height: '6px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                                        <div style={{ height: '100%', width: `${truck.fuel}%`, backgroundColor: fuelColor, borderRadius: '4px' }} />
                                                    </div>
                                                    <span style={{ fontSize: '12px', fontWeight: '600', color: fuelColor }}>{truck.fuel}%</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '14px 16px', color: '#94a3b8', fontSize: '12px' }}>
                                                {new Date(truck.lastUpdate).toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' })}
                                            </td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <button
                                                    onClick={() => setTrucks(prev => prev.filter(t => t.id !== truck.id))}
                                                    className="text-xs text-red-500 hover:text-red-700 font-semibold transition"
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal para Crear/Registrar Camión */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100">
                        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <Truck size={22} className="text-blue-600" />
                                <h3 className="font-bold text-slate-900 text-lg">Registrar Nuevo Camión</h3>
                            </div>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateTruck} className="flex flex-col gap-4 mt-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Patente</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ej: BPGK-20"
                                    value={formData.plate}
                                    onChange={e => setFormData({ ...formData, plate: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none uppercase font-mono"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Modelo de Camión</label>
                                <select
                                    value={formData.model}
                                    onChange={e => setFormData({ ...formData, model: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="Mercedes Actros 2651">Mercedes Actros 2651</option>
                                    <option value="Volvo FH 460">Volvo FH 460</option>
                                    <option value="Scania R 500">Scania R 500</option>
                                    <option value="MAN TGX 18.480">MAN TGX 18.480</option>
                                    <option value="DAF XF 480">DAF XF 480</option>
                                    <option value="Iveco S-Way 570">Iveco S-Way 570</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Conductor Asignado</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ej: Rodrigo Valenzuela"
                                    value={formData.driver}
                                    onChange={e => setFormData({ ...formData, driver: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Estado</label>
                                    <select
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        {ESTADOS_CAMION.map(st => (
                                            <option key={st} value={st}>{st}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Combustible (%): {formData.fuel}%</label>
                                    <input
                                        type="range"
                                        min="10"
                                        max="100"
                                        value={formData.fuel}
                                        onChange={e => setFormData({ ...formData, fuel: e.target.value })}
                                        className="w-full mt-2"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Ubicación Inicial</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ej: Bodega Central, Maipú"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
                                >
                                    Guardar Camión
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
