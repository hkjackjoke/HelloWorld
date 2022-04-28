export class SpriteModel {

    currentFrame: number;
    maxFrame: number;
    w: number;
    h: number;
    currentAnimNum: number;
    numAnims: number;
    animInterval: number;

    constructor(public type: string) {
    }
}
