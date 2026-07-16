# /backend/utils/errores.py

# la clase Error_de_negocio hereda propiedades de exeption, sin Exception python no lo toma como un error sino como una clase normal ·
# asi se hereda en python poniendo dentro de () a la clase que se quiere heredad ej Mamiferos a Perro(Mamiferos)
# Exception es una clase f12 + click para comprobar
class Error_de_negocio(Exception):
    # __init_ es el contructor y dentro ponemos los datos que recibe cuando hacemos raise
    # self representa al error específico que se está creando, es un espacion en la memoria
    def __init__(self, message, status=400):
        
        # sirve unicamente para mostrar error en el back end, solo el menssage porque esta dentro del contructor, osea solo en consola, no e sobligatorio si se manda a react
        # message ya es una propiedad de la clase Exception, por eso s ela coloca y python ya sabe como manejarlo
        # status no lo es por eso no se pone super().__init__(message, status) : - : es opcional, se usa solo para errores de consola, sino muestra todo en blanco sin el super()
        super().__init__(message)
        self.message = message
        self.status = status
        
# Respuesta rápida: "self representa al objeto específico que se está creando en memoria en ese instante. Sirve como nuestro 'llavero' o 'caja' para colgarle datos al error."
# Respuesta rápida: "super() es una función que nos permite llamar a la clase padre (en este caso, Exception). Lo puse para pasarle el message al sistema nativo de errores de Python."
# Respuesta rápida: "Es la clase base de todos los errores en Python. Ponerla entre paréntesis es la sintaxis de Python para aplicar herencia."