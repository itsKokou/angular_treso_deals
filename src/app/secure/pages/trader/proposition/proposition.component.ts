import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarModule, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ProposalResponse } from '../../../../core/models/carnet-ordre/proposal-response';
import { FormatNumberPipe } from '../../../../core/pipes/format-number.pipe';
import { initFlowbite } from 'flowbite';
import { PropositionServiceImpl } from '../../../../core/services/impl/proposition.service.impl';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PercentagePipe } from '../../../../core/pipes/percentage.pipe';

@Component({
  selector: 'app-proposition',
  imports: [CommonModule, MatProgressSpinner, MatPaginatorModule, MatProgressBarModule, MatSnackBarModule, FormatNumberPipe, MatTooltipModule, PercentagePipe],
  templateUrl: './proposition.component.html',
  styleUrl: './proposition.component.css'
})
export class PropositionComponent implements OnInit, AfterViewInit {
  isLoading: Boolean = false;
  totalElements: number = 0; 
  allDatas: ProposalResponse[] = []; 
  allDatasFiltered: ProposalResponse[] = []; 
  datasPaginated: ProposalResponse[] = []; 
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  selectedProposition: ProposalResponse = {};
  selectedStatut: string = "TOUT";

  constructor(
    private matPaginatorIntl:MatPaginatorIntl,
    private snackBar: MatSnackBar,
    private propositionService: PropositionServiceImpl
  ){}

  ngAfterViewInit(): void {
    initFlowbite();
    this.matPaginatorIntl.itemsPerPageLabel="Propositions par page";
    this.matPaginatorIntl.firstPageLabel = "Première page";
    this.matPaginatorIntl.lastPageLabel = "Dernière page";
    this.matPaginatorIntl.nextPageLabel = "Page suivante";
    this.matPaginatorIntl.previousPageLabel = "Page précédente";
  }

  ngOnInit(): void {
    this.propositionService.getTraderProposals().subscribe((res) => {
      if (res.statusCode == 200){
        this.allDatas = res.data!;
        this.allDatasFiltered = this.allDatas;
        this.totalElements = this.allDatasFiltered.length;
        this.datasPaginated = this.allDatasFiltered.slice(0 * 20, (0 + 1) * 20);
      }
    });
  }

  onPageChange(event: PageEvent) {
    console.log('Page change event:', event);
    this.datasPaginated = this.allDatasFiltered.slice(event.pageIndex*event.pageSize, (event.pageIndex + 1)*event.pageSize)
  }

  openSupprimerModal(btnSupprimer: HTMLButtonElement,proposal: ProposalResponse) {
    this.selectedProposition = proposal;
    btnSupprimer.click();
  }

  deleteProposition(){
   document.getElementById("openSpinner")?.click();
    this.propositionService.deleteProposition(this.selectedProposition.id!).subscribe((res) => {
      document.getElementById("closeSpinner")?.click();
      console.log(res);
      
      if (res.statusCode == 204){
        this.snackBar.open("Proposition supprimée avec succès", "Fermer", {
          duration: 5000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition
        });
        this.ngOnInit();
      }
    }) 
  }  

  filter() {
    if(this.selectedStatut == "TOUT"){
      this.allDatasFiltered = this.allDatas;
    }else{
      this.allDatasFiltered = this.allDatas.filter(item => item.status == this.selectedStatut);
    }

    this.totalElements = this.allDatasFiltered.length;
    this.datasPaginated = this.allDatasFiltered.slice(0*20, (0 + 1)*20)
  }

  filterByStatut(statut: string) {
    this.selectedStatut = statut;
    this.filter();
  }
}
