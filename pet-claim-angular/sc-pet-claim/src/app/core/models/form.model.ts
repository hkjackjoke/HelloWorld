import CoreState from '../core.state';
import { InvoiceModel } from './invoice.model';
import { UploadModel } from './upload.model';
export interface FormModel {
    data: FormData;
}
export const formFromState = (state: CoreState, token: string): FormModel => {
    const data = new FormData();
    data.append('CaptchaToken', token);
    data.append('FirstName', (state.freeCover ? 'FC ' : '') + state.firstName.trim());
    data.append('LastName', state.lastName.trim());
    data.append('PetName', state.petName.trim());
    data.append('PolicyNumber', state.policyNumber.trim() === '' ?
    (state.freeCover ? 'FC' : '') : (state.freeCover ? 'FC' : 'P') + state.policyNumber.trim());
    data.append('Email', state.email.trim());
    data.append('ContactNumber', state.contactNumber.trim());
    data.append('BankAccount', state.bankAccount.trim());
    data.append('VetBankAccount', state.vetBankAccount ? '1' : '0');
    data.append('VetBankAccountName', state.vetAccountName.trim());
    data.append('AgreeDeclaration', state.agreeDeclaration ? '1' : '0');
    data.append('DayToDayTreatment', state.dayToDayTreatment ? 'Yes' : 'No');
    data.append('AccidentIllnessTreatment', state.accidentIllnessTreatment ? 'Yes' : 'No');
    state.invoices.forEach((value: InvoiceModel, index: number) => {
        data.append('Invoices[' + index + '][Date]', value.treatmentDate.toString());
        data.append('Invoices[' + index + '][Amount]', value.claimAmount);
        data.append('Invoices[' + index + '][VetSpecialist]', value.vetSpecialist.trim());
    });
    state.invoiceUploads.forEach((value: UploadModel, index: number) => {
        if (value.selected){
            data.append('InvoiceUploads[' + index + ']', value.file);
        }
    });
    if (state.accidentIllnessTreatment || !state.dayToDayTreatment) {
        state.historyUploads.forEach((value: UploadModel, index: number) => {
            if (value.selected){
                data.append('HistoryUploads[' + index + ']', value.file);
            }
        });
    }
    return {data};
};
