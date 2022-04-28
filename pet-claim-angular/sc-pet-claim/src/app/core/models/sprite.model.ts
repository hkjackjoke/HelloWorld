export interface SpriteModel {
    type: string;
    currentFrame: number;
    maxFrame: number;
    w: number;
    h: number;
    currentAnimNum: number;
    numAnims: number;
    animInterval: number;
}
