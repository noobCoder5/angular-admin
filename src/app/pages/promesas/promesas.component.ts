import { Component, OnInit } from '@angular/core';
import { resolve } from 'chart.js/dist/helpers/helpers.options';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [],
})
export class PromesasComponent implements OnInit {
  ngOnInit(): void {
    const promesa = new Promise((resolve, reject) => {
      if (false) {
        resolve('Hola Mundo');
      } else {
        reject('Algo salio mal');
      }
    });

    promesa
      .then((mensaje) => {
        console.log(mensaje);
      })
      .catch((e) => console.log('Error en mi promesa', e));

    this.getUsuarios()
      .then((usuarios: any) => {
        console.log(usuarios);
        (<any[]>usuarios).forEach((usuario) => {
          console.log(usuario.email);
        });
      })
      .catch((err) => console.log(err));
  }

  getUsuarios() {
    const promesa = new Promise((resolve, reject) => {
      fetch('https://reqres.in/api/users')
        .then((resp) => resp.json())
        .then((body) => resolve(body.data))
        .catch((err) => reject(err));
    });

    return promesa;
  }
}
