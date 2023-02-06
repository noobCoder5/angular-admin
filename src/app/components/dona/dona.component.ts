import { Component, Input, OnInit } from '@angular/core';
import { ChartData } from 'chart.js';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [],
})
export class DonaComponent implements OnInit{

  @Input('title')
  public title: string = 'Sales';
  
  @Input('labels') 
  public doughnutChartLabels: string[] = [
    'Download Sales',
    'In-Store Sales',
    'Mail-Order Sales',
  ];

  @Input('data')
  public data: Array<any> = [{ data: [350, 450, 100] }];

  public doughnutChartData!: ChartData<'doughnut'>;

  constructor() {

  }
  ngOnInit(): void {
    this.doughnutChartData = {
      labels: this.doughnutChartLabels,
      datasets: this.data,
    };
  }
}
