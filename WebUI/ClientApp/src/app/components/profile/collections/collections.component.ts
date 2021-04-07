import { Component, Inject, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { API_URL, DEFAULT_COLLECTION_COVER } from 'src/app/app-injection-tokens';
import { UserCollectionDto } from 'src/app/models/dtos/user-collections.dto';
import { AuthService } from 'src/app/services/auth.service';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss']
})
export class CollectionsComponent implements OnInit {

  private currentUserLogin = '';
  private collections$ = new Subject<UserCollectionDto[]>();

  private searchTimeout: any;

  public collections = this.collections$.asObservable();
  public totalCount = -1;

  public searchString = '';

  public pageSize = 12;
  public pageIndex = 0;

  public constructor(
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(API_URL) private apiUrl: string,
    @Inject(DEFAULT_COLLECTION_COVER) private defaultCover: string
  ) {
    this.collections.subscribe(collections => console.log(collections));
  }

  public ngOnInit(): void {
    this.route.parent.paramMap.subscribe(params => {
      this.currentUserLogin = params.get('login');
      this.getCollections('', this.pageSize, 0);
    });
  }

  public getCollectionCover(coverPath: string): string {
    if (!coverPath) {
      return this.defaultCover;
    }

    return this.apiUrl + coverPath;
  }

  public isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  public searchCollections(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.pageIndex = 0;
      this.getCollections(this.searchString, this.pageSize, this.pageIndex);
    }, 700);
  }

  public clearSearch(): void {
    this.searchString = '';
    this.pageIndex = 0;
    this.getCollections('', this.pageSize, this.pageIndex);
  }

  public pageChanged(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getCollections(this.searchString, event.pageSize, event.pageIndex);
  }

  private getCollections(searchString: string, pageSize: number, pageIndex: number): void {
    this.userService.getCollections({ login: this.currentUserLogin, searchString, pageSize, pageIndex }).subscribe(response => {
      this.totalCount = response.totalCount;
      this.collections$.next(response.items);
    });
  }
}
