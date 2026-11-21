import React, { useState } from 'react';

export default function SettingsPage() {
    const [notificaciones, setNotificaciones] = useState(true);
    const [auditEnabled, setAuditEnabled] = useState(true);
    const [rabbitEnabled, setRabbitEnabled] = useState(true);
    const [kafkaEnabled, setKafkaEnabled] = useState(true);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const Toggle = ({ value, onChange, label, description }) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #f1f5f9' }}>
            <div>
                <div style={{ fontWeight: '600', color: '#334155', fontSize: '14px' }}>{label}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{description}</div>
            </div>
            <button
                onClick={() => onChange(!value)}
                style={{
                    width: '48px', height: '26px', borderRadius: '13px', border: 'none',
                    backgroundColor: value ? '#2563eb' : '#cbd5e1',
                    cursor: 'pointer', position: 'relative', transition: 'background-color 0.2s',
                }}
            >
                <span style={{
                    position: 'absolute', top: '3px',
                    left: value ? '25px' : '3px',
                    width: '20px', height: '20px',
                    borderRadius: '50%', backgroundColor: '#fff',
                    transition: 'left 0.2s',
                }} />
            </button>
        </div>
    );

    const serviceStatus = [
        { name: 'ms-bff (Gateway)', port: 8080, icon: '🌐', status: 'active' },
        { name: 'ms-shipments', port: 8085, icon: '📦', status: 'active' },
        { name: 'ms-notify (RabbitMQ)', port: 8082, icon: '🐰', status: 'active' },
        { name: 'ms-audit (MongoDB)', port: 8084, icon: '🔍', status: 'active' },
        { name: 'ms-catalog', port: 8081, icon: '📋', status: 'active' },
        { name: 'ms-report (Kafka)', port: 8083, icon: '📊', status: 'active' },
        { name: 'RabbitMQ Broker', port: 5672, icon: '🐇', status: 'active' },
        { name: 'Kafka Broker', port: 9092, icon: '⚡', status: 'active' },
        { name: 'Oracle DB', port: 1521, icon: '🗄️', status: 'active' },
        { name: 'MongoDB', port: 27017, icon: '🍃', status: 'active' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {saved && (
                <div style={{ backgroundColor: '#f0fdf4', color: '#16a34a', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', border: '1px solid #bbf7d0' }}>
                    ✅ Configuración guardada exitosamente.
                </div>
            )}

            {/* Estado de servicios */}
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ fontWeight: '700', fontSize: '15px', color: '#0f172a' }}>🏗️ Estado de la Infraestructura</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Microservicios y bases de datos del sistema RutaExpress</div>
                </div>
                <div style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                        {serviceStatus.map(s => (
                            <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', border: '1px solid #f1f5f9', backgroundColor: '#fafafa' }}>
                                <span style={{ fontSize: '20px' }}>{s.icon}</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>{s.name}</div>
                                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>Puerto {s.port}</div>
                                </div>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block', boxShadow: '0 0 0 3px #dcfce7' }} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Configuración de sistema */}
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ fontWeight: '700', fontSize: '15px', color: '#0f172a', marginBottom: '16px' }}>⚙️ Preferencias del Sistema</div>
                <Toggle value={notificaciones} onChange={setNotificaciones} label="Notificaciones vía RabbitMQ" description="Enviar notificaciones cuando cambie el estado de un envío" />
                <Toggle value={auditEnabled} onChange={setAuditEnabled} label="Registro de Auditoría (Kafka)" description="Guardar cada cambio de estado en MongoDB via Kafka" />
                <Toggle value={kafkaEnabled} onChange={setKafkaEnabled} label="Kafka Streaming activo" description="Habilitar el flujo de eventos en tiempo real entre microservicios" />
                <Toggle value={rabbitEnabled} onChange={setRabbitEnabled} label="RabbitMQ activo" description="Habilitar la cola de mensajes para notificaciones asíncronas" />
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        onClick={handleSave}
                        style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', backgroundColor: '#2563eb', color: '#fff', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                        Guardar Cambios
                    </button>
                </div>
            </div>

            {/* Info del sistema */}
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ fontWeight: '700', fontSize: '15px', color: '#0f172a', marginBottom: '16px' }}>ℹ️ Información del Sistema</div>
                {[
                    ['Aplicación', 'RutaExpress v1.0.0'],
                    ['Arquitectura', 'Microservicios (Spring Boot 4.1 + React 19)'],
                    ['Autenticación', 'Microsoft Entra ID (Azure AD) / MSAL'],
                    ['Mensajería', 'RabbitMQ 3 + Apache Kafka 7.3'],
                    ['Bases de datos', 'Oracle Free 23.6 + MongoDB 6.0'],
                    ['Containerización', 'Docker Compose'],
                    ['Frontend', 'React 19 + Vite 8 + TailwindCSS 4'],
                ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', gap: '12px', padding: '10px 0', borderBottom: '1px solid #f8fafc', fontSize: '13px' }}>
                        <span style={{ fontWeight: '600', color: '#64748b', minWidth: '140px' }}>{k}</span>
                        <span style={{ color: '#334155' }}>{v}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
