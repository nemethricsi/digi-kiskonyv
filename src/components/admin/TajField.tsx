'use client';

import { TextInput, useField } from '@payloadcms/ui';

import { formatTaj } from '@/lib/taj';

import type { TextFieldClientComponent } from 'payload';

// Shows the TAJ as "111 111 110" while typing, but keeps the form value digits-only.
// Validation stays on the server (field `validate`), errors come back via form state.
export const TajField: TextFieldClientComponent = ({
  field,
  path,
  readOnly,
}) => {
  const { value, setValue, showError, disabled } = useField<string>({
    potentiallyStalePath: path,
  });

  return (
    <TextInput
      path={path}
      label={field.label}
      description={field.admin?.description}
      required={field.required}
      readOnly={readOnly || disabled}
      showError={showError}
      htmlAttributes={{ autoComplete: 'off' }}
      value={formatTaj(value ?? '')}
      // hasMany={false} narrows onChange to a plain input change event
      hasMany={false}
      onChange={(e) => setValue(e.target.value.replace(/\D/g, '').slice(0, 9))}
    />
  );
};
