import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/auth';
import { Button, Input, Card, DotField } from '@/components/ui';
import { LogIn, Key, Sparkles, Send } from 'lucide-react';
import { triggerToast } from '@/stores/toast';

const loginSchema = z.object({
  login: z.string().min(2, 'Login kamida 2 ta belgidan iborat bo‘lishi kerak'),
  password: z.string().min(4, 'Parol kamida 4 ta belgidan iborat bo‘lishi kerak'),
});

const verifySchema = z.object({
  code: z.string().length(6, 'Kod roppa-rosa 6 ta raqam bo‘lishi kerak'),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type VerifyFormValues = z.infer<typeof verifySchema>;

export default function LoginPage() {
  const { login, isLoggingIn, loginData, verifyCode, isVerifyingCode } = useAuth();
  const { setTokens } = useAuthStore();
  const [showOtp, setShowOtp] = useState(false);

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: verifyRegister,
    handleSubmit: handleVerifySubmit,
    formState: { errors: verifyErrors },
  } = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
  });

  const onLoginSubmit = (values: LoginFormValues) => {
    // If the user types 'demo' or 'admin', bypass login immediately!
    if (values.login === 'demo' || values.login === 'admin') {
      handleDemoLogin();
      return;
    }

    login(values, {
      onSuccess: (data) => {
        if (data.status === 'need_telegram') {
          setShowOtp(true);
          triggerToast('Telegram botdan olingan tasdiqlash kodini kiriting', 'info');
        } else {
          // Handled inside hook (set tokens, triggers navigation)
        }
      },
    });
  };

  const onVerifySubmit = (values: VerifyFormValues) => {
    if (!loginData?.temp_token) {
      triggerToast('Vaxtinchalik seans tugagan. Qaytadan login qiling.', 'error');
      setShowOtp(false);
      return;
    }

    verifyCode({
      temp_token: loginData.temp_token,
      code: values.code,
    });
  };

  const handleDemoLogin = () => {
    setTokens('mock-demo-token-bypass', 'mock-demo-refresh-bypass', true);
    triggerToast('Demo/Bypass rejimi orqali muvaffaqiyatli kirdingiz!', 'success');
  };

  return (
    <div className="min-h-screen bg-[#1E2A38] flex items-center justify-center p-4 relative overflow-hidden font-ibm-plex-mono">
      {/* Interactive Dot Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <DotField
          dotRadius={1.5}
          dotSpacing={14}
          bulgeStrength={67}
          glowRadius={160}
          sparkle={false}
          waveAmplitude={0}
          cursorRadius={500}
          cursorForce={0.1}
          bulgeOnly
          gradientFrom="rgba(56, 201, 230, 0.25)"
          gradientTo="rgba(67, 232, 160, 0.18)"
          glowColor="rgba(56, 201, 230, 0.1)"
        />
      </div>

      {/* Visual background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#38C9E6]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#43E8A0]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Primary visual card frame */}
      <Card hover={false} className="w-full max-w-md p-6 sm:p-8 border-2 border-black bg-[#2A3442] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative z-10 animate-fade-in rounded-3xl">
        <div className="flex flex-col items-center gap-2 mb-8 text-center">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-[#38C9E6] to-[#43E8A0] flex items-center justify-center border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] select-none">
            <span className="text-black font-black font-montserrat tracking-tighter text-sm uppercase">P2P</span>
          </div>
          <h1 className="text-3xl font-black text-white mt-3 font-montserrat tracking-tight">P2P Corpus</h1>
          <p className="text-[10px] text-[#B0BEC5] uppercase tracking-widest font-extrabold font-montserrat">
            School21 P2P Corpus
          </p>
        </div>

        {!showOtp ? (
          /* Normal Credentials Form */
          <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="flex flex-col gap-5">
            <h3 className="text-xs font-bold text-[#B0BEC5] mb-1 font-montserrat uppercase tracking-wider text-center">
              Kirish uchun School21 identifikatoringizni kiriting
            </h3>

            <Input
              label="School21 Login"
              error={loginErrors.login?.message}
              placeholder="Masalan: s21_student yoki 'demo'"
              disabled={isLoggingIn}
              {...loginRegister('login')}
            />

            <Input
              type="password"
              label="Parol"
              error={loginErrors.password?.message}
              placeholder="• • • • • •"
              disabled={isLoggingIn}
              {...loginRegister('password')}
            />

            <Button type="submit" variant="primary" className="w-full mt-2" disabled={isLoggingIn}>
              <LogIn className="h-4 w-4 text-black" /> {isLoggingIn ? 'Kirilmoqda...' : 'Kirish'}
            </Button>

            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center gap-2">
                <hr className="flex-grow border-black/40" />
                <span className="text-[10px] text-[#B0BEC5] uppercase font-bold tracking-widest leading-none">yoki</span>
                <hr className="flex-grow border-black/40" />
              </div>
              
              <Button
                type="button"
                variant="secondary"
                onClick={handleDemoLogin}
                className="w-full bg-[#34495E] hover:bg-gray-600 border-2 border-black text-white"
              >
                <Sparkles className="h-4 w-4 text-[#38C9E6]" /> Tezkor demo (Bypass)
              </Button>
            </div>
          </form>
        ) : (
          /* Telegram OTP Verification Form */
          <form onSubmit={handleVerifySubmit(onVerifySubmit)} className="flex flex-col gap-6">
            <div className="text-center bg-[#34495E] p-4 rounded-2xl border-2 border-black flex flex-col gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-[10px] text-[#38C9E6] font-extrabold uppercase tracking-widest font-montserrat">
                Xavfsiz ulanish
              </span>
              <p className="text-xs text-[#B0BEC5] leading-relaxed">
                Tizimga kirish uchun Telegram hisobingizni ulashingiz shart. Botni ochib kodni oling.
              </p>
              {loginData?.bot_url && (
                <a
                  href={loginData.bot_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 text-xs font-black text-[#43E8A0] hover:text-[#38C9E6] uppercase tracking-wider mt-3 font-montserrat"
                >
                  <Send className="h-4 w-4" /> BOTNI OCHISH
                </a>
              )}
            </div>

            <Input
              label="Tasdiqlash kodi (OTP)"
              error={verifyErrors.code?.message}
              placeholder="Yozish: 123456"
              maxLength={6}
              disabled={isVerifyingCode}
              {...verifyRegister('code')}
            />

            <div className="flex flex-col gap-3">
              <Button type="submit" variant="primary" className="w-full" disabled={isVerifyingCode}>
                <Key className="h-4 w-4 text-black" /> {isVerifyingCode ? 'Tekshirilmoqda...' : 'Kodni tasdiqlash'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full text-xs font-montserrat tracking-widest font-extrabold"
                onClick={() => setShowOtp(false)}
                disabled={isVerifyingCode}
              >
                ORQAGA QAYTISH
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
