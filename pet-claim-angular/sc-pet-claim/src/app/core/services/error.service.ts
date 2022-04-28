import { ErrorHandler, Injectable } from '@angular/core';
import { LoggingService } from './logging.service';

@Injectable()
export class InsightsErrorHandlerService extends ErrorHandler {
    constructor(private loggingService: LoggingService) {
        super();
    }

    handleError(error: Error): void {
        this.loggingService.logException(error); // Manually log exception
        super.handleError(error);
    }
}
