import { Options, passwordStrength } from 'check-password-strength';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const TooWeakPassword = {
  id: 0,
  name: 'Too Weak' as const,
  message: 'password is too weak',
};
export const WeakPassword = {
  id: 1,
  name: 'Weak' as const,
  message: 'password is weak',
};
export const MediumPassword = {
  id: 2,
  name: 'Medium' as const,
  message: 'password has medium strength',
};
export const StrongPassword = {
  id: 3,
  name: 'Strong' as const,
  message: 'password has enough strength',
};
export type PasswordStrength = {
  id: number;
  name:
    | typeof TooWeakPassword.name
    | typeof WeakPassword.name
    | typeof MediumPassword.name
    | typeof StrongPassword.name;
  message: string;
};

const options: Options<PasswordStrength> = [
  {
    id: TooWeakPassword.id,
    value: TooWeakPassword,
    minDiversity: 0,
    minLength: 0,
  },
  {
    id: WeakPassword.id,
    value: WeakPassword,
    minDiversity: 2,
    minLength: 6,
  },
  {
    id: MediumPassword.id,
    value: MediumPassword,
    minDiversity: 4,
    minLength: 8,
  },
  {
    id: StrongPassword.id,
    value: StrongPassword,
    minDiversity: 4,
    minLength: 10,
  },
];

export function passwordStrengthValidator(
  leastStrength: PasswordStrength
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    const strength = passwordStrength(value, options);
    if (strength.id >= leastStrength.id) {
      return null;
    } else {
      return {
        passwordStrength: {
          value: control.value,
          message: strength.value.message,
        },
      };
    }
  };
}
