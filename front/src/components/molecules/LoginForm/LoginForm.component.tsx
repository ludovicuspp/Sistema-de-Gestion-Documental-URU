import { useState, type FormEvent } from "react";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { Link } from "@/components/atoms/Link";
import "./LoginForm.css";

export interface LoginFormProps {
  /**
   * Callback cuando se envía el formulario
   */
  onSubmit?: (email: string, password: string) => void;
  /**
   * Si es true, muestra el estado de carga
   * @default false
   */
  loading?: boolean;
  /**
   * Mensaje de error a mostrar
   */
  error?: string;
}

/**
 * Componente LoginForm - Molecule
 *
 * Formulario de login que combina Input, Button y Link.
 * Maneja el estado del formulario y la validación básica.
 *
 * @example
 * ```tsx
 * <LoginForm
 *   onSubmit={(email, password) => handleLogin(email, password)}
 *   loading={isLoading}
 * />
 * ```
 */
export const LoginForm = ({ onSubmit, loading = false, error }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateForm = (): boolean => {
    let isValid = true;

    if (!email.trim()) {
      setEmailError("El email o usuario es requerido");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password.trim()) {
      setPasswordError("La contraseña es requerida");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm() && onSubmit) {
      onSubmit(email, password);
    }
  };

  const EyeIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      onClick={() => setShowPassword(!showPassword)}
      style={{ cursor: "pointer" }}>
      {showPassword ? (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </>
      ) : (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );

  return (
    <div className="login-form-card">
      <div className="login-form-header">
        <h1 className="login-form__logo">URU</h1>
        <p className="login-form__system-name">SISTEMA DOCUMENTAL DE EXPEDIENTES</p>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        {error && (
          <div className="login-form__error-alert" role="alert">
            {error}
          </div>
        )}

        <Input
          type="text"
          placeholder="Email / Usuario"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!emailError}
          errorMessage={emailError}
          fullWidth
          autoComplete="username"
        />

        <Input
          type={showPassword ? "text" : "password"}
          placeholder="nombre.apellido@uru.edu.ve"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!passwordError}
          errorMessage={passwordError}
          fullWidth
          endIcon={<EyeIcon />}
          autoComplete="current-password"
        />

        <Button type="submit" variant="primary" fullWidth loading={loading} className="login-form__submit-button">
          ACCEDER
        </Button>

        <div className="login-form__links">
          <Link href="/forgot-password" className="login-form__link">
            Olvidé mi contraseña
          </Link>
          <span className="login-form__separator">|</span>
          <Link href="/register" className="login-form__link">
            Registrarse
          </Link>
        </div>
      </form>
    </div>
  );
};
