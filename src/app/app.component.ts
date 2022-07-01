import { Component, OnInit } from '@angular/core';
import { IGoal } from './models/base.model';
import { takeRandomIndex } from './util/take-index';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  point = 0;
  paperLines = {
    x: this.createPaperLines(25),
    y: this.createPaperLines(2),
  };
  current: IGoal = {
    name: 'hen',
  };
  speed = ['slow', 'medium', 'fast'];
  goal: IGoal[] = [
    this.current,
    {
      name: 'rooster',
      rotated: true,
    },
    {
      name: 'car_hen',
      rotated: true,
      isTop: true,
    },
    {
      name: 'chick',
    },
    {
      name: 'runner_hen',
    },
  ];

  takeHen() {
    const index = takeRandomIndex(this.goal.length);
    this.current = this.goal[index];
  }

  ngOnInit() {
    this.run();
  }

  run(point?: number) {
    if (point) {
      this.point += point;
    }
    this.takeHen();
  }

  createPaperLines(length: number) {
    return Array(length)
      .fill(0)
      .map((v, i) => i);
  }
}
