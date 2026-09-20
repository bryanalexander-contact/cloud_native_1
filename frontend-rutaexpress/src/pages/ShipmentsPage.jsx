import React, { useEffect, useState } from 'react';
import { PlusCircle, Loader2, AlertCircle } from 'lucide-react';
import { getShipments, createShipment, updateShipmentStatus } from '../services/shipmentService';
import ShipmentTable from '../components/shipments/ShipmentTable';
import CreateShipmentModal from '../components/shipments/CreateShipmentModal';
import TimelineModal from '../components/shipments/TimelineModal'; // <-- Nuevo Import

export default function ShipmentsPage() {
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [timelineShipmentId, setTimelineShipmentId] = useState(null); // <-- Nuevo Estado para el Timeline

    const fetchShipments = () => {
        setLoading(true);
        getShipments()
            .then(data => { setShipments(data); setLoading(false); setError(null); })
            .catch(() => { setError("No se pudieron cargar los envíos desde el servidor central."); setLoading(false); });
    };

    useEffect(() => { fetchShipments(); }, []);

    const handleCreateShipment = async (formData) => {
        try {
            await createShipment(formData);
            setShowCreateModal(false);
            fetchShipments(); 
        } catch {
            alert("Error de comunicación con la base de datos.");
        }
    };

    const handleStatusChange = async (shipmentId, newStatus) => {
        try {
            await updateShipmentStatus(shipmentId, newStatus);
            fetchShipments(); 
        } catch (error) {
            alert("Error al actualizar el estado.");
        }
    };

    if (loading) return <div className="flex items-center gap-3 p-6 text-slate-500 font-medium"><Loader2 className="animate-spin" size={24} /> Sincronizando envíos...</div>;
    if (error) return <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-xl border border-red-200"><AlertCircle size={24} /> {error}</div>;

    return (
        <div className="flex flex-col gap-6 p-2">
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-sm gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-slate-900">Rol actual:</span>
                    <span className="text-lg font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">Despachador</span>
                </div>
                <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-2.5 px-5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
                    <PlusCircle size={20} /> Crear Nuevo Envío
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <ShipmentTable 
                    shipments={shipments} 
                    onStatusChange={handleStatusChange} 
                    onViewTimeline={setTimelineShipmentId} // <-- Pasamos la función a la tabla
                />
            </div>

            <CreateShipmentModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onSubmit={handleCreateShipment} />
            
            {/* <-- Nuevo Modal del Timeline --> */}
            <TimelineModal shipmentId={timelineShipmentId} onClose={() => setTimelineShipmentId(null)} />
        </div>
    );
}