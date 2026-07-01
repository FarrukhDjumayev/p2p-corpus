import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/auth';
import { Button, Input } from '@/components/ui';
import { LogIn, Key, Eye, EyeOff, ChevronRight, Sparkles, Send } from 'lucide-react';
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

const SLIDES = [
  {
    title: 'Gamification',
    description: 'Gain knowledge. Complete projects and achieve higher Levels.',
  },
  {
    title: 'Peer-to-Peer Review',
    description: 'Evaluate your peers and receive objective feedback to progress daily.',
  },
  {
    title: 'Fast Slots Booking',
    description: 'Instantly schedule p2p reviews, gain coins, and upgrade your level.',
  }
];

export default function LoginPage() {
  const { login, isLoggingIn, loginData, verifyCode, isVerifyingCode } = useAuth();
  const { setTokens } = useAuthStore();
  const [showOtp, setShowOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slideshow carousel on left side
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

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
    if (values.login === 'demo' || values.login === 'admin') {
      handleDemoLogin();
      return;
    }

    login(values, {
      onSuccess: (data) => {
        if (data.status === 'need_telegram') {
          setShowOtp(true);
          triggerToast('Telegram botdan olingan tasdiqlash kodini kiriting', 'info');
        }
      },
    });
  };

  const onVerifySubmit = (values: VerifyFormValues) => {
    if (!loginData?.temp_token) {
      triggerToast('Vaqtinchalik seans tugagan. Qaytadan login qiling.', 'error');
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
    triggerToast('Demo bypass rejimi orqali kirdingiz!', 'success');
  };

  return (
    <div className="min-h-screen bg-[#1E2530] text-white flex flex-col justify-center relative overflow-hidden font-sans p-4 select-none">
      {/* 1. Background Pipeline Curve Art & Colorful Squircles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Large flowing pipeline paths (exact curvature SVG integration) */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" fill="none">
          <defs>
            <linearGradient id="gradient-pipe-left" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3BE5C2" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#38C6E6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#7139C7" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="gradient-pipe-right" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8C3BE2" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#4D5CD3" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#43E8A0" stopOpacity="0.5" />
            </linearGradient>
          </defs>

          {/* Left Flow Path entering/exiting squircles */}
          <path
            d="M -50 250 C 150 150, 50 350, -100 500"
            stroke="url(#gradient-pipe-left)"
            strokeWidth="32"
            strokeLinecap="round"
          />

          {/* Connected Main curved bridge flow under card to top-right */}
          <path
            d="M -100 250 C 200 100, -80 600, 400 800 C 600 900, 800 600, 1000 400 C 1100 300, 1200 150, 1400 50"
            stroke="url(#gradient-pipe-right)"
            strokeWidth="28"
            strokeLinecap="round"
          />
        </svg>

        {/* Floating background neon lights */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#3BE5C2]/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#8C3BE2]/8 rounded-full blur-[160px]" />

        {/* Ambient Squircles matching layout flow spacing */}
        <div className="hidden lg:block absolute -left-12 top-[35%] w-24 h-24 bg-[#38C6E6] rotate-12 opacity-80" style={{ borderRadius: '24px 0' }} />
        <div className="hidden lg:block absolute left-[45%] bottom-[5%] w-32 h-32 bg-gradient-to-br from-[#804DE3] to-[#5D46E6] rotate-[22deg] opacity-90 shadow-2xl" style={{ borderRadius: '32px 0' }} />
        <div className="hidden lg:block absolute right-[6%] top-[12%] w-36 h-36 bg-[#43E8A0] rotate-[15deg] opacity-80 shadow-lg" style={{ borderRadius: '36px 0' }} />
        <div className="hidden lg:block absolute right-[22%] top-[30%] w-20 h-20 bg-[#43E8A0]/70 -rotate-12 opacity-90" style={{ borderRadius: '20px 0' }} />
      </div>

      {/* 2. Brand Retro Icon Logo (Exactly in top-left with pipeline) */}
      <div className="absolute top-0 left-0 z-20 pointer-events-none w-[267px] h-[192px] scale-75 origin-top-left sm:scale-100 animate-fade-in">
        <svg
          width="267"
          height="192"
          viewBox="0 0 267 192"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0"
        >
          <defs>
            <linearGradient id="paint1_linear" x1="32" y1="0" x2="267" y2="192" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38C6E6" />
              <stop offset="45%" stopColor="#34DBB1" />
              <stop offset="100%" stopColor="#43E8A0" />
            </linearGradient>
          </defs>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M32 0V13.915C32 21.7049 38.3771 28.0207 46.2424 28.0207H87.1894C109.306 28.0207 129.917 57.4932 129.917 78.2724V174.368C129.917 184.106 137.887 192 147.72 192H249.197C259.03 192 267 184.106 267 174.368V72.1012C267 62.3629 259.03 54.469 249.197 54.469H153.061C121.9 54.469 101.432 25.3759 101.432 13.0333V0H32Z"
            fill="url(#paint1_linear)"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M167.13 125.745L167.14 125.734C167.644 125.21 168.327 124.916 169.038 124.916H190.67C192.019 124.916 193.112 123.776 193.112 122.369V113.221C193.112 112.483 193.394 111.775 193.896 111.254L193.906 111.244C194.41 110.721 195.093 110.427 195.805 110.427H204.56C205.909 110.427 207.003 109.286 207.003 107.879V99.5434C207.003 98.137 205.909 96.9962 204.56 96.9962H195.804C195.09 96.9962 194.405 96.7003 193.901 96.1741C193.396 95.6475 193.112 94.9336 193.112 94.1889V85.0539C193.112 83.6471 192.019 82.5066 190.67 82.5066H155.952C154.581 82.5066 153.469 83.6658 153.469 85.0964V93.3473C153.469 94.7775 154.581 95.937 155.952 95.937H191.431C192.146 95.937 192.831 96.2331 193.337 96.7603C193.842 97.2875 194.126 98.0023 194.126 98.7479V108.684C194.126 109.426 193.843 110.138 193.338 110.662L193.332 110.668C192.827 111.192 192.145 111.486 191.433 111.486H169.802C168.453 111.486 167.36 112.627 167.36 114.033V123.174C167.36 123.914 167.077 124.625 166.576 125.148L166.567 125.157C166.065 125.681 165.384 125.975 164.675 125.975H155.912C154.563 125.975 153.469 127.115 153.469 128.522V136.858C153.469 138.265 154.563 139.405 155.912 139.405H164.683C165.393 139.405 166.074 139.699 166.576 140.223H166.576C167.078 140.746 167.36 141.456 167.36 142.196V151.336C167.36 152.743 168.453 153.883 169.802 153.884L204.52 153.884C205.891 153.884 207.003 152.725 207.003 151.294V143.043C207.003 141.613 205.891 140.454 204.52 140.454L169.038 140.453C168.327 140.453 167.644 140.159 167.139 139.636L167.13 139.626C166.628 139.106 166.346 138.398 166.346 137.66V127.711C166.346 126.973 166.628 126.265 167.13 125.745Z"
            fill="#1D2633"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M227.01 96.1741C226.505 95.6475 226.222 94.9336 226.222 94.1889V85.0653C226.222 83.6522 225.123 82.5066 223.768 82.5066H215.799C214.444 82.5066 213.345 83.6522 213.345 85.0653V93.3783C213.345 94.7911 214.444 95.937 215.799 95.937H224.542C225.256 95.937 225.94 96.2325 226.445 96.7591L226.447 96.7615C226.445 97.2878 227.235 98.0017 227.235 98.7464V151.325C227.235 152.738 228.334 153.884 229.689 153.884H237.658C239.013 153.884 240.111 152.738 240.111 151.325V99.5552C240.111 98.1418 239.013 96.9962 237.658 96.9962H228.913C228.199 96.9962 227.515 96.7007 227.01 96.1741Z"
            fill="#1D2633"
          />
        </svg>

        {/* 'SCHOOL' text written vertically inside the '1' shape */}
        <div 
          className="absolute flex flex-col items-center justify-between text-[6px] sm:text-[6.5px] leading-none font-black uppercase text-[#34DBB1] select-none pointer-events-none font-mono tracking-tighter"
          style={{
            left: '228.8px',
            top: '101.5px',
            width: '10.5px',
            height: '46px',
          }}
        >
          <span>S</span>
          <span>C</span>
          <span>H</span>
          <span>O</span>
          <span>O</span>
          <span>L</span>
        </div>
      </div>

      {/* 3. Main Split Container Grid */}
      <div className="max-w-[1240px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center relative z-10 px-4">
        
        {/* Left Grid Side: Beautiful Slideshow Text and gamification info */}
        <div className="lg:col-span-6 flex flex-col justify-center items-start lg:pr-8 pt-24 lg:pt-0">
          <div className="min-h-[160px] flex flex-col justify-center">
            {SLIDES.map((slide, idx) => (
              <div
                key={slide.title}
                className={`transition-all duration-700 ease-in-out transform ${
                  idx === currentSlide
                    ? 'opacity-100 translate-x-0 relative block'
                    : 'opacity-0 -translate-x-4 absolute hidden'
                }`}
              >
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-montserrat tracking-tight mb-4">
                  {slide.title}
                </h2>
                <p className="text-[#A2AECB] text-base sm:text-lg max-w-md leading-relaxed font-normal">
                  {slide.description}
                </p>
              </div>
            ))}
          </div>

          {/* Interactive Slide dots pager indicator */}
          <div className="flex gap-2.5 mt-8 items-center">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentSlide ? 'w-6 bg-[#3BE5C2]' : 'w-2.5 bg-gray-500/50 hover:bg-gray-400'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right Grid Side: Sber 21 exact Gradient Floating card */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end">
          <div 
            className="w-full max-w-[460px] bg-gradient-to-tr from-[#6035B0] via-[#354A9B] to-[#3AC9DA] p-[2px] shadow-2xl shadow-black/40"
            style={{ borderRadius: '48px 0px' }}
          >
            <div 
              className="w-full h-full bg-[#1E2530]/75 backdrop-blur-2xl p-8 sm:p-10 flex flex-col"
              style={{ borderRadius: '46px 0px' }}
            >
              
              {/* Header Title inside card */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                Welcome to School 21
              </h1>
              <p className="text-[#A2AECB] text-xs sm:text-sm mt-3 leading-relaxed">
                Please enter your login and password that you received earlier
              </p>

              {!showOtp ? (
                /* Authenticated Username & Password Login */
                <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="flex flex-col gap-5 mt-8">
                  
                  {/* Login field container */}
                  <div className="flex flex-col gap-1.5">
                    <div 
                      className={`w-full bg-white text-gray-900 rounded-xl p-[9px] px-4 flex flex-col justify-between transition-all border-2 ${
                        loginErrors.login ? 'border-red-500 ring-2 ring-red-500/20' : 'border-white focus-within:border-[#3BE5C2]'
                      }`}
                    >
                      <label className="text-[10px] text-[#8095AF] font-bold select-none leading-none pt-0.5">login</label>
                      <input
                        type="text"
                        disabled={isLoggingIn}
                        autoCapitalize="none"
                        {...loginRegister('login')}
                        className="w-full bg-transparent text-gray-900 text-sm font-semibold focus:outline-none focus:ring-0 leading-tight h-[22px] p-0 border-none select-all"
                      />
                    </div>
                    {loginErrors.login && (
                      <span className="text-[11px] text-red-300 font-bold ml-1">{loginErrors.login.message}</span>
                    )}
                  </div>

                  {/* Password field container with visibility eye index switch */}
                  <div className="flex flex-col gap-1.5">
                    <div 
                      className={`w-full bg-white text-gray-900 rounded-xl p-[9px] px-4 flex items-center justify-between transition-all border-2 ${
                        loginErrors.password ? 'border-red-500 ring-2 ring-red-500/20' : 'border-white focus-within:border-[#3BE5C2]'
                      }`}
                    >
                      <div className="flex-grow flex flex-col justify-between">
                        <label className="text-[10px] text-[#8095AF] font-bold select-none leading-none pt-0.5">password</label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          disabled={isLoggingIn}
                          {...loginRegister('password')}
                          className="w-full bg-transparent text-gray-900 text-sm font-semibold focus:outline-none focus:ring-0 leading-tight h-[22px] p-0 border-none select-all"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-[#8095AF] hover:text-gray-900 transition-colors p-1 ml-2 flex-shrink-0"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5 stroke-[2]" /> : <Eye className="h-5 w-5 stroke-[2]" />}
                      </button>
                    </div>
                    {loginErrors.password && (
                      <span className="text-[11px] text-red-300 font-bold ml-1">{loginErrors.password.message}</span>
                    )}
                  </div>

                  {/* Action buttons section */}
                  <div className="flex items-center justify-between gap-4 mt-3">
                    <button
                      type="submit"
                      disabled={isLoggingIn}
                      className="h-11 px-6 bg-[#3BE5C2] hover:bg-[#2bd4b1] active:bg-[#1bc4a1] text-[#1C2330] font-black text-sm rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <span>{isLoggingIn ? 'Logging in...' : 'Log in'}</span>
                      <ChevronRight className="h-4 w-4 stroke-[3px]" />
                    </button>

                    <button
                      type="button"
                      onClick={handleDemoLogin}
                      className="text-xs font-black text-[#3BE5C2] hover:text-[#43E8A0] cursor-pointer tracking-wide transition-colors"
                    >
                      Forgot your password?
                    </button>
                  </div>

                  {/* Quick Demo Bypass Access */}
                  <div className="flex flex-col gap-2 mt-4">
                    <div className="flex items-center gap-2">
                      <hr className="flex-grow border-white/10" />
                      <span className="text-[10px] text-[#A2AECB] font-bold uppercase tracking-widest">or bypass</span>
                      <hr className="flex-grow border-white/10" />
                    </div>
                    <button
                      type="button"
                      onClick={handleDemoLogin}
                      className="h-11 w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Sparkles className="h-4 w-4 text-[#3BE5C2]" /> Use instant Demo bypass
                    </button>
                  </div>

                </form>
              ) : (
                /* Telegram Secure Verification Code (OTP) */
                <form onSubmit={handleVerifySubmit(onVerifySubmit)} className="flex flex-col gap-5 mt-8">
                  <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col gap-2 shadow-lg">
                    <span className="text-[10px] text-[#3BE5C2] font-black uppercase tracking-widest">
                      Secure Telegram Authentication
                    </span>
                    <p className="text-xs text-[#A2AECB] leading-relaxed">
                      Please open the bot using the link below to retrieve your securely generated 6-digit confirmation code.
                    </p>
                    {loginData?.bot_url && (
                      <a
                        href={loginData.bot_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-start gap-1 text-xs font-black text-[#43E8A0] hover:text-[#3BE5C2] uppercase tracking-wider mt-2"
                      >
                        <Send className="h-3.5 w-3.5" /> Open Telegram Bot
                      </a>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div 
                      className={`w-full bg-white text-gray-900 rounded-xl p-[9px] px-4 flex flex-col justify-between transition-all border-2 ${
                        verifyErrors.code ? 'border-red-500 ring-2 ring-red-500/20' : 'border-white focus-within:border-[#3BE5C2]'
                      }`}
                    >
                      <label className="text-[10px] text-[#8095AF] font-bold select-none leading-none pt-0.5">verification code</label>
                      <input
                        type="text"
                        maxLength={6}
                        disabled={isVerifyingCode}
                        {...verifyRegister('code')}
                        className="w-full bg-transparent text-gray-900 text-sm font-semibold focus:outline-none focus:ring-0 leading-tight h-[22px] p-0 border-none select-all font-mono tracking-widest text-center"
                        placeholder="000 000"
                      />
                    </div>
                    {verifyErrors.code && (
                      <span className="text-[11px] text-red-300 font-bold ml-1">{verifyErrors.code.message}</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 mt-2">
                    <button
                      type="submit"
                      disabled={isVerifyingCode}
                      className="h-11 w-full bg-[#3BE5C2] hover:bg-[#2bd4b1] active:bg-[#1bc4a1] text-[#1C2330] font-black text-sm rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
                    >
                      <Key className="h-4 w-4 stroke-[2.5]" />{' '}
                      {isVerifyingCode ? 'Verifying OTP...' : 'Verify OTP Code'}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setShowOtp(false)}
                      className="text-xs font-bold text-center text-[#A2AECB] hover:text-[#3BE5C2] mt-1 transition-colors cursor-pointer"
                    >
                      Go back to log in
                    </button>
                  </div>
                </form>
              )}

              {/* Decorative separator inside card */}
              <hr className="border-white/10 my-6" />

              {/* Footer instruction inside login card */}
              <div className="flex flex-col gap-2">
                <span className="text-white text-xs sm:text-sm font-bold">
                  How to begin the study?
                </span>
                <p className="text-[#A2AECB] text-[11px] sm:text-xs leading-relaxed">
                  If you want to study at the next-gen School, press the{' '}
                  <a
                    href="https://21-school.ru"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#3BE5C2] hover:underline font-semibold"
                  >
                    link to School21
                  </a>
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
