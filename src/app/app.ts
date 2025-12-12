import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PiePaginaInicio } from "./paginas/publico/pie-pagina-inicio/pie-pagina-inicio";
import { BarraNavegacionComponent } from "./compartido/componentes/barra-navegacion/barra-navegacion";
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PiePaginaInicio, BarraNavegacionComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

}