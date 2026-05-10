'use client';

import { I18nProvider } from '@/lib/i18n';
import { AccidentReport } from '@/components/delegate/AccidentReport';

export default function Home() {
  return (
    <I18nProvider>
      <AccidentReport />
    </I18nProvider>
  );
}
