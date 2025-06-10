import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { UserDto } from '../../../core/models/user/user-dto';
import { SecurityServiceImpl } from '../../../core/services/impl/security.service.impl';
import { CommonModule } from '@angular/common';
import { Subscription, timer, switchMap } from 'rxjs';
import { NotificationDto } from '../../../core/models/notification/notification-dto';
import { RestResponse } from '../../../core/models/rest-response';
import { NotificationServiceImpl } from '../../../core/services/impl/notification.service.impl';

@Component({
    selector: 'app-gestion-layout',
    imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
    templateUrl: './gestion-layout.component.html',
    styleUrl: './gestion-layout.component.css'
})
export class GestionLayoutComponent implements OnInit, OnDestroy {
  private securityService = inject(SecurityServiceImpl);
  connectedUser? : UserDto;
  page : any = "Dashboard";

  notificationCount: number = 0;
  notificationCountToShow: number = 10;
  notifications: NotificationDto[] = [];

  private refreshSubscription!: Subscription;
  private visibilityChangeHandler = this.handleVisibilityChange.bind(this);
  private isRefreshing = false;

  constructor(
    private router: Router,
    private notificationService: NotificationServiceImpl
  ){
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = event.url.split('/')[2]
        if(url=="dashboard"){
          this.page = "Dashboard";
        }else if(url=="adhesions"){
          this.page = "Adhésions";
        }else if(url=="profils"){
          this.page = "Profils";
        }
      }
    });
  }

  ngOnInit(): void {
    initFlowbite();
    this.connectedUser = this.securityService.getConnectedUser();
    document.addEventListener('visibilitychange', this.visibilityChangeHandler);
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    this.stopAutoRefresh();
    document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
  }

  deconnexion(){
    localStorage.clear();
    this.securityService.isAuthenticated = false;
    this.router.navigateByUrl('/login');
  }

  hideSideBar(){
    document.getElementById("largeSidebar")?.classList.add("hidden");
    document.getElementById("smallSidebar")?.classList.remove("hidden");
    document.getElementById("main")?.classList.remove("xl:ml-68.5");
    document.getElementById("main")?.classList.add("xl:ml-8");
  }

  showSideBar(){
    document.getElementById("smallSidebar")?.classList.add("hidden");
    document.getElementById("largeSidebar")?.classList.remove("hidden");
    document.getElementById("main")?.classList.remove("xl:ml-8");
    document.getElementById("main")?.classList.add("xl:ml-68.5");
  }

  showAllNotifications(){
    document.getElementById("notif-modal-button")?.click();
  }

  markAsRead(idNotification: number){
    this.notificationService.ReadNotification(idNotification).subscribe((response : RestResponse<any>) => {
      //204 success
      console.log(response);
    });
  }

  markAllAsRead(){
    let tab = this.notifications.filter(notif => notif.status == "PENDING");
    for(let notif of tab){
      this.markAsRead(notif.id);
    }
  }

  private startAutoRefresh() {
    if (this.isRefreshing) return;
    this.isRefreshing = true;
    this.refreshSubscription = timer(0, 3000)
    .pipe(
      switchMap(() => this.notificationService.getAllNotification())
    )
    .subscribe((response : RestResponse<NotificationDto[]>) => {
      this.notifications = response.data?.filter(notif => notif.status == "PENDING") || [];
      this.notificationCount = this.notifications.length;
    });
  }

  private stopAutoRefresh() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
      this.isRefreshing = false;
    }
  }

  private handleVisibilityChange() {
    if (document.visibilityState === 'hidden') {
      this.stopAutoRefresh();
    } else if (document.visibilityState === 'visible') {
      this.startAutoRefresh();
    }
  }
}
