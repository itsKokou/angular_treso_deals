import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TraderLayoutComponent } from '../../layouts/trader-layout/trader-layout.component';
import { DashbordComponent } from './dashbord/dashbord.component';
import { TransactionComponent } from './transaction/transaction.component';
import { TradingComponent } from './trading/trading.component';
import { ProfilDetailComponent } from './profil-detail/profil-detail.component';
import { CarnetOrdreComponent } from './carnet-ordre/carnet-ordre.component';
import { AddCarnetOrdreComponent } from './add-carnet-ordre/add-carnet-ordre.component';
import { ChatComponent } from './chat/chat.component';

const routes: Routes = [
  {
    path: '',
    component: TraderLayoutComponent,
    children: [
      {
        path:'dashboard',
        component: DashbordComponent
      },
      {
        path: 'transaction',
        component: TransactionComponent
      },
      {
        path: 'trading',
        component: TradingComponent
      },
      {
        path: 'profil',
        component: ProfilDetailComponent
      },
      {
        path: 'carnet/ordre',
        component: CarnetOrdreComponent
      },
      {
        path: 'carnet/ordre/form',
        component: AddCarnetOrdreComponent
      },
      {
        path: 'chat',
        component: ChatComponent
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TraderRoutingModule { }
