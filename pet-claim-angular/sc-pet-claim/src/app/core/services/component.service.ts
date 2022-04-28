import {
    ComponentFactoryResolver,
    Injectable, ApplicationRef, Injector, ComponentRef, EmbeddedViewRef} from '@angular/core';
import { Subject } from 'rxjs';
import { CalendarComponent } from 'src/app/shared/components/calendar/calendar.component';
import { LoadingNotificationComponent } from 'src/app/shared/components/loading-notification/loading-notification.component';
import { PopupComponent } from 'src/app/shared/components/popup/popup.component';
import { ToolTipComponent } from 'src/app/shared/components/tool-tip/tool-tip.component';
import { TrackingService } from './tracking.service';

declare var TweenMax: any;
declare var Quart: any;

@Injectable({
    providedIn: 'root'
})
export class ComponentService {
    calendarComponentRef: ComponentRef<CalendarComponent>;
    toolTipComponentRef: ComponentRef<ToolTipComponent>;
    toolTipComponentRefList: Map<string, ComponentRef<ToolTipComponent>>;
    popupComponentRef: ComponentRef<PopupComponent>;
    loadingComponentRef: ComponentRef<LoadingNotificationComponent>;
    currentScrollTop: any;
    toolTipOpen = false;

    private recaptchav2 = new Subject<string>();
    recaptchav2$ = this.recaptchav2.asObservable();



    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private injector: Injector,
        private tracking: TrackingService) {
        this.toolTipComponentRefList = new Map<string, ComponentRef<ToolTipComponent>>();
    }
    public recaptchav2Resolved(token: string): void{
        this.recaptchav2.next(token);
    }
    public popup(type: string, title: string, copy: string): PopupComponent{
        this.destroyPopup();
        this.tracking.popupView(title, type);
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(PopupComponent);
        const componentRef = componentFactory.create(this.injector);
        this.appRef.attachView(componentRef.hostView);
        const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        document.body.appendChild(domElem);
        this.popupComponentRef = componentRef;
        this.popupComponentRef.instance.popupType = type;
        this.popupComponentRef.instance.title = title;
        this.popupComponentRef.instance.copy = copy;
        return (this.popupComponentRef.instance as PopupComponent);
    }
    public destroyPopup(): void {
        if (this.popupComponentRef !== undefined) {
            this.appRef.detachView(this.popupComponentRef.hostView);
            this.popupComponentRef.destroy();
            this.popupComponentRef = undefined;
        }
    }
    public toolTip(copy: string, helpId: string): ToolTipComponent {
        this.destroyOtherToolTips(helpId);
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ToolTipComponent);
        const componentRef = componentFactory.create(this.injector);
        this.appRef.attachView(componentRef.hostView);
        const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        document.body.appendChild(domElem);
        this.toolTipComponentRef = componentRef;
        this.toolTipComponentRef.instance.copy = copy;
        this.toolTipComponentRef.instance.helpId = helpId;
        this.toolTipOpen = true;
        this.toolTipComponentRefList.set(helpId, this.toolTipComponentRef);
        return (this.toolTipComponentRef.instance as ToolTipComponent);
    }
    public destroyOtherToolTips(helpId: string): void {
        this.toolTipComponentRefList.forEach((value: ComponentRef<ToolTipComponent>, key: string) => {
            if (key !== helpId) {
                this.destroyToolTip(key);
                this.toolTipComponentRefList.delete(key);
            }
        });
    }
    public destroyToolTip(helpId: string): void {
        if (this.toolTipComponentRefList.has(helpId)) {
            const toolTip = this.toolTipComponentRefList.get(helpId);
            (toolTip.instance as ToolTipComponent).show = false;
            (toolTip.instance as ToolTipComponent).helpIcon.show = false;
            this.toolTipOpen = false;
            setTimeout(() => {
                toolTip.destroy();
            }, 50);
        }
    }

    public calendar(): CalendarComponent {
        if (this.calendarComponentRef !== undefined) {
            this.destroyCalendar();
        }
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(CalendarComponent);
        const componentRef = componentFactory.create(this.injector);
        this.appRef.attachView(componentRef.hostView);
        const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        document.body.appendChild(domElem);
        this.calendarComponentRef = componentRef;
        return (this.calendarComponentRef.instance as CalendarComponent);
    }
    public destroyCalendar(): void {
        if (this.calendarComponentRef !== undefined) {
            this.appRef.detachView(this.calendarComponentRef.hostView);
            this.calendarComponentRef.destroy();
            this.calendarComponentRef = undefined;
        }
    }

    public loadingNotification(message: string): LoadingNotificationComponent {
        if (this.loadingComponentRef !== undefined) {
            this.destroyLoading();
        }
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(LoadingNotificationComponent);
        const componentRef = componentFactory.create(this.injector);
        this.appRef.attachView(componentRef.hostView);
        const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        document.body.appendChild(domElem);
        this.loadingComponentRef = componentRef;
        this.loadingComponentRef.instance.message = message;
        return (this.loadingComponentRef.instance as LoadingNotificationComponent);
    }
    public destroyLoading(): void {
        if (this.loadingComponentRef !== undefined) {
            this.appRef.detachView(this.loadingComponentRef.hostView);
            this.loadingComponentRef.destroy();
        }
    }


    public offset(nativeElement: any): any {
        const rect = (nativeElement as HTMLElement).getBoundingClientRect();
        const topPos = rect.top;
        const leftPos = rect.left;
        const docEl = document.documentElement;
        const rectTop = rect.top + window.pageYOffset - docEl.clientTop;
        const rectLeft = rect.left + window.pageXOffset - docEl.clientLeft;
        return {left: leftPos, top: topPos, offsetLeft: rectLeft, offsetTop: rectTop};
    }


}
