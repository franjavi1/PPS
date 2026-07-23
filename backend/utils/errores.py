# /backend/utils/errores.py

class APIError(Exception):
    """Excepcion personalizada para errores de negocio controlados."""
    def __init__(self, message, status=400):
        super().__init__(message)
        self.message = message
        self.status = status