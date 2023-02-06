import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [],
})
export class Grafica1Component {

  public title: string = 'Mi Grafica';

  public labels: string[] = [
    'Label1',
    'Label2',
    'Label3'
  ]

  public data: Array<any> = [{ data: [1000, 2000, 3000] }];
 
  constructor() {}
}
