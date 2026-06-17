import { useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { Card, Avatar, Button, Input, Spinner, Badge, Skeleton } from '@/components/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  User,
  GraduationCap,
  BookOpen,
  ThumbsUp,
  ThumbsDown,
  Edit,
  CheckCircle,
  HelpCircle,
  Code,
} from 'lucide-react';

const profileUpdateSchema = z.object({
  first_name: z.string().min(2, 'Ism kamida 2 ta belgidan iborat bo‘lishi kerak'),
  last_name: z.string().min(2, 'Familiya kamida 2 ta belgidan iborat bo‘lishi kerak'),
  avatar_url: z.string().url('To‘g‘ri rasm URL manzilini kiriting').or(z.literal('')),
});

type FormValues = z.infer<typeof profileUpdateSchema>;

export default function ProfilePage() {
  const { profile, isLoadingProfile, updateProfile, isUpdatingProfile, skills, isLoadingSkills } = useProfile();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(profileUpdateSchema),
  });

  const handleEditOpen = () => {
    if (profile?.user) {
      setValue('first_name', profile.user.first_name || '');
      setValue('last_name', profile.user.last_name || '');
      setValue('avatar_url', profile.user.avatar_url || '');
    }
    setIsEditing(true);
  };

  const onUpdateSubmit = async (values: FormValues) => {
    try {
      await updateProfile(values);
      setIsEditing(false);
    } catch (e) {}
  };

  if (isLoadingProfile || !profile) {
    return (
      <div className="flex flex-col gap-6 animate-fade-in font-ibm-plex-mono text-white animate-pulse-subtle">
        {/* Title */}
        <div className="flex flex-col gap-2">
          <Skeleton variant="text" className="w-1/4 h-6 animate-pulse" />
          <Skeleton variant="text" className="w-[45%] h-3.5 animate-pulse" />
        </div>

        {/* Profile Header Card Skeleton */}
        <div className="p-6 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 rounded-3xl border-2 border-black bg-[#2A3442] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col sm:flex-row items-center gap-5 w-full">
            <Skeleton variant="circle" className="h-24 w-24 flex-shrink-0 animate-pulse" />
            <div className="flex flex-col items-center sm:items-start gap-2.5 w-full">
              <div className="flex items-center gap-2 w-full">
                <Skeleton variant="text" className="w-40 h-5 animate-pulse" />
                <Skeleton variant="rect" className="w-20 h-5 rounded-md animate-pulse" />
              </div>
              <Skeleton variant="text" className="w-24 h-3.5 animate-pulse" />
              <Skeleton variant="text" className="w-[60%] h-3 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Stats Matrix Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-5 flex flex-col gap-3 rounded-2xl border-2 border-black bg-[#2A3442] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2">
                <Skeleton variant="circle" className="h-4 w-4 animate-pulse" />
                <Skeleton variant="text" className="w-16 h-3 animate-pulse" />
              </div>
              <Skeleton variant="text" className="w-12 h-8 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const { user, stats } = profile;

  return (
    <div className="flex flex-col gap-6 animate-fade-in font-ibm-plex-mono text-white">
      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl sm:text-2xl font-black text-white font-montserrat tracking-tight leading-none">Mening Profilim</h1>
        <p className="text-xs text-[#B0BEC5] leading-relaxed">
          Platformadagi darajangiz, dars va fikr-mulohazalar statistikasi boshqaruvi.
        </p>
      </div>

      {/* Profile Header Card */}
      <Card hover={false} className="p-6 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 relative overflow-hidden rounded-3xl border-2 border-black bg-[#2A3442] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <Avatar src={user.avatar_url} name={user.school21_login} size="xl" />
          <div className="flex flex-col items-center sm:items-start gap-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white font-montserrat tracking-tight">
                {user.first_name} {user.last_name}
              </h2>
              <Badge type="primary">{`LEVEL ${user.level}`}</Badge>
            </div>
            <span className="text-xs text-[#38C9E6] font-bold">@{user.school21_login}</span>
            <span className="text-[10px] text-[#B0BEC5] uppercase tracking-wider font-extrabold mt-1">
              Program: {user.core_program || 'CORE'} • Track: {user.main_track || 'Web'}
            </span>

            {/* Language Badges */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {user.languages.map((l) => (
                <span key={l} className="text-[10px] uppercase tracking-widest font-black px-2.5 py-1 rounded-xl bg-[#34495E] text-[#cdbdff] border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>

        <Button variant="secondary" onClick={handleEditOpen} className="text-xs uppercase font-extrabold tracking-wider font-montserrat">
          <Edit className="h-4 w-4" /> Edit Profile
        </Button>
      </Card>

      {/* Edit Form inline Card */}
      {isEditing && (
        <Card className="p-6 border-2 border-black bg-[#2A3442] animate-slide-in rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <form onSubmit={handleSubmit(onUpdateSubmit)} className="flex flex-col gap-4">
            <h3 className="text-sm font-extrabold text-white border-b-2 border-black pb-3 font-montserrat uppercase tracking-wider">
              Profil Ma‘lumotlarini Tahrirlash
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Ism" error={errors.first_name?.message} {...register('first_name')} />
              <Input label="Familiya" error={errors.last_name?.message} {...register('last_name')} />
            </div>
            <Input
              label="Avatar loyiha yoki rasm URL manzili"
              error={errors.avatar_url?.message}
              placeholder="https://..."
              {...register('avatar_url')}
            />
            <div className="flex gap-3 justify-end pt-2">
              <Button type="button" variant="ghost" onClick={() => setIsEditing(false)} disabled={isUpdatingProfile}>
                Bekor qilish
              </Button>
              <Button type="submit" variant="primary" disabled={isUpdatingProfile}>
                {isUpdatingProfile ? 'Saqlanmoqda...' : 'Saqlash'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Stats Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Teach count */}
        <Card className="p-5 flex flex-col gap-2 rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-[#2A3442]">
          <div className="flex items-center gap-2 text-[#cdbdff]">
            <GraduationCap className="h-4 w-4" />
            <span className="text-[10px] uppercase tracking-widest font-extrabold text-[#B0BEC5] font-montserrat">O‘rgatilgan</span>
          </div>
          <span className="text-2xl font-black text-white mt-1 font-montserrat leading-none">{stats.taught_count} marta</span>
          <span className="text-[10px] text-[#B0BEC5] leading-relaxed">Reviewer sifatida</span>
        </Card>

        {/* Learn count */}
        <Card className="p-5 flex flex-col gap-2 rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-[#2A3442]">
          <div className="flex items-center gap-2 text-[#38C9E6]">
            <BookOpen className="h-4 w-4" />
            <span className="text-[10px] uppercase tracking-widest font-extrabold text-[#B0BEC5] font-montserrat">O‘rganilgan</span>
          </div>
          <span className="text-2xl font-black text-white mt-1 font-montserrat leading-none">{stats.learned_count} marta</span>
          <span className="text-[10px] text-[#B0BEC5] leading-relaxed">Reviewee sifatida</span>
        </Card>

        {/* Positive Review */}
        <Card className="p-5 flex flex-col gap-2 rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-[#263E33]">
          <div className="flex items-center gap-2 text-[#43E8A0]">
            <ThumbsUp className="h-4 w-4" />
            <span className="text-[10px] uppercase tracking-widest font-extrabold text-white/80 font-montserrat">Ijobiy fikrlar</span>
          </div>
          <span className="text-2xl font-black text-[#43E8A0] mt-1 font-montserrat leading-none">{stats.positive_reviews} ta</span>
          <span className="text-[10px] text-white/75 leading-relaxed">Sheriklar olqishladi</span>
        </Card>

        {/* Negative Review */}
        <Card className="p-5 flex flex-col gap-2 rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-[#4A2D2D]">
          <div className="flex items-center gap-2 text-[#FF9B9B]">
            <ThumbsDown className="h-4 w-4" />
            <span className="text-[10px] uppercase tracking-widest font-extrabold text-white/80 font-montserrat">Salbiy fikrlar</span>
          </div>
          <span className="text-2xl font-black text-[#FF9B9B] mt-1 font-montserrat leading-none">{stats.negative_reviews} ta</span>
          <span className="text-[10px] text-white/75 leading-relaxed">Jiddiy kamchiliklar</span>
        </Card>
      </div>

      {/* Skills list Radar module mock alternative display */}
      <div className="flex flex-col gap-4 mt-2">
        <span className="text-sm font-extrabold text-white flex items-center gap-2 border-b-2 border-black pb-3 font-montserrat uppercase tracking-wider">
          <Code className="h-5 w-5 text-[#38C9E6]" /> Texnik Ko‘nikmalar (Program Skills)
        </span>

        {isLoadingSkills ? (
          <Spinner size="sm" />
        ) : Object.keys(skills).length === 0 ? (
          <Card className="p-6 text-center text-[#B0BEC5] text-xs">
            Hech qanday ko‘nikmalar qayd etilmagan.
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Object.entries(skills).map(([skillName, value]) => (
              <Card key={skillName} hover={false} className="p-5 bg-[#2A3442] border-2 border-black rounded-2xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex justify-between items-center mb-2.5 text-xs">
                  <span className="font-extrabold text-[#B0BEC5] font-montserrat uppercase tracking-wider">{skillName}</span>
                  <span className="font-black text-[#38C9E6] font-ibm-plex-mono">{value}%</span>
                </div>
                {/* Visual bar */}
                <div className="h-4.5 w-full rounded-full bg-[#34495E] border-2 border-black overflow-hidden p-[2px] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  <div className="h-full bg-gradient-to-r from-[#38C9E6] to-[#43E8A0] rounded-full" style={{ width: `${value}%` }} />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

