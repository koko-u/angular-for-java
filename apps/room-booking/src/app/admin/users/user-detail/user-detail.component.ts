import { Component, OnInit } from '@angular/core';
import { UserInterface } from '@angular-for-java/api-interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { userId } from '../shared';
import { DataService } from '../../../services/data/data.service';

@Component({
  selector: 'rbg-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  user$!: Observable<UserInterface.IUser | undefined>;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user$ = this.route.queryParamMap.pipe(
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

  async onEditClick() {
    await this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { action: 'edit' },
      queryParamsHandling: 'merge',
    });
  }
}
