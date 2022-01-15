import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { EMPTY, map, Observable, of, Subscription, switchMap } from 'rxjs';
import { DataService } from '../../../services/data/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { pickParam } from '../../../shared';
import { RoomInterface } from '@angular-for-java/api-interfaces';
import { View } from '../../../models/action.model';
import {
  ErrorMessages,
  NoError,
  RoomFormService,
} from '../form-services/room-form.service';

@Component({
  selector: 'rbg-room-edit',
  templateUrl: './room-edit.component.html',
  styleUrls: ['./room-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RoomFormService],
})
export class RoomEditComponent implements OnInit, OnDestroy {
  room$!: Observable<RoomInterface.IRoom | undefined>;
  layouts = RoomInterface.Layouts;

  errorMessages: ErrorMessages = NoError;
  private errorMessagesSubscription: Subscription | undefined;

  private updateRoomSubscription: Subscription | undefined;

  constructor(
    public roomEdit: RoomFormService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.room$ = this.route.queryParamMap.pipe(
      map(pickParam('roomId')),
      switchMap((roomId) => {
        if (roomId) {
          return this.dataService.findRoomById(roomId);
        } else {
          return of(undefined);
        }
      }),
      this.roomEdit.patchValue()
    );

    this.roomEdit.errorMessages$.subscribe(
      (errorMessages) => (this.errorMessages = errorMessages)
    );
  }
  ngOnDestroy(): void {
    this.errorMessagesSubscription?.unsubscribe();
    this.updateRoomSubscription?.unsubscribe();
  }

  onSubmit() {
    if (this.roomEdit.form.invalid) return;

    const formValue = this.roomEdit.form.value;
    const capacities = RoomInterface.Layouts.map((layout, idx) => {
      return {
        layout,
        capacity: formValue.capacities[idx],
      } as RoomInterface.ILayoutCapacity;
    });
    this.updateRoomSubscription = this.route.queryParamMap
      .pipe(
        map(pickParam('roomId')),
        switchMap((roomId) => {
          if (roomId) {
            return this.dataService.updateRoom(roomId, {
              name: formValue.name,
              location: formValue.location,
              capacities,
            });
          } else {
            return EMPTY;
          }
        })
      )
      .subscribe({
        next: async () => await this.navigateToViewPage(),
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
