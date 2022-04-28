import { createReducer, on } from '@ngrx/store';
import CoreState, { defaultStepStates, initializeState } from '../core.state';
import * as CoreActions from '../actions/core.actions';
import { emptyUpload, disabledUpload, UploadModel } from '../models/upload.model';
import { InvoiceModel, populatedInvoice } from '../models/invoice.model';
import { ProgressModel, setProgressModel } from '../models/progress.model';

export const initialState = initializeState();
const constCoreReducer = createReducer(initialState,
    on(CoreActions.initializeState, (state: CoreState, { recatchaKey, maxUploadSize, uploadTotal, invoiceTotal }) => {
        return { ...state, recatchaKey, maxUploadSize, uploadTotal, invoiceTotal};
    }),
    on(CoreActions.setCoverType, (state: CoreState, { value }) => {
        return { ...state, freeCover: value};
    }),
    on(CoreActions.getVetsSuccess, (state: CoreState, { vets }) => {
        return { ...state, vets};
    }),
    on(CoreActions.claimStarted, (state: CoreState, { claimStarted }) => {
        return { ...state, started: claimStarted};
    }),
    on(CoreActions.displayCart, (state: CoreState, { displayCart }) => {
        return { ...state, displayCart};
    }),
    on(CoreActions.setYourDetails, (state: CoreState, {
        firstName,
        lastName,
        petName,
        policyNumber,
        email,
        contactNumber,
        dayToDayTreatment,
        accidentIllnessTreatment
    }) => {
        const list = [];
        if (dayToDayTreatment){
            list.push('routine or day-to-day treatment');
        }
        if (accidentIllnessTreatment){
            list.push('treatment for an accident or illness');
        }
        let funnelStepValue = 'none';
        if (list.length === 2){
            funnelStepValue = 'both';
        }
        if (list.length === 1){
            funnelStepValue = list[0];
        }
        return {
            ...state,
            firstName,
            lastName,
            petName,
            policyNumber,
            email,
            contactNumber,
            dayToDayTreatment,
            accidentIllnessTreatment,
            enableHistoryUpload: accidentIllnessTreatment || !dayToDayTreatment,
            funnelStepValue
        };
    }),
    on(CoreActions.addInvoice, (state: CoreState, {  treatmentDate, vetSpecialist, claimAmount, hasBeenAdded, hasBeenSaved }) => {
        const id = new Date().getTime();
        return { ...state,
            invoices: [
                ...state.invoices,
                {
                    id,
                    treatmentDate,
                    vetSpecialist,
                    claimAmount,
                    hasBeenAdded,
                    hasBeenSaved
                }
            ],
            addAnotherInvoice: false};
    }),
    on(CoreActions.addAnotherInvoice, (state: CoreState) => {
        return { ...state, addAnotherInvoice: true, showCart: false, invoiceIndex: -1};
    }),
    on(CoreActions.onRemoveInvoice, (state: CoreState) => {
        return { ...state, deleteInvoice: false};
    }),
    on(CoreActions.removeInvoice, (state: CoreState, {  index }) => {
        const invoices = new Array<InvoiceModel>();
        state.invoices.forEach((item: InvoiceModel, i: number) => {
            if (i !== index) {
                invoices.push(item);
            }
        });
        if (invoices.length === 0){
            return {
                ...state,
                invoiceUploads: [],
                historyUploads: [],
                invoices,
                deleteInvoice: true,
                invoiceIndex: -1
            };
        }
        return { ...state, invoices, deleteInvoice: true, invoiceIndex: -1};
    }),
    on(CoreActions.editInvoice, (state: CoreState, {  index }) => {
        return { ...state, invoiceIndex: index, addAnotherInvoice: false};
    }),
    on(CoreActions.updateInvoice, (state: CoreState, {  index, invoice }) => {
        const invoices = new Array<InvoiceModel>();
        state.invoices.forEach((item: InvoiceModel, i: number) => {
            if (i !== index) {
                invoices.push(item);
            }else{
                invoices.push(invoice);
            }
        });
        return { ...state, invoices, invoiceIndex: -1};
    }),
    on(CoreActions.invoiceIndexReset, (state: CoreState, {  }) => {
        return { ...state, invoiceIndex: -1};
    }),
    on(CoreActions.invoiceAdded, (state: CoreState, {  index }) => {
        const invoices = new Array<InvoiceModel>();
        state.invoices.forEach((item: InvoiceModel, i: number) => {
            if (i === index) {
                invoices.push(populatedInvoice(item.id, item.treatmentDate, item.vetSpecialist, item.claimAmount, true, false));
            }else{
                invoices.push(item);
            }
        });
        return { ...state, invoices};
    }),
    on(CoreActions.setCartTotal, (state: CoreState) => {
        let cartTotal = '0.00';
        let cartTotalValue = 0;
        if (state.invoices.length > 0){
            state.invoices.forEach((invoice: InvoiceModel, i: number) => {
                cartTotalValue += Number(invoice.claimAmount);
            });
            cartTotal = new Intl.NumberFormat('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}).format(cartTotalValue);
        }
        return {...state, cartTotal, cartTotalValue};
    }),
    on(CoreActions.editInvoiceComplete, (state: CoreState) => {
        return { ...state, invoiceIndex: -1};
    }),
    on(CoreActions.addUploadInvoice, (state: CoreState, { upload }) => {
        const uploads = new Array<UploadModel>();
        state.invoiceUploads.forEach((item: UploadModel, index: number) => {
            if (item.id === 0){
                uploads.push(upload);
            } else {
                uploads.push(item);
            }
        });
        if (uploads.length < state.uploadTotal){
            uploads.push(upload);
        }else{
            uploads.push(disabledUpload());
        }
        return {...state, invoiceUploads: uploads};
    }),
    on(CoreActions.removeUploadInvoice, (state: CoreState, { index }) => {
        const uploads = new Array<UploadModel>();
        state.invoiceUploads.forEach((item: UploadModel, i: number) => {
            if (i !== index && item.id !== 0) {
                uploads.push(item);
            }
        });        
        return {...state, invoiceUploads: uploads};
    }),

    on(CoreActions.addUploadHistory, (state: CoreState, { upload }) => {
        const uploads = new Array<UploadModel>();
        state.historyUploads.forEach((item: UploadModel, index: number) => {
            if (item.id === 0){
                uploads.push(upload);
            } else {
                uploads.push(item);
            }
        });
        if (uploads.length < state.uploadTotal){
            uploads.push(upload);
        }else{
            uploads.push(disabledUpload());
        }
        return {...state, historyUploads: uploads};
    }),
    on(CoreActions.removeUploadHistory, (state: CoreState, { index }) => {
        const uploads = new Array<UploadModel>();
        state.historyUploads.forEach((item: UploadModel, i: number) => {
            if (i !== index && item.id !== 0) {
                uploads.push(item);
            }
        });        
        return {...state, historyUploads: uploads};
    }),
    on(CoreActions.showCart, (state: CoreState) => {
        return { ...state, showCart: true};
    }),
    on(CoreActions.cartInitialized, (state: CoreState) => {
        return { ...state, cartInitialized: true};
    }),
    on(CoreActions.hideCart, (state: CoreState) => {
        return { ...state, showCart: false};
    }),
    on(CoreActions.setDeclaration, (state: CoreState, {bankAccount, vetBankAccount, vetAccountName, agreeDeclaration}) => {
        return { ...state, bankAccount, vetBankAccount, vetAccountName, agreeDeclaration};
    }),
    on(CoreActions.validateAll, (state: CoreState) => {
        let valid = true;
        if (state.vetBankAccount){
            if (state.vetAccountName === null || state.vetAccountName === undefined){
                valid = false;
            } else if (state.vetAccountName.trim() === ''){
                valid = false;
            }
        }
        if (!state.agreeDeclaration){
            valid = false;
        }
        if (!state.invoices.length){
            valid = false;
        }
        return { ...state, applicationValid: valid};
    }),
    on(CoreActions.submitApplication, (state: CoreState, {body}) => {
        return { ...state};
    }),
    on(CoreActions.failSubmitApplication, (state: CoreState, {body}) => {
        return { ...state, applicationSubmitFail: true};
    }),
    on(CoreActions.claimConfirmation, (state: CoreState) => {
        return {
            ...state,
            invoices: new Array<InvoiceModel>(),
            invoiceUploads: [],
            historyUploads: [],
            bankAccount: '',
            vetBankAccount: false,
            agreeDeclaration: false,
            dayToDayTreatment: false,
            accidentIllnessTreatment: false,
            applicationValid: false,
            applicationSubmitSuccess: false,
            applicationSubmitFail: false,
            applicationComplete: true,
            cartTotalValue: 0
        };
    }),
    on(CoreActions.makeAnotherClaim, (state: CoreState) => {
        return {...state,
            applicationComplete: false,
            stepStates: defaultStepStates()
        };
    }),
    on(CoreActions.setStepState, (state: CoreState, {  index , value}) => {
        const states = new Array<ProgressModel>();
        state.stepStates.forEach((progress: ProgressModel, i: number) => {
            if (progress.index === index){
                const completed = progress.completed || value === 'complete';
                states.push(setProgressModel(progress.index, value, completed, progress.feature));
            }else{
                let stateValue = progress.completed ? 'complete' : '';
                if (progress.index > index && progress.completed ){
                    stateValue = 'complete forward';
                }
                if (progress.index === 3 && progress.state !== ''){
                    stateValue = 'been-there';
                }
                states.push(setProgressModel(progress.index, stateValue, progress.completed, progress.feature));
            }
        });
        return { ...state, stepStates: states};
    }),
    on(CoreActions.errorAjaxAction, (state: CoreState, error: Error) => {
        return { ...state, ajaxError: error, hasAjaxError: true};
    }),
    on(CoreActions.errorAjaxActionClear, (state: CoreState) => {
        return { ...state, ajaxError: null, hasAjaxError: false, applicationSubmitFail: false};
    }),
);
export function coreReducer(state: any, action: any): CoreState {
    return constCoreReducer(state, action);
}
