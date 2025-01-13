import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
    standalone: true,
    selector: 'app-dashbord',
    imports: [],
    templateUrl: './dashbord.component.html',
    styleUrl: './dashbord.component.css'
})
export class DashbordComponent implements OnInit {

    constructor(){
        localStorage.setItem("trader","Dashboard");
    }
    
    ngOnInit(): void {
        initFlowbite();
    }

}
