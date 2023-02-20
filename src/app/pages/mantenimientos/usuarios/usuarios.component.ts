import { Component, OnDestroy, OnInit } from '@angular/core';
import { delay, Subscription } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [],
})
export class UsuariosComponent implements OnInit, OnDestroy {
  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];

  public imgSubs!: Subscription;
  public desde: number = 0;
  public cargando: boolean = true;

  constructor(
    private usuariosService: UsuarioService,
    private busquedasService: BusquedasService,
    private modalImagenService: ModalImagenService
  ) {}

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarUsuarios();

    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe((img) => this.cargarUsuarios());
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuariosService.cargarUsuarios(this.desde).subscribe(
      ({ total, usuarios }) => {
        this.totalUsuarios = total;
        this.usuarios = usuarios;
        this.usuariosTemp = usuarios;
        this.cargando = false;
      },
      (err) => console.error
    );
  }

  cambiarPagina(valor: number) {
    this.desde += valor;

    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde > this.totalUsuarios) {
      this.desde -= valor;
    }

    this.cargarUsuarios();
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      this.usuarios = this.usuariosTemp;
      return;
    }

    this.busquedasService
      .buscar('usuarios', termino)
      .subscribe((resultados: any[]) => {
        this.usuarios = resultados;
      });
  }

  eliminarUsuario(usuario: Usuario): void {
    if (usuario.uid === this.usuariosService.usuario.uid) {
      Swal.fire('Error', 'No puede borrarse a si mismo', 'error');
      return;
    }

    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Está a punto de borrar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrarlo',
    }).then((result) => {
      if (result.value) {
        this.usuariosService.eliminarUsuario(usuario).subscribe(
          (resp) => {
            Swal.fire(
              'Usuario borrado',
              `${usuario.nombre} eliminado correctamente`,
              'success'
            );

            this.cargarUsuarios();
          },
          (err) => Swal.fire('Error al borrar', `${err.error.msg}`, 'error')
        );
      }
    });
  }

  cambiarRole(usuario: Usuario) {
    this.usuariosService.guardarUsuario(usuario).subscribe((resp) => {
      console.log(resp);
    });
  }

  abrirModal(usuario: Usuario) {
    this.modalImagenService.abrirModal('usuarios', usuario.uid!, usuario.img);
  }
}
