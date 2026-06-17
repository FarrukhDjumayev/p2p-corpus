import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Project, SlotCreate } from '@/types/api';
import { Button, Input, Select } from '@/components/ui';
import { triggerToast } from '@/stores/toast';

interface CreateSlotFormProps {
  teachableProjects: Project[];
  userCampus?: string | null;
  onSubmit: (data: SlotCreate) => Promise<void>;
  isSubmitting?: boolean;
  initialStartTime?: string;
}

const slotSchema = z.object({
  reviewer_project: z.string().min(1, 'Loyiha nomini tanlash majburiy'),
  start_time: z.string().min(1, 'Boshlanish vaqtini tanlash majburiy'),
  is_online: z.boolean(),
});

type FormValues = z.infer<typeof slotSchema>;

export function CreateSlotForm({
  teachableProjects,
  userCampus,
  onSubmit,
  isSubmitting = false,
  initialStartTime,
}: CreateSlotFormProps) {
  const isTashkent = userCampus?.toLowerCase() === 'tashkent';

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(slotSchema),
    defaultValues: {
      reviewer_project: '',
      start_time: initialStartTime || '',
      is_online: isTashkent ? true : false,
    },
  });

  // Prefill initialStartTime inside useEffect when it changes
  useEffect(() => {
    if (initialStartTime) {
      setValue('start_time', initialStartTime);
    }
  }, [initialStartTime, setValue]);

  // Force is_online true for Tashkent campus
  useEffect(() => {
    if (isTashkent) {
      setValue('is_online', true);
    }
  }, [isTashkent, setValue]);

  const onFormSubmit = async (values: FormValues) => {
    try {
      // Calculate end_time as default +60 minutes to streamline business flow
      const startDt = new Date(values.start_time);
      if (startDt.getTime() < Date.now()) {
        triggerToast('Boshlanish vaqti o‘tib ketgan bo‘lishi mumkin emas', 'error');
        return;
      }
      const endDt = new Date(startDt.getTime() + 60 * 60 * 1000);

      await onSubmit({
        reviewer_project: values.reviewer_project,
        start_time: startDt.toISOString(),
        end_time: endDt.toISOString(),
        is_online: values.is_online,
      });
    } catch (e) {
      // Errors are already handled inside mutate of useSlots hook, but this prevents form submission crash
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-5">
      {/* Project selector */}
      <Select
        label="Siz o‘rgata oladigan loyiha"
        error={errors.reviewer_project?.message}
        {...register('reviewer_project')}
      >
        <option value="" disabled className="bg-[#0f1923]">-- Tanlang --</option>
        {teachableProjects.map((proj) => (
          <option key={proj.id || proj.title} value={proj.title} className="bg-[#1a2332]">
            {proj.title}
          </option>
        ))}
      </Select>

      {/* Start Date Selection */}
      <Input
        type="datetime-local"
        label="Dars boshlanish vaqti"
        error={errors.start_time?.message}
        placeholder="Vaqtni tanlang"
        {...register('start_time')}
      />

      {/* Online/Offline Toggle */}
      <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-[#0f1923] border border-[#2d3748]">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            disabled={isTashkent}
            className="h-4 w-4 rounded border-[#2d3748] text-[#00bfa5] accent-[#00bfa5] cursor-pointer"
            {...register('is_online')}
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[#dde4e0]">Onlayn dars</span>
            <span className="text-[10px] text-[#85948f]">Masofaviy yoki telegram orqali P2P dars</span>
          </div>
        </label>
        {isTashkent && (
          <span className="text-[10px] text-[#00bfa5] uppercase tracking-wider font-semibold font-mono mt-1">
            * Tashkent campusi faqat onlayn rejimlarni qo‘llab-quvvatlaydi.
          </span>
        )}
      </div>

      <div className="pt-2">
        <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Yaratilmoqda...' : 'Slotni tasdiqlash'}
        </Button>
      </div>
    </form>
  );
}
export default CreateSlotForm;
