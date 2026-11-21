import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function KpiCards({ totalShipments = 5 }) {
    const navigate = useNavigate();

    return (
        <div style={styles.grid}>
            {/* Tarjeta 1: Envíos Totales y por Hora */}
            <div 
                style={{ ...styles.card, cursor: 'pointer' }} 
                onClick={() => navigate('/shipments')}
                title="Ver gestión de envíos"
            >
                <div style={styles.cardHeader}>
                    <span style={styles.cardTitle}>Envíos en Tránsito / Hora</span>
                    <span style={styles.liveTag}>🟢 Real-time</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
                    <span style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a' }}>{totalShipments}</span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>envíos registrados</span>
                </div>
                <div style={styles.chartContainer}>
                    <svg viewBox="0 0 300 80" style={styles.svgLine}>
                        <path d="M 0 50 Q 50 20 100 45 T 200 30 T 300 10" fill="none" stroke="#3b82f6" strokeWidth="2.5" />
                    </svg>
                </div>
            </div>

            {/* Tarjeta 2: Lead Time Promedio */}
            <div style={styles.card}>
                <div style={styles.cardHeader}>
                    <span style={styles.cardTitle}>Lead Time Promedio</span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>ⓘ SLA</span>
                </div>
                <div style={styles.metricContent}>
                    <div style={styles.gaugeMock}>
                        <span style={styles.gaugeValue}>39 m</span>
                    </div>
                </div>
                <span style={{ fontSize: '11px', color: '#16a34a', textAlign: 'center', fontWeight: '600' }}>
                    ✓ 12% más rápido que la meta mensual
                </span>
            </div>

            {/* Tarjeta 3: Capacidad Activa de la Flota */}
            <div 
                style={{ ...styles.card, cursor: 'pointer' }}
                onClick={() => navigate('/fleet')}
                title="Ver flota de camiones"
            >
                <div style={styles.cardHeader}>
                    <span style={styles.cardTitle}>Capacidad de Flota</span>
                    <span style={styles.liveTag}>🚛 Flota</span>
                </div>
                <div style={styles.metricContent}>
                    <div style={styles.circleProgress}>
                        <span style={styles.circleText}>70%</span>
                    </div>
                </div>
                <span style={{ fontSize: '11px', color: '#2563eb', textAlign: 'center', fontWeight: '600' }}>
                    Haz click para gestionar camiones ›
                </span>
            </div>
        </div>
    );
}

const styles = {
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.15s, box-shadow 0.15s',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: '13px',
        fontWeight: '700',
        color: '#475569',
        textTransform: 'uppercase',
        letterSpacing: '0.025em',
    },
    liveTag: {
        fontSize: '11px',
        backgroundColor: '#f0fdf4',
        color: '#16a34a',
        padding: '2px 8px',
        borderRadius: '12px',
        fontWeight: '600',
    },
    chartContainer: {
        height: '45px',
        marginTop: '6px',
    },
    svgLine: {
        width: '100%',
        height: '100%',
    },
    metricContent: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px 0',
    },
    gaugeMock: {
        fontSize: '30px',
        fontWeight: '800',
        color: '#0f172a',
    },
    gaugeValue: {
        fontSize: '32px',
        fontWeight: '800',
    },
    circleProgress: {
        width: '65px',
        height: '65px',
        borderRadius: '50%',
        border: '5px solid #3b82f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    circleText: {
        fontSize: '18px',
        fontWeight: '800',
        color: '#0f172a',
    }
};