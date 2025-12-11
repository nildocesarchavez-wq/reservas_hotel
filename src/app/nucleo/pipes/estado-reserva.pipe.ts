import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'estadoReserva',
    standalone: true
})
export class EstadoReservaPipe implements PipeTransform {

    transform(value: unknown, ...args: unknown[]): unknown {
        return null;
    }

}
