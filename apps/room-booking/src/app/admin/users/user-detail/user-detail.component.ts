import { Component, Input, OnInit } from '@angular/core';
import { UserInterface } from '@angular-for-java/api-interfaces';

@Component({
  selector: 'rbg-user-detail[user]',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  @Input()
  user!: UserInterface.IUser;

  constructor() {}

  ngOnInit(): void {}
}
