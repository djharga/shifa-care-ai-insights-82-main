import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
}

interface TextInputProps extends FormFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel' | 'password';
  disabled?: boolean;
}

interface SelectInputProps extends FormFieldProps {
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
}

interface TextareaInputProps extends FormFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
}

interface DateInputProps extends FormFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

interface NumberInputProps extends FormFieldProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

export const FormTextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  error,
  className = '',
  disabled = false
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={label} className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={label}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={error ? 'border-red-500' : ''}
      />
      {error && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export const FormSelectInput: React.FC<SelectInputProps> = ({
  label,
  value,
  onValueChange,
  options,
  placeholder,
  required = false,
  error,
  className = '',
  disabled = false
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={label} className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className={error ? 'border-red-500' : ''}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export const FormTextareaInput: React.FC<TextareaInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  required = false,
  error,
  className = '',
  disabled = false
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={label} className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Textarea
        id={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={error ? 'border-red-500' : ''}
      />
      {error && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export const FormDateInput: React.FC<DateInputProps> = ({
  label,
  value,
  onChange,
  required = false,
  error,
  className = '',
  disabled = false
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={label} className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={label}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={error ? 'border-red-500' : ''}
      />
      {error && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export const FormNumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  min,
  max,
  step = 1,
  required = false,
  error,
  className = '',
  disabled = false
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={label} className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={label}
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={error ? 'border-red-500' : ''}
      />
      {error && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}; 