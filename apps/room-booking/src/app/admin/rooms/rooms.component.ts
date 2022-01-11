import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DataService } from '../../services/data/data.service';
import { RoomInterface } from '@angular-for-java/api-interfaces';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { concatMap, map, Observable, of, switchMap, tap } from 'rxjs';

const roomId = (queryParam: ParamMap): number | undefined => {
  if (queryParam.has('roomId')) {
    const roomId = Number(queryParam.get('roomId'));
    if (isNaN(roomId)) {
      return undefined;
    } else {
      return roomId;
    }
  } else {
    return undefined;
  }
};

@Component({
  selector: 'rbg-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class RoomsComponent implements OnInit {
  rooms$!: Observable<RoomInterface.IRoom[]>;
  selectedRoom$!: Observable<RoomInterface.IRoom | undefined>;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.rooms$ = this.dataService.getAllRooms();
    this.selectedRoom$ = this.route.queryParamMap.pipe(
      map(roomId),
      switchMap((roomId) => {
        if (roomId) {
          return this.dataService.findRoomById(roomId);
        } else {
          return of(undefined);
        }
      })
    );
  }

  async viewRoom(roomId: number) {
    await this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { roomId: roomId },
    });
  }
}
