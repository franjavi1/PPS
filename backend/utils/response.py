# /backend/utils/response.py
from flask import jsonify

def responder(data=None, message="Éxito", ok=True, error=None, status=200):
 
    if data is None:
        lista_data = []
    elif isinstance(data, list):
        lista_data = data
    else:
        lista_data = [data]
        
    response_json = {
        "ok": ok,
        "data": lista_data,
        "count": len(lista_data),
        "message": message,
        "error": error
    }
    
    return jsonify(response_json), status