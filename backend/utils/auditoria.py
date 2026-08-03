from flask import g
from datetime import datetime

class Auditoria:
    @staticmethod
    def preparar_alta(modelo):
        persona_id = getattr(g, 'id_persona', None)
        
        modelo.id_persona_alta = persona_id
        
        return modelo

    @staticmethod
    def preparar_modificacion(modelo):
        persona_id = getattr(g, 'id_persona', None)
        
        modelo.id_persona_modificacion = persona_id
        modelo.ts_modificacion = datetime.now()
        return modelo

    @staticmethod
    def preparar_baja(modelo):
        persona_id = getattr(g, 'id_persona', None)
        
        modelo.id_persona_baja = persona_id
        modelo.ts_baja = datetime.now()
        
        return modelo