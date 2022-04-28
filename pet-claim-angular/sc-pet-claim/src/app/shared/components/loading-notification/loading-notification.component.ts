import { Component, OnInit, ViewChild } from '@angular/core';
import { PetAnimationComponent } from '../pet-animation/pet-animation.component';

@Component({
  selector: 'app-loading-notification',
  templateUrl: './loading-notification.component.html',
  styleUrls: ['./loading-notification.component.scss']
})
export class LoadingNotificationComponent implements OnInit {
  public message: string;
  public counter = 0;
  public randomnumber: number;
  public displayFlag = 'message1';
  @ViewChild('petAnimation', { static: true}) petAnimation: PetAnimationComponent;

  constructor() { }

  ngOnInit() {
    this.randomnumber = this.randomNumber();
    setInterval(() => {
      this.change();
    }, 5000);
  }

  randomNumber(): number {
    const min = 0;
    const max = 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  change(): void {
    switch (this.counter){
      case 0: {
        this.displayFlag = 'message2';
        this.counter++;
        break;
      }
      case 1: {
        this.displayFlag = 'message3';
        this.counter++;
        break;
      }
      case 2: {
        this.displayFlag = 'message4';
        break;
      }
    }
  }
}
