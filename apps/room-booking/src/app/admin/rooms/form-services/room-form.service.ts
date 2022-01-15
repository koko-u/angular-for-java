import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@ngneat/reactive-forms';
import { ValidationErrors, Validators } from '@angular/forms';
import { RoomInterface } from '@angular-for-java/api-interfaces';
import { combineLatest, concat, map, Observable, of, pipe, tap } from 'rxjs';
import { isNotEmptyValidator } from '../../../validators/is-not-empty.validator';
import { someValidator } from '../../../validators/some.validator';

export type ErrorMessages = {
  name: string;
  location: string;
  capacities: string[];
  crossCapacity: string;
};
export const NoError: ErrorMessages = {
  name: '',
  location: '',
  capacities: Array(RoomInterface.Layouts.length).fill(''),
  crossCapacity: '',
};

function getNameErrorMessage(errors: ValidationErrors | null): string {
  if (!errors) return '';

  if (errors['required']) {
    return 'Name is required';
  } else if (errors['isNotEmpty']) {
    return 'Name should not be empty';
  } else {
    return '';
  }
}
function getLocationErrorMessage(errors: ValidationErrors | null): string {
  if (!errors) return '';

  if (errors['required']) {
    return 'Location is required';
  } else if (errors['isNotEmpty']) {
    return 'Location should not be empty';
  } else if (errors['minlength']) {
    return 'Location should have at least 2 characters';
  } else {
    return '';
  }
}
function getCapacityErrorMessage(
  errors: ValidationErrors | null
): (layout: RoomInterface.Layout) => string {
  return (layout: RoomInterface.Layout) => {
    if (!errors) return '';

    const layoutIndex = RoomInterface.Layouts.findIndex((l) => l === layout);
    if (layoutIndex < 0) {
      return '';
    }
    if (errors['min']) {
      return `${layout} should be positive or zero capacity`;
    } else {
      return `${layout} has some wrong value`;
    }
  };
}
function getCrossCapacityErrorMessage(errors: ValidationErrors | null): string {
  if (!errors) return '';

  if (errors['some']) {
    return 'Some Layout should have at least 1 capacity';
  } else {
    return '';
  }
}

@Injectable()
export class RoomFormService {
  private _form = new FormGroup({
    name: new FormControl('', [Validators.required, isNotEmptyValidator]),
    location: new FormControl('', [
      Validators.required,
      isNotEmptyValidator,
      Validators.minLength(2),
    ]),
    capacities: new FormArray(
      RoomInterface.Layouts.map(() => new FormControl('', Validators.min(0))),
      someValidator(Validators.min(1))
    ),
  });

  get form() {
    return this._form;
  }

  get errorMessages$(): Observable<ErrorMessages> {
    // フォームの LayoutCapacity 配列に相当する個別のエラーを
    // [ [Theater, null]$, [U-Shape, { err }]$, [BoardMeating, null]$ ]
    // の形の Observable の配列にする
    const eachCapacityErrors = RoomInterface.Layouts.map((layout, index) =>
      this._form.controls.capacities.controls[index].errors$.pipe(
        map(
          (errors) =>
            [layout, errors] as [RoomInterface.Layout, ValidationErrors | null]
        )
      )
    );
    // 先に作成した Observable の配列を組み合わせて [ '', 'Error Msg, '' ]$
    // の形のエラーメッセージの配列の Observable に変換する
    const eachCapacityErrors$ = combineLatest(eachCapacityErrors).pipe(
      map((capacityErrors) => {
        return capacityErrors.map((capacityError) => {
          const [layout, errors] = capacityError;
          return getCapacityErrorMessage(errors)(layout);
        });
      })
    );

    const error$ = combineLatest([
      this._form.touch$,
      this._form.controls.name.errors$,
      this._form.controls.location.errors$,
      eachCapacityErrors$,
      this._form.controls.capacities.errors$,
    ]).pipe(
      map(
        ([
          touch,
          nameErrors,
          locationErrors,
          eachCapacityErrors,
          capacitiesErrors,
        ]) => {
          if (!touch) return NoError;

          return {
            name: getNameErrorMessage(nameErrors),
            location: getLocationErrorMessage(locationErrors),
            capacities: eachCapacityErrors,
            crossCapacity: getCrossCapacityErrorMessage(capacitiesErrors),
          };
        }
      )
    );
    return concat(of(NoError), error$);
  }

  patchValue() {
    return pipe(
      tap((room: RoomInterface.IRoom | undefined) => {
        if (room) {
          const capacities = RoomInterface.Layouts.map((layout) => {
            const layoutCapacity = room.capacities.find(
              (capacity) => capacity.layout === layout
            );
            return layoutCapacity ? layoutCapacity.capacity : 0;
          });
          this._form.patchValue({
            name: room.name,
            location: room.location,
            capacities: capacities,
          });
        }
      })
    );
  }

  getLayoutCapacityControl(layout: RoomInterface.Layout) {
    const index = RoomInterface.Layouts.findIndex((l) => l === layout);
    return this._form.controls.capacities.controls[index];
  }
}
