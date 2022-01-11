import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { Validators } from '@angular/forms';
import {
  passwordStrengthValidator,
  WeakPassword,
} from '../../../validators/password-strength.validator';
import { combineLatest, map, Observable } from 'rxjs';
import { DataService } from '../../../services/data/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { View } from '../../../models/action.model';
import { PasswordValidators } from '../../../validators/password.validators';

@Component({
  selector: 'rbg-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PasswordValidators],
})
export class CreateUserComponent implements OnInit {
  createForm = new FormGroup(
    {
      name: new FormControl<string>('', [Validators.required]),
      password: new FormControl<string>('', [
        Validators.required,
        passwordStrengthValidator(WeakPassword),
      ]),
      repeatedPassword: new FormControl<string>('', [Validators.required]),
    },
    {
      validators: this.passwordValidators.matchesPasswords(
        'password',
        'repeatedPassword'
      ),
      updateOn: 'change',
    }
  );

  nameErrorMessage$!: Observable<string | undefined>;
  passwordErrorMessage$!: Observable<string | undefined>;
  matchesPasswordErrorMessage$!: Observable<string | undefined>;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private passwordValidators: PasswordValidators
  ) {}

  ngOnInit(): void {
    this.nameErrorMessage$ = combineLatest([
      this.createForm.controls.name.touch$,
      this.createForm.controls.name.errors$,
    ]).pipe(
      map(([touch, errors]) => {
        if (touch && errors) {
          return 'Name is required';
        } else {
          return undefined;
        }
      })
    );

    this.passwordErrorMessage$ = combineLatest([
      this.createForm.controls.password.touch$,
      this.createForm.controls.password.errors$,
    ]).pipe(
      map(([touch, errors]) => {
        if (touch && errors) {
          if (errors['required']) {
            return 'Password is required';
          } else if (errors['passwordStrength']) {
            return errors['passwordStrength'].message;
          } else {
            return 'Password has some errors';
          }
        } else {
          return undefined;
        }
      })
    );

    this.matchesPasswordErrorMessage$ = combineLatest([
      this.createForm.touch$,
      this.createForm.errors$,
    ]).pipe(
      map(([touch, errors]) => {
        if (touch && errors) {
          if (errors['matchesPasswords']) {
            return 'Passwords do not match';
          } else {
            return undefined;
          }
        } else {
          return undefined;
        }
      })
    );
  }

  onSubmit() {
    if (this.createForm.invalid) return;

    this.dataService
      .createUser(
        this.createForm.controls.name.value,
        this.createForm.controls.password.value
      )
      .subscribe({
        next: async (user) => {
          await this.navigateToViewPage(user.id);
        },
      });
  }

  async onCancel() {
    await this.navigateToViewPage();
  }

  private async navigateToViewPage(userId?: number) {
    await this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { userId: userId, action: View },
    });
  }
}
