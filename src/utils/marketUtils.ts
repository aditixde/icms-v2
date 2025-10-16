import { SectorResult } from './carbonSimulator';

const ROW_TOL = 1e-6;

export type Classification = 'seller' | 'buyer' | 'neutral';

export function classify(S: number, tol = ROW_TOL): Classification {
  if (S > tol) return 'seller';
  if (S < -tol) return 'buyer';
  return 'neutral';
}

export interface ParticipantCounts {
  sellers: number;
  buyers: number;
  neutral: number;
}

export function counts(
  sectors: { ccc: number }[],
  tol = ROW_TOL
): ParticipantCounts {
  let sellers = 0;
  let buyers = 0;
  let neutral = 0;

  sectors.forEach((s) => {
    const c = classify(s.ccc, tol);
    if (c === 'seller') sellers++;
    else if (c === 'buyer') buyers++;
    else neutral++;
  });

  return { sellers, buyers, neutral };
}

export function colorFor(v: number, tol: number): string {
  if (v > tol) return '#10B981';
  if (v < -tol) return '#EF4444';
  return '#9CA3AF';
}
