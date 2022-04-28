import { InvoiceModel } from './models/invoice.model';
import { OrganisationModel } from './models/organisation.model';
import { ProgressModel, setProgressModel } from './models/progress.model';
import { emptyUpload, UploadModel } from './models/upload.model';

export default class CoreState{
    vets: OrganisationModel[];
    freeCover: boolean;
    started: boolean;
    firstName: string;
    lastName: string;
    petName: string;
    policyNumber: string;
    email: string;
    contactNumber: string;
    invoices: Array<InvoiceModel>;
    invoiceIndex: number;
    showCart: boolean;
    cartInitialized: boolean;
    addAnotherInvoice: boolean;
    deleteInvoice: boolean;
    maxUploadSize: number;
    uploadTotal: number;
    invoiceTotal: number;
    cartTotal: string;
    cartTotalValue: number;
    invoiceUploads: Array<UploadModel>;
    historyUploads: Array<UploadModel>;
    bankAccount: string;
    vetBankAccount: boolean;
    vetAccountName: string;
    agreeDeclaration: boolean;
    dayToDayTreatment: boolean;
    accidentIllnessTreatment: boolean;
    applicationValid: boolean;
    applicationSubmitSuccess: boolean;
    applicationSubmitFail: boolean;
    applicationComplete: boolean;
    displayCart: boolean;
    hasAjaxError: boolean;
    ajaxError: any;
    stepStates: Array<ProgressModel>;
    enableHistoryUpload: boolean;
    recatchaKey: string;
    funnelStepValue: string;
}
export const initializeState = (): CoreState => {
    return {
        vets: new Array<OrganisationModel>(),
        freeCover: false,
        started: false,
        firstName: '',
        lastName: '',
        petName: '',
        policyNumber: '',
        email: '',
        contactNumber: '',
        invoices: new Array<InvoiceModel>(),
        invoiceIndex: -1,
        showCart: false,
        cartInitialized: false,
        addAnotherInvoice: false,
        deleteInvoice: false,
        maxUploadSize: 2,
        uploadTotal: 8,
        invoiceTotal: 8,
        cartTotal: '',
        cartTotalValue: 0,
        invoiceUploads: [],
        historyUploads: [],
        bankAccount: '',
        vetBankAccount: false,
        vetAccountName: '',
        agreeDeclaration: false,
        dayToDayTreatment: false,
        accidentIllnessTreatment: false,
        applicationValid: false,
        applicationSubmitSuccess: false,
        applicationSubmitFail: false,
        applicationComplete: false,
        displayCart: true,
        hasAjaxError: false,
        ajaxError: '',
        stepStates: defaultStepStates(),
        enableHistoryUpload: false,
        recatchaKey: '',
        funnelStepValue: ''
    };
};
export const defaultStepStates = (): ProgressModel[] => {
    return [
        setProgressModel(0, 'current', false, 'your-details'),
        setProgressModel(1, '', false, 'claim-details'),
        setProgressModel(2, '', false, 'upload-documents'),
        setProgressModel(3, '', false, 'review-claim'),
    ];
};
