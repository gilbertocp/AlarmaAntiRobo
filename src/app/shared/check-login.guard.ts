import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CheckLoginGuard implements CanActivate {

  constructor(
    private authSvc: AuthService, 
    private router: Router
  ) { }

  canActivate(): boolean  {
    if(this.authSvc.isLogged()){
      this.router.navigate(['/home'])
      return false;
    }else {
      return true;
    }
  }
  
}
