import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SondageService } from '../../../../../services/sondage.service';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

@Component({
  selector: 'app-sondage-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sondage-results.html',
  styleUrls: ['./sondage-results.css']
})
export class SondageResultsComponent implements OnInit {

  sondageId!: number;

  stats: any;
  participations: any[] = [];

  activeTab: 'stats' | 'participations' = 'stats';

  openedQuestions: { [key: number]: boolean } = {};

  loading = true;

  charts: Chart[] = [];
  openedCharts: { [key: number]: boolean } = {};
  openedPieCharts: { [key: number]: boolean } = {};

  constructor(
    private route: ActivatedRoute,
    private sondageService: SondageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.sondageId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.loadStats();
    this.loadParticipations();
  }

  loadStats(): void {

    this.sondageService.getStats(this.sondageId)
      .subscribe({
        next: (res) => {
          this.stats = res;

          this.cdr.detectChanges();
        }
      });
  }

  loadParticipations(): void {

    this.sondageService.getParticipations(this.sondageId)
      .subscribe({
        next: (res) => {

          this.participations = res.map((p: any) => ({
            ...p,
            grouped: this.groupResponses(p.reponses)
          }));

          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  groupResponses(reponses: any[]) {

    const grouped: any = {};

    reponses.forEach(r => {

      if (!grouped[r.question]) {
        grouped[r.question] = [];
      }

      grouped[r.question].push(r.reponse);
    });

    return grouped;
  }

  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  toggleOpenQuestion(questionId: number): void {
    this.openedQuestions[questionId] =
      !this.openedQuestions[questionId];
    this.cdr.detectChanges();
  }

  getOpenResponses(questionText: string) {

    const responses: any[] = [];

    this.participations.forEach(p => {

      p.reponses.forEach((r: any) => {

        if (
          r.question === questionText &&
          r.reponse
        ) {

          responses.push({
            nom: p.nom,
            prenom: p.prenom,
            reponse: r.reponse
          });

        }

      });

    });

    return responses;
  }

  getParticipantResponses(p: any, question: string): string[] {
    return p.grouped[question] || [];
  }

  createSingleChart(questionId: number): void {

    const q = this.stats.questions.find(
      (x: any) => x.questionId === questionId
    );

    if (!q || q.choix.length === 0) return;

    const existing = this.charts.find(
      (c: any) => c.canvas.id === 'chart-' + questionId
    );

    if (existing) return;

    const canvas = document.getElementById(
      'chart-' + questionId
    ) as HTMLCanvasElement;

    if (!canvas) return;

    const chart = new Chart(canvas, {

      type: 'bar',

      data: {

        labels: q.choix.map((c: any) => c.label),

        datasets: [
          {
            data: q.choix.map((c: any) => c.count),

            backgroundColor: [
              '#2563eb',
              '#0f766e',
              '#ca8a04',
              '#dc2626',
              '#7c3aed',
              '#ea580c'
            ],

            borderRadius: 10
          }
        ]
      },

      options: {

        responsive: true,

        plugins: {

          legend: {
            display: false
          },

          datalabels: {
            display: false
          }
        },

        scales: {

          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      },

    });

    this.charts.push(chart);
  }

  toggleChart(questionId: number): void {

    this.openedCharts[questionId] =
      !this.openedCharts[questionId];

    this.cdr.detectChanges();

    // OPEN
    if (this.openedCharts[questionId]) {

      requestAnimationFrame(() => {
        this.createSingleChart(questionId);
      });

    }

    // CLOSE
    else {

      const existingChart = this.charts.find(
        (c: any) =>
          c.canvas.id === 'chart-' + questionId
      );

      if (existingChart) {

        existingChart.destroy();

        this.charts = this.charts.filter(
          c => c !== existingChart
        );
      }
    }
  }

  createPieChart(questionId: number): void {

    const q = this.stats.questions.find(
      (x: any) => x.questionId === questionId
    );

    if (!q || q.choix.length === 0) return;

    const existing = this.charts.find(
      (c: any) =>
        c.canvas.id === 'pie-chart-' + questionId
    );

    if (existing) return;

    const canvas = document.getElementById(
      'pie-chart-' + questionId
    ) as HTMLCanvasElement;

    if (!canvas) return;

    const chart = new Chart(canvas, {

      type: 'pie',

      data: {

        labels: q.choix.map((c: any) => c.label),

        datasets: [
          {

            data: q.choix.map(
              (c: any) => c.percentage
            ),

            backgroundColor: [
              '#3b82f6',
              '#14b8a6',
              '#f59e0b',
              '#ef4444',
              '#8b5cf6',
              '#64748b'
            ],

            borderWidth: 2
          }
        ]
      },

      options: {

        responsive: true,

        plugins: {

          legend: {
            position: 'bottom'
          },

          datalabels: {

            color: '#fff',

            font: {
              weight: 'bold',
              size: 14
            },

            formatter: (value: any) => {
              return value + '%';
            }
          }
        }
      }
    });

    this.charts.push(chart);
  }

  togglePieChart(questionId: number): void {

    this.openedPieCharts[questionId] =
      !this.openedPieCharts[questionId];

    this.cdr.detectChanges();

    // OPEN
    if (this.openedPieCharts[questionId]) {

      requestAnimationFrame(() => {
        this.createPieChart(questionId);
      });

    }

    // CLOSE
    else {

      const existingChart = this.charts.find(
        (c: any) =>
          c.canvas.id === 'pie-chart-' + questionId
      );

      if (existingChart) {

        existingChart.destroy();

        this.charts = this.charts.filter(
          c => c !== existingChart
        );
      }
    }
  }

}