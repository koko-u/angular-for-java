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
    this._rooms = createMockRooms();
    this._users = createMockUsers();
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

  createRoom(
    roomCreate: Omit<RoomInterface.IRoom, 'id'>
  ): Observable<RoomInterface.IRoom> {
    const maxId = this._rooms.reduce((id, room) => {
      if (room.id > id) {
        return room.id;
      } else {
        return id;
      }
    }, 0);
    const capacities = roomCreate.capacities.filter(
      (capacityLayout) => capacityLayout.capacity > 0
    );
    const room = {
      id: maxId + 1,
      name: roomCreate.name,
      location: roomCreate.location,
      capacities,
    };

    this._rooms.push(room);

    return of(room);
  }

  updateRoom(
    roomId: number,
    roomUpdate: Omit<RoomInterface.IRoom, 'id'>
  ): Observable<RoomInterface.IRoom> {
    const room = this._rooms.find((r) => r.id === roomId);
    if (room) {
      const capacities = roomUpdate.capacities.filter(
        (capacityLayout) => capacityLayout.capacity > 0
      );
      room.name = roomUpdate.name;
      room.location = roomUpdate.location;
      room.capacities = capacities;

      return of(room);
    } else {
      return EMPTY;
    }
  }
}

function createMockRooms(): RoomInterface.IRoom[] {
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
function createMockUsers(): UserInterface.IUser[] {
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
