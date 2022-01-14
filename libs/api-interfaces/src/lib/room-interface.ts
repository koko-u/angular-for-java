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

export const Theater = 'Theater' as const;
export const UShape = 'U-Shape' as const;
export const Board = 'Board Meeting' as const;
export const Layouts = [Theater, UShape, Board] as const;

export type Layout = typeof Layouts[number];
