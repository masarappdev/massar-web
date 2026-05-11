'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  Truck,
  Users,
  Wallet,
  Plus,
  AlertTriangle,
  Wrench,
  RefreshCw,
  ChevronDown,
  Construction,
  ArrowDownUp,
  FileText,
  Calendar,
  LogOut,
  FileClock,
  Banknote,
  Receipt,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';
import { useAppStore } from '@/lib/store';
import { AccidentReport } from './AccidentReport';
import { AdvanceRequest } from './AdvanceRequest';
import { AnnualLeaveRequest } from './AnnualLeaveRequest';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ServiceItem {
  id: string;
  titleKey: string;
  descKey: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  image?: string;
}

interface ServiceSection {
  id: string;
  filterKey: string;
  titleKey: string;
  descKey: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  services: ServiceItem[];
}

/* ------------------------------------------------------------------ */
/*  Filter Chip                                                        */
/* ------------------------------------------------------------------ */

function FilterChip({
  label,
  active,
  onClick,
  icon: Icon,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold whitespace-nowrap
        transition-all duration-300 ease-out
        ${
          active
            ? 'bg-[#007AFF] text-white shadow-lg shadow-[#007AFF]/20 scale-[1.02]'
            : 'bg-white text-gray-500 border border-gray-200/80 hover:border-gray-300 hover:text-gray-700 active:scale-[0.97]'
        }
      `}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {label}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Service Row                                                        */
/* ------------------------------------------------------------------ */

function ServiceCard({
  service,
}: {
  service: ServiceItem;
}) {
  const { t } = useI18n();
  const svc = t.services as Record<string, string>;
  const Icon = service.icon;
  const { setActiveServiceForm } = useAppStore();

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="w-full bg-white rounded-xl p-3 flex flex-col items-stretch gap-2 shadow-sm"
    >
      {/* Row 1: Icon - start side (right in RTL, left in LTR) */}
      <div className="w-9 h-9 shrink-0 flex items-center justify-center self-start overflow-hidden">
        {service.image ? (
          <img src={service.image} alt="" className="w-full h-full object-contain" />
        ) : (
          <div className={`w-full h-full ${service.bg} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${service.color}`} />
          </div>
        )}
      </div>

      {/* Row 2: Title - start side (right in RTL, left in LTR) */}
      <p className="text-[11px] font-bold text-gray-700 leading-tight truncate text-start">
        {svc[service.titleKey]}
      </p>

      {/* Row 3: Request button - end side (left in RTL, right in LTR) */}
      <span
        className="text-[10px] text-[#007AFF] font-medium text-end flex items-center justify-end gap-0.5"
        onClick={(e) => {
          e.stopPropagation();
          if (service.id === 'accident') setActiveServiceForm('accident');
          if (service.id === 'advance') setActiveServiceForm('advance');
          if (service.id === 'annual-leave') setActiveServiceForm('annual-leave');
        }}
      >
        {svc.viewDetailsBtn}
        <Plus className="w-3 h-3" />
      </span>
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/*  Section Card (Collapsible)                                         */
/* ------------------------------------------------------------------ */

function SectionCard({
  section,
  locale,
  index,
  defaultOpen = true,
}: {
  section: ServiceSection;
  locale: Locale;
  index: number;
  defaultOpen?: boolean;
}) {
  const { t } = useI18n();
  const svc = t.services as Record<string, string>;
  const tabs = t.tabs as Record<string, string>;
  const SectionIcon = section.icon;
  const serviceCount = section.services.length;

  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="bg-white rounded-2xl overflow-hidden border border-gray-200"
      style={{
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
      }}
    >
      {/* Section Header (Clickable) - White background */}
      <div className="p-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center gap-3 py-2 active:bg-gray-50/60 transition-colors"
        >
          {/* Section Icon */}
          <div
            className={`w-9 h-9 shrink-0 rounded-xl ${section.bg} flex items-center justify-center`}
          >
            <SectionIcon className={`w-[16px] h-[16px] ${section.color}`} />
          </div>

          {/* Title & Description */}
          <div className="flex-1 min-w-0 text-start">
            <div className="flex items-center gap-2">
              <h3 className="text-[13px] font-black text-gray-900">
                {svc[section.titleKey]}
              </h3>
              {serviceCount > 0 && (
                <span className="text-[10px] font-bold text-[#007AFF] bg-[#007AFF]/8 px-2 py-0.5 rounded-full">
                  {serviceCount}
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
              {svc[section.descKey]}
            </p>
          </div>

          {/* Expand / Collapse Icon */}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="w-7 h-7 shrink-0 rounded-full bg-gray-100/80 flex items-center justify-center"
          >
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </motion.div>
        </button>
      </div>

      {/* Collapsible Content - Gray background */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            {serviceCount > 0 ? (
              <div className="bg-gray-50 py-2 px-2 grid grid-cols-2 gap-2 rounded-b-2xl">
                {section.services.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 px-4 pb-4 pt-2 rounded-b-2xl">
                <div className="flex items-center gap-2.5 py-3 px-3 rounded-xl bg-white">
                  <Construction className="w-4 h-4 text-gray-300 shrink-0" />
                  <p className="text-[11px] text-gray-400 font-medium">
                    {tabs.comingSoon}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Tab                                                           */
/* ------------------------------------------------------------------ */

export function ServicesTab() {
  const { t, locale } = useI18n();
  const svc = t.services as Record<string, string>;
  const { activeServiceForm } = useAppStore();

  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  /* Filters */
  const filters = [
    { key: 'all', label: svc.filterAll, icon: ArrowDownUp },
    { key: 'fleet', label: svc.filterFleet, icon: Truck },
    { key: 'hr', label: svc.filterHR, icon: Users },
    { key: 'finance', label: svc.filterFinance, icon: Wallet },
  ];

  /* Sections data */
  const sections: ServiceSection[] = [
    {
      id: 'fleet',
      filterKey: 'fleet',
      titleKey: 'fleetTitle',
      descKey: 'fleetDesc',
      icon: Truck,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      services: [
        {
          id: 'accident',
          titleKey: 'serviceAccident',
          descKey: 'serviceAccidentDesc',
          icon: AlertTriangle,
          color: 'text-red-500',
          bg: 'bg-red-50',
          image: '/icons/services/accident.png',
        },
        {
          id: 'maintenance',
          titleKey: 'serviceMaintenance',
          descKey: 'serviceMaintenanceDesc',
          icon: Wrench,
          color: 'text-amber-500',
          bg: 'bg-amber-50',
          image: '/icons/services/maintenance.png',
        },
        {
          id: 'replacement',
          titleKey: 'serviceReplacement',
          descKey: 'serviceReplacementDesc',
          icon: RefreshCw,
          color: 'text-emerald-500',
          bg: 'bg-emerald-50',
          image: '/icons/services/replacement.png',
        },
      ],
    },
    {
      id: 'hr',
      filterKey: 'hr',
      titleKey: 'hrTitle',
      descKey: 'hrDesc',
      icon: Users,
      color: 'text-violet-500',
      bg: 'bg-violet-50',
      services: [
        {
          id: 'salary-cert',
          titleKey: 'serviceSalaryCert',
          descKey: 'serviceSalaryCertDesc',
          icon: FileText,
          color: 'text-blue-500',
          bg: 'bg-blue-50',
        },
        {
          id: 'annual-leave',
          titleKey: 'serviceAnnualLeave',
          descKey: 'serviceAnnualLeaveDesc',
          icon: Calendar,
          color: 'text-teal-500',
          bg: 'bg-teal-50',
        },
        {
          id: 'resignation',
          titleKey: 'serviceResignation',
          descKey: 'serviceResignationDesc',
          icon: LogOut,
          color: 'text-rose-500',
          bg: 'bg-rose-50',
        },
        {
          id: 'contract-renewal',
          titleKey: 'serviceContractRenewal',
          descKey: 'serviceContractRenewalDesc',
          icon: FileClock,
          color: 'text-indigo-500',
          bg: 'bg-indigo-50',
        },
      ],
    },
    {
      id: 'finance',
      filterKey: 'finance',
      titleKey: 'financeTitle',
      descKey: 'financeDesc',
      icon: Wallet,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      services: [
        {
          id: 'advance',
          titleKey: 'serviceAdvance',
          descKey: 'serviceAdvanceDesc',
          icon: Banknote,
          color: 'text-amber-500',
          bg: 'bg-amber-50',
        },
        {
          id: 'account-statement',
          titleKey: 'serviceAccountStatement',
          descKey: 'serviceAccountStatementDesc',
          icon: Receipt,
          color: 'text-sky-500',
          bg: 'bg-sky-50',
        },
      ],
    },
  ];

  /* Filter logic */
  const filteredSections = useMemo(() => {
    let result = sections;

    if (activeFilter !== 'all') {
      result = result.filter((s) => s.filterKey === activeFilter);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result
        .map((section) => ({
          ...section,
          services: section.services.filter((service) => {
            const title = (svc[service.titleKey] || '').toLowerCase();
            const desc = (svc[service.descKey] || '').toLowerCase();
            return title.includes(q) || desc.includes(q);
          }),
        }))
        .filter(
          (section) =>
            section.services.length > 0 ||
            (svc[section.titleKey] || '').toLowerCase().includes(q) ||
            (svc[section.descKey] || '').toLowerCase().includes(q)
        );
    }

    return result;
  }, [activeFilter, search, svc]);

  const hasResults = filteredSections.length > 0;

  // Show accident report form if active (after all hooks)
  if (activeServiceForm === 'accident') {
    return <AccidentReport />;
  }

  // Show advance request form if active (after all hooks)
  if (activeServiceForm === 'advance') {
    return <AdvanceRequest />;
  }

  // Show annual leave request form if active (after all hooks)
  if (activeServiceForm === 'annual-leave') {
    return <AnnualLeaveRequest />;
  }

  return (
    <motion.div
      className="px-4 pt-5 pb-28"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Page Title */}
      <div className="mb-4">
        <h1 className="text-[18px] font-black text-gray-900 leading-tight">
          {svc.title}
        </h1>
        <p className="text-[12px] text-gray-400 mt-1">
          {svc.searchPlaceholder.replace('...', '')}
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-3.5">
        <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={svc.searchPlaceholder}
          className="
            w-full ps-10 pe-10 py-2.5
            bg-[#F2F2F7] border border-transparent
            rounded-xl text-[13px] text-gray-900
            placeholder:text-gray-400 placeholder:text-[12px]
            focus:outline-none focus:bg-white focus:border-[#007AFF]/30 focus:ring-2 focus:ring-[#007AFF]/10
            transition-all duration-200
          "
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute end-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-300/60 flex items-center justify-center"
          >
            <X className="w-3.5 h-3.5 text-gray-600" />
          </button>
        )}
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1 no-scrollbar">
        {filters.map((filter) => (
          <FilterChip
            key={filter.key}
            label={filter.label}
            icon={filter.icon}
            active={activeFilter === filter.key}
            onClick={() => setActiveFilter(filter.key)}
          />
        ))}
      </div>

      {/* Sections */}
      <AnimatePresence mode="wait">
        {hasResults ? (
          <motion.div
            key={activeFilter + search}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-3"
          >
            {filteredSections.map((section, index) => (
              <SectionCard
                key={section.id}
                section={section}
                locale={locale}
                index={index}
                defaultOpen={true}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
              <Search className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-[13px] font-bold text-gray-500">
              {svc.noResults}
            </p>
            <p className="text-[11px] text-gray-400 mt-1">
              {svc.noResults}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
