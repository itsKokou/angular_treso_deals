import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Route, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { SecurityServiceImpl } from '../../../core/services/impl/security.service.impl';
import { UserDto } from '../../../core/models/user/user-dto';
import { CommonModule } from '@angular/common';
import { NotificationDto } from '../../../core/models/notification/notification-dto';
import { NotificationServiceImpl } from '../../../core/services/impl/notification.service.impl';
import { RestResponse } from '../../../core/models/rest-response';
import { Subscription, switchMap, timer } from 'rxjs';

@Component({
    selector: 'app-trader-layout',
    imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
    templateUrl: './trader-layout.component.html',
    styleUrl: './trader-layout.component.css'
})
export class TraderLayoutComponent implements OnInit, OnDestroy {
  private securityService = inject(SecurityServiceImpl);
  connectedUser? : UserDto;
  page : any;

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
        // Réinitialisez les données ici
        const url = event.url.split('/')[2]
        if(url=="dashboard"){
          this.page = "Dashboard";
        }else if(url=="transaction"){
          this.page = "Mes Transactions";
        }else if(url=="trading"){
          this.page = "Trading";
        }else if(url=="carnet"){
          this.page = "Carnet d'ordres";
        }else if(url=="chat"){
          this.page = "Messagerie";
        }else if(url=="proposition"){
          this.page = "Mes Propositions";
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
