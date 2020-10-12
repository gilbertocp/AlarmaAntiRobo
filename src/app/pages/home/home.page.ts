import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(public authSvc: AuthService, private router: Router) { }

  ngOnInit() {
  }

  logout(): void {
    this.authSvc.logout();
    this.router.navigate(['/login']);
  }

  toggleAlarm(e: any): void {
    const state = e.target.getAttribute('data-state');
  }
}
