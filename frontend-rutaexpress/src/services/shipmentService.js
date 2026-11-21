import api from './api';

// Obtener todos los envíos desde Oracle a través del BFF
export const getShipments = async () => {
    const response = await api.get('/api/v1/shipments'); 
    return response.data;
};

// Enviar un nuevo envío mediante POST para guardarlo en la base de datos
export const createShipment = async (shipmentData) => {
    const response = await api.post('/api/v1/shipments', shipmentData);
    return response.data;
};

export const updateShipmentStatus = async (id, newStatus) => {
    const response = await api.patch(`/api/v1/shipments/${id}/status`, { 
        status: newStatus 
    });
    return response.data;
};

export const getShipmentHistory = async (shipmentId) => {
    try {
        const response = await api.get(`/api/v1/audit/shipments/${shipmentId}`);
        return response.data;
    } catch (error) {
        console.error("Error obteniendo historial de auditoría", error);
        return [];
    }
};