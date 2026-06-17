import { SlotStatus } from '@/types/api';
import { Check, Clock, AlertTriangle } from 'lucide-react';

interface SlotTimelineProps {
  status: SlotStatus;
  actualStart?: string | null;
  actualEnd?: string | null;
}

export function SlotTimeline({ status, actualStart, actualEnd }: SlotTimelineProps) {
  // Define standard steps in sequence
  const steps = [
    { key: 'created', label: 'Slot Yaratildi', desc: 'Siz sheriklar uchun vaqt darchasini ruxsat etdingiz.' },
    { key: 'booked', label: 'Band Qilindi', desc: 'Dars baholovchi talaba tomonidan band qilindi.' },
    { key: 'in_progress', label: 'Dars Boshlandi', desc: 'Ikkala tomon ham darsni "Boshlash" ni bosishdi.' },
    { key: 'completed', label: 'Tugallandi', desc: 'Peer-to-peer baholash va loyiha muhokamasi yakunlandi.' },
  ];

  const getStepIndex = () => {
    switch (status) {
      case 'open':
        return 0;
      case 'booked':
        return 1;
      case 'in_progress':
        return 2;
      case 'completed':
        return 3;
      case 'cancelled':
      case 'absent':
        return -1; // Special alerts instead
    }
  };

  const activeIndex = getStepIndex();

  return (
    <div className="flex flex-col gap-5 p-5 bg-[#1a2332] border border-[#2d3748] rounded-xl">
      <h3 className="text-xs uppercase font-mono font-bold tracking-widest text-[#85948f] mb-2">
        Baholash Bosqichlari Timeline
      </h3>

      {/* Side branch block if cancel or absent */}
      {status === 'cancelled' && (
        <div className="p-4 rounded-lg bg-[#ff5252]/10 border border-[#ff5252]/30 flex items-start gap-3 mb-2 animate-fade-in">
          <AlertTriangle className="h-5 w-5 text-[#ff5252] flex-shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-bold text-[#ff5252]">Loyiha Bekor Qilindi</span>
            <span className="text-xs text-[#bbcac4]">Ushbu slot yaratuvchi tomonidan yoki administrator tomonidan bekor qilindi.</span>
          </div>
        </div>
      )}

      {status === 'absent' && (
        <div className="p-4 rounded-lg bg-[#ff5252]/10 border border-[#ff5252]/30 flex items-start gap-3 mb-2 animate-fade-in">
          <AlertTriangle className="h-5 w-5 text-[#ff5252] flex-shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-bold text-[#ff5252]">Dars Kelmadi deb Belgilandi</span>
            <span className="text-xs text-[#bbcac4]">Baholash vaqtida kelmagan a‘zo qayd etildi. Tegishli XP jarimalari yuklandi.</span>
          </div>
        </div>
      )}

      {/* Timeline Steps layout */}
      <div className="relative border-l border-[#2d3748] ml-3 pl-6 space-y-6">
        {steps.map((step, idx) => {
          const isDone = activeIndex >= idx;
          const isCurrent = activeIndex === idx;

          return (
            <div key={step.key} className="relative group">
              {/* Chronological Indicator circle */}
              <div
                className={`absolute -left-[31px] top-1.5 h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all duration-300
                  ${
                    isDone
                      ? 'bg-[#00bfa5] border-[#00bfa5] shadow-[0_0_8px_rgba(0,191,165,0.4)]'
                      : 'bg-[#1a2332] border-[#2d3748]'
                  }
                `}
              >
                {isDone && <Check className="h-2.5 w-2.5 text-[#0f1923] stroke-[3]" />}
              </div>

              {/* Step Title & Details */}
              <div className="flex flex-col gap-0.5">
                <span
                  className={`text-sm font-bold transition-colors duration-150
                    ${isCurrent ? 'text-[#00bfa5]' : isDone ? 'text-[#dde4e0]' : 'text-[#85948f]'}
                  `}
                >
                  {step.label}
                </span>
                <span className="text-xs text-[#85948f] leading-relaxed max-w-sm">
                  {step.desc}
                </span>

                {/* Additional timestamp indicators from backend logs */}
                {step.key === 'in_progress' && actualStart && (
                  <span className="text-[10px] font-mono text-[#00bfa5] mt-1">
                    Boshlanish vaqti: {new Date(actualStart).toLocaleTimeString('uz-UZ')}
                  </span>
                )}
                {step.key === 'completed' && actualEnd && (
                  <span className="text-[10px] font-mono text-[#7c4dff] mt-1">
                    Yakunlanish vaqti: {new Date(actualEnd).toLocaleTimeString('uz-UZ')}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default SlotTimeline;
