from models.modalidades import Modalidades


def obtener_todas():
    return Modalidades.query.order_by(Modalidades.descripcion).all()