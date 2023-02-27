import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../guards/admin.guard';
import { AuthGuard } from '../guards/auth.guard';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { HospitalesComponent } from './mantenimientos/hospitales/hospitales.component';
import { MedicoComponent } from './mantenimientos/medicos/medico.component';
import { MedicosComponent } from './mantenimientos/medicos/medicos.component';
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
import { PagesComponent } from './pages.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ProgressComponent } from './progress/progress.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'buscar/:termino',
        component: BusquedaComponent,
        data: {titulo: 'Búsquedas'}
      },
      {
        path: '',
        component: DashboardComponent,
         data: { titulo : 'Dashboard'} 
      },
      {
        path: 'progress',
        component: ProgressComponent,
        data: { titulo : 'ProgressBar'} 
      },
      {
        path: 'grafica1',
        component: Grafica1Component,
        data: { titulo : 'Gráfica 1'} 
      },
      {
        path: 'account-settings',
        component: AccountSettingsComponent,
        data: { titulo : 'Ajustes de cuenta'} 
      },
      {
        path: 'promesas',
        component: PromesasComponent,
        data: { titulo : 'Promesas'} 
      },
      {
        path: 'rxjs',
        component: RxjsComponent,
        data: { titulo : 'Rxjs'} 
      },
      {
        path: 'perfil',
        component: PerfilComponent,
        data: {titulo: 'Perfil'}
      },
      // Mantenimientos
      {
        path: 'usuarios',
        component: UsuariosComponent,
        data: {titulo: 'Usuarios'},
        canActivate: [AdminGuard]
      },
      {
        path: 'hospitales',
        component: HospitalesComponent,
        data: {titulo: 'Hospitales'}
      },
      {
        path: 'medicos',
        component: MedicosComponent,
        data: {titulo: 'Médicos'}
      },
      {
        path: 'medico/:id',
        component: MedicoComponent,
        data: {titulo: 'Médico'}
      }
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
