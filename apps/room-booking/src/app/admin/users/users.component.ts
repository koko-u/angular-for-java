import { UserInterface } from '@angular-for-java/api-interfaces';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DataService } from '../../services/data/data.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map, Observable, of, switchMap } from 'rxjs';

const userId = (paramMap: ParamMap): number | undefined => {
  if (paramMap.has('userId')) {
    const userId = Number(paramMap.get('userId'));
    if (isNaN(userId)) {
      return undefined;
    } else {
      return userId;
    }
  } else {
    return undefined;
  }
};

@Component({
  selector: 'rbg-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class UsersComponent implements OnInit {
  users$!: Observable<UserInterface.IUser[]>;
  selectedUser$!: Observable<UserInterface.IUser | undefined>;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.users$ = this.dataService.getAllUsers();
    this.selectedUser$ = this.route.queryParamMap.pipe(
      map(userId),
      switchMap((userId) => {
        if (userId) {
          return this.dataService.findUserById(userId);
        } else {
          return of(undefined);
        }
      })
    );
  }

  viewUser(userId: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { userId: userId },
    });
  }
}
