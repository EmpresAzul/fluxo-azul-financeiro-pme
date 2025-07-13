
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useInputValidation } from '@/hooks/useInputValidation';
import { cn } from '@/lib/utils';
import Logo from './Logo';

// Componente para efeito de gradiente inferior dos botões
const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

// Container para organizar label e input
const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { validateEmail, sanitizeText, errors, setFieldError, clearFieldError } = useInputValidation();

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedEmail = sanitizeText(e.target.value);
    setEmail(sanitizedEmail);
    
    if (sanitizedEmail) {
      const validation = validateEmail(sanitizedEmail);
      if (!validation.isValid) {
        setFieldError('email', validation.message || 'Email inválido');
      } else {
        clearFieldError('email');
      }
    } else {
      clearFieldError('email');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedPassword = sanitizeText(e.target.value);
    setPassword(sanitizedPassword);
    clearFieldError('password');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações antes de enviar
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha email e senha.",
        variant: "destructive",
      });
      return;
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      toast({
        title: "Email inválido",
        description: emailValidation.message,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const success = await login(email, password);
      
      if (success) {
        toast({
          title: "Login realizado com êxito!",
          description: "Bem-vindo ao FluxoAzul! Você foi autenticado com sucesso.",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Erro no login",
          description: "E-mail ou senha incorretos. Verifique suas credenciais.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-600">
      <div className="relative z-10 w-full max-w-md px-4 sm:px-6">
        <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white/95 backdrop-blur-xl p-4 md:rounded-2xl md:p-8 border-0 overflow-hidden" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
          {/* Header com logo */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <Logo size="lg" />
            </div>
            <h2 className="text-xl font-bold text-neutral-800">
              Bem-vindo ao FluxoAzul
            </h2>
            <p className="mt-2 max-w-sm text-sm text-neutral-600 mx-auto">
              Faça login para acessar sua plataforma de gestão financeira
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <LabelInputContainer>
              <Label htmlFor="email" className="text-sm font-medium text-black">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Digite seu e-mail"
                required
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="password" className="text-sm font-medium text-black">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Digite sua senha"
                  required
                  className={cn("pr-12", errors.password ? 'border-red-500' : '')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors z-10"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </LabelInputContainer>

            <button
              type="submit"
              disabled={loading || !!errors.email || !!errors.password}
              className="group/btn relative block h-12 w-full rounded-md bg-gradient-to-br from-slate-900 via-slate-800 to-blue-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] hover:from-slate-800 hover:via-slate-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Entrando...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <LogIn size={18} />
                  <span>Entrar no Sistema</span>
                </div>
              )}
              <BottomGradient />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
