import { AfterViewInit, Component, ElementRef, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { populatedUpload, UploadModel } from 'src/app/core/models/upload.model';
import { ComponentService } from 'src/app/core/services/component.service';
import { TrackingService } from 'src/app/core/services/tracking.service';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit, AfterViewInit{

  @Input() upload: UploadModel;
  @Input() index: number;
  @Input() fieldName = 'file';
  @Input() interactionName = 'file';
  @Input() hideNotSelected = false;
  @Input() maxUploadSize = 2;
  @Output() fileSelect = new EventEmitter<UploadModel>();
  @Output() fileRemove = new EventEmitter<number>();
  @Output() fileToBig = new EventEmitter<void>();
  @Output() fileSelectError = new EventEmitter<void>();
  public fileElement: HTMLInputElement;
  public file: File;
  public imageSrc: any;
  public displayImg = false;
  public displayDoc = false;
  public fileSelected = false;
  public enableErrorSelect = true;
  public disabled = false;
  public filename = '';
  public docType = '';
  public isDraggedOver = false;
  public files: File[];
  
  @ViewChild('fileInput', {static: false}) fileInput: ElementRef;
  constructor(private componentService: ComponentService, private tracking: TrackingService) {
  }
  ngOnInit(): void {
    if (this.upload.selected){
      this.fileSelected = true;
      this.file = this.upload.file;
      this.filename = this.file.name;
      this.display();
    }
    this.disabled = this.upload.disabled;
  }
  ngAfterViewInit(): void {
    if (!this.hideNotSelected && !this.disabled){
      this.fileElement = (this.fileInput.nativeElement as HTMLInputElement);
      this.fileElement.addEventListener('change', () => {
        this.file = this.fileElement.files[0];
        if (this.enableErrorSelect){
          this.file.slice( 0, 1 ).arrayBuffer() .then( () => {
            this.tracking.fieldInteraction(this.interactionName + ' add');
            if ((this.file.size / 1024 / 1024) <= this.maxUploadSize){
              this.filename = this.file.name;
              this.display();
              if (this.fileSelected){
               this.fileSelect.emit(populatedUpload(new Date().getTime(), this.fileElement.files[0]));
              }
            } else {
              this.reset();
              this.fileToBig.emit();
            }
          } )
          .catch( (err) => {
            this.fileSelectError.emit();
          } );
        } else {
          this.tracking.fieldInteraction(this.interactionName + ' add');
          if ((this.file.size / 1024 / 1024) <= this.maxUploadSize){
            this.filename = this.file.name;
            this.display();
            if (this.fileSelected){
             this.fileSelect.emit(populatedUpload(new Date().getTime(), this.fileElement.files[0]));
            }
          } else {
            this.reset();
            this.fileToBig.emit();
          }
        }
      });
    }
  }
  setPopup(title: string, description: string): void{
    const popup = this.componentService.popup('max-upload-size', title, description);
    popup.clickButtonOne.subscribe((value: any) => {
      this.componentService.destroyPopup();
    });
  }
  display(): void{
    const ext = this.file.name.split('.').pop().toLowerCase();
    switch (ext){
      case 'png':
      case 'jpg':
      case 'jpeg':
        this.displayImage();
        this.fileSelected = true;
        this.docType = '';
        break;
      case 'pdf':
      case 'doc':
      case 'docx':
        this.displayDoc = true;
        this.fileSelected = true;
        this.docType = ext;
        break;
      default:
        this.filename = '';
        this.docType = '';
        this.fileSelected = false;
        this.setPopup('Incorrect File Type', 'The file you selected is not included in our accepted file types. Please select a DOC, DOCX, PDF, JPEG, JPG or PNG file.');
        break;
    }
  }
  displayImage(): void{
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imageSrc = e.target.result;
      this.displayImg = true;
    };
    reader.readAsDataURL(this.file);
  }
  reset(): void{
    this.filename = '';
    this.fileSelected = false;
    this.displayDoc = false;
    this.fileElement.value = '';
  }
  remove(): void{
    this.tracking.fieldInteraction(this.interactionName + ' remove');
    this.fileRemove.emit(this.index);
  }
 
  // drag and drop
  handleDrop(event: DragEvent) {
    this.stopDefault(event);
    this.isDraggedOver = false;

    this.files = Array.from(event.dataTransfer.files);
    for (let i = 0; i < this.files.length; i++) {
      const file = this.files[i];
      let ext = file.name.split('.').pop().toLowerCase();
      let validType = ['png', 'jpg', 'jpeg', 'pdf', 'doc', 'docx'];
      if ((file.size / 1024 / 1024) > this.maxUploadSize || !validType.includes(ext)) {
        this.setPopup('Incorrect File Type or Size', 'The file you selected is not included in our accepted file types. Please select a DOC, DOCX, PDF, JPEG, JPG or PNG file. And size should be less than 2Mb.');
        return;
      }      
    }
    for (let i = 0; i < this.files.length; i++) {
      const file = this.files[i];
      this.tracking.fieldInteraction(this.interactionName + ' add');
      this.fileSelect.emit(populatedUpload(new Date().getTime(), file));
    }
  }
  handleDragOver(event: Event) {
    this.stopDefault(event);
    this.isDraggedOver = true;
  }
  handleDragEnter() {
    this.isDraggedOver = true;
  }
  handleDragLeave() {
    this.isDraggedOver = false;
  }
  private stopDefault(e: Event) {
    e.preventDefault();
    e.stopPropagation();
  }
}

