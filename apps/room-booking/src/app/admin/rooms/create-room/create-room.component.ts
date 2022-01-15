import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  ErrorMessages,
  NoError,
  RoomFormService,
} from '../form-services/room-form.service';
import { DataService } from '../../../services/data/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomInterface } from '@angular-for-java/api-interfaces';
import { Subscription } from 'rxjs';
import { View } from '../../../models/action.model';

@Component({
  selector: 'rbg-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RoomFormService],
})
export class CreateRoomComponent implements OnInit, OnDestroy {
  layouts = RoomInterface.Layouts;

  errorMessages: ErrorMessages = NoError;
  private errorMessagesSubscription: Subscription | undefined;

  private createRoomSubscription: Subscription | undefined;

  constructor(
    public roomCreate: RoomFormService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.roomCreate.errorMessages$.subscribe((errorMessages) => {
      this.errorMessages = errorMessages;
    });
  }
  ngOnDestroy(): void {
    this.errorMessagesSubscription?.unsubscribe();
    this.createRoomSubscription?.unsubscribe();
  }

  onSubmit() {
    if (this.roomCreate.form.invalid) return;

    const formValue = this.roomCreate.form.value;
    const capacities = RoomInterface.Layouts.map((layout, idx) => {
      return {
        layout,
        capacity: formValue.capacities[idx],
      } as RoomInterface.ILayoutCapacity;
    });

    this.createRoomSubscription = this.dataService
      .createRoom({
        name: formValue.name,
        location: formValue.location,
        capacities,
      })
      .subscribe({ next: async () => await this.navigateToViewPage() });
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
