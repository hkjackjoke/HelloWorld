

export class BreedsModel {
    public static catBreeds: Array<BreedsModel>;
    public static dogBreeds: Array<BreedsModel>;

    constructor(
      public Code: string,
      public Description: string,
      public Species: string,
      public label: string,
      public id: number
    ) {}
}
