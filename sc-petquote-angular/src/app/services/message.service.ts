import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({ providedIn: "root" })
export class MessageService {
    public static scrollToWindowTop = "scrollToWindowTop";
    public static scrollToTimeline = "scrollToTimeline";
    public static applicationTimeOut = "applicationTimeOut";
    public static scrollToTimelineWithDuration = "scrollToTimelineWithDuration";
    public static creditCardFail = "creditCardFail";
    public static submitSuccess = "submitSuccess";
    public static onSubmit = "onSubmit";
    public static onNext = "onNext";
    public static onBack = "onBack";
    public static editFrom = "editFrom";
    public static editPet = "editPet";
    public static editAuthorisedPerson = "editAuthorisedPerson";
    public static applicationComplete = "applicationComplete";

    private subject = new Subject<any>();

    sendMessage(id: string, body: any = 0): void {
        this.subject.next({ id, body });
    }
    clearMessages(): void  {
        this.subject.next();
    }
    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
}
