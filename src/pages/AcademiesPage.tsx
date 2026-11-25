import { Link } from 'react-router-dom';
import { Scale } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { AcademyCard } from '../components/AcademyCard';
import { academyService } from '../services/academyService';
import { useAppState } from '../hooks/useAppState';

export function AcademiesPage() {
  const { state } = useAppState();
  return (
    <>
      <PageHeader title="Service academies" subtitle="4 academies" />
      <Link
        to="/compare"
        className="mb-4 flex min-h-[52px] items-center gap-3 rounded-xl2 border border-dashed border-navy/25 bg-white px-4 text-sm font-semibold text-navy hover:border-navy/50"
      >
        <Scale className="h-5 w-5 text-gold-dark" aria-hidden />
        Compare academies (up to 3)
      </Link>
      <div className="flex flex-col gap-3">
        {academyService.list().map((a, i) => (
          <AcademyCard key={a.id} academy={a} index={i} selected={state.selectedAcademy === a.id} />
        ))}
      </div>
    </>
  );
}
