import { UserInterface } from '@angular-for-java/api-interfaces';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Action, Create, View } from '../../models/action.model';
import { action } from '../../shared';

@Component({
  selector: 'rbg-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class UsersComponent implements OnInit {
  users$!: Observable<UserInterface.IUser[]>;
  action$!: Observable<Action>;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.users$ = this.dataService.getAllUsers();
    this.action$ = this.route.queryParamMap.pipe(map(action));
  }

  async viewUser(userId: number) {
    await this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { userId: userId, action: View },
    });
  }

  async onAddClick() {
    await this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { action: Create },
    });
  }
}
