import React, { useState } from 'react';
import { HelpCircle, BookOpen, Server, LifeBuoy, ChevronDown, ChevronUp, CheckCircle, ExternalLink, RefreshCw } from 'lucide-react';
import api from '../services/api';

const FAQS = [
    {
        q: '¿Cómo funciona la arquitectura de microservicios de RutaExpress?',
        a: 'RutaExpress opera bajo una arquitectura Cloud Native basada en Spring Boot 3 y Spring Cloud Gateway (BFF). Cada dominio tiene su propio microservicio: Envíos (ms-shipments con Oracle DB), Catálogo (ms-catalog con Oracle DB), Auditoría (ms-audit con MongoDB y Kafka), Reportes (ms-report con Kafka) y Notificaciones (ms-notify con RabbitMQ).'
    },
    {
        q: '¿Cómo se registran los cambios de estado en tiempo real?',
        a: 'Cuando un despachador actualiza el estado de un envío en la sección de Envíos, ms-shipments emite un evento asíncrono al tópico "shipment-status-topic" en Apache Kafka. El ms-audit consume este evento y almacena el registro inmutable en MongoDB para consultar la línea de tiempo completa.'
    },
    {
        q: '¿Cómo inicio y cierro sesión de forma segura?',
        a: 'La autenticación utiliza Microsoft Entra ID (Azure AD) mediante MSAL en el frontend y JWT Resource Server en el BFF. Para cerrar sesión de forma segura, haz click en tu perfil en la esquina superior derecha y selecciona "Cerrar Sesión", confirmando tu acción en el diálogo de seguridad.'
    },
    {
        q: '¿Cómo genero reportes del sistema?',
        a: 'En la sección Reportes, puedes solicitar reportes en formatos PDF, CSV o Excel. El BFF canaliza la petición a ms-report, el cual genera un ID de reporte trazable y despacha la solicitud mediante Kafka.'
    },
    {
        q: '¿Dónde puedo gestionar la flota de camiones?',
        a: 'En la sección Flota (icono de camión en la barra lateral), puedes visualizar todas las unidades activas, filtrar por estado (Disponible, En Ruta, Mantenimiento), buscar por patente o conductor, y registrar nuevas unidades a la flota.'
    }
];

export default function HelpPage() {
    const [openFaq, setOpenFaq] = useState(0);
    const [serviceStatuses, setServiceStatuses] = useState(null);
    const [checking, setChecking] = useState(false);

    const checkHealth = async () => {
        setChecking(true);
        const results = {};
        
        try {
            await api.get('/api/v1/test');
            results.bff = 'ONLINE';
        } catch (e) {
            results.bff = e.response ? `ONLINE (${e.response.status})` : 'OFFLINE';
        }

        try {
            await api.get('/api/v1/shipments');
            results.shipments = 'ONLINE';
        } catch (e) {
            results.shipments = e.response ? `ONLINE (${e.response.status})` : 'OFFLINE';
        }

        try {
            await api.get('/api/v1/report');
            results.report = 'ONLINE';
        } catch (e) {
            results.report = e.response ? `ONLINE (${e.response.status})` : 'OFFLINE';
        }

        setServiceStatuses(results);
        setChecking(false);
    };

    return (
        <div className="flex flex-col gap-6 max-w-5xl">
            {/* Header banner */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                    <LifeBuoy size={32} />
                    <h2 className="text-2xl font-bold">Centro de Ayuda y Soporte</h2>
                </div>
                <p className="text-blue-100 text-sm max-w-2xl">
                    Guía de uso, preguntas frecuentes y monitoreo de conectividad de la plataforma RutaExpress Cloud Native.
                </p>
            </div>

            {/* Diagnóstico rápido de servicios */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <Server size={20} className="text-slate-600" />
                        <h3 className="font-bold text-slate-900 text-base">Diagnóstico de Conectividad</h3>
                    </div>
                    <button
                        onClick={checkHealth}
                        disabled={checking}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition disabled:opacity-50"
                    >
                        <RefreshCw size={16} className={checking ? 'animate-spin' : ''} />
                        {checking ? 'Comprobando...' : 'Probar Conectividad'}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { name: 'Gateway BFF', port: '8080', key: 'bff' },
                        { name: 'ms-shipments (Oracle)', port: '8085', key: 'shipments' },
                        { name: 'ms-report (Kafka)', port: '8083', key: 'report' },
                    ].map(s => {
                        const status = serviceStatuses ? serviceStatuses[s.key] : 'Sin comprobar';
                        const isOnline = status && status.startsWith('ONLINE');
                        return (
                            <div key={s.name} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex justify-between items-center">
                                <div>
                                    <div className="font-semibold text-slate-800 text-sm">{s.name}</div>
                                    <div className="text-xs text-slate-400">Puerto {s.port}</div>
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                    status === 'Sin comprobar' 
                                        ? 'bg-slate-200 text-slate-600'
                                        : isOnline 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-amber-100 text-amber-700'
                                }`}>
                                    {status}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Preguntas Frecuentes (FAQ) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <BookOpen size={20} className="text-blue-600" />
                    <h3 className="font-bold text-slate-900 text-base">Preguntas Frecuentes</h3>
                </div>

                <div className="divide-y divide-slate-100">
                    {FAQS.map((faq, idx) => {
                        const isOpen = openFaq === idx;
                        return (
                            <div key={idx} className="py-4">
                                <button
                                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                                    className="w-full flex justify-between items-center text-left font-semibold text-slate-800 text-sm hover:text-blue-600 transition"
                                >
                                    <span>{faq.q}</span>
                                    {isOpen ? <ChevronUp size={18} className="text-blue-600 shrink-0" /> : <ChevronDown size={18} className="text-slate-400 shrink-0" />}
                                </button>
                                {isOpen && (
                                    <p className="mt-3 text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        {faq.a}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Contacto / Soporte */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <h4 className="font-bold text-slate-900 text-sm">¿Necesitas soporte técnico adicional?</h4>
                    <p className="text-xs text-slate-500 mt-1">
                        Proyecto Duoc UC - Cloud Native 1 | Asignatura Arquitectura Cloud
                    </p>
                </div>
                <div className="flex gap-3">
                    <a
                        href="https://portal.azure.com"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
                    >
                        Azure Portal <ExternalLink size={14} />
                    </a>
                </div>
            </div>
        </div>
    );
}
