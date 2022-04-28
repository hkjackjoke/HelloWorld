import { createAction, props} from '@ngrx/store';
import { ApplicationResultModel } from '../models/application-result.model';
import { FormModel } from '../models/form.model';
import { InvoiceModel } from '../models/invoice.model';
import { OrganisationModel } from '../models/organisation.model';
import { UploadModel } from '../models/upload.model';
export const initializeState = createAction(
    '[App Component] initializeState',
    props<{ recatchaKey: string, maxUploadSize: number, uploadTotal: number, invoiceTotal: number}>()
);
export const setCoverType = createAction(
    '[App Component] setCoverType',
    props<{ value: boolean }>()
);
export const getVetsSuccess = createAction(
    '[App Component] getVetsSuccess',
    props<{ vets: OrganisationModel[] }>()
);
export const claimStarted = createAction(
    '[App Component] claimStarted',
    props<{ claimStarted: boolean }>()
);
export const displayCart = createAction(
    '[App Component] displayCart',
    props<{ displayCart: boolean }>()
);
export const setYourDetails = createAction(
    '[App Component] setYourDetails',
    props<{
        firstName: string,
        lastName: string,
        petName: string,
        policyNumber: string,
        email: string,
        contactNumber: string,
        dayToDayTreatment: boolean,
        accidentIllnessTreatment: boolean
    }>()
);
export const addInvoice = createAction(
    '[App Component] addInvoice',
    props<{  treatmentDate: Date , vetSpecialist: string,  claimAmount: string, hasBeenAdded: boolean,  hasBeenSaved: boolean }>()
);
export const addAnotherInvoice = createAction(
    '[App Component] addAnotherInvoice'
);
export const removeInvoice = createAction(
    '[App Component] removeInvoice',
    props<{  index: number }>()
);
export const invoiceIndexReset = createAction(
    '[App Component] invoiceIndexReset'
);
export const invoiceAdded = createAction(
    '[App Component] invoiceAdded',
    props<{  index: number }>()
);
export const onRemoveInvoice = createAction(
    '[App Component] onRemoveInvoice'
);
export const editInvoice = createAction(
    '[App Component] editInvoice',
    props<{  index: number }>()
);
export const editInvoiceComplete = createAction(
    '[App Component] editInvoiceComplete'
);
export const updateInvoice = createAction(
    '[App Component] updateInvoice',
    props<{  index: number, invoice: InvoiceModel }>()
);
export const addUploadInvoice = createAction(
    '[App Component] addUploadInvoice',
    props<{  upload: UploadModel }>()
);
export const removeUploadInvoice = createAction(
    '[App Component] removeUploadInvoice',
    props<{  index: number }>()
);
export const setCartTotal = createAction(
    '[App Component] setCartTotal'
);
export const addUploadHistory = createAction(
    '[App Component] addUploadHistory',
    props<{  upload: UploadModel }>()
);
export const removeUploadHistory = createAction(
    '[App Component] removeUploadHistory',
    props<{  index: number }>()
);
export const showCart = createAction(
    '[App Component] showCart'
);
export const cartInitialized = createAction(
    '[App Component] cartInitialized'
);
export const hideCart = createAction(
    '[App Component] hideCart'
);
export const setDeclaration = createAction(
    '[App Component] setDeclaration',
    props<{ bankAccount: string, vetBankAccount: boolean, vetAccountName: string, agreeDeclaration: boolean }>()
);
export const validateAll = createAction(
    '[App Component] validateAll'
);
export const submitApplication = createAction(
    '[App Component] submitApplication',
    props<{  body: FormModel }>()
);
export const successSubmitApplication = createAction(
    '[App Component] successSubmitApplication',
    props<{  body: ApplicationResultModel }>()
);
export const failSubmitApplication = createAction(
    '[App Component] failSubmitApplication',
    props<{  body: ApplicationResultModel }>()
);
export const claimConfirmation = createAction(
    '[App Component] claimConfirmation'
);
export const makeAnotherClaim = createAction(
    '[App Component] makeAnotherClaim'
);
export const setStepState = createAction(
    '[App Component] setStepState',
    props<{  index: number, value: string }>()
);
export const errorAjaxAction = createAction('[Ajax] - Error', props<Error>());
export const errorAjaxActionClear = createAction('[Ajax] - Error Clear');
