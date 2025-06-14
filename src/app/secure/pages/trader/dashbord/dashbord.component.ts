import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { CanvasJSAngularChartsModule, CanvasJSChart } from '@canvasjs/angular-charts';
import { RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { InvitationComponent } from './invitation/invitation.component';

@Component({
    standalone: true,
    selector: 'app-dashbord',
    imports: [CommonModule, CanvasJSAngularChartsModule, RouterLink],
    templateUrl: './dashbord.component.html',
    styleUrl: './dashbord.component.css'
})
export class DashbordComponent implements OnInit, AfterViewInit {
	today = Date();
    chart: CanvasJSChart = new CanvasJSChart();

	
	horizontalPosition: MatSnackBarHorizontalPosition = 'center';
	verticalPosition: MatSnackBarVerticalPosition = 'top';
 
	chartOptionsAOT = {
		animationEnabled: true,
		theme: "light2",
		title:{
			text: "OAT"
		},
		axisY: {
			// title: "Number of Orders",
			includeZero: true
		},
		axisY2: {
			// title: "Total Revenue",
			includeZero: true,
			// labelFormatter: (e:any) => {
			// 	var suffixes = ["", "K", "M", "B"];
	
			// 	var order = Math.max(Math.floor(Math.log(e.value) / Math.log(1000)), 0);
			// 	if(order > suffixes.length - 1)
			// 	order = suffixes.length - 1;
	
			// 	var suffix = suffixes[order];
			// 	return '$' + (e.value / Math.pow(1000, order)) + suffix;
			// }
		},
		toolTip: {
			shared: true
		},
		legend: {
			cursor: "pointer",
			// Quand on clique sur legend pour cacher ou afficher
			// itemclick: function (e: any) {
			// 	if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
			// 		e.dataSeries.visible = false;
			// 	} else {
			// 		e.dataSeries.visible = true;
			// 	} 
			// 	e.chart.render();
			// }
		},
		data: [{
			type: "column",
			showInLegend: true,
			name: "Volumes transigés (J)",
			axisYType: "secondary",
			// yValueFormatString: "$#,###",
			dataPoints: [
				{ label: "7H", y: 250000 },
				{ label: "8H", y: 431000 },
				{ label: "9H", y: 646000 },
				{ label: "10H", y: 522000 },
				{ label: "11H", y: 464000 },
				{ label: "12H", y: 470000 },
				{ label: "13H", y: 534000 },
				{ label: "14H", y: 407000 },
				{ label: "15H", y: 484000 },
				{ label: "16H", y: 465000 },
				{ label: "17H", y: 424000 }
			]
			},{
			type: "spline",
			showInLegend: true,
			name: "Valeurs transigées (J)",
			dataPoints: [
				{ label: "7H", y: 372 },
				{ label: "8H", y: 412 },
				{ label: "9H", y: 572 },
				{ label: "10H", y: 224 },
				{ label: "11H", y: 246 },
				{ label: "12H", y: 601 },
				{ label: "13H", y: 642 },
				{ label: "14H", y: 590 },
				{ label: "15H", y: 527 },
				{ label: "16H", y: 273 },
				{ label: "17H", y: 251 }
			]
		}]
	}

	chartOptionsBAT = {
		animationEnabled: true,
		theme: "light2",
		title:{
			text: "BAT"
		},
		axisY: {
			// title: "Number of Orders",
			includeZero: true
		},
		axisY2: {
			// title: "Total Revenue",
			includeZero: true,
			// labelFormatter: (e:any) => {
			// 	var suffixes = ["", "K", "M", "B"];
	
			// 	var order = Math.max(Math.floor(Math.log(e.value) / Math.log(1000)), 0);
			// 	if(order > suffixes.length - 1)
			// 	order = suffixes.length - 1;
	
			// 	var suffix = suffixes[order];
			// 	return '$' + (e.value / Math.pow(1000, order)) + suffix;
			// }
		},
		toolTip: {
			shared: true
		},
		legend: {
			cursor: "pointer",
			// Quand on clique sur legend pour cacher ou afficher
			// itemclick: function (e: any) {
			// 	if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
			// 		e.dataSeries.visible = false;
			// 	} else {
			// 		e.dataSeries.visible = true;
			// 	} 
			// 	e.chart.render();
			// }
		},
		data: [{
			type: "column",
			showInLegend: true,
			name: "Volumes transigés (J)",
			axisYType: "secondary",
			// yValueFormatString: "$#,###",
			dataPoints: [
				{ label: "7H", y: 260000 },
				{ label: "8H", y: 231000 },
				{ label: "9H", y: 546000 },
				{ label: "10H", y: 122000 },
				{ label: "11H", y: 134000 },
				{ label: "12H", y: 270000 },
				{ label: "13H", y: 234000 },
				{ label: "14H", y: 307000 },
				{ label: "15H", y: 484000 },
				{ label: "16H", y: 365000 },
				{ label: "17H", y: 424000 }
			]
			},{
			type: "spline",
			showInLegend: false,
			name: "Valeurs transigées (J)",
			dataPoints: [
				{ label: "7H", y: 105 },
				{ label: "8H", y: 58 },
				{ label: "9H", y: 205 },
				{ label: "10H", y: 122 },
				{ label: "11H", y: 246 },
				{ label: "12H", y: 163 },
				{ label: "13H", y: 256 },
				{ label: "14H", y: 305 },
				{ label: "15H", y: 180 },
				{ label: "16H", y: 273 },
				{ label: "17H", y: 305 }
			]
		}]
	}
   
    constructor(
		private dialog: MatDialog,
		private snackBar: MatSnackBar,
	){
    }

    ngAfterViewInit(): void {
        document.querySelector(".canvasjs-chart-credit")?.classList.add("hidden");
        console.log( document.querySelector(".canvasjs-chart-credit"));
    }
    
    ngOnInit(): void {
        initFlowbite();
    }

    
	openDialogInvitation(){
    const dialogRef = this.dialog.open(InvitationComponent,{width:'70%', disableClose: true});
    dialogRef.afterClosed().subscribe((result:any)=>{
      if(result){
        console.log("Type", result);

        if (result.statusCode==204) {
          this.snackBar.open("Votre invitation a été envoyée avec succès! \nNous vous remercions pour votre marque de confiance","Ok",{
            duration: 8000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        } else {
          this.snackBar.open("Une erreur s'est produite lors de l'envoi. Veuillez rééssayer !","Ok",{
            duration: 5000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      }
    })
  }

}
