import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'disponibilidad',
    standalone: true
})
export class DisponibilidadPipe implements PipeTransform {

    transform(value: unknown, ...args: unknown[]): unknown {
        return null;
    }

}
