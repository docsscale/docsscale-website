import type { BasicFormField } from '@keystatic/core';
import { CountedInput } from './counted-input';

type Limits = { warnUnder?: number; warnOver: number; max: number };

/** A text field with a live character count. Stored as a plain string, so the
 *  file format is the same as Keystatic's own text field. The input lives in
 *  its own client file because this config is also loaded by the server route. */
export function countedText({
  label,
  description,
  multiline = false,
  required = true,
  limits,
}: {
  label: string;
  description?: string;
  multiline?: boolean;
  required?: boolean;
  limits: Limits;
}): BasicFormField<string> {
  return {
    kind: 'form',
    label,
    Input(props) {
      return (
        <CountedInput
          {...props}
          label={label}
          description={description}
          multiline={multiline}
          required={required}
          limits={limits}
        />
      );
    },
    defaultValue: () => '',
    parse: (value) => (typeof value === 'string' ? value : ''),
    serialize: (value) => ({ value: value === '' ? undefined : value }),
    validate(value) {
      if (required && value.trim() === '') throw new Error(`${label} is required.`);
      if (value.length > limits.max)
        throw new Error(`${label} is ${value.length} characters; the limit is ${limits.max}.`);
      return value;
    },
    reader: { parse: (value) => (typeof value === 'string' ? value : '') },
  };
}
