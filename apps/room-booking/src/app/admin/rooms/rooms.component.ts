import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DataService } from '../../services/data/data.service';
import { IRoom } from '@angular-for-java/api-interfaces';

@Component({
  selector: 'rbg-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomsComponent implements OnInit {
  rooms!: IRoom[];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.rooms = this.dataService.rooms;
  }
}
