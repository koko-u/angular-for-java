import { Injectable } from '@angular/core';
import { IRoom, Layout } from '@angular-for-java/api-interfaces';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  rooms: IRoom[];

  constructor() {
    this.rooms = [
      {
        id: 1,
        name: 'First Room',
        location: 'First Floor',
        capacities: [
          { layout: Layout.Theater, capacity: 50 },
          { layout: Layout.UShape, capacity: 20 },
        ],
      },
      {
        id: 2,
        name: 'Second Room',
        location: 'Third Floor',
        capacities: [{ layout: Layout.Theater, capacity: 60 }],
      },
    ];
  }

  findById(roomId: number): IRoom | undefined {
    return this.rooms.find(room => room.id === roomId)
  }
}
