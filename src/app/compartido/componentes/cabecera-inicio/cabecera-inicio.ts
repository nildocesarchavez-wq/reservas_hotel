import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cabecera-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cabecera-inicio.html',
  styleUrls: ['./cabecera-inicio.css']
})
export class CabeceraInicio implements OnInit, OnDestroy {
  private sliderInterval: any;
  private currentSlide = 0;
  private slides: NodeListOf<HTMLElement> | null = null;

  ngOnInit(): void {
    this.initSlider();
    this.initModal();
  }

  ngOnDestroy(): void {
    if (this.sliderInterval) {
      clearInterval(this.sliderInterval);
    }
  }

  initSlider(): void {
    setTimeout(() => {
      this.slides = document.querySelectorAll('.rslides li');
      
      if (this.slides && this.slides.length > 0) {
        // Iniciar slider automático
        this.sliderInterval = setInterval(() => {
          this.nextSlide();
        }, 5000); // Cambiar cada 5 segundos
      }
    }, 0);
  }

  nextSlide(): void {
    if (!this.slides) return;

    this.slides[this.currentSlide].style.display = 'none';
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.slides[this.currentSlide].style.display = 'block';
  }

  initModal(): void {
    setTimeout(() => {
      const modalTriggers = document.querySelectorAll('[data-modal="myModal"]');
      const modal = document.getElementById('myModal');
      const closeBtn = modal?.querySelector('.close');

      modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          if (modal) {
            modal.classList.add('show');
            modal.style.display = 'flex';
          }
        });
      });

      if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
          modal.classList.remove('show');
          modal.style.display = 'none';
        });
      }

      // Cerrar modal al hacer clic fuera
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            modal.classList.remove('show');
            modal.style.display = 'none';
          }
        });
      }
    }, 0);
  }
}