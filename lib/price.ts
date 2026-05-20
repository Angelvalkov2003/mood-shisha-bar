export const EUR_TO_BGN = 1.95583;

export function eurToBgn(eur: number) {
  return Number(eur) * EUR_TO_BGN;
}

export function formatPrice(eur: number) {
  const e = Number(eur);
  return { eur: e.toFixed(2), bgn: eurToBgn(e).toFixed(2) };
}
