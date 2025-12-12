import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactoService } from '../../../nucleo/servicios/contacto.service';
import { CrearContactoData } from '../../../nucleo/modelos/contacto.model';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css'
})
export class ContactoComponent {
  private contactoService = inject(ContactoService);

  // Modelo del formulario
  formData: CrearContactoData = {
    nombre: '',
    telefono: '',
    email: ''
  };

  // Estados del formulario
  enviando = false;
  mensajeExito = '';
  mensajeError = '';

  /**
   * Enviar formulario de contacto
   */
  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    // Validar campos
    if (!this.formData.nombre || !this.formData.telefono || !this.formData.email) {
      this.mostrarError('Por favor, complete todos los campos');
      return;
    }

    // Validar email
    if (!this.validarEmail(this.formData.email)) {
      this.mostrarError('Por favor, ingrese un email válido');
      return;
    }

    this.enviando = true;
    this.mensajeError = '';
    this.mensajeExito = '';

    try {
      await this.contactoService.crearContacto(this.formData);
      
      this.mostrarExito('¡Mensaje enviado correctamente! Nos pondremos en contacto pronto.');
      this.limpiarFormulario();
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      this.mostrarError('Hubo un error al enviar el mensaje. Por favor, intente nuevamente.');
    } finally {
      this.enviando = false;
    }
  }

  /**
   * Validar formato de email
   */
  private validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Mostrar mensaje de éxito
   */
  private mostrarExito(mensaje: string): void {
    this.mensajeExito = mensaje;
    setTimeout(() => {
      this.mensajeExito = '';
    }, 5000);
  }

  /**
   * Mostrar mensaje de error
   */
  private mostrarError(mensaje: string): void {
    this.mensajeError = mensaje;
    setTimeout(() => {
      this.mensajeError = '';
    }, 5000);
  }

  /**
   * Limpiar formulario
   */
  private limpiarFormulario(): void {
    this.formData = {
      nombre: '',
      telefono: '',
      email: ''
    };
  }
}