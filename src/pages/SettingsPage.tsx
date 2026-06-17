import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '@/services/settings';
import { Spinner, Skeleton, Modal } from '@/components/ui';
import { triggerToast } from '@/stores/toast';
import { Settings, Languages, Eye, Unlink, Lock, X, ShieldAlert, LogOut } from 'lucide-react';
import { authService } from '@/services/auth';
import { useAuthStore } from '@/stores/auth';

const LANGUAGE_OPTIONS = [
  "O'zbek",
  'Русский',
  'English',
  'Français',
  'Deutsch',
  'Español',
  'Türkçe',
  'العربية',
  'فарسی',
  '中文',
];

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);

  // Load language and campus configuration details
  const { data: config, isLoading } = useQuery({
    queryKey: ['settings-page-logs'],
    queryFn: settingsService.getSettings,
  });

  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [showUnlinkModal, setShowUnlinkModal] = useState<boolean>(false);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const [unlinkPassword, setUnlinkPassword] = useState<string>('');
  const [isUnlinking, setIsUnlinking] = useState<boolean>(false);

  useEffect(() => {
    if (config?.languages && config.languages.length > 0) {
      setSelectedLanguage(config.languages[0]);
    }
  }, [config]);

  // Language update mutation
  const updateLanguageMutation = useMutation({
    mutationFn: (lang: string) => settingsService.updateLanguage(lang),
    onSuccess: () => {
      triggerToast('Muloqot tili sozlamasi muvaffaqiyatli saqlandi', 'success');
      queryClient.invalidateQueries({ queryKey: ['settings-page-logs'] });
    },
    onError: (err: any) => {
      const detail = err?.response?.data?.detail || 'Xatolik yuz berdi';
      triggerToast(detail, 'error');
    },
  });

  const handleLanguageSave = () => {
    if (!selectedLanguage) {
      triggerToast('Iltimos, til tanlang', 'error');
      return;
    }
    updateLanguageMutation.mutate(selectedLanguage);
  };

  const handleUnlinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unlinkPassword) {
      triggerToast('Iltimos, parolingizni kiriting', 'error');
      return;
    }

    setIsUnlinking(true);
    try {
      await authService.unlinkTelegram(unlinkPassword);
      triggerToast('Telegram muvaffaqiyatli uzildi. Tizimdan chiqmoqdasiz...', 'success');
      setShowUnlinkModal(false);
      
      // Short timeout to let the user see the success message before logout
      setTimeout(() => {
        logout();
      }, 1500);
    } catch (err: any) {
      const detail = err?.response?.data?.detail || 'Hisob paroli noto‘g‘ri';
      triggerToast(detail, 'error');
    } finally {
      setIsUnlinking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 max-w-2xl mx-auto font-ibm-plex-mono text-white animate-pulse-subtle">
        {/* Header Block skeleton */}
        <div className="bg-[#2A3442] p-6 rounded-3xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Skeleton variant="circle" className="w-12 h-12" />
            <Skeleton variant="text" className="w-1/2 h-6" />
          </div>
          <Skeleton variant="text" className="w-[85%] h-4 mt-1" />
        </div>

        {/* Content Item 1 skeleton */}
        <div className="bg-[#2A3442] p-6 rounded-3xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b-2 border-black/20 pb-3">
            <Skeleton variant="circle" className="h-6 w-6" />
            <Skeleton variant="text" className="w-32 h-4" />
          </div>
          <div className="bg-[#34495E] p-4 rounded-2xl border-2 border-black flex flex-col gap-3">
            <Skeleton variant="text" className="w-24 h-3" />
            <div className="flex gap-2">
              <Skeleton variant="rect" className="w-16 h-7 rounded-lg" />
              <Skeleton variant="rect" className="w-20 h-7 rounded-lg" />
            </div>
          </div>
          <div className="flex gap-4">
            <Skeleton variant="rect" className="w-full h-11 rounded-xl" />
            <Skeleton variant="rect" className="w-24 h-11 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto font-ibm-plex-mono pb-24 lg:pb-8">
      
      {/* 3D Neo-Brutalist Header Area */}
      <div className="bg-[#2A3442] p-6 rounded-3xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-2 relative overflow-hidden">
        <div className="flex items-center gap-3">
          {/* Animated Gradient Icon Block */}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#38C9E6] to-[#43E8A0] flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Settings className="w-6 h-6 text-black animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-montserrat tracking-tight">
            TIZIM SOZLAMALARI
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-[#B0BEC5] font-ibm-plex-mono mt-1">
          Platformadagi muloqot tillari, xavfsizlik sozlamalari va vizual tizim parametrlari boshqaruvi.
        </p>
        <div className="absolute right-4 top-4 opacity-10">
          <Settings className="w-24 h-24 text-white" />
        </div>
      </div>

      {/* Language preferred section */}
      <div className="bg-[#2A3442] p-6 rounded-3xl border-2 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex flex-col gap-5">
        
        {/* Section Header */}
        <div className="flex items-center gap-3 border-b-2 border-black pb-3">
          <div className="w-8 h-8 rounded-lg bg-[#38C9E6] border-2 border-black flex items-center justify-center text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
            <Languages className="h-4 w-4" />
          </div>
          <h2 className="text-sm font-bold uppercase tracking-[0.05em] font-montserrat text-white leading-none">
            Muloqot tillari
          </h2>
        </div>

        {/* Existing active keys with 3D badges */}
        <div className="flex flex-col gap-2 bg-[#34495E] p-4 rounded-2xl border-2 border-black">
          <span className="text-xs uppercase tracking-[0.05em] font-bold font-montserrat text-[#38C9E6]">
            Sizning faol tillaringiz:
          </span>
          <div className="flex flex-wrap gap-2 mt-1">
            {config?.languages && config.languages.length > 0 ? (
              config.languages.map((l) => (
                <span key={l} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border-2 border-black bg-gradient-to-br from-[#38C9E6] to-[#43E8A0] text-[#000000] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  {l}
                </span>
              ))
            ) : (
              <span className="text-xs text-[#B0BEC5] italic">Muloqot tillari tanlanmagan</span>
            )}
          </div>
        </div>

        {/* Interactive select list and primary action block */}
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-wider font-bold font-montserrat text-[#B0BEC5] mb-1">
            Yangi til qo'shish yoki almashtirish
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full h-11 px-4 py-2 border-2 border-black rounded-xl bg-[#34495E] text-white font-ibm-plex-mono focus:outline-none focus:ring-2 focus:ring-[#38C9E6] transition-all cursor-pointer"
              >
                <option value="" disabled className="bg-[#34495E] text-[#B0BEC5]">-- Tilni Tanlang --</option>
                {LANGUAGE_OPTIONS.map((l) => (
                  <option key={l} value={l} className="bg-[#2A3442] text-white">
                    {l}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={handleLanguageSave}
              disabled={updateLanguageMutation.isPending}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-br from-[#38C9E6] to-[#43E8A0] text-black font-extrabold rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all font-montserrat text-xs tracking-wider uppercase h-11 flex items-center justify-center cursor-pointer"
            >
              {updateLanguageMutation.isPending ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
          </div>
        </div>
      </div>

      {/* Theme Card aligned with 3D Neo-Brutalist Theme specification */}
      <div className="bg-[#2A3442] p-6 rounded-3xl border-2 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex flex-col gap-4">
        
        {/* Section Header */}
        <div className="flex items-center gap-3 border-b-2 border-black pb-3">
          <div className="w-8 h-8 rounded-lg bg-[#cdbdff] border-2 border-black flex items-center justify-center text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
            <Eye className="h-4 w-4" />
          </div>
          <h2 className="text-sm font-bold uppercase tracking-[0.05em] font-montserrat text-white leading-none">
            Vizual Mavzu (Theme Mode)
          </h2>
        </div>
        
        <div className="flex flex-col gap-3">
          <p className="text-xs sm:text-sm text-[#B0BEC5] leading-relaxed">
            P2P Corpus platformasi <strong className="text-[#38C9E6]">Modern 3D Neo-Brutalist</strong> dizayn tizimiga asoslanganligi bois faqatgina <strong className="text-[#cdbdff]">To‘q Mavzu (Dark system only)</strong> da ishlaydi.
          </p>
          
          <div className="flex items-center gap-3 p-4 bg-[#34495E] rounded-xl border-2 border-black">
            <div className="h-3 w-3 rounded-full bg-[#00e676] animate-pulse shadow-[0_0_8px_rgba(0,230,118,0.5)]" />
            <span className="text-xs text-[#bbcac4] uppercase tracking-wider font-bold">
              Tungi baholashlar uchun ko'zni ideal vizual himoya qilish faol!
            </span>
          </div>
        </div>
      </div>

      {/* Security Telegram Connection Unlink (Red / Error aesthetics) */}
      <div className="bg-[#FF9B9B]/10 p-6 rounded-3xl border-2 border-[#FF9B9B] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex flex-col gap-4">
        
        {/* Section Header */}
        <div className="flex items-center gap-3 border-b-2 border-black pb-3">
          <div className="w-8 h-8 rounded-lg bg-[#FF9B9B] border-2 border-black flex items-center justify-center text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
            <Unlink className="h-4 w-4" />
          </div>
          <h2 className="text-sm font-bold uppercase tracking-[0.05em] font-montserrat text-[#FF9B9B] leading-none">
            Xavfsizlik & Hisob ulanishi
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-xs sm:text-sm text-[#B0BEC5] leading-relaxed">
            Agar ulangan Telegram akkauntingizni o‘zgartirmoqchi bo‘lsangiz, uni profil bilan ulanishini buzishingiz (unlink) mumkin. Tizimdan ulanish uzilgandan keyin hisobingiz xavfsizligi va xabardor qilish to'xtatiladi.
          </p>

          <div className="flex justify-end mt-1">
            <button
              onClick={() => {
                setUnlinkPassword('');
                setShowUnlinkModal(true);
              }}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#FF9B9B] hover:bg-[#FF8888] text-black font-extrabold rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all font-montserrat text-xs tracking-wider uppercase h-11 flex items-center justify-center cursor-pointer"
            >
              Telegram ulanishini uzish
            </button>
          </div>
        </div>
      </div>

      {/* Tizimdan Chiqish Section (Mobile and overall compatible) */}
      <div className="bg-[#2A3442] p-6 rounded-3xl border-2 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex flex-col gap-4">
        {/* Section Header */}
        <div className="flex items-center gap-3 border-b-2 border-black pb-3">
          <div className="w-8 h-8 rounded-lg bg-[#FF9B9B] border-2 border-black flex items-center justify-center text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
            <LogOut className="h-4 w-4" />
          </div>
          <h2 className="text-sm font-bold uppercase tracking-[0.05em] font-montserrat text-white leading-none">
            Tizimdan chiqish (Logout)
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-xs sm:text-sm text-[#B0BEC5] leading-relaxed">
            Platformadagi ish seansini yakunlamoqchimisiz? Chiqqaningizdan so'ng, qayta kirish uchun hisobingiz orqali login qilishingiz kerak bo'ladi.
          </p>

          <div className="flex justify-end mt-1">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#FF9B9B] hover:bg-[#FF8888] text-black font-extrabold rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all font-montserrat text-xs tracking-wider uppercase h-11 flex items-center justify-center cursor-pointer"
            >
              Tizimdan chiqish
            </button>
          </div>
        </div>
      </div>

      {/* Show Logout Confirmation modal */}
      {showLogoutModal && (
        <Modal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          title="Tizimdan Chiqish"
        >
          <div className="flex flex-col gap-4">
            <p className="text-xs sm:text-sm text-[#B0BEC5] leading-relaxed">
              Haqiqatdan ham tizimdan chiqmoqchimisiz? Kelgusi kirishlar uchun qayta avtorizatsiyadan oʻtishingiz talab etiladi.
            </p>
            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 bg-[#34495E] hover:bg-gray-600 text-white font-extrabold rounded-xl border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all text-xs tracking-wider uppercase cursor-pointer"
              >
                Qolish
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutModal(false);
                  logout();
                }}
                className="px-4 py-2 bg-[#FF9B9B] hover:bg-[#FF8888] text-black font-extrabold rounded-xl border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all text-xs tracking-wider uppercase cursor-pointer"
              >
                Chiqish
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Iframe-Safe Neo-Brutalist Password Protection Modal */}
      {showUnlinkModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[#2A3442] rounded-3xl p-8 max-w-md w-full border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-5 animate-fade-in">
            
            <div className="flex justify-between items-center border-b-2 border-black pb-3">
              <span className="text-lg font-extrabold font-montserrat text-white tracking-tight uppercase">
                Xavfsizlik tasdiqi
              </span>
              <button
                onClick={() => setShowUnlinkModal(false)}
                className="w-8 h-8 rounded-lg bg-[#34495E] border-2 border-black flex items-center justify-center text-white hover:bg-black hover:text-[#38C9E6] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-[#ff5252]/10 border-2 border-black">
              <ShieldAlert className="h-6 w-6 text-[#ff5252] shrink-0" />
              <div className="flex flex-col gap-1">
                <span className="text-xs font-extrabold text-[#ff5252] uppercase tracking-[0.05em] font-montserrat">Diqqat!</span>
                <p className="text-xs text-[#B0BEC5] leading-relaxed">
                  Telegram ulanishini uzish tizimdan avtomatik logout bo‘lishingizga sabab bo‘ladi. Davom etish uchun School21 parolingizni kiritib tasdiqlang.
                </p>
              </div>
            </div>

            <form onSubmit={handleUnlinkSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-[0.05em] font-bold font-montserrat text-[#B0BEC5]">
                  XAFSIZLIK PAROLI
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={unlinkPassword}
                    onChange={(e) => setUnlinkPassword(e.target.value)}
                    placeholder="School21 parolingiz..."
                    className="h-11 w-full rounded-xl bg-[#34495E] border-2 border-black pl-10 pr-3 text-sm
                               text-white placeholder:text-[#85948f]
                               focus:outline-none focus:ring-2 focus:ring-[#38C9E6]
                               transition-all"
                    autoFocus
                  />
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#85948f]" />
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setShowUnlinkModal(false)}
                  className="flex-1 px-4 py-2 bg-[#34495E] hover:bg-gray-600 text-white font-extrabold rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all font-montserrat text-xs tracking-wider uppercase cursor-pointer text-center"
                  disabled={isUnlinking}
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#ff5252] text-white hover:bg-red-600 font-extrabold rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all font-montserrat text-xs tracking-wider uppercase cursor-pointer"
                  disabled={isUnlinking || !unlinkPassword}
                >
                  {isUnlinking ? 'Uzilmoqda...' : 'Tasdiqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
