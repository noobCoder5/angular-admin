import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/fileupload.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [],
})
export class ModalImagenComponent implements OnInit {
  public imagenSubir?: File;
  public imgTemp?: any;

  constructor(
    public modalImagenService: ModalImagenService,
    private fileUploadService: FileUploadService
  ) {}

  ngOnInit(): void {}

  cerrarModal() {
    this.imgTemp = null;
    this.modalImagenService.cerrarModal();
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
      const id = this.modalImagenService.id;
      const tipo = this.modalImagenService.tipo;

      this.fileUploadService
        .actualizarFoto(this.imagenSubir, tipo, id)
        .then((img) => {
          Swal.fire('Guardado', 'Imagen de usuario actualizada', 'success');
          this.modalImagenService.nuevaImagen.emit(img);
          this.cerrarModal();
        })
        .catch((err) => {
          console.error(err);
          Swal.fire('Error', 'No se pudo subir la imagen', 'error');
        });
    }
  }
}
