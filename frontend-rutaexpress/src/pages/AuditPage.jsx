import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Loader2 } from 'lucide-react';

export default function AuditPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        api.get('/api/v1/audit/shipments/all')
            .then(res => { setLogs(res.data || []); setLoading(false); })
            .catch(() => {
                // Si no hay datos del servidor, usamos datos demo
                setLogs([
                    { id: '1', shipmentId: 1, previousStatus: 'Creado', newStatus: 'En Ruta', location: 'Bodega Central', user: 'Carlos R.', timestamp: '2026-10-17T10:00:00' },
                    { id: '2', shipmentId: 1, previousStatus: 'En Ruta', newStatus: 'Entregado', location: 'Maipú', user: 'Carlos R.', timestamp: '2026-10-17T14:30:00' },
                    { id: '3', shipmentId: 2, previousStatus: 'Creado', newStatus: 'En Ruta', location: 'Bodega Norte', user: 'Ana M.', timestamp: '2026-10-17T09:00:00' },
                    { id: '4', shipmentId: 3, previousStatus: 'Creado', newStatus: 'Cancelado', location: 'Bodega Sur', user: 'Sistema', timestamp: '2026-10-16T17:00:00' },
                ]);
                setLoading(false);
                setError('Mostrando datos de ejemplo — el servicio de auditoría se conectará cuando Docker esté activo.');
            });
    }, []);

    const statusColor = (s) => {
        if (s === 'Entregado') return { bg: '#f0fdf4', text: '#16a34a' };
        if (s === 'En Ruta') return { bg: '#eff6ff', text: '#2563eb' };
        if (s === 'Cancelado') return { bg: '#fef2f2', text: '#dc2626' };
        return { bg: '#f1f5f9', text: '#475569' };
    };

    const filtered = logs.filter(l =>
        String(l.shipmentId).includes(search) ||
        (l.user || '').toLowerCase().includes(search.toLowerCase()) ||
        (l.newStatus || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6">
            {error && (
                <div style={{ backgroundColor: '#fef3c7', color: '#d97706', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', border: '1px solid #fde68a' }}>
                    ⚠️ {error}
                </div>
            )}

            <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input
                    type="text"
                    placeholder="Buscar por ID de envío, usuario o estado..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ flex: 1, padding: '9px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}
                />
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>{filtered.length} registros</span>
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: '700', fontSize: '15px', color: '#0f172a' }}>🔍 Log de Auditoría (MongoDB)</span>
                    <span style={{ fontSize: '11px', backgroundColor: '#f0fdf4', color: '#16a34a', padding: '2px 8px', borderRadius: '10px', fontWeight: '600', border: '1px solid #bbf7d0' }}>Kafka Consumer</span>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                        <Loader2 style={{ animation: 'spin 1s linear infinite', color: '#94a3b8' }} size={32} />
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                {['ID Envío', 'Estado Anterior', 'Nuevo Estado', 'Ubicación', 'Usuario', 'Timestamp'].map(h => (
                                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '700', color: '#475569', fontSize: '12px', textTransform: 'uppercase' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(log => {
                                const sc = statusColor(log.newStatus);
                                return (
                                    <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <td style={{ padding: '13px 16px', fontFamily: 'monospace', fontWeight: '700', color: '#2563eb' }}>RE0012{log.shipmentId}</td>
                                        <td style={{ padding: '13px 16px', color: '#64748b' }}>{log.previousStatus || '—'}</td>
                                        <td style={{ padding: '13px 16px' }}>
                                            <span style={{ backgroundColor: sc.bg, color: sc.text, padding: '3px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '700' }}>
                                                {log.newStatus}
                                            </span>
                                        </td>
                                        <td style={{ padding: '13px 16px', color: '#64748b' }}>{log.location || '—'}</td>
                                        <td style={{ padding: '13px 16px', color: '#334155' }}>{log.user || 'Sistema'}</td>
                                        <td style={{ padding: '13px 16px', color: '#94a3b8', fontSize: '12px' }}>
                                            {new Date(log.timestamp).toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' })}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
