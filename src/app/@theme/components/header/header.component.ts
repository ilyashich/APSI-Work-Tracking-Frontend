import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ContextProvider } from '../../../@services/context.provider';
import { RestApiService } from '../../../@services/rest_api.service';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;
  selectedContext: string = 'ALL';
  currentTheme = 'default';
  availableContexts: string[] = ['ALL'];

  userMenu = [{ title: 'Profile' }, { title: 'Log out' }];

  constructor(private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private userService: UserData,
    private breakpointService: NbMediaBreakpointsService,
    private contextProvider: ContextProvider,
    private restApiService: RestApiService) {
  }

  ngOnInit() {
    this.restApiService.get_contexts();
    // -------------------------------------------------------------------------
    this.contextProvider.getApiContext().subscribe((apiContext) => {
      this.selectedContext = apiContext;
    });
    // -------------------------------------------------------------------------
    this.contextProvider.getApiContexts().subscribe((apiContexts) => {
      this.availableContexts.splice(0, this.availableContexts.length);
      for (let index = 0; index < apiContexts.length; index++) {
        this.availableContexts.push(apiContexts[index]);
      }
    });
    // -------------------------------------------------------------------------
    this.currentTheme = this.themeService.currentTheme;
    // -------------------------------------------------------------------------
    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: any) => this.user = users.nick);

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
    )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
    )
      .subscribe(themeName => this.currentTheme = themeName);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  changeApiContext(selectedContext: string) {
    this.contextProvider.setApiContext(selectedContext);
  }
}
