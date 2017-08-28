export function chance(probability: number, total: number = 100): boolean {
  const ratio = probability / total;

  return Math.random() < ratio;
}
