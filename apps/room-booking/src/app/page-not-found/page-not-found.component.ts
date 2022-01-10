import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons/faQuestionCircle';

@Component({
  selector: 'rbg-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageNotFoundComponent implements OnInit {
  questionCircle = faQuestionCircle;

  constructor() {}

  ngOnInit(): void {}
}
