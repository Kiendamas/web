import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useLoginMutation } from '../features/auth/authApi';
import { useAuth } from '../hooks/useAuth';
import { useUI } from '../hooks/useUI';
import { Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { showSuccess, showError } = useUI();
  const [login, { isLoading }] = useLoginMutation();

  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const onSubmit = async (data) => {
    try {
      await login(data).unwrap();
      showSuccess('¡Bienvenido! Sesión iniciada correctamente');
      navigate(from, { replace: true });
    } catch (error) {
      showError(error.data?.message || 'Error al iniciar sesión');
    }
  };

  // 🔹 login con google (placeholder, implementar según tu backend)
  const handleGoogleLogin = () => {
    showSuccess("Función de Google Login pendiente de implementar 🚀");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="max-w-sm w-full space-y-8 flex flex-col items-center">

        {/* Logo */}
        <img
          src="/logo.jpg"
          alt="Logo"
          className="w-32 h-32 object-contain mx-auto"
        />

        {/* Formulario */}
        <form className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <input
            type="email"
            {...register('username', {
              required: 'El email es requerido',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email inválido'
              }
            })}
            placeholder="Usuario"
            className="w-full px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-kiendamas-brown"
          />
          {errors.username && (
            <p className="text-red-500 text-xs">{errors.username.message}</p>
          )}

          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "La contraseña es requerida",
                minLength: {
                  value: 6,
                  message: "La contraseña debe tener al menos 6 caracteres",
                },
              })}
              placeholder="Contraseña"
              className="w-full px-4 py-3 pr-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-kiendamas-brown"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>


          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          )}

          {/* Botón login */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-kiendamas-brown text-white py-3 rounded-full font-semibold shadow-md hover:bg-opacity-90 transition"
          >
            {isLoading ? "Cargando..." : "Iniciar Sesión"}
          </button>
        </form>

        {/* Botón Google */}
       

        {/* Continuar sin login */}
        <button
          onClick={() => navigate('/')}
          className="w-full bg-white border-2 border-yellow-500 text-gray-800 py-3 rounded-full font-semibold hover:bg-yellow-50 transition"
        >
          Continuar sin login
        </button>

      </div>
    </div>
  );
};

export default LoginPage;
