import { ILayoutCapacity, Layout } from '@angular-for-java/api-interfaces';

export class LayoutCapacity implements ILayoutCapacity {
  constructor(public layout: Layout, public capacity: number) {}
}
