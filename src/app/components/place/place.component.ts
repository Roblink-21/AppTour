import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.scss'],
})
export class PlaceComponent implements OnInit {

  @Input() place;

  constructor() { }

  ngOnInit() {}

  getCuisines(data) {
    return data.join(', ');
  }

}