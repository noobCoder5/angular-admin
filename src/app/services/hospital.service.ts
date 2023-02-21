import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Hospital } from '../models/hospital.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class HospitalService {
  constructor(private http: HttpClient) {}

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

  cargarHospitales(): Observable<Hospital[]> {
    const url = `${base_url}/hospitales`;
    return this.http.get<Hospital[]>(url).pipe(
      map((resp: any) => {
        return resp.hospitales;
        /*const hospitales: Hospital[] = resp.hospitales.map(
            (hospital: any) => new Hospital(hospital.nombre, hospital._id, hospital.img, hospital.usuario)
          );
          return hospitales;*/
      })
    );
  }

  crearHospital(nombre: string) {
    const url = `${base_url}/hospitales`;
    return this.http.post(url, { nombre }, this.headers);
  }

  actualizarHospital(_id: string, nombre: string) {
    const url = `${base_url}/hospitales/${_id}`;
    return this.http.put(url, { nombre }, this.headers);
  }

  borrarHospital(_id: string) {
    const url = `${base_url}/hospitales/${_id}`;
    return this.http.delete(url, this.headers);
  }
}
