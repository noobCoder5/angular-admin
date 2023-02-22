import { Component, OnInit } from '@angular/core';
import { Medico } from 'src/app/models/medico.model';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [],
})
export class MedicosComponent implements OnInit {
  public cargando: boolean = true;
  public medicos: Medico[] = [];

  constructor(private medicosService: MedicoService, private modalImagenService: ModalImagenService) {}

  ngOnInit(): void {
    this.cargarMedicos();
  }

  cargarMedicos() {
    this.cargando = true;
    this.medicosService.cargarMedicos().subscribe((medicos: Medico[]) => {
      this.cargando = false;
      this.medicos = medicos;
    });
  }

  abrirModal(medico: Medico) {
    this.modalImagenService.abrirModal(
      'medicos',
      medico._id!,
      medico.img
    );
  }
}
