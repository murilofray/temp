import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../comum/services/auth.service';
import { from } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const token = localStorage.getItem('jwt');

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    return from(this.authService.verifyToken(token)).pipe(
      map((response) => {
        if (!response.ok) {
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      }),
      switchMap((isValid) => {
        if (!isValid) {
          this.router.navigate(['/login']);
        }
        return [isValid];
      }),
    );
  }
}
