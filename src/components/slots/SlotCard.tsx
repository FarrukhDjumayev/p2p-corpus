import { Link } from 'react-router-dom';
import { Slot, UserMe } from '@/types/api';
import { Card, Badge } from '@/components/ui';
import { formatDateTime } from '@/lib/utils';
import { Calendar, Laptop, MapPin, ArrowRight, User } from 'lucide-react';

interface SlotCardProps {
  slot: Slot;
  currentUserId?: string;
}

export function SlotCard({ slot, currentUserId }: SlotCardProps) {
  // Identify user role in this slot
  const isReviewer = slot.reviewer_id === currentUserId;
  const isReviewee = slot.reviewee_id === currentUserId;

  const getStatusBadge = () => {
    switch (slot.status) {
      case 'open':
        return <Badge type="success">Ochiq</Badge>;
      case 'booked':
        return <Badge type="info">Band qilingan</Badge>;
      case 'in_progress':
        return <Badge type="warning">Jarayonda</Badge>;
      case 'completed':
        return <Badge type="primary">Tugallandi</Badge>;
      case 'cancelled':
        return <Badge type="error">Bekor qilingan</Badge>;
      case 'absent':
        return <Badge type="error">Kelmadi</Badge>;
      default:
        return <Badge type="info">{slot.status}</Badge>;
    }
  };

  return (
    <Card hover className="flex flex-col gap-4 h-full relative font-ibm-plex-mono">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-[#B0BEC5] font-extrabold tracking-widest uppercase font-montserrat">
            {isReviewer ? 'O‘QITUVCHI (SIZ)' : isReviewee ? 'O‘QUVCHI (SIZ)' : 'OCHIQ SLOT'}
          </span>
          <h4 className="text-base font-extrabold text-white truncate max-w-[180px] sm:max-w-[240px] font-montserrat tracking-tight" title={slot.reviewer_project}>
            {slot.reviewer_project}
          </h4>
        </div>
        {getStatusBadge()}
      </div>

      {/* Attributes List */}
      <div className="flex flex-col gap-2.5 text-xs text-[#B0BEC5] py-2.5 border-y-2 border-black/30 my-1">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-[#38C9E6] flex-shrink-0" />
          <span className="truncate font-bold text-white">{formatDateTime(slot.start_time)}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 min-w-[100px]">
            <Laptop className="h-4 w-4 text-[#cdbdff] flex-shrink-0" />
            <span>{slot.is_online ? 'Onlayn' : 'Oflayn'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-[#ffd740] flex-shrink-0" />
            <span className="uppercase font-extrabold text-[11px] text-[#ffd740]">{slot.campus}</span>
          </div>
        </div>

        {slot.reviewee_project && (
          <div className="flex items-center gap-2 text-[#B0BEC5]">
            <User className="h-4 w-4 text-[#43E8A0] flex-shrink-0" />
            <span className="truncate">O‘quvchi loyihasi: <strong className="text-white font-extrabold">{slot.reviewee_project}</strong></span>
          </div>
        )}
      </div>

      {/* Button to show detail */}
      <div className="mt-auto pt-2 flex justify-end">
        <Link
          to={`/slots/${slot.id}`}
          className="inline-flex items-center gap-2 text-xs font-black text-[#38C9E6] hover:text-[#43E8A0] uppercase tracking-widest group transition-all duration-150 font-montserrat"
        >
          Batafsil <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </Card>
  );
}
export default SlotCard;
