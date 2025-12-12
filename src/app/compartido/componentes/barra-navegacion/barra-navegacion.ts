import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-barra-navegacion',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './barra-navegacion.html',
  styleUrl: './barra-navegacion.css'
})
export class BarraNavegacionComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  
}