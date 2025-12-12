import { Component, OnInit, OnDestroy, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderAdmin } from "../../../compartido/componentes/header-admin/header-admin";
import { SidebarAdmin } from "../../../compartido/componentes/sidebar-admin/sidebar-admin";
import { ReservasService } from '../../../nucleo/servicios/reservas.service';
import { Reserva } from '../../../nucleo/modelos/reserva.model';
import { Subscription } from 'rxjs';

interface LucroDetalle {
  id: string;
  nombre: string;
  fechaEntrada: string;
  fechaSalida: string;
  alquilerHabitacion: number;
  extras: number;
  comidas: number;
  granTotal: number;
  lucro: number;
}

interface DatoGrafico {
  fecha: string;
  lucro: number;
}

declare var ApexCharts: any;

@Component({
  selector: 'app-lucro',
  standalone: true,
  imports: [CommonModule, HeaderAdmin, SidebarAdmin],
  templateUrl: './lucro.html',
  styleUrl: './lucro.css',
})
export class Lucro implements OnInit, OnDestroy, AfterViewInit {
  private reservasService = inject(ReservasService);
  private subscription?: Subscription;
  private chart: any;

  reservas: Reserva[] = [];
  lucroDetalles: LucroDetalle[] = [];
  totalGeneral = 0;
  totalLucro = 0;
  cargando = true;
  error: string | null = null;

  ngOnInit(): void {
    this.cargarReservas();
  }

  ngAfterViewInit(): void {
    // El gráfico se inicializará después de cargar los datos
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    if (this.chart) {
      this.chart.destroy();
    }
  }

  /**
   * Cargar reservas en tiempo real desde Firebase
   */
  private cargarReservas(): void {
    this.cargando = true;
    this.error = null;

    this.subscription = this.reservasService.obtenerTodasReservas().subscribe({
      next: (reservas) => {
        console.log('Reservas recibidas:', reservas);
        
        // Filtrar solo reservas completadas o confirmadas
        this.reservas = reservas.filter(r => 
          r.estado === 'completada' || r.estado === 'confirmada'
        );
        
        this.procesarDatos();
        this.cargando = false;
        
        // Inicializar o actualizar el gráfico
        setTimeout(() => {
          this.renderizarGrafico();
        }, 100);
      },
      error: (err) => {
        console.error('Error al cargar reservas:', err);
        this.error = 'Error al cargar las reservas. Por favor, intenta nuevamente.';
        this.cargando = false;
      }
    });
  }

  /**
   * Procesar datos para la tabla de lucro
   */
  private procesarDatos(): void {
    this.lucroDetalles = this.reservas.map(reserva => {
      const alquiler = reserva.precioTotal;
      
      // Simular extras y comidas (puedes ajustar esto según tu modelo)
      const extras = Math.random() > 0.7 ? Math.floor(Math.random() * 100) : 0;
      const comidas = Math.random() > 0.5 ? Math.floor(Math.random() * 150) : 0;
      
      const granTotal = alquiler + extras + comidas;
      const lucro = granTotal * 0.10; // 10% de lucro

      return {
        id: reserva.id,
        nombre: reserva.usuarioNombre,
        fechaEntrada: this.formatearFecha(reserva.fechaEntrada),
        fechaSalida: this.formatearFecha(reserva.fechaSalida),
        alquilerHabitacion: alquiler,
        extras: extras,
        comidas: comidas,
        granTotal: granTotal,
        lucro: lucro
      };
    });

    // Calcular totales
    this.totalGeneral = this.lucroDetalles.reduce((sum, item) => sum + item.granTotal, 0);
    this.totalLucro = this.lucroDetalles.reduce((sum, item) => sum + item.lucro, 0);

    console.log('Detalles procesados:', this.lucroDetalles);
  }

  /**
   * Preparar datos para el gráfico
   */
  private prepararDatosGrafico(): DatoGrafico[] {
    // Agrupar lucro por fecha de salida
    const lucroPorFecha = new Map<string, number>();

    this.lucroDetalles.forEach(detalle => {
      const fecha = detalle.fechaSalida;
      const lucroActual = lucroPorFecha.get(fecha) || 0;
      lucroPorFecha.set(fecha, lucroActual + detalle.lucro);
    });

    // Convertir a array y ordenar por fecha
    const datos = Array.from(lucroPorFecha.entries())
      .map(([fecha, lucro]) => ({ fecha, lucro }))
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

    return datos;
  }

  /**
   * Renderizar gráfico con ApexCharts
   */
  private renderizarGrafico(): void {
    const datosGrafico = this.prepararDatosGrafico();
    
    if (datosGrafico.length === 0) {
      console.log('No hay datos para el gráfico');
      return;
    }

    const opciones = {
      series: [{
        name: 'Lucro (10%)',
        data: datosGrafico.map(d => d.lucro)
      }],
      chart: {
        height: 350,
        type: 'area',
        toolbar: {
          show: true
        },
        zoom: {
          enabled: true
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      xaxis: {
        categories: datosGrafico.map(d => d.fecha),
        title: {
          text: 'Fecha de Salida'
        }
      },
      yaxis: {
        title: {
          text: 'Lucro (USD)'
        },
        labels: {
          formatter: (value: number) => `$${value.toFixed(2)}`
        }
      },
      colors: ['#0095ff'],
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100]
        }
      },
      tooltip: {
        y: {
          formatter: (value: number) => `$${value.toFixed(2)}`
        }
      }
    };

    const chartElement = document.querySelector('#chart');
    if (chartElement) {
      // Destruir gráfico anterior si existe
      if (this.chart) {
        this.chart.destroy();
      }
      
      this.chart = new ApexCharts(chartElement, opciones);
      this.chart.render();
    }
  }

  /**
   * Formatear fecha a string legible
   */
  private formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  /**
   * Formatear número como moneda
   */
  formatearMoneda(valor: number): string {
    return `$${valor.toFixed(2)}`;
  }

  /**
   * Recargar datos manualmente
   */
  recargar(): void {
    this.cargarReservas();
  }
}