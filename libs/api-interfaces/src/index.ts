export * from './lib/api-interfaces';

export interface IRoom {
  id: number;
  name: string;
  location: string;
  capacities: ILayoutCapacity[];
}

export interface ILayoutCapacity {
  layout: Layout;
  capacity: number;
}

export enum Layout {
  Theater = 'Theater',
  UShape = 'U-Shape',
  Board = 'Board Meeting',
}
