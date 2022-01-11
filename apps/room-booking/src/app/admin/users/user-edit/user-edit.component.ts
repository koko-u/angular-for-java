import { Component, OnInit } from '@angular/core';
import { UserInterface } from '@angular-for-java/api-interfaces';
import { DataService } from '../../../services/data/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map, Observable, of, switchMap, tap } from 'rxjs';
import { userId } from '../shared';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { Validators } from '@angular/forms';
import { View } from '../../../models/action.model';

@Component({
  selector: 'rbg-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
})
export class UserEditComponent implements OnInit {
  user$!: Observable<UserInterface.IUser | undefined>;

  nameErrorMessage$!: Observable<string | undefined>;

  editForm = new FormGroup({
    name: new FormControl<string>('', [Validators.required]),
  });

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user$ = this.route.queryParamMap.pipe(
      map(userId),
      switchMap((userId) => {
        if (userId) {
          return this.dataService.findUserById(userId);
        } else {
          return of(undefined);
        }
      }),
      tap((user) => {
        if (user) {
          this.editForm.setValue({
            name: user.name,
          });
        }
      })
    );

    this.nameErrorMessage$ = combineLatest([
      this.editForm.touch$,
      this.editForm.controls.name.errors$,
    ]).pipe(
      map(([touch, errors]) => {
        if (touch) {
          if (errors) {
            return 'Name is required';
          } else {
            return undefined;
          }
        } else {
          return undefined;
        }
      })
    );
  }

  onSubmit(userId: number) {
    if (this.editForm.invalid) return;

    this.dataService
      .updateUser(userId, this.editForm.controls.name.value)
      .subscribe({
        complete: async () => await this.navigateToViewPage(),
      });
  }

  async onCancel() {
    await this.navigateToViewPage();
  }

  private async navigateToViewPage() {
    await this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { action: View },
      queryParamsHandling: 'merge',
    });
  }
}
