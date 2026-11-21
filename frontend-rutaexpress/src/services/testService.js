import api from './api';

export const verifyBffConnection = async () => {
  try {
    const response = await api.get('/api/v1/test');
    console.log('✅ [E2E SUCCESS] Respuesta del BFF:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ [E2E ERROR] Fallo la conexión con el BFF:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
};
