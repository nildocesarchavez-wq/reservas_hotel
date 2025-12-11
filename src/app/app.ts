import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PiePaginaInicio } from "./compartido/componentes/pie-pagina-inicio/pie-pagina-inicio";
import { BarraNavegacionComponent } from "./compartido/componentes/barra-navegacion/barra-navegacion";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PiePaginaInicio, BarraNavegacionComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('reservas_hotel');
}
