import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const isNotEmptyValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const value = control.value as string;
  if (value) {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return { isNotEmpty: true };
    } else {
      return null;
    }
  } else {
    return { isNotEmpty: true };
  }
};
