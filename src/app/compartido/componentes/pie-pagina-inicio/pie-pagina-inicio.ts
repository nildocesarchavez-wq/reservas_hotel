import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pie-pagina-inicio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pie-pagina-inicio.html',
  styleUrls: ['./pie-pagina-inicio.css']
})
export class PiePaginaInicio implements OnInit {
      
  ngOnInit(): void {
    this.initScrollToTop();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const toTopBtn = document.getElementById('toTop');
    
    if (toTopBtn) {
      if (window.pageYOffset > 300) {
        toTopBtn.style.display = 'block';
      } else {
        toTopBtn.style.display = 'none';
      }
    }
  }

  initScrollToTop(): void {
    setTimeout(() => {
      const toTopBtn = document.getElementById('toTop');
      
      if (toTopBtn) {
        toTopBtn.addEventListener('click', (e) => {
          e.preventDefault();
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        });
      }
    }, 0);
  }
}