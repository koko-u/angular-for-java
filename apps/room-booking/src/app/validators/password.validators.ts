import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable()
export class PasswordValidators {
  matchesPasswords(
    passwordControlName: string,
    repeatedPasswordControlName: string
  ): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const passwordControl = formGroup.get(passwordControlName);
      const repeatPasswordControl = formGroup.get(repeatedPasswordControlName);
      if (!passwordControl || !repeatPasswordControl) return null;

      const password = passwordControl.value as string;
      const repeatedPassword = repeatPasswordControl.value as string;
      if (password) {
        if (password === repeatedPassword) {
          return null;
        } else {
          return { matchesPasswords: true };
        }
      } else {
        if (repeatedPassword) {
          return { matchesPasswords: true };
        } else {
          return null;
        }
      }
    };
  }
}
