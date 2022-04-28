import { OrganisationModel, emptyOrganisation } from './organisation.model';

export interface InvoiceModel {
    id: number;
    treatmentDate: Date;
    vetSpecialist: string;
    claimAmount: string;
    hasBeenAdded: boolean;
    hasBeenSaved: boolean;
}
export const emptyInvoice = (): InvoiceModel => {
    return {
        id: 0,
        treatmentDate: new Date(),
        vetSpecialist: '',
        claimAmount: '',
        hasBeenAdded: false,
        hasBeenSaved: false
    };
};
export const populatedInvoice = (
    id: number,
    treatmentDate: Date,
    vetSpecialist: string,
    claimAmount: string,
    hasBeenAdded: boolean,
    hasBeenSaved: boolean,
    ): InvoiceModel => {
    return {id, treatmentDate, vetSpecialist, claimAmount, hasBeenAdded, hasBeenSaved};
};
