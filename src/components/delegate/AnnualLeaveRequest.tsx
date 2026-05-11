'use client';

import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  X,
  Check,
  CalendarDays,
  CalendarRange,
  Phone,
  StickyNote,
  Paperclip,
  FileText,
  CheckCircle2,
  Palmtree,
  Clock,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useAppStore } from '@/lib/store';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface LeaveFormData {
  reason: string;
  days: string;
  startDate: string;
  endDate: string;
  contactDuringLeave: string;
  notes: string;
  attachments: { file: File; name: string }[];
}

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const LEAVE_BALANCE = {
  total: 30,
  used: 12,
  remaining: 18,
};

/* ------------------------------------------------------------------ */
/*  Progress Bar                                                       */
/* ------------------------------------------------------------------ */

function ProgressBar({ currentStep }: { currentStep: number }) {
  const { t } = useI18n();
  const f = t.annualLeaveForm as Record<string, string>;

  const steps = [
    { label: f.step1, short: '1' },
    { label: f.step2, short: '2' },
  ];

  return (
    <div className="flex items-start">
      {steps.map((step, idx) => {
        const stepNum = idx + 1;
        const isActive = stepNum === currentStep;
        const isDone = stepNum < currentStep;

        return (
          <div key={idx} className="contents">
            <div className="flex flex-col items-center shrink-0">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  isDone
                    ? 'bg-[#007AFF] text-white'
                    : isActive
                    ? 'bg-[#007AFF] text-white shadow-md shadow-[#007AFF]/30'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {isDone ? <Check className="w-4 h-4" /> : step.short}
              </div>
              <span
                className={`text-[12px] mt-1.5 font-bold leading-tight text-center transition-colors duration-300 ${
                  isActive ? 'text-[#007AFF]' : isDone ? 'text-gray-600' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`h-[2px] flex-1 mx-2 mt-[14px] self-start transition-colors duration-300 ${
                  stepNum < currentStep ? 'bg-[#007AFF]' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Leave Balance Card                                                 */
/* ------------------------------------------------------------------ */

function LeaveBalanceCard() {
  const { t } = useI18n();
  const f = t.annualLeaveForm as Record<string, string>;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-4 text-white shadow-lg shadow-teal-500/25 relative overflow-hidden"
    >
      {/* Decorative circles */}
      <div className="absolute top-0 end-0 w-24 h-24 rounded-full bg-white/5 -translate-y-8 translate-x-8" />
      <div className="absolute bottom-0 start-0 w-16 h-16 rounded-full bg-white/5 translate-y-6 -translate-x-6" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <Palmtree className="w-4.5 h-4.5" />
          </div>
          <span className="text-[12px] font-medium text-white/80">
            {f.balanceCardTitle}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Remaining - Large */}
          <div className="flex-1">
            <div className="flex items-baseline gap-1">
              <span className="text-[2rem] font-black leading-none">
                {LEAVE_BALANCE.remaining}
              </span>
              <span className="text-sm font-semibold text-white/70">
                {f.days}
              </span>
            </div>
            <p className="text-[11px] text-white/60 mt-1 leading-relaxed">
              {f.remainingLabel}
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-3">
            <div className="text-center">
              <div className="bg-white/15 rounded-lg px-2.5 py-1.5">
                <p className="text-[16px] font-black leading-none">{LEAVE_BALANCE.total}</p>
              </div>
              <p className="text-[10px] text-white/60 mt-1">{f.totalLabel}</p>
            </div>
            <div className="text-center">
              <div className="bg-white/15 rounded-lg px-2.5 py-1.5">
                <p className="text-[16px] font-black leading-none">{LEAVE_BALANCE.used}</p>
              </div>
              <p className="text-[10px] text-white/60 mt-1">{f.usedLabel}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 1: Request Details                                            */
/* ------------------------------------------------------------------ */

function Step1Details({
  data,
  errors,
  onChange,
  onNext,
}: {
  data: LeaveFormData;
  errors: Record<string, string>;
  onChange: (d: LeaveFormData) => void;
  onNext: () => void;
}) {
  const { t, locale } = useI18n();
  const f = t.annualLeaveForm as Record<string, string>;
  const common = t.common as Record<string, string>;
  const isRTL = locale === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDaysChange = (val: string) => {
    const sanitized = val.replace(/[^0-9]/g, '');
    onChange({ ...data, days: sanitized });
  };

  const handleStartDateChange = (val: string) => {
    onChange({ ...data, startDate: val });
    // Auto-calculate end date
    if (val && data.days && Number(data.days) > 0) {
      const start = new Date(val);
      const end = new Date(start);
      end.setDate(end.getDate() + Number(data.days) - 1);
      onChange({ ...data, startDate: val, endDate: end.toISOString().split('T')[0] });
    }
  };

  const handleAttachmentAdd = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).map((file) => ({ file, name: file.name }));
    onChange({
      ...data,
      attachments: [...data.attachments, ...newFiles].slice(0, 5),
    });
  };

  const removeAttachment = (index: number) => {
    const updated = [...data.attachments];
    updated.splice(index, 1);
    onChange({ ...data, attachments: updated });
  };

  const handleNext = () => {
    const newErrors: Record<string, string> = {};

    if (!data.reason.trim()) {
      newErrors.reason = f.reasonRequired;
    }

    if (!data.days || Number(data.days) === 0) {
      newErrors.days = f.daysRequired;
    } else if (Number(data.days) > LEAVE_BALANCE.remaining) {
      newErrors.days = f.daysExceeds;
    }

    if (!data.startDate) {
      newErrors.startDate = f.startDateRequired;
    }

    if (Object.keys(newErrors).length === 0) {
      onNext();
    } else {
      onChange({ ...data, _errors: newErrors } as LeaveFormData);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
      transition={{ duration: 0.3 }}
      className="px-5 pb-3 flex flex-col gap-3"
    >
      {/* Leave Balance Card */}
      <div className="relative">
        <LeaveBalanceCard />
      </div>

      {/* Leave Reason */}
      <div>
        <label className="text-[15px] font-bold text-gray-900 mb-2 block">
          {f.reason}
        </label>
        <textarea
          value={data.reason}
          onChange={(e) => onChange({ ...data, reason: e.target.value })}
          placeholder={f.reasonPlaceholder}
          rows={3}
          className={`w-full px-3 py-3 bg-gray-50 border rounded-xl text-[15px] text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF]/40 resize-none leading-relaxed ${
            errors.reason ? 'border-red-400 bg-red-50/50' : 'border-gray-200'
          }`}
        />
        {errors.reason && (
          <p className="text-[13px] text-red-500 mt-0.5 ps-0.5 font-medium">{errors.reason}</p>
        )}
      </div>

      {/* Number of Leave Days */}
      <div>
        <label className="text-[15px] font-bold text-gray-900 mb-2 block">
          {f.days}
        </label>
        <div className="relative">
          <CalendarDays className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            inputMode="numeric"
            value={data.days}
            onChange={(e) => {
              handleDaysChange(e.target.value);
              // Recalculate end date if start date exists
              if (data.startDate) {
                const sanitized = e.target.value.replace(/[^0-9]/g, '');
                if (sanitized && Number(sanitized) > 0) {
                  const start = new Date(data.startDate);
                  const end = new Date(start);
                  end.setDate(end.getDate() + Number(sanitized) - 1);
                  onChange({
                    ...data,
                    days: sanitized,
                    endDate: end.toISOString().split('T')[0],
                  });
                }
              }
            }}
            placeholder={f.daysPlaceholder}
            className={`w-full ps-9 pe-14 py-1 bg-gray-50 border rounded-xl text-[15px] text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF]/40 transition-all ${
              errors.days ? 'border-red-400 bg-red-50/50' : 'border-gray-200'
            }`}
          />
          <span className="absolute end-3 top-1/2 -translate-y-1/2 text-[13px] font-bold text-gray-500">
            {f.days}
          </span>
        </div>
        {errors.days && (
          <p className="text-[13px] text-red-500 mt-0.5 ps-0.5 font-medium">{errors.days}</p>
        )}
      </div>

      {/* Start Date */}
      <div>
        <label className="text-[15px] font-bold text-gray-900 mb-2 block">
          {f.startDate}
        </label>
        <div className="relative">
          <CalendarRange className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="date"
            value={data.startDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
            className={`w-full ps-9 pe-3 py-1 bg-gray-50 border rounded-xl text-[15px] text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF]/40 transition-all ${
              errors.startDate ? 'border-red-400 bg-red-50/50' : 'border-gray-200'
            }`}
          />
        </div>
        {errors.startDate && (
          <p className="text-[13px] text-red-500 mt-0.5 ps-0.5 font-medium">{errors.startDate}</p>
        )}
      </div>

      {/* End Date (auto-calculated) */}
      <div>
        <label className="text-[15px] font-bold text-gray-900 mb-2 block">
          {f.endDate}
        </label>
        <div className="relative">
          <CalendarRange className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="date"
            value={data.endDate}
            readOnly
            className="w-full ps-9 pe-3 py-1 bg-gray-100 border border-gray-200 rounded-xl text-[15px] text-gray-500 cursor-not-allowed"
          />
          <span className="absolute end-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 bg-white/80 px-1.5 py-0.5 rounded">
            {f.autoCalculated}
          </span>
        </div>
      </div>

      {/* Contact During Leave (Optional) */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Phone className="w-3.5 h-3.5 text-gray-400" />
          <label className="text-[15px] font-bold text-gray-900">
            {f.contactDuringLeave}
          </label>
          <span className="text-[11px] text-gray-400 font-medium">({f.optional})</span>
        </div>
        <input
          type="text"
          value={data.contactDuringLeave}
          onChange={(e) => onChange({ ...data, contactDuringLeave: e.target.value })}
          placeholder={f.contactDuringLeavePlaceholder}
          className="w-full px-3 py-1 bg-gray-50 border border-gray-200 rounded-xl text-[15px] text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF]/40 transition-all"
        />
      </div>

      {/* Separator */}
      <div className="border-t border-gray-100" />

      {/* Attachments (Optional) */}
      <div>
        <div className="flex items-center gap-1.5 mb-1.5">
          <Paperclip className="w-3.5 h-3.5 text-gray-400" />
          <p className="text-[15px] font-bold text-gray-900">{f.attachments}</p>
          <span className="text-[11px] text-gray-400 font-medium">({f.optional})</span>
        </div>
        <p className="text-[13px] text-gray-500 mb-2">{f.attachmentsHint}</p>

        {data.attachments.length > 0 && (
          <div className="flex flex-col gap-1.5 mb-2">
            {data.attachments.map((att, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="text-[13px] text-gray-600 flex-1 truncate">
                  {att.name}
                </span>
                <button type="button" onClick={() => removeAttachment(idx)}>
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        )}

        {data.attachments.length < 5 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-1.5 border border-dashed border-gray-200 rounded-lg flex items-center justify-center gap-1.5 text-[12px] text-gray-400 hover:border-[#007AFF] hover:text-[#007AFF] transition-colors"
          >
            <Upload className="w-4 h-4" />
            {f.addAttachment}
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
          multiple
          onChange={(e) => handleAttachmentAdd(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Next Button */}
      <button
        type="button"
        onClick={handleNext}
        className="w-full py-3.5 bg-[#007AFF] hover:bg-[#0066DD] text-white font-bold rounded-xl text-[15px] flex items-center justify-center gap-2 shadow-md shadow-[#007AFF]/20 active:scale-[0.98] transition-all"
      >
        {common.next}
        <ArrowIcon className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 2: Review & Submit                                            */
/* ------------------------------------------------------------------ */

function Step2Review({
  data,
  onBack,
  onSubmit,
}: {
  data: LeaveFormData;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const { t, locale } = useI18n();
  const f = t.annualLeaveForm as Record<string, string>;
  const common = t.common as Record<string, string>;
  const isRTL = locale === 'ar';
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    onSubmit();
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale === 'ar' ? 'ar-SA' : locale === 'hi' ? 'hi-IN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Calculate leave period
  const getLeavePeriod = () => {
    if (!data.startDate || !data.endDate) return '';
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return `${formatDate(data.startDate)} — ${formatDate(data.endDate)} (${diffDays} ${f.days})`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
      transition={{ duration: 0.3 }}
      className="px-5 pb-3 flex flex-col gap-3"
    >
      {/* Review Header */}
      <div className="text-center">
        <p className="text-[17px] font-bold text-gray-900">{f.reviewTitle}</p>
        <p className="text-[15px] text-gray-500">{f.reviewSubtitle}</p>
      </div>

      {/* Leave Details */}
      <div className="bg-gray-50 rounded-xl p-3">
        <p className="text-[15px] font-bold text-[#007AFF] mb-3">
          {f.detailsSection}
        </p>
        <div className="flex flex-col gap-2">
          <ReviewItem label={f.reason} value={data.reason} />
          <ReviewItem
            label={f.days}
            value={`${data.days} ${f.days}`}
            highlight
          />
          <ReviewItem
            label={f.leavePeriod}
            value={getLeavePeriod()}
          />
          {data.contactDuringLeave && (
            <ReviewItem label={f.contactDuringLeave} value={data.contactDuringLeave} />
          )}
        </div>
      </div>

      {/* Attachments */}
      {data.attachments.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-[15px] font-bold text-[#007AFF] mb-3">
            {f.attachmentsSection}
          </p>
          <ReviewItem
            label={f.attachmentsSection}
            value={`${data.attachments.length} ${f.attachmentsCount}`}
          />
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-[15px] flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        >
          {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          {common.back}
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 py-3 bg-[#007AFF] hover:bg-[#0066DD] disabled:bg-gray-300 text-white font-bold rounded-xl text-[15px] flex items-center justify-center gap-2 shadow-md shadow-[#007AFF]/20 active:scale-[0.98] transition-all"
        >
          {isSubmitting ? (
            <motion.div
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
          ) : (
            <>
              <Upload className="w-4 h-4" />
              {f.submit}
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Review Item Helper                                                 */
/* ------------------------------------------------------------------ */

function ReviewItem({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      {label && <p className="text-[13px] font-bold text-gray-900">{label}</p>}
      <p
        className={`text-[15px] font-medium ${
          highlight ? 'text-teal-600' : 'text-gray-800'
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Success Screen                                                     */
/* ------------------------------------------------------------------ */

function SuccessScreen() {
  const { t } = useI18n();
  const f = t.annualLeaveForm as Record<string, string>;
  const { setActiveServiceForm } = useAppStore();
  const requestNum = useMemo(
    () => `LV-${Date.now().toString().slice(-6)}`,
    [],
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center px-6 py-10"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-5"
      >
        <CheckCircle2 className="w-10 h-10 text-green-600" />
      </motion.div>
      <h2 className="text-[20px] font-bold text-gray-900 mb-1">{f.successTitle}</h2>
      <p className="text-[15px] text-gray-500 text-center leading-relaxed mb-4">
        {f.successMessage}
      </p>
      <div className="bg-gray-50 rounded-lg px-5 py-3 mb-6">
        <p className="text-[13px] text-gray-500">{f.requestNumber}</p>
        <p className="text-[17px] font-bold text-[#007AFF]">{requestNum}</p>
      </div>
      <button
        type="button"
        onClick={() => setActiveServiceForm(null)}
        className="w-full py-3.5 bg-[#007AFF] hover:bg-[#0066DD] text-white font-bold rounded-xl text-[15px] shadow-md shadow-[#007AFF]/20 active:scale-[0.98] transition-all"
      >
        {f.backToServices}
      </button>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function AnnualLeaveRequest() {
  const { t, locale } = useI18n();
  const { setActiveServiceForm } = useAppStore();
  const common = t.common as Record<string, string>;
  const isRTL = locale === 'ar';

  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState<LeaveFormData>({
    reason: '',
    days: '',
    startDate: '',
    endDate: '',
    contactDuringLeave: '',
    notes: '',
    attachments: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
  };

  const handleBackToServices = () => {
    setActiveServiceForm(null);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else setActiveServiceForm(null);
  };

  const handleSubmitDone = () => {
    setShowSuccess(true);
  };

  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="flex flex-col h-screen bg-[#F8F9FA]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white shrink-0">
        <div className="flex-1">
          <h1 className="text-[17px] font-bold text-gray-900">
            {t.services.serviceAnnualLeave as string}
          </h1>
          <p className="text-[13px] text-gray-500">
            {t.services.serviceAnnualLeaveDesc as string}
          </p>
        </div>
      </div>

      {showSuccess ? (
        <div className="flex-1 flex items-center justify-center">
          <SuccessScreen />
        </div>
      ) : (
        <>
          {/* Back to Services Button */}
          <button
            type="button"
            onClick={handleBackToServices}
            className="flex items-center gap-2 px-5 pt-3 pb-2 text-[14px] text-[#007AFF] font-semibold hover:text-[#0066DD] transition-colors self-start"
          >
            <BackArrow className="w-4 h-4" />
            {common.back}
          </button>

          {/* Form Card */}
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.06)]">
              {/* Progress Bar as Card Title */}
              <div className="px-5 py-3 border-b border-gray-100 bg-gradient-to-b from-gray-50/80 to-white rounded-t-2xl">
                <ProgressBar currentStep={step} />
              </div>

              <div className="overflow-y-auto pt-3">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <Step1Details
                      key="step1"
                      data={formData}
                      errors={errors}
                      onChange={(d) => {
                        setFormData(d);
                        setErrors({});
                      }}
                      onNext={handleNext}
                    />
                  )}
                  {step === 2 && (
                    <Step2Review
                      key="step2"
                      data={formData}
                      onBack={handleBack}
                      onSubmit={handleSubmitDone}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
