import { SidebarComponent } from '@syncfusion/ej2-angular-navigations';
import { ButtonComponent } from "@syncfusion/ej2-angular-buttons";
import { Component, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'pages',
    styleUrls: ['pages.component.scss'],
    templateUrl: 'pages.component.html',
    encapsulation: ViewEncapsulation.None
})
export class PagesComponent implements OnInit {

    @ViewChild('sidebar') sidebar: SidebarComponent;
    public type: string = 'Push';
    public target: string = 'content';
    public enablePersistence: boolean = true;
    @ViewChild('togglebtn')
    public togglebtn: ButtonComponent;
    public menuList: { [key: string]: string | object }[];
    private timeout: any;

    constructor(private router: Router) {
      this.menuList = [
        {
          name: 'Dashboard', 
          icon: 'house-fill',
          url: '/pages/dashboard'
        }
      ]
    }
  
    ngOnInit(): void {
        this.togglebtn.content = 'Close';
        this.sidebar.show();
        document.getElementById("head").scrollIntoView();
    }

    pageChangeEvent(event) {
        this.togglebtn.content = 'Close';
        this.sidebar.show();
      }

    public onCreated(args: any) {
        this.sidebar.show();
    }

    btnClick() {
        if (this.togglebtn.element.classList.contains('e-active')) {
            this.togglebtn.content = 'Open';
            this.sidebar.hide();
        } else {
            this.togglebtn.content = 'Close';
            this.sidebar.show();
        }
    }

    touchstart() {
        this.timeout = setInterval(() => {
            this.togglebtn.content = 'Open';
            this.sidebar.hide();
        }, 200);
      };
    
      touchend() {
        clearInterval(this.timeout);
      };
}