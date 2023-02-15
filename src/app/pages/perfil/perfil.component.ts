import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { FileUploadService } from 'src/app/services/fileupload.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [],
})
export class PerfilComponent implements OnInit {
  public perfilForm!: FormGroup;
  public usuario: Usuario;
  public imagenSubir?: File;
  public imgTemp?: any;

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuarioService,
    private fileUploadService: FileUploadService
  ) {
    this.usuario = this.usuariosService.usuario;
  }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.email]],
    });
  }

  actualizarPerfil() {
    this.usuariosService
      .actualizarPerfil(
        this.perfilForm.get('nombre')?.value,
        this.perfilForm.get('email')?.value
      )
      .subscribe(
        (resp) => {
          console.log(resp);
          const { nombre, email } = this.perfilForm.value;
          this.usuario.nombre = nombre;
          this.usuario.email = email;

          Swal.fire('Guardado', 'Los cambios fueron guardados', 'success');
        },
        (err) => {
          Swal.fire('Error', err.error.msg, 'error');
        }
      );
  }

  cambiarImagen(event: any) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    this.imagenSubir = file;

    // obtener imagen en base64
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    };
  }

  subirImagen() {
    if (this.imagenSubir) {
      this.fileUploadService
        .actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid!)
        .then((img) => {
          this.usuario.img = img;
          Swal.fire('Guardado', 'Imagen de usuario actualizada', 'success');
        })
        .catch((err) => {
          console.error(err);
          Swal.fire('Error', 'No se pudo subir la imagen', 'error');
        });
    }
  }
}
