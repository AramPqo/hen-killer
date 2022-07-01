import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { IGoal } from './models/base.model';
import { takeRandomIndex } from './util/take-index';

@Directive({
  selector: '[move]',
})
export class MoveDirective implements OnInit {
  @Input() goal!: IGoal;
  @Output() shoot = new EventEmitter();
  sound!: any;
  element!: HTMLImageElement;
  position = 0;
  interval!: any;
  speed = [10, 100, 30, 20, 50, 5];

  constructor(private readonly el: ElementRef, private readonly renderer: Renderer2) {}

  ngOnInit() {
    this.element = this.el.nativeElement;
    this.renderer.addClass(this.element, this.goal.name);
    this.renderer.setStyle(this.element, 'top', `${takeRandomIndex(90)}%`);
    this.move(this.speed[takeRandomIndex(this.speed.length)]);
  }

  @HostListener('document:click', ['$event']) documentClick(event: MouseEvent) {
    const clientRect = this.el.nativeElement.getBoundingClientRect();
    const goalX = clientRect.width + clientRect.left;
    const goalY = clientRect.height + clientRect.top;
    const eventX = event.x + 20;
    const eventY = event.y + 22;
    const node = document.createElement('div');
    this.renderer.setStyle(node, 'left', `${eventX - 38}px`);
    this.renderer.setStyle(node, 'top', `${eventY - 45}px`);
    if (
      eventX < goalX &&
      eventX > clientRect.left &&
      eventY < goalY &&
      eventY > clientRect.top
    ) {
      this.renderer.addClass(node, 'shooted');
      this.sound = new Audio('./../assets/effects/shoot-success.mp3');
      this.sound.play();
      this.clear(1);
    } else {
      this.renderer.addClass(node, 'fail');
      this.sound = new Audio('./../assets/effects/shoot-fail.mp3');
      this.sound.play();
    }

    this.renderer.appendChild(document.body, node);
  }

  move(speed: number) {
    this.renderer.setStyle(this.element, 'display', `block`);
    if (this.element.style.display !== 'none') {
      this.interval = setInterval(() => {
        ++this.position;
        if (document.visibilityState === 'visible') {
          this.renderer.setStyle(this.element, 'left', `${this.position}%`);
        } else {
          clearInterval(this.interval);
        }

        if (this.position > 95) {
          this.clear();
        }
      }, speed);
    }

    setTimeout(() => {
      this.move(this.speed[takeRandomIndex(this.speed.length)]);
    }, 2000);
  }

  clear(point?: number) {
    clearTimeout(this.interval);
    this.shoot.emit(point);
    this.renderer.setStyle(this.element, 'left', `-100%`);
    this.position = 0;
    this.renderer.setStyle(this.element, 'top', `${takeRandomIndex(90)}%`);
  }
}
