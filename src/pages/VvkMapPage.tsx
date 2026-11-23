import { MapPin, ExternalLink } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Card, EmptyState, SectionTitle } from '../components/ui';
import { InlineSource } from '../components/FactRow';
import { vvkLocations, vvk2026Note } from '../data/vvk';
import { academyService } from '../services/academyService';

const mapUrl = (address: string) => `https://www.openstreetmap.org/search?query=${encodeURIComponent(address)}`;

export function VvkMapPage() {
  return (
    <>
      <PageHeader title="ВВК на карте" back />
      {vvkLocations.length === 0 ? (
        <EmptyState
          icon={<MapPin className="h-8 w-8" aria-hidden />}
          title="Адрес требует уточнения"
          text="Официально подтверждённых адресов пунктов ВВК пока нет. Мы не показываем непроверенные адреса и координаты."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {vvkLocations.map((l) => (
            <Card key={l.id}>
              <h3 className="font-semibold">{l.name}</h3>
              <p className="mt-1 text-sm">{l.address ?? 'Адрес требует уточнения'}</p>
              {l.phone && <p className="mt-1 select-all text-sm tabular-nums">{l.phone}</p>}
              {l.address && (
                <a href={mapUrl(l.address)} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-[40px] items-center gap-1 text-sm font-semibold text-navy">
                  Открыть на карте <ExternalLink className="h-4 w-4" aria-hidden />
                </a>
              )}
              <InlineSource refData={l} />
            </Card>
          ))}
        </div>
      )}
      <Card className="mt-3">
        <p className="text-[14px] leading-snug">{vvk2026Note.text}</p>
        <InlineSource refData={vvk2026Note} />
      </Card>

      <SectionTitle>Адреса академий (не пункты ВВК)</SectionTitle>
      <div className="flex flex-col gap-2">
        {academyService.list().map((a) => (
          <Card key={a.id} className="!p-3.5">
            <p className="font-semibold leading-snug">{a.shortTitle}</p>
            <p className="mt-0.5 text-sm text-ink/80">{a.address.value ?? 'Адрес требует уточнения'}</p>
            {a.address.value && (
              <a href={mapUrl(a.address.value)} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex min-h-[40px] items-center gap-1 text-sm font-semibold text-navy">
                Открыть на карте <ExternalLink className="h-4 w-4" aria-hidden />
              </a>
            )}
            <InlineSource refData={a.address} />
          </Card>
        ))}
      </div>
    </>
  );
}
