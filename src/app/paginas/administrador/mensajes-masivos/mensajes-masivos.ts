import { Component } from '@angular/core';
import { HeaderAdmin } from "../../../compartido/componentes/header-admin/header-admin";
import { SidebarAdmin } from "../../../compartido/componentes/sidebar-admin/sidebar-admin";

@Component({
  selector: 'app-mensajes-masivos',
  imports: [HeaderAdmin, SidebarAdmin],
  templateUrl: './mensajes-masivos.html',
  styleUrl: './mensajes-masivos.css',
})
export class MensajesMasivos {

  abrirModal() {
    const modal = document.getElementById('myModal');
    if (modal) {
      modal.classList.add('show');
    }
  }

  cerrarModal() {
    const modal = document.getElementById('myModal');
    if (modal) {
      modal.classList.remove('show');
    }
  }

  ngAfterViewInit() {
    // Botón para abrir modal
    const openBtn = document.getElementById('openModalButton');
    if (openBtn) {
      openBtn.addEventListener('click', () => this.abrirModal());
    }

    // Botones para cerrar modal
    const closeBtn = document.getElementById('closeModalButton');
    const cancelBtn = document.getElementById('cancelModalButton');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.cerrarModal());
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.cerrarModal());
    }

    // Cerrar modal al hacer click fuera de él
    const modal = document.getElementById('myModal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.cerrarModal();
        }
      });
    }

    // Manejar envío del formulario
    const form = document.getElementById('newsletterForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Formulario enviado');
        // Aquí puedes agregar la lógica para enviar el newsletter
        this.cerrarModal();
      });
    }
  }
}