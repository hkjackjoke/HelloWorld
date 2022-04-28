import { Component, OnInit, Input } from '@angular/core';
import { SpriteModel } from 'src/app/models/sprite.model';

@Component({
  selector: 'app-pet-animation',
  templateUrl: './pet-animation.component.html',
  styleUrls: ['./pet-animation.component.scss']
})
export class PetAnimationComponent implements OnInit {

  @Input() type: string;
  @Input() size: string;
  public spriteObj: SpriteModel;
  public bgPosition: string;
  public animalClass: string;
  private setIntervalHandler: any;
  private petAnim = this;

  constructor() {

   }

  ngOnInit() {
    this.resetAnimation();

  }
  public stopPetAnimation(): void {
    this.spriteObj = null;
    clearInterval(this.setIntervalHandler);
  }
  public resetAnimation(species: string = ''): void {
    if (species !== '') {
      if (species === 'cat') {
        this.startCat();
      }
      if (species === 'dog') {
        this.startDog();
      }
      return;
    }
    if (this.type === 'cat') {
      this.startCat();
    }
    if (this.type === 'dog') {
      this.startDog();
    }
  }
  public startCat(): void {
    this.animalClass = 'cat';
    this.spriteObj = new SpriteModel(this.type);
    this.spriteObj.currentFrame = 0;
    this.spriteObj.maxFrame = 0;
    this.spriteObj.w = 137;
    this.spriteObj.h = 92;
    this.spriteObj.type = 'cat';
    this.spriteObj.currentAnimNum = 0;
    this.spriteObj.numAnims = 4;
    this.spriteObj.animInterval = 0;
    this.chooseAnimation(this.spriteObj);
  }
  public startDog(): void {
    this.animalClass = 'dog';
    this.spriteObj = new SpriteModel(this.type);
    this.spriteObj.currentFrame = 0;
    this.spriteObj.maxFrame = 0;
    this.spriteObj.w = 86;
    this.spriteObj.h = 111;
    this.spriteObj.type = 'dog';
    this.spriteObj.currentAnimNum = 0;
    this.spriteObj.numAnims = 4;
    this.spriteObj.animInterval = 0;
    this.chooseAnimation(this.spriteObj);
  }

  public chooseAnimation(spriteObj: any) {
    let nextAnim = Math.floor(Math.random() * (spriteObj.numAnims + 1));

    /* GIVE CHANCE OF IDLE BEING HIGHER */
    if (nextAnim >= spriteObj.numAnims) {
        nextAnim = 0;
    }

    spriteObj.currentFrame = 0;
    spriteObj.currentAnimNum = nextAnim;
    this.bgPosition = '0px 0px';

    if (spriteObj.type === 'cat') {
        if (nextAnim === 0) {
            spriteObj.maxFrame = 162;
        } else if (nextAnim === 1) {
            spriteObj.maxFrame = 151;
        } else if (nextAnim === 2) {
            spriteObj.maxFrame = 151;
        } else {
            spriteObj.maxFrame = 81;
        }
    } else if (spriteObj.type === 'dog') {
        if (nextAnim === 0) {
            spriteObj.maxFrame = 86;
        } else if (nextAnim === 1) {
            spriteObj.maxFrame = 121;
        } else if (nextAnim === 2) {
            spriteObj.maxFrame = 89;
        } else {
            spriteObj.maxFrame = 70;
        }
    }
    this.startAnimation(spriteObj);
  }
  public startAnimation(spriteObj: any) {
    clearInterval(this.setIntervalHandler);
    this.setIntervalHandler = setInterval(() => {
      this.nextSpriteFrame(spriteObj);
    }, 33);
  }

  public nextSpriteFrame(spriteObj: any) {
    spriteObj.currentFrame++;
    if (spriteObj.currentFrame < spriteObj.maxFrame) {
        let xPos = -spriteObj.w * spriteObj.currentFrame;
        let yPos = -spriteObj.h * spriteObj.currentAnimNum;
        if (spriteObj.type === 'cat') {
            xPos = -spriteObj.w * spriteObj.currentAnimNum;
            yPos = -spriteObj.h * spriteObj.currentFrame;
            this.bgPosition = xPos + 'px ' + yPos + 'px';
        } else if (spriteObj.type === 'dog') {
          this.bgPosition = xPos + 'px ' + yPos + 'px';
        }
    } else {
      this.chooseAnimation(spriteObj);
    }
  }
}
