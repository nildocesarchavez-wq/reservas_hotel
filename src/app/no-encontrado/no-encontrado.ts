import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-no-encontrado',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './no-encontrado.html',
    styleUrl: './no-encontrado.css'
})
export class NoEncontradoComponent {
    private location = inject(Location);

    goBack(): void {
        this.location.back();
    }
}