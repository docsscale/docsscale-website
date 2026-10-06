'use client';

import { TextArea, TextField } from '@keystar/ui/text-field';
import type { FormFieldInputProps } from '@keystatic/core';

export type Limits = { warnUnder?: number; warnOver: number; max: number };

export function problem(value: string, label: string, required: boolean, limits: Limits): string | undefined {
  if (required && value.trim() === '') return `${label} is required.`;
  if (value.length > limits.max) return `${label} is ${value.length} characters; the limit is ${limits.max}.`;
  return undefined;
}

/** The input for countedText(): a live character count, amber outside the
 *  recommended range, red over the hard limit. */
export function CountedInput({
  value,
  onChange,
  autoFocus,
  forceValidation,
  label,
  description,
  multiline,
  required,
  limits,
}: FormFieldInputProps<string> & {
  label: string;
  description?: string;
  multiline: boolean;
  required: boolean;
  limits: Limits;
}) {
  const n = value.length;
  const over = n > limits.max;
  const amber = !over && (n > limits.warnOver || (limits.warnUnder !== undefined && n > 0 && n < limits.warnUnder));
  const state = over ? 'Too long: search engines will cut this off.' : amber ? 'Outside the recommended length.' : 'Good length.';
  const colour = over ? '#B4432F' : amber ? '#9A6700' : '#1A7F37';
  const error = forceValidation || over ? problem(value, label, required, limits) : undefined;
  const Field = multiline ? TextArea : TextField;
  return (
    <Field
      label={label}
      autoFocus={autoFocus}
      value={value}
      onChange={onChange}
      isRequired={required}
      errorMessage={error}
      description={
        <span data-counter={label}>
          {description ? `${description} ` : ''}
          <strong style={{ color: colour }}>
            {n} / {limits.max} characters. {n === 0 ? '' : state}
          </strong>
        </span>
      }
    />
  );
}
