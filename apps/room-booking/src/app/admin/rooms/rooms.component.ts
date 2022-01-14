import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data/data.service';
import { RoomInterface } from '@angular-for-java/api-interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Action, Actions, Create, Edit, View } from '../../models/action.model';
import { action } from '../../shared';

@Component({
  selector: 'rbg-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class RoomsComponent implements OnInit {
  rooms$!: Observable<RoomInterface.IRoom[]>;
  action$!: Observable<Action>;

  view = View;
  create = Create;
  edit = Edit;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.rooms$ = this.dataService.getAllRooms();
    this.action$ = this.route.queryParamMap.pipe(map(action));
  }

  async viewRoom(roomId: number) {
    await this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { roomId: roomId, action: View },
    });
  }

  async createRoom() {
    await this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { action: Create },
    });
  }
}
