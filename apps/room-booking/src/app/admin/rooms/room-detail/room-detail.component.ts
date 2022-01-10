import { Component, OnInit, ChangeDetectionStrategy, Input } from "@angular/core"
import { IRoom } from '@angular-for-java/api-interfaces';

@Component({
  selector: 'rbg-room-detail[room]',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomDetailComponent implements OnInit {
  @Input()
  room!: IRoom;

  constructor() {}

  ngOnInit(): void {}
}
