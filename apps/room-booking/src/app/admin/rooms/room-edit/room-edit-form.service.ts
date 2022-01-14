import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@ngneat/reactive-forms';
import { ValidationErrors, Validators } from '@angular/forms';
import { RoomInterface } from '@angular-for-java/api-interfaces';
import { combineLatest, concat, map, Observable, of, pipe, tap } from 'rxjs';
import { isNotEmptyValidator } from '../../../validators/is-not-empty.validator';

export type ErrorMessages = {
  name: string;
  location: string;
  capacities: string[];
};
export const NoError: ErrorMessages = {
  name: '',
  location: '',
  capacities: Array(RoomInterface.Layouts.length).fill(''),
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

    if (errors[layoutIndex]) {
      return `${layout} is something wrong`;
    } else {
      return '';
    }
  };
}

@Injectable()
export class RoomEditFormService {
  private _form = new FormGroup({
    name: new FormControl('', [Validators.required, isNotEmptyValidator]),
    location: new FormControl('', [
      Validators.required,
      isNotEmptyValidator,
      Validators.minLength(2),
    ]),
    capacities: new FormArray(
      RoomInterface.Layouts.map(() => new FormControl(''))
    ),
  });

  constructor() {}

  get form() {
    return this._form;
  }

  get errorMessages$(): Observable<ErrorMessages> {
    const error$ = combineLatest([
      this._form.touch$,
      this._form.controls.name.errors$,
      this._form.controls.location.errors$,
      this._form.controls.capacities.errors$,
    ]).pipe(
      map(([touch, nameErrors, locationErrors, capacitiesErrors]) => {
        if (!touch) return NoError;

        return {
          name: getNameErrorMessage(nameErrors),
          location: getLocationErrorMessage(locationErrors),
          capacities: RoomInterface.Layouts.map(
            getCapacityErrorMessage(capacitiesErrors)
          ),
        };
      })
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
