import { Injectable } from '@angular/core';
import { RoomInterface, UserInterface } from '@angular-for-java/api-interfaces';
import { EMPTY, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private _rooms: RoomInterface.IRoom[];
  private _users: UserInterface.IUser[];

  constructor() {
    this._rooms = this.createMockRooms();
    this._users = this.createMockUsers();
  }

  getAllRooms(): Observable<RoomInterface.IRoom[]> {
    return of(this._rooms);
  }
  getAllUsers(): Observable<UserInterface.IUser[]> {
    return of(this._users);
  }

  findRoomById(roomId: number): Observable<RoomInterface.IRoom | undefined> {
    return of(this._rooms.find((room) => room.id === roomId));
  }
  findUserById(userId: number): Observable<UserInterface.IUser | undefined> {
    return of(this._users.find((user) => user.id === userId));
  }

  updateUser(userId: number, name: string): Observable<UserInterface.IUser> {
    const user = this._users.find((u) => u.id === userId);
    if (user) {
      user.name = name;
      return of(user);
    } else {
      return EMPTY;
    }
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

  createUser(name: string, password: string): Observable<UserInterface.IUser> {
    const maxId = this._users.reduce((acc, user) => {
      return user.id > acc ? user.id : acc;
    }, 0);
    const user = {
      id: maxId + 1,
      name,
    };
    this._users.push(user);
    return of(user);
  }
}
