import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormArray } from '@ngneat/reactive-forms';

// export const someValidator = <T>(predicate: (n: T) => boolean): ValidatorFn => {
//   return (arrayForm: AbstractControl): ValidationErrors | null => {
//     if (arrayForm instanceof FormArray) {
//       if (
//         arrayForm.controls.map((control) => control.value as T).some(predicate)
//       ) {
//         return null;
//       } else {
//         return {
//           some: true,
//         };
//       }
//     }
//     return null;
//   };
// };
export const someValidator = (validator: ValidatorFn): ValidatorFn => {
  return (arrayForm: AbstractControl): ValidationErrors | null => {
    if (arrayForm instanceof FormArray) {
      if (arrayForm.controls.some((control) => validator(control) === null)) {
        return null;
      } else {
        return { some: true };
      }
    }
    return null;
  };
};
