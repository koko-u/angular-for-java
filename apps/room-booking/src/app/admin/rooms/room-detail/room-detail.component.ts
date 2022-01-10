import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { IRoom } from '@angular-for-java/api-interfaces';

@Component({
  selector: 'rbg-room-detail',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomDetailComponent implements OnInit {
  room: IRoom;

  constructor() {}

  ngOnInit(): void {}
}
