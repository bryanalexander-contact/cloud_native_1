import React, { useEffect, useState } from 'react';
import KpiCards from '../components/dashboard/KpiCards';
import FlowCard from '../components/dashboard/FlowCard';
import ShipmentTable from '../components/dashboard/ShipmentTable';
import api from '../services/api'; 

export default function DashboardPage() {
    const [bffStatus, setBffStatus] = useState(null);

    // Prueba de conexión End-to-End con el BFF al montar el Dashboard
    useEffect(() => {
        if (!api || typeof api.get !== 'function') {
            console.error("❌ 'api' no está importado correctamente.");
            setBffStatus({ success: false, error: "Error de configuración en api.js" });
            return;
        }

        api.get('/api/v1/test')
            .then(response => {
                console.log('✅ [E2E SUCCESS] Respuesta del BFF:', response.data);
                setBffStatus({ success: true, data: response.data });
            })
            .catch(error => {
                console.error('❌ [E2E ERROR] Fallo al consultar el BFF:', error);
                setBffStatus({ 
                    success: false, 
                    error: error.response?.data?.message || error.message || 'Error de red / CORS'
                });
            });
    }, []);

    return (
        <div className="flex flex-col gap-6">
            {/* Alerta de conexión E2E */}
            {bffStatus && (
                <div className={`p-4 rounded-xl border text-sm font-medium ${
                    bffStatus.success 
                        ? 'bg-green-50 text-green-800 border-green-200' 
                        : 'bg-red-50 text-red-800 border-red-200'
                }`}>
                    {bffStatus.success ? (
                        <span>
                            ✅ <strong>Conexión E2E Exitosa:</strong> {bffStatus.data.message} 
                            {bffStatus.data.authenticatedUser?.username && ` (${bffStatus.data.authenticatedUser.username})`}
                        </span>
                    ) : (
                        <span>
                            ❌ <strong>Error E2E:</strong> {bffStatus.error}
                        </span>
                    )}
                </div>
            )}

            {/* Componentes principales del Dashboard */}
            <KpiCards />
            <FlowCard />
            <ShipmentTable />
        </div>
    );
}