import { Injectable } from '@angular/core';
import { RoomInterface, UserInterface } from '@angular-for-java/api-interfaces';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  rooms: RoomInterface.IRoom[];
  users: UserInterface.IUser[];

  constructor() {
    this.rooms = this.createMockRooms();
    this.users = this.createMockUsers();
  }

  findRoomById(roomId: number): RoomInterface.IRoom | undefined {
    return this.rooms.find((room) => room.id === roomId);
  }
  findUserById(userId: number): UserInterface.IUser | undefined {
    return this.users.find((user) => user.id === userId);
  }

  private createMockRooms(): RoomInterface.IRoom[] {
    return [
      {
        id: 1,
        name: 'First Room',
        location: 'First Floor',
        capacities: [
          { layout: RoomInterface.Theater, capacity: 50 },
          { layout: RoomInterface.UShape, capacity: 20 },
        ],
      },
      {
        id: 2,
        name: 'Second Room',
        location: 'Third Floor',
        capacities: [{ layout: RoomInterface.Theater, capacity: 60 }],
      },
    ];
  }
  private createMockUsers(): UserInterface.IUser[] {
    return [
      {
        id: 1,
        name: 'Caroline Gibson',
      },
      {
        id: 2,
        name: 'Edgar Watkins',
      },
    ];
  }
}
