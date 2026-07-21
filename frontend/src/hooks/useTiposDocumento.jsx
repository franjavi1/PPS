// frontend\src\hooks\useTiposDocumento.jsx
import { useState, useCallback } from "react";
import tiposDocumentoService from "../services/tiposDocumentoService";

export default function useTiposDocumento() {
    const [tiposDocumento, setTiposDocumento] = useState([]);
    const [cargando, setCargando] = useState(false);

    const listarTiposDocumento = useCallback(async () => {
        setCargando(true);
        try {
            const res = await tiposDocumentoService.listarTodos();
            if (res.ok) {
                setTiposDocumento(res.data);
            } else {
                console.error(res.message || "Error al listar");
            }
            return res;
        } catch (error) {
            console.error("Error en la peticion", error);
        } finally {
            setCargando(false);
        }
    }, []);

    const comboTiposDocumento = () => {
        debugger;
        return tiposDocumento.map(p => ({
            key: p.idTipoDocumento,
            value: p.idTipoDocumento,
            label: p.descripcion || 'Sin descipcion'
        }));
    };

    const obtenerTipoDocumento = async (id) => {
        return await tiposDocumentoService.obtenerPorId(id);
    };

    const crearTiposDocumento = async (data) => {
        const res = await tiposDocumentoService.crear(data);
        return res;
    };

    const editarTiposDocumento = async (id, data) => {
        const res = await tiposDocumentoService.actualizar(id, data);
        return res;
    };

    const eliminarTiposDocumento = async (id) => {
        const res = await tiposDocumentoService.eliminar(id);
        return res;
    };

    return { 
        tiposDocumento,
        cargando,
        comboTiposDocumento, 
        listarTiposDocumento, 
        obtenerTipoDocumento, 
        crearTiposDocumento, 
        editarTiposDocumento, 
        eliminarTiposDocumento 
    };
}