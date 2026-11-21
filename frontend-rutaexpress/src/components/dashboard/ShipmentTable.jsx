import React from 'react';
import { useNavigate } from 'react-router-dom';

const statusColor = (status) => {
    switch (status) {
        case 'Creado': return { color: '#10b981', bg: '#f0fdf4' };
        case 'Aceptado': return { color: '#3b82f6', bg: '#eff6ff' };
        case 'En Bodega': return { color: '#f59e0b', bg: '#fef3c7' };
        case 'En Ruta': return { color: '#f97316', bg: '#ffedd5' };
        case 'Entregado': return { color: '#10b981', bg: '#f0fdf4' };
        default: return { color: '#64748b', bg: '#f1f5f9' };
    }
};

export default function ShipmentTable({ shipments = [] }) {
    const navigate = useNavigate();

    const fallbackData = [
        { id: 1, trackingCode: 'RE00123', recipientName: 'Distribuidora Central', origin: 'Santiago', destination: 'Valparaíso', status: 'Creado', createdAt: '2026-10-17T10:10:53' },
        { id: 2, trackingCode: 'RE00124', recipientName: 'Comercial del Norte', origin: 'Santiago', destination: 'Antofagasta', status: 'Aceptado', createdAt: '2026-10-17T11:20:10' },
        { id: 3, trackingCode: 'RE00125', recipientName: 'Logística Austral', origin: 'Concepción', destination: 'Puerto Montt', status: 'En Bodega', createdAt: '2026-10-17T12:00:30' },
        { id: 4, trackingCode: 'RE00126', recipientName: 'Supermercados del Sur', origin: 'Santiago', destination: 'Rancagua', status: 'En Ruta', createdAt: '2026-10-17T13:45:00' },
        { id: 5, trackingCode: 'RE00127', recipientName: 'Farmacias Unidas', origin: 'La Serena', destination: 'Coquimbo', status: 'Entregado', createdAt: '2026-10-17T14:10:00' },
    ];

    const displayData = (shipments && shipments.length > 0) ? shipments : fallbackData;
    const isUsingRealData = shipments && shipments.length > 0;

    return (
        <div style={styles.card}>
            <div style={styles.cardHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={styles.tableTitle}>📋 Envíos Recientes</span>
                    <span style={isUsingRealData ? styles.liveBadge : styles.demoBadge}>
                        {isUsingRealData ? '● Datos en Vivo (Oracle DB)' : '● Datos de Demostración'}
                    </span>
                </div>
                <button 
                    onClick={() => navigate('/shipments')}
                    style={styles.headerBtn}
                >
                    + Nuevo Envío / Ver Todos
                </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.thRow}>
                            <th style={styles.th}>Tracking ID</th>
                            <th style={styles.th}>Destinatario</th>
                            <th style={styles.th}>Origen ➔ Destino</th>
                            <th style={styles.th}>Estado</th>
                            <th style={styles.th}>Fecha Creación</th>
                            <th style={styles.th}>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayData.map((item, index) => {
                            const sc = statusColor(item.status);
                            const formattedDate = item.createdAt 
                                ? new Date(item.createdAt).toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' })
                                : 'Reciente';

                            return (
                                <tr key={item.id || index} style={styles.tr}>
                                    <td style={styles.tdBold}>{item.trackingCode || `RE00${item.id}`}</td>
                                    <td style={styles.td}>{item.recipientName || 'Cliente RutaExpress'}</td>
                                    <td style={styles.td}>
                                        <span style={{ color: '#64748b' }}>{item.origin || 'Santiago'}</span>
                                        <span style={{ margin: '0 6px', color: '#cbd5e1' }}>➔</span>
                                        <span style={{ fontWeight: '600' }}>{item.destination || 'Región'}</span>
                                    </td>
                                    <td style={styles.td}>
                                        <span style={{ ...styles.badge, backgroundColor: sc.bg, color: sc.color }}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td style={styles.td}>{formattedDate}</td>
                                    <td style={styles.td}>
                                        <button 
                                            style={styles.actionBtn} 
                                            onClick={() => navigate('/shipments')}
                                        >
                                            › Gestionar / Timeline
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const styles = {
    card: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
    },
    cardHeader: {
        padding: '16px 20px',
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    tableTitle: {
        fontSize: '15px',
        fontWeight: '700',
        color: '#0f172a',
    },
    liveBadge: {
        fontSize: '11px',
        fontWeight: '600',
        padding: '2px 8px',
        borderRadius: '10px',
        backgroundColor: '#f0fdf4',
        color: '#16a34a',
    },
    demoBadge: {
        fontSize: '11px',
        fontWeight: '600',
        padding: '2px 8px',
        borderRadius: '10px',
        backgroundColor: '#f1f5f9',
        color: '#64748b',
    },
    headerBtn: {
        backgroundColor: '#2563eb',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        padding: '6px 12px',
        fontSize: '12px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left',
        fontSize: '13px',
    },
    thRow: {
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        color: '#64748b',
    },
    th: {
        padding: '12px 16px',
        fontWeight: '600',
        fontSize: '12px',
    },
    tr: {
        borderBottom: '1px solid #f1f5f9',
    },
    td: {
        padding: '12px 16px',
        color: '#334155',
    },
    tdBold: {
        padding: '12px 16px',
        fontWeight: 'bold',
        color: '#0f172a',
        fontFamily: 'monospace',
    },
    badge: {
        padding: '4px 10px',
        borderRadius: '12px',
        fontSize: '11px',
        fontWeight: '600',
    },
    actionBtn: {
        background: 'none',
        border: 'none',
        color: '#2563eb',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: '600',
    }
};