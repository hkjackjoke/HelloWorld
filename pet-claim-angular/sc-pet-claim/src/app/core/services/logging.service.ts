import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { InvoiceModel } from 'src/app/core/models/invoice.model';
import { UploadModel } from 'src/app/core/models/upload.model';

@Injectable({
    providedIn: 'root',
})
export class LoggingService {
  appInsights: ApplicationInsights;

  constructor() {
    this.appInsights = new ApplicationInsights({
      config: {
        instrumentationKey: environment.appInsights.instrumentationKey,
        enableAutoRouteTracking: true // option to log all route changes
      }
    });
    this.appInsights.loadAppInsights();
  }

  logPageView(name?: string, url?: string): void { // option to call manually
    this.appInsights.trackPageView({
      name,
      uri: url
    });
  }

  logEvent(name: string, properties?: { [key: string]: any }): void {
    this.appInsights.trackEvent({ name}, properties);
  }

  logMetric(name: string, average: number, properties?: { [key: string]: any }): void {
    this.appInsights.trackMetric({ name, average }, properties);
  }

  logException(exception: Error, severityLevel?: number): void {
    this.appInsights.trackException({ exception, severityLevel });
  }

  logTrace(message: string, properties?: { [key: string]: any }): void {
    this.appInsights.trackTrace({ message}, properties);
  }

  getLogInfo(firstName: string, lastName: string, petName: string, policyNumber: string, email: string, contactNumber: string,
             invoices?: Array<InvoiceModel>, invoiceUploads?: Array<UploadModel>, historyUploads?: Array<UploadModel>): string {
    let invoiceString = '';
    if (invoices != null) {
      for (const invoice of invoices) {
        invoiceString += invoice.id + ', ' + invoice.vetSpecialist + ', ' + invoice.treatmentDate + ', ' + invoice.claimAmount + '----';
      }
    }

    let invoiceUploadString = '';
    if (invoiceUploads != null) {
      for (const invoiceUpload of invoiceUploads) {
        invoiceUploadString += invoiceUpload.file.name + '----';
      }
    }
    let historyUploadString = '';
    if (historyUploads != null) {
      for (const historyUpload of historyUploads) {
        historyUploadString += historyUpload.file.name + '----';
      }
    }
    return '[first name]: ' + firstName + ' [last name]: ' + lastName +
      ' [pet name]: ' + petName + ' [policy number]: ' + policyNumber +
      ' [email]: ' + email + ' [contactNumber]: ' + contactNumber +
      ' [invoice]: ' + invoiceString +
      ' [invoice upload]: ' + invoiceUploadString +
      ' [history upload]: ' + historyUploadString;
  }
}