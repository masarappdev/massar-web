'use client';

import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  X,
  Check,
  ChevronDown,
  Banknote,
  Building2,
  Landmark,
  Wallet,
  StickyNote,
  Paperclip,
  FileText,
  CheckCircle2,
  CircleDollarSign,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useAppStore } from '@/lib/store';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface BankAccount {
  id: string;
  bankName: string;
  accountName: string;
  iban: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface AdvanceFormData {
  amount: string;
  reason: string;
  receiveMethod: 'bank' | 'cash' | '';
  bankAccountId: string;
  notes: string;
  attachments: { file: File; name: string }[];
}

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const AVAILABLE_ADVANCE = 5000;

const bankAccounts: BankAccount[] = [
  {
    id: 'salary-account',
    bankName: 'Al Rajhi Bank',
    accountName: 'حساب الراتب',
    iban: 'SA0380000000608010167519',
    icon: Landmark,
  },
  {
    id: 'savings-account',
    bankName: 'Al Ahli Bank',
    accountName: 'حساب التوفير',
    iban: 'SA6610000000000000001234',
    icon: Building2,
  },
  {
    id: 'current-account',
    bankName: 'Riyad Bank',
    accountName: 'حساب جاري',
    iban: 'SA4430000000000000005678',
    icon: Wallet,
  },
];

/* ------------------------------------------------------------------ */
/*  Progress Bar                                                       */
/* ------------------------------------------------------------------ */

function ProgressBar({ currentStep }: { currentStep: number }) {
  const { t } = useI18n();
  const f = t.advanceForm as Record<string, string>;

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
/*  Available Advance Card                                             */
/* ------------------------------------------------------------------ */

function AvailableAdvanceCard() {
  const { t } = useI18n();
  const f = t.advanceForm as Record<string, string>;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 text-white shadow-lg shadow-emerald-500/25"
    >
      {/* Decorative circles */}
      <div className="absolute top-0 end-0 w-24 h-24 rounded-full bg-white/5 -translate-y-8 translate-x-8" />
      <div className="absolute bottom-0 start-0 w-16 h-16 rounded-full bg-white/5 translate-y-6 -translate-x-6" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <CircleDollarSign className="w-4.5 h-4.5" />
          </div>
          <span className="text-[12px] font-medium text-white/80">
            {f.availableAdvance}
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-[2rem] font-black leading-none">
            {AVAILABLE_ADVANCE.toLocaleString()}
          </span>
          <span className="text-sm font-semibold text-white/70">
            {f.currency}
          </span>
        </div>
        <p className="text-[11px] text-white/60 mt-1.5 leading-relaxed">
          {f.availableAdvanceDesc}
        </p>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 1: Advance Details                                            */
/* ------------------------------------------------------------------ */

function Step1({
  data,
  errors,
  onChange,
  onNext,
}: {
  data: AdvanceFormData;
  errors: Record<string, string>;
  onChange: (d: AdvanceFormData) => void;
  onNext: () => void;
}) {
  const { t, locale } = useI18n();
  const f = t.advanceForm as Record<string, string>;
  const common = t.common as Record<string, string>;
  const isRTL = locale === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const [bankOpen, setBankOpen] = useState(false);
  const bankRef = useRef<HTMLDivElement>(null);
  const additionalInputRef = useRef<HTMLInputElement>(null);

  const selectedBank = bankAccounts.find((a) => a.id === data.bankAccountId);

  const handleAmountChange = (val: string) => {
    const sanitized = val.replace(/[^0-9]/g, '');
    onChange({ ...data, amount: sanitized });
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

    if (!data.amount || Number(data.amount) === 0) {
      newErrors.amount = f.amountRequired;
    } else if (Number(data.amount) < 100) {
      newErrors.amount = f.amountMin;
    } else if (Number(data.amount) > AVAILABLE_ADVANCE) {
      newErrors.amount = f.amountMax;
    }

    if (!data.reason.trim()) {
      newErrors.reason = f.reasonRequired;
    }

    if (!data.receiveMethod) {
      newErrors.receiveMethod = f.methodRequired;
    }

    if (data.receiveMethod === 'bank' && !data.bankAccountId) {
      newErrors.bankAccountId = f.bankRequired;
    }

    if (Object.keys(newErrors).length === 0) {
      onNext();
    } else {
      onChange({ ...data, _errors: newErrors } as AdvanceFormData);
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
      {/* Available Advance Card */}
      <div className="relative">
        <AvailableAdvanceCard />
      </div>

      {/* Amount */}
      <div>
        <label className="text-[15px] font-bold text-gray-900 mb-2 block">
          {f.amount}
        </label>
        <div className="relative">
          <Banknote className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            inputMode="numeric"
            value={data.amount ? Number(data.amount).toLocaleString() : ''}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder={f.amountPlaceholder}
            className={`w-full ps-9 pe-16 bg-gray-50 border rounded-xl text-[15px] text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF]/40 transition-all ${
              errors.amount ? 'border-red-400 bg-red-50/50' : 'border-gray-200'
            }`}
          />
          <span className="absolute end-3 top-1/2 -translate-y-1/2 text-[13px] font-bold text-gray-500">
            {f.currency}
          </span>
        </div>
        <p className="text-[13px] text-gray-500 mt-1 ps-0.5">
          {f.amountHint} {AVAILABLE_ADVANCE.toLocaleString()} {f.currency}
        </p>
        {errors.amount && (
          <p className="text-[13px] text-red-500 mt-0.5 ps-0.5 font-medium">{errors.amount}</p>
        )}
      </div>

      {/* Reason */}
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

      {/* Receive Method - Inline Radio Buttons */}
      <div>
        <label className="text-[15px] font-bold text-gray-900 mb-2 block">
          {f.receiveMethod}
        </label>
        <div className="flex items-center gap-0">
          {/* Bank Transfer Option */}
          <button
            type="button"
            onClick={() => onChange({ ...data, receiveMethod: 'bank', bankAccountId: '' })}
            className={`flex items-center gap-1.5 py-1.5 px-0 transition-colors duration-200 ${
              data.receiveMethod === 'bank' ? 'text-[#007AFF]' : 'text-gray-500'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 shrink-0 ${
                data.receiveMethod === 'bank'
                  ? 'border-[#007AFF]'
                  : 'border-gray-300'
              }`}
            >
              {data.receiveMethod === 'bank' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="w-2 h-2 rounded-full bg-[#007AFF]"
                />
              )}
            </div>
            <span className="text-[13px] font-medium">{f.receiveMethodBank}</span>
          </button>

          {/* Divider */}
          <span className="text-gray-300 mx-3 text-[13px]">|</span>

          {/* Cash Option */}
          <button
            type="button"
            onClick={() => onChange({ ...data, receiveMethod: 'cash', bankAccountId: '' })}
            className={`flex items-center gap-1.5 py-1.5 px-0 transition-colors duration-200 ${
              data.receiveMethod === 'cash' ? 'text-[#007AFF]' : 'text-gray-500'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 shrink-0 ${
                data.receiveMethod === 'cash'
                  ? 'border-[#007AFF]'
                  : 'border-gray-300'
              }`}
            >
              {data.receiveMethod === 'cash' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="w-2 h-2 rounded-full bg-[#007AFF]"
                />
              )}
            </div>
            <span className="text-[13px] font-medium">{f.receiveMethodCash}</span>
          </button>
        </div>
        {errors.receiveMethod && (
          <p className="text-[13px] text-red-500 mt-1 ps-0.5 font-medium">{errors.receiveMethod}</p>
        )}
      </div>

      {/* Bank Account Selection (Conditional) */}
      <AnimatePresence>
        {data.receiveMethod === 'bank' && (
          <motion.div
            ref={bankRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <label className="text-[15px] font-bold text-gray-900 mb-2 block">
              {f.selectBankAccount}
            </label>
            <div className="relative">
              <Landmark className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <button
                type="button"
                onClick={() => setBankOpen(!bankOpen)}
                className={`w-full ps-9 pe-9 py-3 bg-gray-50 border rounded-xl text-[15px] text-start focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF]/40 transition-all ${
                  errors.bankAccountId ? 'border-red-400 bg-red-50/50' : 'border-gray-200'
                }`}
              >
                <span className={selectedBank ? 'text-gray-900' : 'text-gray-400'}>
                  {selectedBank
                    ? `${selectedBank.accountName} - ${selectedBank.bankName}`
                    : f.selectBankAccountPlaceholder}
                </span>
              </button>
              <ChevronDown
                className={`absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform ${
                  bankOpen ? 'rotate-180' : ''
                }`}
              />

              <AnimatePresence>
                {bankOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full mt-1 start-0 end-0 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-30 max-h-48 overflow-y-auto no-scrollbar"
                  >
                    {bankAccounts.map((account) => {
                      const BankIcon = account.icon;
                      const isSelected = data.bankAccountId === account.id;
                      return (
                        <button
                          key={account.id}
                          type="button"
                          onClick={() => {
                            onChange({ ...data, bankAccountId: account.id });
                            setBankOpen(false);
                          }}
                          className={`w-full px-3 py-2.5 text-start transition-colors ${
                            isSelected
                              ? 'bg-[#007AFF]/5 text-[#007AFF]'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                              <BankIcon className="w-3.5 h-3.5 text-gray-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-[12px] font-semibold truncate ${isSelected ? 'text-[#007AFF]' : ''}`}>
                                {account.accountName}
                              </p>
                              <p className="text-[10px] text-gray-400 font-mono">
                                {account.iban.slice(0, 10)}...
                              </p>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#007AFF] shrink-0" />}
                          </div>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {errors.bankAccountId && (
              <p className="text-[13px] text-red-500 mt-0.5 ps-0.5 font-medium">{errors.bankAccountId}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

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
/*  Step 2: Additional Data                                            */
/* ------------------------------------------------------------------ */

function Step2Additional({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: AdvanceFormData;
  onChange: (d: AdvanceFormData) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const { t, locale } = useI18n();
  const f = t.advanceForm as Record<string, string>;
  const common = t.common as Record<string, string>;
  const isRTL = locale === 'ar';

  const additionalInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <motion.div
      initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
      transition={{ duration: 0.3 }}
      className="px-5 pb-3 flex flex-col gap-3"
    >
      {/* Additional Notes */}
      <div>
        <div className="flex items-center gap-1.5 mb-1.5">
          <StickyNote className="w-3.5 h-3.5 text-gray-400" />
          <p className="text-[15px] font-bold text-gray-900">{f.additionalNotes}</p>
        </div>
        <textarea
          value={data.notes}
          onChange={(e) => onChange({ ...data, notes: e.target.value })}
          placeholder={f.additionalNotesPlaceholder}
          rows={3}
          className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[15px] text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF]/40 resize-none leading-relaxed"
        />
      </div>

      {/* Separator */}
      <div className="border-t border-gray-100" />

      {/* Additional Attachments */}
      <div>
        <div className="flex items-center gap-1.5 mb-1.5">
          <Paperclip className="w-3.5 h-3.5 text-gray-400" />
          <p className="text-[15px] font-bold text-gray-900">{f.additionalAttachments}</p>
        </div>
        <p className="text-[13px] text-gray-500 mb-2">{f.additionalAttachmentsHint}</p>

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
            onClick={() => additionalInputRef.current?.click()}
            className="w-full py-1.5 border border-dashed border-gray-200 rounded-lg flex items-center justify-center gap-1.5 text-[12px] text-gray-400 hover:border-[#007AFF] hover:text-[#007AFF] transition-colors"
          >
            <Upload className="w-4 h-4" />
            {f.addAttachment}
          </button>
        )}
        <input
          ref={additionalInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
          multiple
          onChange={(e) => handleAttachmentAdd(e.target.files)}
          className="hidden"
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

function Step2({
  data,
  onBack,
  onSubmit,
}: {
  data: AdvanceFormData;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const { t, locale } = useI18n();
  const f = t.advanceForm as Record<string, string>;
  const common = t.common as Record<string, string>;
  const isRTL = locale === 'ar';
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedBank = bankAccounts.find((a) => a.id === data.bankAccountId);

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

      {/* Advance Details */}
      <div className="bg-gray-50 rounded-xl p-3">
        <p className="text-[15px] font-bold text-[#007AFF] mb-3">
          {f.detailsSection}
        </p>
        <div className="flex flex-col gap-2">
          <ReviewItem
            label={f.amount}
            value={`${Number(data.amount).toLocaleString()} ${f.currency}`}
            highlight
          />
          <ReviewItem label={f.reason} value={data.reason} />
          <ReviewItem
            label={f.receiveMethod}
            value={data.receiveMethod === 'bank' ? f.receiveMethodBank : f.receiveMethodCash}
          />
          {data.receiveMethod === 'bank' && selectedBank && (
            <div className="bg-white rounded-lg p-2.5 mt-1 border border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  {(() => {
                    const Icon = selectedBank.icon;
                    return <Icon className="w-4 h-4 text-blue-500" />;
                  })()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-gray-900">{selectedBank.accountName}</p>
                  <p className="text-[12px] text-gray-400 font-mono">{selectedBank.iban}</p>
                </div>
              </div>
            </div>
          )}
          {data.notes && <ReviewItem label={f.additionalNotes} value={data.notes} />}
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
      {label && <p className="text-[13px] font-bold text-gray-500">{label}</p>}
      <p
        className={`text-[15px] font-medium ${
          highlight ? 'text-emerald-600' : 'text-gray-800'
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
  const f = t.advanceForm as Record<string, string>;
  const { setActiveServiceForm } = useAppStore();
  const requestNum = useMemo(
    () => `ADV-${Date.now().toString().slice(-6)}`,
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

export function AdvanceRequest() {
  const { t, locale } = useI18n();
  const { setActiveServiceForm } = useAppStore();
  const common = t.common as Record<string, string>;
  const isRTL = locale === 'ar';

  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState<AdvanceFormData>({
    amount: '',
    reason: '',
    receiveMethod: '',
    bankAccountId: '',
    notes: '',
    attachments: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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
            {t.services.serviceAdvance as string}
          </h1>
          <p className="text-[13px] text-gray-500">
            {t.services.serviceAdvanceDesc as string}
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
                      errors={errors}
                      onChange={(d) => {
                        setFormData(d);
                        setErrors({});
                      }}
                      onNext={handleNext}
                    />
                  )}
                  {step === 2 && (
                    <Step2Additional
                      key="step2"
                      data={formData}
                      onChange={setFormData}
                      onNext={handleNext}
                      onBack={handleBack}
                    />
                  )}
                  {step === 3 && (
                    <Step2
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
