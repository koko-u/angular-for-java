import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { map, Observable, of, Subscription, switchMap } from 'rxjs';
import { DataService } from '../../../services/data/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { pickParam } from '../../../shared';
import { RoomInterface } from '@angular-for-java/api-interfaces';
import { View } from '../../../models/action.model';
import {
  ErrorMessages,
  NoError,
  RoomEditFormService,
} from './room-edit-form.service';

@Component({
  selector: 'rbg-room-edit',
  templateUrl: './room-edit.component.html',
  styleUrls: ['./room-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RoomEditFormService],
})
export class RoomEditComponent implements OnInit, OnDestroy {
  room$!: Observable<RoomInterface.IRoom | undefined>;
  layouts = RoomInterface.Layouts;

  errorMessages: ErrorMessages = NoError;
  private errorMessagesSubscription: Subscription | undefined;

  constructor(
    public roomEdit: RoomEditFormService,
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
  }

  onSubmit() {
    console.log({ value: this.roomEdit.form.value });
  }

  async onCancel() {
    await this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { action: View },
      queryParamsHandling: 'merge',
    });
  }
}
