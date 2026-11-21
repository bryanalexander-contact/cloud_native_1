import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KpiCards from '../components/dashboard/KpiCards';
import FlowCard from '../components/dashboard/FlowCard';
import ShipmentTable from '../components/dashboard/ShipmentTable';
import api from '../services/api'; 
import { getShipments } from '../services/shipmentService';
import { ArrowRight, Truck, Package, ShieldCheck, FileText } from 'lucide-react';

export default function DashboardPage() {
    const navigate = useNavigate();
    const [bffStatus, setBffStatus] = useState(null);
    const [shipments, setShipments] = useState([]);
    const [loadingShipments, setLoadingShipments] = useState(true);

    // Cargar envíos reales y probar conexión con el BFF
    useEffect(() => {
        api.get('/api/v1/test')
            .then(response => {
                setBffStatus({ success: true, data: response.data });
            })
            .catch(error => {
                setBffStatus({ 
                    success: false, 
                    error: error.response?.data?.message || error.message || 'Error de red / BFF no disponible'
                });
            });

        getShipments()
            .then(data => {
                if (Array.isArray(data)) {
                    setShipments(data);
                }
                setLoadingShipments(false);
            })
            .catch(() => {
                setLoadingShipments(false);
            });
    }, []);

    return (
        <div className="flex flex-col gap-6">
            {/* Alerta de conexión E2E */}
            {bffStatus && (
                <div className={`p-4 rounded-xl border text-sm font-medium flex justify-between items-center ${
                    bffStatus.success 
                        ? 'bg-green-50 text-green-800 border-green-200' 
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                    {bffStatus.success ? (
                        <span>
                            ✅ <strong>Conexión E2E Exitosa:</strong> {bffStatus.data.message} 
                            {bffStatus.data.authenticatedUser?.username && ` (${bffStatus.data.authenticatedUser.username})`}
                        </span>
                    ) : (
                        <span>
                            ⚠️ <strong>Estado BFF:</strong> {bffStatus.error} (Operando en modo local)
                        </span>
                    )}

                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => navigate('/fleet')} 
                            className="text-xs font-bold underline hover:opacity-80 flex items-center gap-1"
                        >
                            Ver Flota <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            )}

            {/* Accesos directos rápidos a los microservicios */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Gestión de Envíos', desc: 'ms-shipments (Oracle)', icon: Package, path: '/shipments', color: 'from-blue-500 to-blue-600' },
                    { label: 'Flota de Camiones', desc: 'ms-catalog (Oracle)', icon: Truck, path: '/fleet', color: 'from-emerald-500 to-emerald-600' },
                    { label: 'Trazabilidad y Auditoría', desc: 'ms-audit (MongoDB)', icon: ShieldCheck, path: '/audit', color: 'from-violet-500 to-violet-600' },
                    { label: 'Generación de Reportes', desc: 'ms-report (Kafka)', icon: FileText, path: '/reports', color: 'from-amber-500 to-amber-600' },
                ].map(item => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={item.label}
                            onClick={() => navigate(item.path)}
                            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex items-center gap-3.5 group"
                        >
                            <div className={`p-2.5 rounded-lg bg-gradient-to-br ${item.color} text-white group-hover:scale-105 transition-transform`}>
                                <Icon size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">{item.label}</div>
                                <div className="text-xs text-slate-400 truncate">{item.desc}</div>
                            </div>
                            <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                        </div>
                    );
                })}
            </div>

            {/* Componentes principales del Dashboard */}
            <KpiCards totalShipments={shipments.length} />
            <FlowCard />
            <ShipmentTable shipments={shipments} />
        </div>
    );
}