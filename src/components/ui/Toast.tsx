import { useToastStore } from '@/stores/toast';
import { X, CheckCircle, AlertOctagon, Info } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 rounded-lg flex items-start gap-4 border shadow-lg transition-all duration-300 animate-slide-in
            ${
              toast.type === 'success'
                ? 'bg-[#1a2332] border-[#00e676] text-[#00e676]'
                : toast.type === 'error'
                ? 'bg-[#1a2332] border-[#ff5252] text-[#ff5252]'
                : 'bg-[#1a2332] border-[#40c4ff] text-[#40c4ff]'
            }
          `}
        >
          <div className="flex-shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle className="h-5 w-5" />}
            {toast.type === 'error' && <AlertOctagon className="h-5 w-5" />}
            {toast.type === 'info' && <Info className="h-5 w-5" />}
          </div>
          <div className="flex-grow">
            <p className="text-sm font-medium text-[#dde4e0]">{toast.text}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 text-[#85948f] hover:text-[#dde4e0] transition-colors"
            aria-label="Yopish"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
