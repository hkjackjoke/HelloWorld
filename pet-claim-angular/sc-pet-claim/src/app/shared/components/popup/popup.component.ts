import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ComponentService } from 'src/app/core/services/component.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {

  public popupType = '';
  public title = '';
  public copy = '';
  @Output() clickButtonOne = new EventEmitter<any>();
  @Output() clickButtonTwo = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {

  }
  buttonClick(id: number): void{
    switch (id){
      case 1:
        this.clickButtonOne.emit('');
        break;
      case 2:
        this.clickButtonTwo.emit('');
        break;
    }
  }
}
