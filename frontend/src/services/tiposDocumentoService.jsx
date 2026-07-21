// frontend\src\services\tiposDocumentoService.jsx
import api from '../api';

const prefix = '/tipos-documento';

const tiposDocumentoService = {

    listarTodos: async () => {
        try {
            const response = await api.get(`${prefix}`);
            return response.data;
        } catch (error) {
            return error.response?.data || { ok: false, message: "Error de conexion con el servidor." };
        }
    },

    obtenerPorId: async (id) => {
        try {
            const response = await api.get(`${prefix}/${id}`);
            return response.data;
        } catch (error) {
            return error.response?.data || { ok: false, message: "No se pudo obtener el tipo de documento." };
        }
    },

    crear: async (data) => {
        try {
            debugger;
            const response = await api.post(`${prefix}`, data);
            return response.data;
        } catch (error) {
            return error.response?.data || { ok: false, message: "Error al conectar con el servidor." };
        }
    },

    actualizar: async (id, data) => {
        try {
            const response = await api.put(`${prefix}/${id}`, data);
            return response.data;
        } catch (error) {
            return error.response?.data || { ok: false, message: "Error al actualizar el registro." };
        }
    },

    eliminar: async (id) => {
        try {
            const response = await api.delete(`${prefix}/${id}`);
            return response.data;
        } catch (error) {
            return error.response?.data || { ok: false, message: "Error al eliminar el registro." };
        }
    }
};

export default tiposDocumentoService;