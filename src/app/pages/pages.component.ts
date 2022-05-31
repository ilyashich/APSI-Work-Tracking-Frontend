import { SidebarComponent } from '@syncfusion/ej2-angular-navigations';
import { ButtonComponent } from "@syncfusion/ej2-angular-buttons";
import { Component, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth-service';

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

    constructor(private router: Router, private authService: AuthService) {
      switch (this.authService.userData.role) {
        case 'EMPLOYEE':
          this.menuList = [
            {
              name: 'Moje projekty', 
              icon: 'house-fill',
              url: '/pages/my_projects'
            }
          ]
          break;

        case 'MANAGER':
        this.menuList = [
          {
            name: 'Dashboard', 
            icon: 'house-fill',
            url: '/pages/dashboard'
          },
          {
            name: 'Moje projekty', 
            icon: 'house-fill',
            url: '/pages/my_projects'
          }
        ]
        break;

        case 'CLIENT':
        this.menuList = [
          {
            name: 'Dashboard', 
            icon: 'house-fill',
            url: '/pages/dashboard'
          }
        ]
        break;
      }
      this.menuList = [
        {
          name: 'Dashboard', 
          icon: 'house-fill',
          url: '/pages/dashboard'
        }
      ]
    }
  
    ngOnInit(): void {
        //this.togglebtn.content = 'Close';
        //this.sidebar.show();
        //document.getElementById("head").scrollIntoView();
    }

    logout() {
      this.authService.logout();
    }

    pageChangeEvent(event) {
        this.togglebtn.content = 'Zamknij';
        this.sidebar.show();
      }

    public onCreated(args: any) {
        this.sidebar.show();
    }

    btnClick() {
        if (this.togglebtn.element.classList.contains('e-active')) {
            this.togglebtn.content = 'Otwórz';
            this.sidebar.hide();
        } else {
            this.togglebtn.content = 'Zamknij';
            this.sidebar.show();
        }
    }

    touchstart() {
        this.timeout = setInterval(() => {
            this.togglebtn.content = 'Otwórz';
            this.sidebar.hide();
        }, 200);
      };
    
      touchend() {
        clearInterval(this.timeout);
      };
}