import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'solesPeruanos',
  standalone: true
})
export class SolesPeruanosPipe implements PipeTransform {
  
  transform(value: number | string, mostrarSimbolo: boolean = true): string {
    // Convertir a número si es string
    const numero = typeof value === 'string' ? parseFloat(value) : value;
    
    // Validar que sea un número válido
    if (isNaN(numero)) {
      return 'S/ 0.00';
    }
    
    // Formatear el número con separadores de miles y 2 decimales
    const numeroFormateado = numero.toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    // Retornar con o sin símbolo
    return mostrarSimbolo ? `S/ ${numeroFormateado}` : numeroFormateado;
  }
}