import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentService } from 'src/app/core/services/component.service';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss']
})
export class ErrorMessageComponent implements OnInit {

  constructor(private router: Router, private components: ComponentService) { }
  @Input() type = 'default';
  @Input() specificType = '';
  @Input() maxUploadSize = 2;
  @Output() closeError = new EventEmitter<any>();
  ngOnInit(): void {
  }
  review(): void{
    this.router.navigate(['review-claim']);
  }
  freeCoverInfo(): void{
    const popup = this.components.popup('free-cover-important', 'Important things to know', '');
    popup.clickButtonOne.subscribe((value: any) => {
      this.components.destroyPopup();
    });
  }
  close(): void{
    this.closeError.emit(1);
  }
}
