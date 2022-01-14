import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RoomInterface } from '@angular-for-java/api-interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { Edit } from '../../../models/action.model';
import { map, Observable, of, switchMap } from 'rxjs';
import { pickParam } from '../../../shared';
import { DataService } from '../../../services/data/data.service';

@Component({
  selector: 'rbg-room-detail',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomDetailComponent implements OnInit {
  room$!: Observable<RoomInterface.IRoom | undefined>;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async onEditRoom() {
    await this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { action: Edit },
      queryParamsHandling: 'merge',
    });
  }

  ngOnInit(): void {
    this.room$ = this.route.queryParamMap.pipe(
      map(pickParam('roomId')),
      switchMap((roomId) => {
        if (roomId) {
          return this.dataService.findRoomById(roomId);
        } else {
          return of(undefined);
        }
      })
    );
  }
}
