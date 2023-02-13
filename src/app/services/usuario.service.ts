import { HttpClient } from '@angular/common/http';
import { ElementRef, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';

import jwt_decode from 'jwt-decode';

const base_url = environment.base_url;

declare const google: any;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  constructor(private http: HttpClient, private router: Router) {}

  googleInit(googleBtn: ElementRef<any>) {
    google.accounts.id.initialize({
      client_id:
        '142234242342-qpsij9vo70h10jkttifo7vkquenke493.apps.googleusercontent.com',
      callback: (response: any) => this.handleCredentialResponse(response),
    });

    google.accounts.id.renderButton(
      googleBtn.nativeElement,
      { theme: 'outline', size: 'large' } // customization attributes
    );
  }

  handleCredentialResponse(response: any) {
    console.log('Encoded JWT ID token: ' + response.credential);
    this.loginGoogle(response.credential).subscribe(
      (resp) => {
        const { sub } = this.decodeGoogleToken(response.credential);
        localStorage.setItem('googleId', sub);
        this.router.navigateByUrl('/');
      },
      (err) => console.error
    );
  }

  decodeGoogleToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (err) {
      return null;
    }
  }

  logout() {
    localStorage.removeItem('token');

    const googleId = localStorage.getItem('googleId') || null;

    localStorage.removeItem('googleId');

    if (googleId) {
      google.accounts.id.revoke(googleId, () => {
        this.router.navigateByUrl('/auth/login');
      });
    } else {
      this.router.navigateByUrl('/auth/login');
    }
  }

  validarToken(): Observable<boolean> {
    const token = localStorage.getItem('token') || '';

    return this.http
      .get(`${base_url}/login/renew`, {
        headers: {
          'x-token': token,
        },
      })
      .pipe(
        tap((resp: any) => {
          if (resp.token) {
            localStorage.setItem('token', resp.token);
          }
        }),
        map((resp) => {
          return true;
        }),
        catchError((error) => of(false))
      );
  }

  crearUsuario(formData: RegisterForm) {
    return this.http.post(`${base_url}/usuarios`, formData).pipe(
      tap((resp: any) => {
        if (resp.token) {
          localStorage.setItem('token', resp.token);
        }
      })
    );
  }

  login(formData: LoginForm) {
    return this.http.post(`${base_url}/login`, formData).pipe(
      tap((resp: any) => {
        if (resp.token) {
          localStorage.setItem('token', resp.token);
        }
      })
    );
  }

  loginGoogle(token: string) {
    return this.http.post(`${base_url}/login/google`, { token }).pipe(
      tap((resp: any) => {
        if (resp.token) {
          localStorage.setItem('token', resp.token);
        }
      })
    );
  }
}
