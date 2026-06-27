import { useState } from "react";
import { useNavigate } from "react-router";
import { User, Lock, Eye, EyeOff } from "lucide-react";

function InicioSesion() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [verPassword, setVerPassword] = useState(false);
  const [errores, setErrores] = useState({});

  function validarFormulario() {
    const nuevosErrores = {};

    const regexUsuario = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,50}$/;
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
    const regexPassword = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

    if (usuario.trim() === "") {
      nuevosErrores.usuario = "El usuario o email es obligatorio";
    } else if (!regexUsuario.test(usuario) && !regexEmail.test(usuario)) {
      nuevosErrores.usuario = "Ingresa un usuario valido o un email valido";
    }

    if (password.trim() === "") {
      nuevosErrores.password = "La contraseña es obligatoria";
    } else if (!regexPassword.test(password)) {
      nuevosErrores.password =
        "La contraseña debe tener al menos 6 caracteres, una letra y un numero";
    }

    setErrores(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  }

  function ingresar(e) {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    navigate("/inicio");
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="px-8 pt-10 pb-6">
          <div className="flex justify-center mb-6">
            <img
              src="/logo.jpeg"
              alt="Logo bomberos"
              className="w-44 h-44 object-contain"
            />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-slate-800">
              Sistema de Legajos
            </h1>

            <p className="text-xl text-slate-500 mt-3">
              Bomberos Voluntarios
            </p>
          </div>

          <form onSubmit={ingresar} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Usuario o email
              </label>

              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={24}
                />

                <input
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  placeholder="Ingresa tu usuario o email"
                  className={`w-full h-14 pl-14 pr-4 border rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                    errores.usuario
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-slate-300 focus:ring-red-500 focus:border-red-500"
                  }`}
                />
              </div>

              {errores.usuario && (
                <p className="text-red-600 text-sm mt-2">
                  {errores.usuario}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Contraseña
              </label>

              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={24}
                />

                <input
                  type={verPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  className={`w-full h-14 pl-14 pr-14 border rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                    errores.password
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-slate-300 focus:ring-red-500 focus:border-red-500"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setVerPassword(!verPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {verPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
              </div>

              {errores.password && (
                <p className="text-red-600 text-sm mt-2">
                  {errores.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full h-16 bg-red-600 text-white text-xl font-bold rounded-xl shadow-lg hover:bg-red-700 transition"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default InicioSesion;
