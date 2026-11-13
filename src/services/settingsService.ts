import { NineKingsSettings } from '../types/settings';

export const loadSettings = async (file: File): Promise<NineKingsSettings> => {
  const text = await file.text();
  return JSON.parse(text);
};

export const saveSettings = (settings: NineKingsSettings): string => {
  return JSON.stringify(settings, null, 2);
};

export const downloadSettings = (settings: NineKingsSettings, filename: string) => {
  const blob = new Blob([saveSettings(settings)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const parseSerializedValue = <T>(serializedValue: string): T => {
  return JSON.parse(serializedValue);
};

export const stringifySerializedValue = <T>(value: T): string => {
  return JSON.stringify(value);
};

// The game reads these fields as C# int. null (empty input -> NaN), decimals or
// anything above 2147483647 make the whole block fail to load, and the game
// silently replaces it with defaults (all king XP back to 0).
export const toInt32 = (raw: string, min = -2147483648): number => {
  const n = Math.trunc(Number(raw));
  return Number.isNaN(n) ? Math.max(min, 0) : Math.min(Math.max(n, min), 2147483647);
};