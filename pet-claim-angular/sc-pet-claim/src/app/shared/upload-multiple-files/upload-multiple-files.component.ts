import { AfterViewInit, Component, ElementRef, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { populatedUpload, UploadModel } from 'src/app/core/models/upload.model';
import { ComponentService } from 'src/app/core/services/component.service';
import { TrackingService } from 'src/app/core/services/tracking.service';
import { LoggingService } from 'src/app/core/services/logging.service';

@Component({
  selector: 'app-upload-multiple-files',
  templateUrl: './upload-multiple-files.component.html',
  styleUrls: ['./upload-multiple-files.component.scss']
})
export class UploadMultipleFilesComponent implements OnInit, AfterViewInit {
  @Input() fieldName = 'file';
  @Input() interactionName = 'file';
  @Input() hideNotSelected = false;
  @Input() maxUploadSize = 2;
  @Input() uploadTotal;
  @Input() uploadType;
  @Input() fileList: Array<UploadModel>;
  @Output() fileSelect = new EventEmitter<UploadModel>();
  @Output() fileRemove = new EventEmitter<number>();
  @Output() fileSelectError = new EventEmitter<void>();
  public fileElement: HTMLInputElement;
  public isDraggedOver = false;
  private files: File[];
  @ViewChild('fileInput', {static: false}) fileInput: ElementRef;
  constructor(private componentService: ComponentService, private tracking: TrackingService, private logging: LoggingService) { }

  ngOnInit(): void {

  }
  ngAfterViewInit(): void {
    if (!this.hideNotSelected){
      this.fileElement = (this.fileInput.nativeElement as HTMLInputElement);
      this.fileElement.addEventListener('change', () => {
        this.files = Array.from(this.fileElement.files);
        if (this.validateFiles(this.files)) {
          this.addFiles(this.files);
        }
      });
    }
  }

  setPopup(title: string, description: string): void{
    const popup = this.componentService.popup('max-upload-size', title, description);
    popup.clickButtonOne.subscribe((value: any) => {
      this.componentService.destroyPopup();
    });
    this.logging.logTrace('<Popup> ' + '[title]: ' + title + ' [description]: ' + description);
  }

  validateFiles(files: File[]): boolean{
    const validType = ['png', 'jpg', 'jpeg', 'pdf', 'doc', 'docx'];
    for (const file of files) {
      const ext = file.name.split('.').pop().toLowerCase();
      if (file.size === 0){
        this.setPopup('Upload failed', 'The file ' + file.name + '  doesn’t contain any information. The file may be corrupted. Please check and try again.');
        return false;
      }
      if ((file.size / 1024 / 1024) > this.maxUploadSize) {
        this.setPopup('Upload failed', 'The file ' + file.name + ' exceeds the max file size of ' + this.maxUploadSize + 'mb. Please compress the file and try again.');
        return false;
      }
      if (!validType.includes(ext)){
        this.setPopup('Upload failed', 'The file ' + file.name + ' is not supported. We can only accept DOC, DOCX, PDF, JPEG, JPG or PNG file.');
        return false;
      }
    }
    return true;
  }

  addFiles(files: File[]): void{
    if (files.length > this.uploadTotal || files.length + this.fileList.length > this.uploadTotal){
      this.setPopup('Too many files selected', 'You can only add ' + this.uploadTotal + ' documents (max ' + this.maxUploadSize + 'mb each). <br>Please try again.');
      return;
    }
    if (files.length + this.fileList.length === this.uploadTotal){
      this.setPopup('Document limit reached', 'You\'ve reached the maximum number of ' + this.uploadType + ' documents you can attach for this claim. Please add one file for every invoice item you entered.');
    }
    for (const file of files) {
      this.tracking.fieldInteraction(this.interactionName + ' add');
      this.fileSelect.emit(populatedUpload(new Date().getTime(), file));
    }
  }

  remove(i): void{
    this.tracking.fieldInteraction(this.interactionName + ' remove');
    this.fileRemove.emit(i);
  }

  // drag and drop
  handleDrop(event: DragEvent): void {
    this.stopDefault(event);
    this.isDraggedOver = false;
    this.files = Array.from(event.dataTransfer.files);
    if (this.validateFiles(this.files)){this.addFiles(this.files); }
  }

  handleDragOver(event: Event): void {
    this.stopDefault(event);
    this.isDraggedOver = true;
  }
  handleDragEnter(): void {
    this.isDraggedOver = true;
  }
  handleDragLeave(): void {
    this.isDraggedOver = false;
  }
  private stopDefault(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
  }
}


