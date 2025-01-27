import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { CanvasJSAngularChartsModule, CanvasJSChart } from '@canvasjs/angular-charts';
import { RouterLink } from '@angular/router';

@Component({
    standalone: true,
    selector: 'app-dashbord',
    imports: [CommonModule, CanvasJSAngularChartsModule, RouterLink],
    templateUrl: './dashbord.component.html',
    styleUrl: './dashbord.component.css'
})
export class DashbordComponent implements OnInit, AfterViewInit {

    chart: CanvasJSChart = new CanvasJSChart();
 
	chartOptions = {
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
   
    constructor(){
    }

    ngAfterViewInit(): void {
        document.querySelector(".canvasjs-chart-credit")?.classList.add("hidden");
        console.log( document.querySelector(".canvasjs-chart-credit"));
    }
    
    ngOnInit(): void {
        initFlowbite();
    }

    

}
