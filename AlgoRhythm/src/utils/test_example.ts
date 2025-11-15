export function add(a: number, b: number): number {
  return a + b;
}

export function average(numbers: number[]): number {
  if (numbers.length === 0) throw new Error("Cannot average empty array");
  const sum = numbers.reduce((acc, n) => acc + n, 0);
  return sum / numbers.length;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function calculateGrade(scores: number[]): string {
  const avg = average(scores);
  if (avg >= 90) return "A";
  if (avg >= 75) return "B";
  if (avg >= 60) return "C";
  return "F";
}
