export interface UploadModel {
    id: number;
    file: File;
    selected: boolean;
    disabled: boolean;
}
export const emptyUpload = (): UploadModel => {
    return {
        id: 0,
        file: null,
        selected: false,
        disabled: false
    };
};
export const disabledUpload = (): UploadModel => {
    return {
        id: 0,
        file: null,
        selected: false,
        disabled: true
    };
};
export const populatedUpload = (id: number, file: File): UploadModel => {
    return {
        id,
        file,
        selected: true,
        disabled: false
    };
};

export const enum uploadType {
    Invoice = 'invoice',
    History = 'history',
    Review = 'review'
}
