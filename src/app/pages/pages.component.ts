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
      switch (this.authService.userData ? this.authService.userData.role : '') {
        case 'USER':
          this.menuList = [
            {
              name: 'Moje projekty', 
              icon: 'house-fill',
              url: '/pages/dashboard',
              id: 'projects'
            },
            {
              name: 'Moje czynności', 
              icon: 'list-task',
              url: '/pages/dashboard',
              id: 'jobs'
            }
          ]
          break;

        case 'ADMIN':
          this.menuList = [
            {
              name: 'Pracownicy', 
              icon: 'person-fill',
              url: '/pages/dashboard',
              id: 'employees'
            },
            {
              name: 'Projekty', 
              icon: 'house-fill',
              url: '/pages/dashboard',
              id: 'projects'
            },
            {
              name: 'Czynności do akceptacji', 
              icon: 'list-check',
              url: '/pages/dashboard',
              id: 'jobs'
            },
            {
              name: 'Repozytorium problemów', 
              icon: 'exclamation-circle-fill',
              url: '/pages/dashboard',
              id: 'problems'
            }
          ]
          break;

        case 'CLIENT':
          this.menuList = [
            {
              name: 'Czynności', 
              icon: 'list-check',
              url: '/pages/dashboard',
              id: 'jobs'
            }
          ]
          break;

        default:
          this.menuList = [
            {
              name: 'Czynności', 
              icon: 'list-check',
              url: '/pages/dashboard',
              id: 'jobs'
            }
          ]
          break;
          
      }
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