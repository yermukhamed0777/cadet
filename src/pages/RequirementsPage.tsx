import { useEffect } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card, SectionTitle } from '../components/ui';
import { InlineSource } from '../components/FactRow';
import { RequirementsLinks } from './AcademyDetailPage';
import { admissionFacts } from '../data/requirements';
import { useAppState } from '../hooks/useAppState';

export function RequirementsPage() {
  const { markRequirementsViewed } = useAppState();
  useEffect(() => markRequirementsViewed(), [markRequirementsViewed]);
  return (
    <>
      <PageHeader title="Требования" back />
      <RequirementsLinks />
      <SectionTitle>Этапы поступления</SectionTitle>
      <div className="flex flex-col gap-3">
        {admissionFacts.map((f) => (
          <Card key={f.id}>
            <h3 className="font-semibold text-ink">{f.title}</h3>
            <p className="mt-1 text-[14.5px] leading-relaxed text-ink/85">{f.text}</p>
            <InlineSource refData={f} />
          </Card>
        ))}
      </div>
      <p className="mt-4 text-[12.5px] leading-snug text-muted">
        Приложение не является официальным ресурсом МВД. Перед подачей документов сверяйте требования с приёмной комиссией выбранного вуза.
      </p>
    </>
  );
}
