import { ILayoutCapacity, IRoom } from '@angular-for-java/api-interfaces';

export class Room implements IRoom {
  constructor(
    public id: number,
    public name: string,
    public location: string,
    public capacities: ILayoutCapacity[]
  ) {}
}
