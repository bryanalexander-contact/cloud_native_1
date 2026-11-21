import React, { useState } from 'react';
import api from '../services/api';
import { Loader2 } from 'lucide-react';

export default function ReportsPage() {
    const [generating, setGenerating] = useState(false);
    const [lastReport, setLastReport] = useState(null);
    const [reportType, setReportType] = useState('PDF');
    const [error, setError] = useState(null);

    const handleGenerate = async () => {
        setGenerating(true);
        setError(null);
        try {
            const response = await api.post(`/api/v1/report/generate?type=${reportType}`);
            setLastReport({ ...response.data, generatedAt: new Date().toLocaleString('es-CL') });
        } catch (err) {
            setError('No se pudo conectar con el servicio de reportes. Verifique que el microservicio esté activo.');
        } finally {
            setGenerating(false);
        }
    };

    const mockReports = [
        { id: 'RPT-001', name: 'Reporte Mensual de Envíos', date: '2026-10-01', type: 'PDF', status: 'Generado' },
        { id: 'RPT-002', name: 'Análisis de Flota Semanal', date: '2026-10-07', type: 'CSV', status: 'Generado' },
        { id: 'RPT-003', name: 'KPIs de Rendimiento', date: '2026-10-14', type: 'PDF', status: 'Generado' },
    ];

    return (
        <div className="flex flex-col gap-6">
            {/* Panel de generación */}
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>📊 Generar Nuevo Reporte</h2>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
                    Solicita la generación de un reporte al microservicio <strong>ms-rutaexpress-report</strong> (publicado vía Kafka).
                </p>

                {error && (
                    <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '14px', border: '1px solid #fecaca' }}>
                        ❌ {error}
                    </div>
                )}
                {lastReport && (
                    <div style={{ backgroundColor: '#f0fdf4', color: '#16a34a', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '14px', border: '1px solid #bbf7d0' }}>
                        ✅ Reporte <strong>{lastReport.reportId}</strong> ({lastReport.type}) generado exitosamente a las {lastReport.generatedAt}.
                    </div>
                )}

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <select
                        value={reportType}
                        onChange={e => setReportType(e.target.value)}
                        style={{ padding: '9px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', fontFamily: 'inherit', outline: 'none', color: '#334155' }}
                    >
                        <option value="PDF">📄 PDF</option>
                        <option value="CSV">📊 CSV</option>
                        <option value="EXCEL">📗 Excel</option>
                    </select>
                    <button
                        onClick={handleGenerate}
                        disabled={generating}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '10px 20px', borderRadius: '10px', border: 'none',
                            backgroundColor: generating ? '#93c5fd' : '#2563eb',
                            color: '#fff', fontWeight: '600', fontSize: '14px',
                            cursor: generating ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                        }}
                    >
                        {generating ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Generando...</> : '🚀 Generar Reporte'}
                    </button>
                </div>
            </div>

            {/* Historial de reportes */}
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ fontWeight: '700', fontSize: '15px', color: '#0f172a' }}>📁 Historial de Reportes</span>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            {['ID', 'Nombre del Reporte', 'Fecha', 'Tipo', 'Estado'].map(h => (
                                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '700', color: '#475569', fontSize: '12px', textTransform: 'uppercase' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {mockReports.map(r => (
                            <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <td style={{ padding: '13px 16px', fontFamily: 'monospace', fontWeight: '700', color: '#2563eb' }}>{r.id}</td>
                                <td style={{ padding: '13px 16px', color: '#334155' }}>{r.name}</td>
                                <td style={{ padding: '13px 16px', color: '#64748b' }}>{r.date}</td>
                                <td style={{ padding: '13px 16px' }}>
                                    <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '3px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '600' }}>{r.type}</span>
                                </td>
                                <td style={{ padding: '13px 16px' }}>
                                    <span style={{ backgroundColor: '#f0fdf4', color: '#16a34a', padding: '3px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '600' }}>✅ {r.status}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
