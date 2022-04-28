export interface ProgressModel {
    index: number;
    state: string;
    completed: boolean;
    feature: string;
}
export const setProgressModel = (index: number, state: string, completed: boolean, feature: string ): ProgressModel => {
    return {index, state, completed, feature};
};


