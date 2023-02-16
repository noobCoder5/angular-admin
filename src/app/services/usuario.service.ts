import { HttpClient } from '@angular/common/http';
import { ElementRef, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, delay, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';

import jwt_decode from 'jwt-decode';
import { Usuario } from '../models/usuario.model';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

const base_url = environment.base_url;

declare const google: any;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  public usuario!: Usuario;

  constructor(private http: HttpClient, private router: Router) {}

  get headers(): any {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

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
        //const { sub } = this.decodeGoogleToken(response.credential);
        //localStorage.setItem('googleId', sub);
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

    /*const googleId = localStorage.getItem('googleId') || null;

    localStorage.removeItem('googleId');

    if (googleId) {
      google.accounts.id.revoke(googleId, () => {
        this.router.navigateByUrl('/auth/login');
      });
    } else {
      this.router.navigateByUrl('/auth/login');
    }*/

    try {
      if (this.usuario.google) {
        google.accounts.id.revoke(this.usuario.email, () => {
          this.router.navigateByUrl('/auth/login');
        });
      } else {
        this.router.navigateByUrl('/auth/login');
      }
    } catch (error) {
      this.router.navigateByUrl('/auth/login');
    }
  }

  validarToken(): Observable<boolean> {
    return this.http.get(`${base_url}/login/renew`, this.headers).pipe(
      map((resp: any) => {
        localStorage.setItem('token', resp.token);
        const { email, google, nombre, role, img, uid } = resp.usuario;
        this.usuario = new Usuario(nombre, email, '', img, google, role, uid);
        return true;
      }),
      catchError((error) => of(false))
    );
  }

  crearUsuario(formData: RegisterForm) {
    return this.http.post(`${base_url}/usuarios`, formData).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      })
    );
  }

  login(formData: LoginForm) {
    return this.http.post(`${base_url}/login`, formData).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      })
    );
  }

  loginGoogle(token: string) {
    return this.http.post(`${base_url}/login/google`, { token }).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      })
    );
  }

  actualizarPerfil(nombre: string, email: string): Observable<any> {
    let data: any = { nombre, email };
    data = { ...data, role: this.usuario.role || '' };

    console.log(data);

    return this.http.put(
      `${base_url}/usuarios/${this.uid}`,
      data,
      this.headers
    );
  }

  cargarUsuarios(desde: number = 0): Observable<CargarUsuario> {
    const url = `${base_url}/usuarios?desde=${desde}`;

    return this.http.get<CargarUsuario>(url, this.headers).pipe(
      /*delay(5000),*/
      map((resp: any) => {
        const usuarios: Usuario[] = resp.usuarios.map((u: any) => new Usuario(u.nombre, u.email, '', u.img, u.google, u.role, u.uid));
        resp.usuarios = usuarios;
        return resp;
      })
    );
  }
}
