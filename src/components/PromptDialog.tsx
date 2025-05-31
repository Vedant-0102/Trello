import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ColorPicker } from './ColorPicker';

interface PromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  placeholder?: string;
  defaultValue?: string;
  showColorPicker?: boolean;
  onConfirm: (value: string, color?: string) => void;
}

export function PromptDialog({
  open,
  onOpenChange,
  title,
  description,
  placeholder,
  defaultValue = '',
  showColorPicker = false,
  onConfirm,
}: PromptDialogProps) {
  const [value, setValue] = useState(defaultValue);
  const [selectedColor, setSelectedColor] = useState('#3b82f6');

  const handleConfirm = () => {
    if (value.trim()) {
      onConfirm(value.trim(), showColorPicker ? selectedColor : undefined);
      setValue('');
      setSelectedColor('#3b82f6');
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setValue('');
    setSelectedColor('#3b82f6');
    onOpenChange(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-slate-800 dark:text-slate-200">{title}</DialogTitle>
          {description && <DialogDescription className="text-slate-600 dark:text-slate-400">{description}</DialogDescription>}
        </DialogHeader>
        
        <div className="space-y-4">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
            autoFocus
          />
          
          {showColorPicker && (
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Choose a color:
              </label>
              <ColorPicker
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
              />
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleCancel}
            className="bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!value.trim()}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}