import { Component, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    styleUrls: ['app.component.scss'],
    template: '<router-outlet></router-outlet>',
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

    constructor(private router: Router) {

    }
  
    ngOnInit(): void {

    }

}