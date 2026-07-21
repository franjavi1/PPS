# /backend/utils/auditoria.py
from flask import g
from datetime import datetime

class Auditoria:
    @staticmethod
    def preparar_alta(modelo):
        usuario_id = getattr(g, 'usuario_id', None)
        
        modelo.idUsuarioCreacion = usuario_id
        
        return modelo

    @staticmethod
    def preparar_modificacion(modelo):
        usuario_id = getattr(g, 'usuario_id', None)
        
        modelo.idUsuarioModificacion = usuario_id
        
        return modelo

    @staticmethod
    def preparar_baja(modelo):
        usuario_id = getattr(g, 'usuario_id', None)
        
        modelo.idUsuarioBaja = usuario_id
        modelo.tsBaja = datetime.now()
        
        return modelo