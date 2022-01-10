import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'rbg-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
