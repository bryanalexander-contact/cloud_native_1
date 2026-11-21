import React, { useEffect, useState } from 'react';
import { PlusCircle, Loader2, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { getShipments, createShipment, updateShipmentStatus } from '../services/shipmentService';
import ShipmentTable from '../components/shipments/ShipmentTable';
import CreateShipmentModal from '../components/shipments/CreateShipmentModal';
import TimelineModal from '../components/shipments/TimelineModal';

const initialShipmentsFallback = [
    { id: 1, trackingCode: 'RE-100234', recipientName: 'Distribuidora Central S.A.', origin: 'Bodega Central, Santiago', destination: 'Av. España 450, Valparaíso', status: 'En Ruta', createdAt: '2026-10-17T09:15:00' },
    { id: 2, trackingCode: 'RE-100235', recipientName: 'Comercializadora del Norte', origin: 'Bodega Central, Santiago', destination: 'Calle Prat 120, Antofagasta', status: 'Aceptado', createdAt: '2026-10-17T10:30:00' },
    { id: 3, trackingCode: 'RE-100236', recipientName: 'Logística Austral Ltda.', origin: 'Bodega Concepción', destination: 'Av. Los Lagos 880, Puerto Montt', status: 'En Bodega', createdAt: '2026-10-17T11:45:00' },
    { id: 4, trackingCode: 'RE-100237', recipientName: 'Supermercados del Sur', origin: 'Bodega Central, Santiago', destination: 'Av. Kennedy 5400, Las Condes', status: 'Entregado', createdAt: '2026-10-16T15:20:00' },
    { id: 5, trackingCode: 'RE-100238', recipientName: 'Farmacias Unidas', origin: 'Bodega La Serena', destination: 'Calle Balmaceda 310, La Serena', status: 'Creado', createdAt: '2026-10-17T12:00:00' },
];

export default function ShipmentsPage() {
    const [shipments, setShipments] = useState(() => {
        const cached = localStorage.getItem('rutaexpress_shipments');
        return cached ? JSON.parse(cached) : initialShipmentsFallback;
    });
    const [loading, setLoading] = useState(false);
    const [offlineMode, setOfflineMode] = useState(false);
    const [notification, setNotification] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [timelineShipmentId, setTimelineShipmentId] = useState(null);

    const showMsg = (text, type = 'success') => {
        setNotification({ text, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const fetchShipments = () => {
        setLoading(true);
        getShipments()
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setShipments(data);
                    localStorage.setItem('rutaexpress_shipments', JSON.stringify(data));
                    setOfflineMode(false);
                } else if (Array.isArray(data) && data.length === 0 && shipments.length === 0) {
                    setShipments(initialShipmentsFallback);
                }
                setLoading(false);
            })
            .catch(() => {
                setOfflineMode(true);
                setLoading(false);
            });
    };

    useEffect(() => { 
        fetchShipments(); 
    }, []);

    const handleCreateShipment = async (formData) => {
        const tempId = Date.now();
        const newShipment = {
            id: tempId,
            trackingCode: 'RE-' + (tempId % 1000000),
            recipientName: formData.recipientName,
            origin: formData.origin || 'Bodega Central, Santiago',
            destination: formData.destination,
            status: 'Creado',
            createdAt: new Date().toISOString()
        };

        // Guardado optimista inmediato en el estado
        setShipments(prev => {
            const updated = [newShipment, ...prev];
            localStorage.setItem('rutaexpress_shipments', JSON.stringify(updated));
            return updated;
        });
        setShowCreateModal(false);
        showMsg(`Envío ${newShipment.trackingCode} creado exitosamente.`);

        // Intento de persistencia en ms-shipments
        try {
            await createShipment({
                trackingCode: newShipment.trackingCode,
                recipientName: newShipment.recipientName,
                origin: newShipment.origin,
                destination: newShipment.destination,
                status: 'Creado'
            });
            fetchShipments();
        } catch (err) {
            console.log('ms-shipments offline, persistido en almacenamiento local');
        }
    };

    const handleStatusChange = async (shipmentId, newStatus) => {
        // Actualización optimista inmediata
        setShipments(prev => {
            const updated = prev.map(s => s.id === shipmentId ? { ...s, status: newStatus } : s);
            localStorage.setItem('rutaexpress_shipments', JSON.stringify(updated));
            return updated;
        });
        showMsg(`Estado actualizado a "${newStatus}".`);

        // Notificar al backend ms-shipments (que disparará el evento Kafka hacia ms-audit)
        try {
            await updateShipmentStatus(shipmentId, newStatus);
            fetchShipments();
        } catch (err) {
            console.log('ms-shipments offline, cambio reflejado en estado local');
        }
    };

    return (
        <div className="flex flex-col gap-6 p-2">
            {/* Mensajes de notificación */}
            {notification && (
                <div className={`p-4 rounded-xl border text-sm font-semibold flex items-center gap-2 ${
                    notification.type === 'success' 
                        ? 'bg-green-50 text-green-800 border-green-200' 
                        : 'bg-red-50 text-red-800 border-red-200'
                }`}>
                    <CheckCircle size={18} className="text-green-600" /> {notification.text}
                </div>
            )}

            {/* Aviso de modo autónomo si el backend está desconectado */}
            {offlineMode && (
                <div className="flex items-center justify-between p-4 bg-amber-50 text-amber-800 rounded-xl border border-amber-200 text-sm">
                    <div className="flex items-center gap-2.5">
                        <AlertCircle size={20} className="text-amber-600 shrink-0" />
                        <div>
                            <strong>Modo Offline / Caché Local:</strong> El backend local (BFF en puerto 8080) no responde aún. La aplicación funciona con persistencia local interactiva para pruebas continuas.
                        </div>
                    </div>
                    <button 
                        onClick={fetchShipments} 
                        className="px-3 py-1.5 bg-amber-200 hover:bg-amber-300 rounded-lg text-xs font-bold text-amber-900 transition flex items-center gap-1.5 shrink-0 ml-3"
                    >
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Reintentar
                    </button>
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-sm gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-slate-900">Rol actual:</span>
                    <span className="text-lg font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">Despachador</span>
                    <span className="text-xs text-slate-400 ml-2">({shipments.length} envíos registrados)</span>
                </div>
                <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-2.5 px-5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
                    <PlusCircle size={20} /> Crear Nuevo Envío
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <ShipmentTable 
                    shipments={shipments} 
                    onStatusChange={handleStatusChange} 
                    onViewTimeline={setTimelineShipmentId}
                />
            </div>

            <CreateShipmentModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onSubmit={handleCreateShipment} />
            
            {/* Modal del Timeline */}
            <TimelineModal shipmentId={timelineShipmentId} onClose={() => setTimelineShipmentId(null)} />
        </div>
    );
}