import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { UserServiceImpl } from '../../../../core/services/impl/user.service.impl';
import { UserDto } from '../../../../core/models/user/user-dto';
import { SecurityServiceImpl } from '../../../../core/services/impl/security.service.impl';
import { InstituteUserDTO } from '../../../../core/models/institution/institute-user-dto';
import { RestResponse } from '../../../../core/models/rest-response';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{

  allUsers: InstituteUserDTO[] = []; 
  lastAddedUsers: InstituteUserDTO[] = []; 
  connectedUser: UserDto = inject(SecurityServiceImpl).getConnectedUser(); 
  totalUsers : number = 0;
  newUsersThisMonth : number = 0;
  activeUsers : number = 0;
  inactiveUsers : number = 0;


  profils = ['Trader', 'Validateur', 'Opérateur', 'Admin Institution'];
  
  profilColors : { [key: string]: string } = {
    'Trader': 'bg-yellow-100 text-yellow-700',
    'Validateur': 'bg-blue-100 text-blue-700',
    'Opérateur': 'bg-green-100 text-green-700',
    'Admin Institution': 'bg-purple-100 text-purple-700'
  };

  couleursMo: { [key: string]: string } = {
    "Non justifié": "#FFC0CB",
    "RCR": "#FFFF00",
    "CP": "#ADD8E6",
    "Ecole": "#00FFFF",
    "Arret maladie": "#FF69B4",
    "Enfant malade": "#FFD700",
    "Déplacement": "#FF4500",
    "Congé de naissance": "#90EE90",
    "Congé d'accueil": "#ac8def",
    "Congé paternité": "#6bb4ef"
  };

  couleursMotif: { [key: string]: string } = {
    "Trader": "#FFC0CB", // jaune 
    "Validateur": "#93c5fd",// bleu
    "Opérateur": "#bbf7d0",// vert
    "Admin Institution": "#ddd6fe",// violet
  };


  constructor(
    private userService: UserServiceImpl,
  ){}

  ngOnInit(): void {
    initFlowbite();
    this.userService.getUserByInstitutionId(this.connectedUser.institutionId!).subscribe((res: RestResponse<InstituteUserDTO[]>)=>{
      if (res.statusCode == 200) {
        this.allUsers = res.data!.reverse();
        this.totalUsers = this.allUsers.length;
        this.newUsersThisMonth = this.allUsers.filter(user => user.createdAt && new Date(user.createdAt).getMonth() === new Date().getMonth() && new Date(user.createdAt).getFullYear() === new Date().getFullYear()).length;
        this.activeUsers = this.allUsers.filter(user => user.status =="ENABLED").length;
        this.inactiveUsers = this.allUsers.filter(user => user.status !="ENABLED").length;
        this.lastAddedUsers = this.allUsers.slice(0, 4);
        this.renderChart();
        
      }
    });

    
  }

  renderChart(){
    let data = [];

    for(let profil of this.profils){
      data.push(this.allUsers.filter(user => user.profile == profil).length);
    }
    const myChart = new Chart("piechart",{
      type: 'pie',
      data: {
        labels: this.profils,
        datasets: [
          {
            label: 'Nombre d\'utilisateurs',
            data: data,
            backgroundColor: ["#FFC0CB", "#FFFF00", "#ADD8E6", "#00FFFF",],
            hoverOffset: 4,
          },
        ],
      
      },
      options: {
        responsive: true,
        // scales:{
        //   y:{
        //     beginAtZero: true,
        //     // ticks:{
        //     //   stepSize: 1,
        //     // }
        //   }
        // }
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              pointStyle: 'circle',
              usePointStyle: true,
            }
          },
        },
      },
    });


  }

}
