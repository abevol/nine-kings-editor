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