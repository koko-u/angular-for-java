import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DataService } from '../../services/data/data.service';
import { IRoom } from '@angular-for-java/api-interfaces';
import { ActivatedRoute, ParamMap, Router } from "@angular/router"
import { map, tap } from "rxjs"

const roomId = (queryParam: ParamMap): number | undefined => {
  if (queryParam.has('roomId')) {
    const roomId = Number(queryParam.get('roomId'))
    if (isNaN(roomId)) {
      return undefined
    } else {
      return roomId
    }
  } else {
    return undefined
  }
}

@Component({
  selector: 'rbg-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class RoomsComponent implements OnInit {
  rooms!: IRoom[];

  selectedRoom: IRoom | undefined

  constructor(private dataService: DataService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.rooms = this.dataService.rooms;
    this.route.queryParamMap.pipe(map(roomId)).subscribe(roomId => {
      if (roomId) {
        this.selectedRoom = this.dataService.findById(roomId)
      } else {
        this.selectedRoom = undefined
      }
    })
  }

  async viewRoom(roomId: number) {
    await this.router.navigate([], { relativeTo: this.route, queryParams: { roomId: roomId } })
  }
}
