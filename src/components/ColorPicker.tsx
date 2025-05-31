import React from 'react';

const PRESET_COLORS = [
  { name: 'Blue', value: '#3b82f6', bg: 'bg-blue-500' },
  { name: 'Green', value: '#10b981', bg: 'bg-emerald-500' },
  { name: 'Purple', value: '#8b5cf6', bg: 'bg-violet-500' },
  { name: 'Red', value: '#ef4444', bg: 'bg-red-500' },
  { name: 'Orange', value: '#f97316', bg: 'bg-orange-500' },
  { name: 'Pink', value: '#ec4899', bg: 'bg-pink-500' },
  { name: 'Indigo', value: '#6366f1', bg: 'bg-indigo-500' },
  { name: 'Teal', value: '#14b8a6', bg: 'bg-teal-500' },
];

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export function ColorPicker({ selectedColor, onColorChange }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {PRESET_COLORS.map((color) => (
        <button
          key={color.value}
          type="button"
          onClick={() => onColorChange(color.value)}
          className={`w-6 h-6 rounded-full border-2 transition-all ${
            selectedColor === color.value
              ? 'border-gray-800 dark:border-gray-200 scale-110'
              : 'border-gray-300 dark:border-gray-600 hover:scale-105'
          } ${color.bg}`}
          title={color.name}
        />
      ))}
    </div>
  );
}
