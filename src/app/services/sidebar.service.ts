import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  menu: any[] = [
    {
      titulo: 'Dashboard!!',
      icono: 'mdi mdi-gauge',
      submenu: [
        {
          titulo: 'Main',
          url: '/',
        },
        {
          titulo: 'ProgressBar',
          url: 'progress',
        },
        {
          titulo: 'Gráficas',
          url: 'grafica1',
        },
        {
          titulo: 'Promesas',
          url: 'promesas'
        },
        {
          titulo: 'Rxjs',
          url: 'rxjs'
        },
        {
          titulo: 'Perfil de usuario',
          url: 'perfil'
        },
        {
          titulo: 'Usuarios',
          url: 'usuarios'
        },
        {
          titulo: 'Hospitales',
          url: 'hospitales'
        }
      ],
    },
  ];

  constructor() {}
}
