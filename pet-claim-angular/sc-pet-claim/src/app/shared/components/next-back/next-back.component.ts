import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-next-back',
  templateUrl: './next-back.component.html',
  styleUrls: ['./next-back.component.scss']
})
export class NextBackComponent implements OnInit {

  @Input() allowNext = false;
  @Input() allowBack = true;
  @Input() nextArrow = true;
  @Input() nextLabel = 'Next step';
  @Input() tabindexValue = 0;
  @Output() goNext = new EventEmitter<any>();
  @Output() goBack = new EventEmitter<any>();
  public isFocused = false;
  constructor() { }

  ngOnInit(): void {
  }
  next(): void{
    if (this.allowNext){
      this.goNext.emit(null);
    }
  }
  back(): void{
    if (this.allowBack){
      this.goBack.emit(null);
    }
  }
  public onTabOut(): void{
    this.isFocused = false;
  }
  public onTabIn(): void{
    this.isFocused = true;
  }
  public checkEnter(event: any): void{
    if (event.keyCode === 13){
      this.next();
    }
  }
}
