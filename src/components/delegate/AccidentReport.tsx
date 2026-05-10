'use client';

import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Plus,
  Upload,
  X,
  Check,
  ChevronDown,
  CalendarDays,
  Clock,
  MapPin,
  FileText,
  User,
  Briefcase,
  AlertCircle,
  FileUp,
  StickyNote,
  CheckCircle2,
  ShieldCheck,
  Paperclip,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useAppStore } from '@/lib/store';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface AccidentFormData {
  accidentDate: string;
  accidentTime: string;
  location: string;
  accidentType: string;
  description: string;
  photos: { file: File; preview: string }[];
  najmReport: { file: File; name: string } | null;
  additionalAttachments: { file: File; name: string }[];
  notes: string;
}

/* ------------------------------------------------------------------ */
/*  Progress Bar                                                       */
/* ------------------------------------------------------------------ */

function ProgressBar({ currentStep }: { currentStep: number }) {
  const { t } = useI18n();
  const f = t.accidentForm as Record<string, string>;

  const steps = [
    { label: f.step1, short: '1' },
    { label: f.step2, short: '2' },
    { label: f.step3, short: '3' },
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
/*  Step 1: Accident Data                                              */
/* ------------------------------------------------------------------ */

function Step1({
  data,
  onChange,
  onNext,
}: {
  data: AccidentFormData;
  onChange: (d: AccidentFormData) => void;
  onNext: () => void;
}) {
  const { t, locale } = useI18n();
  const f = t.accidentForm as Record<string, string>;
  const { user } = useAppStore();
  const common = t.common as Record<string, string>;
  const [typeOpen, setTypeOpen] = useState(false);
  const typeRef = useRef<HTMLDivElement>(null);

  const accidentTypes = [
    f.typeCollision,
    f.typeRunOffRoad,
    f.typePedestrian,
    f.typeFire,
    f.typeRollover,
    f.typeScratch,
    f.typeFixedObstacle,
    f.typeOther,
  ];

  const isRTL = locale === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <motion.div
      initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
      transition={{ duration: 0.3 }}
      className="px-5 pb-3 flex flex-col gap-3"
    >
      {/* Employee Card */}
      <div className="bg-gradient-to-r from-[#007AFF]/5 to-transparent rounded-xl p-3 border border-[#007AFF]/10">
        <p className="text-[15px] font-bold text-[#007AFF] mb-3">{f.employeeInfo}</p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#007AFF] flex items-center justify-center text-white font-bold text-sm shrink-0">
            {user?.name?.charAt(0) || 'م'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[16px] font-bold text-gray-900 truncate">
              {user?.name || 'المندوب'}
            </p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[13px] text-gray-500 flex items-center gap-1">
                <User className="w-3.5 h-3.5" />#{user?.nationalId || '—'}
              </span>
              <span className="text-[13px] text-gray-500 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5" />
                {f.jobTitle}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Date + Time Row */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-[15px] font-bold text-gray-900 mb-2 block">
            {f.accidentDate}
          </label>
          <div className="relative">
            <CalendarDays className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={data.accidentDate}
              onChange={(e) => onChange({ ...data, accidentDate: e.target.value })}
              className="w-full ps-9 pe-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[15px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF]/40"
            />
          </div>
        </div>
        <div className="flex-1">
          <label className="text-[15px] font-bold text-gray-900 mb-2 block">
            {f.accidentTime}
          </label>
          <div className="relative">
            <Clock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="time"
              value={data.accidentTime}
              onChange={(e) => onChange({ ...data, accidentTime: e.target.value })}
              className="w-full ps-9 pe-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[15px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF]/40"
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="text-[15px] font-bold text-gray-900 mb-2 block">{f.location}</label>
        <div className="relative">
          <MapPin className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={data.location}
            onChange={(e) => onChange({ ...data, location: e.target.value })}
            placeholder={f.locationPlaceholder}
            className="w-full ps-9 pe-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[15px] text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF]/40"
          />
        </div>
      </div>

      {/* Accident Type */}
      <div ref={typeRef}>
        <label className="text-[15px] font-bold text-gray-900 mb-2 block">
          {f.accidentType}
        </label>
        <div className="relative">
          <AlertCircle className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <button
            type="button"
            onClick={() => setTypeOpen(!typeOpen)}
            className="w-full ps-9 pe-9 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[15px] text-start focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF]/40"
          >
            <span className={data.accidentType ? 'text-gray-900' : 'text-gray-400'}>
              {data.accidentType || f.accidentTypePlaceholder}
            </span>
          </button>
          <ChevronDown
            className={`absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform ${
              typeOpen ? 'rotate-180' : ''
            }`}
          />
          <AnimatePresence>
            {typeOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute top-full mt-1 start-0 end-0 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-30 max-h-36 overflow-y-auto no-scrollbar"
              >
                {accidentTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      onChange({ ...data, accidentType: type });
                      setTypeOpen(false);
                    }}
                    className={`w-full px-3 py-2.5 text-[15px] text-start transition-colors ${
                      data.accidentType === type
                        ? 'bg-[#007AFF]/5 text-[#007AFF] font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="text-[15px] font-bold text-gray-900 mb-2 block">{f.description}</label>
        <textarea
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          placeholder={f.descriptionPlaceholder}
          rows={2}
          className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[15px] text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF]/40 resize-none leading-relaxed"
        />
      </div>

      {/* Next Button */}
      <button
        type="button"
        onClick={onNext}
        className="w-full py-3.5 bg-[#007AFF] hover:bg-[#0066DD] text-white font-bold rounded-xl text-[15px] flex items-center justify-center gap-2 shadow-md shadow-[#007AFF]/20 active:scale-[0.98] transition-all"
      >
        {common.next}
        <ArrowIcon className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 2: Attachments                                                */
/* ------------------------------------------------------------------ */

function Step2({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: AccidentFormData;
  onChange: (d: AccidentFormData) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const { t, locale } = useI18n();
  const f = t.accidentForm as Record<string, string>;
  const common = t.common as Record<string, string>;
  const isRTL = locale === 'ar';

  const photoInputRef = useRef<HTMLInputElement>(null);
  const najmInputRef = useRef<HTMLInputElement>(null);
  const additionalInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoAdd = (files: FileList | null) => {
    if (!files) return;
    const newPhotos = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .slice(0, 5 - data.photos.length)
      .map((file) => ({ file, preview: URL.createObjectURL(file) }));
    onChange({ ...data, photos: [...data.photos, ...newPhotos] });
  };

  const removePhoto = (index: number) => {
    URL.revokeObjectURL(data.photos[index].preview);
    const updated = [...data.photos];
    updated.splice(index, 1);
    onChange({ ...data, photos: updated });
  };

  const handleNajm = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    onChange({ ...data, najmReport: { file, name: file.name } });
  };

  const handleAdditional = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).map((file) => ({ file, name: file.name }));
    onChange({
      ...data,
      additionalAttachments: [...data.additionalAttachments, ...newFiles],
    });
  };

  const removeAdditional = (index: number) => {
    const updated = [...data.additionalAttachments];
    updated.splice(index, 1);
    onChange({ ...data, additionalAttachments: updated });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
      transition={{ duration: 0.3 }}
      className="px-5 pb-3 flex flex-col gap-3"
    >
      {/* Photos */}
      <div>
        <div className="flex items-center gap-1.5 mb-1.5">
          <Camera className="w-4 h-4 text-[#007AFF]" />
          <p className="text-[15px] font-bold text-gray-900">{f.photosTitle}</p>
        </div>
        <p className="text-[13px] text-gray-500 mb-2">{f.photosHint}</p>
        <div className="flex gap-2 flex-wrap">
          {data.photos.map((photo, idx) => (
            <div key={idx} className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-200">
              <img src={photo.preview} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(idx)}
                className="absolute top-0.5 end-0.5 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
          {data.photos.length < 5 && (
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="w-14 h-14 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-0.5 hover:border-[#007AFF] hover:bg-[#007AFF]/5 transition-colors"
            >
              <Plus className="w-4 h-4 text-gray-400" />
              <span className="text-[11px] text-gray-500">
                {data.photos.length}/5
              </span>
            </button>
          )}
        </div>
        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handlePhotoAdd(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Separator */}
      <div className="border-t border-gray-100" />

      {/* Najm Report */}
      <div>
        <div className="flex items-center gap-1.5 mb-1.5">
          <ShieldCheck className="w-4 h-4 text-[#007AFF]" />
          <p className="text-[15px] font-bold text-gray-900">{f.najmTitle}</p>
        </div>
        <p className="text-[13px] text-gray-500 mb-2">{f.najmHint}</p>
        {data.najmReport ? (
          <div className="flex items-center gap-2 p-2.5 bg-green-50 border border-green-200 rounded-lg">
            <FileUp className="w-4 h-4 text-green-600 shrink-0" />
            <span className="text-[13px] text-green-700 font-medium flex-1 truncate">
              {data.najmReport.name}
            </span>
            <button
              type="button"
              onClick={() => onChange({ ...data, najmReport: null })}
            >
              <X className="w-4 h-4 text-green-500" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => najmInputRef.current?.click()}
            className="w-full py-1.5 border border-dashed border-gray-300 rounded-lg flex items-center justify-center gap-1.5 text-[12px] text-gray-500 hover:border-[#007AFF] hover:text-[#007AFF] hover:bg-[#007AFF]/5 transition-colors"
          >
            <Upload className="w-4 h-4" />
            {f.uploadFile}
          </button>
        )}
        <input
          ref={najmInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={(e) => handleNajm(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Separator */}
      <div className="border-t border-gray-100" />

      {/* Additional Attachments */}
      <div>
        <div className="flex items-center gap-1.5 mb-1.5">
          <Paperclip className="w-3.5 h-3.5 text-gray-400" />
          <p className="text-[15px] font-bold text-gray-900">{f.additionalTitle}</p>
        </div>
        <p className="text-[13px] text-gray-500 mb-2">{f.additionalHint}</p>
        {data.additionalAttachments.length > 0 && (
          <div className="flex flex-col gap-1.5 mb-2">
            {data.additionalAttachments.map((att, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="text-[12px] text-gray-600 flex-1 truncate">
                  {att.name}
                </span>
                <button type="button" onClick={() => removeAdditional(idx)}>
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={() => additionalInputRef.current?.click()}
          className="w-full py-1.5 border border-dashed border-gray-200 rounded-lg flex items-center justify-center gap-1.5 text-[12px] text-gray-400 hover:border-[#007AFF] hover:text-[#007AFF] transition-colors"
        >
          <Plus className="w-4 h-4" />
          {f.addPhoto}
        </button>
        <input
          ref={additionalInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx,.ppt,.pptx,.zip,.rar"
          multiple
          onChange={(e) => handleAdditional(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Separator */}
      <div className="border-t border-gray-100" />

      {/* Notes */}
      <div>
        <div className="flex items-center gap-1.5 mb-1.5">
          <StickyNote className="w-3.5 h-3.5 text-gray-400" />
          <p className="text-[15px] font-bold text-gray-900">{f.notesTitle}</p>
        </div>
        <textarea
          value={data.notes}
          onChange={(e) => onChange({ ...data, notes: e.target.value })}
          placeholder={f.notesPlaceholder}
          rows={2}
          className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[15px] text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF]/40 resize-none"
        />
      </div>

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
          onClick={onNext}
          className="flex-1 py-3 bg-[#007AFF] hover:bg-[#0066DD] text-white font-bold rounded-xl text-[15px] flex items-center justify-center gap-2 shadow-md shadow-[#007AFF]/20 active:scale-[0.98] transition-all"
        >
          {common.next}
          {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 3: Review & Submit                                            */
/* ------------------------------------------------------------------ */

function Step3({
  data,
  onBack,
  onSubmit,
}: {
  data: AccidentFormData;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const { t, locale } = useI18n();
  const f = t.accidentForm as Record<string, string>;
  const common = t.common as Record<string, string>;
  const { user } = useAppStore();
  const isRTL = locale === 'ar';
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    onSubmit();
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

      {/* Accident Data */}
      <div className="bg-gray-50 rounded-xl p-3">
        <p className="text-[15px] font-bold text-[#007AFF] mb-3">
          {f.accidentDataSection}
        </p>
        <div className="grid grid-cols-2 gap-y-2 gap-x-3">
          <ReviewItem label={f.employeeInfo} value={user?.name || '—'} />
          <ReviewItem label="" value={`#${user?.nationalId || '—'}`} />
          <ReviewItem label={f.accidentDate} value={data.accidentDate || '—'} />
          <ReviewItem label={f.accidentTime} value={data.accidentTime || '—'} />
          <ReviewItem label={f.location} value={data.location || '—'} />
          <ReviewItem label={f.accidentType} value={data.accidentType || '—'} />
        </div>
        {data.description && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-[13px] text-gray-500 mb-0.5">{f.description}</p>
            <p className="text-[15px] text-gray-800 leading-relaxed">
              {data.description}
            </p>
          </div>
        )}
      </div>

      {/* Attachments */}
      <div className="bg-gray-50 rounded-xl p-3">
        <p className="text-[15px] font-bold text-[#007AFF] mb-3">
          {f.attachmentsSection}
        </p>
        <div className="flex flex-col gap-1.5">
          <ReviewItem
            label={f.photosTitle}
            value={`${data.photos.length} ${f.photosCount}`}
          />
          <ReviewItem
            label={f.najmTitle}
            value={data.najmReport ? f.najmAttached : f.najmNotAttached}
            highlight={!data.najmReport}
          />
          {data.additionalAttachments.length > 0 && (
            <ReviewItem
              label={f.additionalTitle}
              value={`${data.additionalAttachments.length} ${f.attachmentsCount}`}
            />
          )}
          {data.notes && <ReviewItem label={f.notesTitle} value={data.notes} />}
        </div>
      </div>

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
      {label && <p className="text-[13px] font-bold text-gray-500">{label}</p>}
      <p
        className={`text-[15px] font-medium ${
          highlight ? 'text-amber-600' : 'text-gray-900'
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
  const f = t.accidentForm as Record<string, string>;
  const { setActiveServiceForm } = useAppStore();
  const requestNum = useMemo(
    () => `ACC-${Date.now().toString().slice(-6)}`,
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
/*  Main Component                                                    */
/* ------------------------------------------------------------------ */

export function AccidentReport() {
  const { t, locale } = useI18n();
  const { setActiveServiceForm } = useAppStore();
  const common = t.common as Record<string, string>;
  const isRTL = locale === 'ar';

  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState<AccidentFormData>({
    accidentDate: '',
    accidentTime: '',
    location: '',
    accidentType: '',
    description: '',
    photos: [],
    najmReport: null,
    additionalAttachments: [],
    notes: '',
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
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
            تسجيل واقعة حادث
          </h1>
          <p className="text-[13px] text-gray-500">
            {t.services.serviceAccident as string}
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
                    <Step1
                      key="step1"
                      data={formData}
                      onChange={setFormData}
                      onNext={handleNext}
                    />
                  )}
                  {step === 2 && (
                    <Step2
                      key="step2"
                      data={formData}
                      onChange={setFormData}
                      onNext={handleNext}
                      onBack={handleBack}
                    />
                  )}
                  {step === 3 && (
                    <Step3
                      key="step3"
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
