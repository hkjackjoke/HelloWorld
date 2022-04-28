import {
    ComponentFactoryResolver,
    Injectable, Inject, ReflectiveInjector, ApplicationRef, Injector, ComponentRef, EmbeddedViewRef} from "@angular/core";
import { CalendarComponent } from "../components/calendar/calendar.component";
import { ErrorNotificationComponent } from "../components/error-notification/error-notification.component";
import { LoadingNotificationComponent } from "../components/loading-notification/loading-notification.component";
import { ToolTipComponent } from "../components/tool-tip/tool-tip.component";
import { GreenBannerComponent } from "../components/green-banner/green-banner.component";
import { DiscountModalComponent } from "../components/discount-modal/discount-modal.component";
import { CoPaymentModalComponent } from "../components/co-payment-modal/co-payment-modal.component";
import { TimeOutModalComponent } from "../components/time-out-modal/time-out-modal.component";
import { TrackingService } from "./tracking.service";
declare var TweenMax: any;
declare var Quart: any;

@Injectable({
    providedIn: "root"
})
export class ComponentService {
    calendarComponentRef: ComponentRef<CalendarComponent>;
    errorComponentRef: ComponentRef<ErrorNotificationComponent>;
    loadingComponentRef: ComponentRef<LoadingNotificationComponent>;
    toolTipComponentRef: ComponentRef<ToolTipComponent>;
    toolTipComponentRefList: Map<string, ComponentRef<ToolTipComponent>>;

    greenBannerComponentRef: ComponentRef<GreenBannerComponent>;
    discountModalComponentRef: ComponentRef<DiscountModalComponent>;
    coPaymentComponentRef: ComponentRef<CoPaymentModalComponent>;
    timeOutComponentRef: ComponentRef<TimeOutModalComponent>;
    currentScrollTop: any;
    toolTipOpen = false;
    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private injector: Injector,
        private tracking: TrackingService) {
        this.toolTipComponentRefList = new Map<string, ComponentRef<ToolTipComponent>>();
    }
    public discountModal(): void {
        if (this.discountModalComponentRef !== undefined) {
            this.destroyDiscountModal();
        }
        const componentFactory: any = this.componentFactoryResolver.resolveComponentFactory(DiscountModalComponent);
        const componentRef: any  = componentFactory.create(this.injector);
        this.appRef.attachView(componentRef.hostView);
        const domElem: any  = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        document.getElementById("common-popup-boxes").appendChild(domElem);
        this.discountModalComponentRef = componentRef;
        (this.discountModalComponentRef.instance as DiscountModalComponent).eventOut.subscribe((value: string) => {
            switch (value) {
                case "close-discount-modal":
                    this.destroyDiscountModal();
                    break;
            }
        });
    }
    public destroyDiscountModal(): void {
        if (this.discountModalComponentRef !== undefined) {
            this.appRef.detachView(this.discountModalComponentRef.hostView);
            this.discountModalComponentRef.destroy();
        }
    }
    public coPaymentModal(): void {
        if (this.coPaymentComponentRef !== undefined) {
            this.destroyCoPayment();
        }
        const componentFactory: any = this.componentFactoryResolver.resolveComponentFactory(CoPaymentModalComponent);
        const componentRef: any = componentFactory.create(this.injector);
        this.appRef.attachView(componentRef.hostView);
        const domElem: any = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        document.getElementById("common-popup-boxes").appendChild(domElem);
        this.coPaymentComponentRef = componentRef;
        if (window.innerWidth <= 767) {
            this.currentScrollTop = window.scrollY;
            window.scrollTo(0, 0);
        }
        (this.coPaymentComponentRef.instance as CoPaymentModalComponent).eventOut.subscribe((value: string) => {
            switch (value) {
                case "close":
                    this.destroyCoPayment();
                    break;
            }
        });
    }
    public destroyCoPayment(): void {
        if (this.coPaymentComponentRef !== undefined) {
            this.appRef.detachView(this.coPaymentComponentRef.hostView);
            this.coPaymentComponentRef.destroy();
            if (window.innerWidth <= 767) {
                window.scrollTo(0, this.currentScrollTop);
            }
        }
    }
    public timeOutModal(): void  {
        if (this.timeOutComponentRef !== undefined) {
            this.destroyTimeOut();
        }
        const componentFactory: any = this.componentFactoryResolver.resolveComponentFactory(TimeOutModalComponent);
        const componentRef: any = componentFactory.create(this.injector);
        this.appRef.attachView(componentRef.hostView);
        const domElem: any = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        document.getElementById("common-popup-boxes").appendChild(domElem);
        this.timeOutComponentRef = componentRef;
        if (window.innerWidth <= 767) {
            this.scrollTo(0);
        }
        (this.timeOutComponentRef.instance as TimeOutModalComponent).eventOut.subscribe((value: string) => {
            switch (value) {
                case "close":
                    this.destroyTimeOut();
                    break;
            }
        });
    }
    public destroyTimeOut(): void {
        if (this.timeOutComponentRef !== undefined) {
            this.appRef.detachView(this.timeOutComponentRef.hostView);
            this.timeOutComponentRef.destroy();
        }
    }
    public greenBanner(): void  {
        if (this.greenBannerComponentRef !== undefined) {
            this.destroyGreenBanner();
        }
        const componentFactory: any = this.componentFactoryResolver.resolveComponentFactory(GreenBannerComponent);
        const componentRef: any = componentFactory.create(this.injector);
        this.appRef.attachView(componentRef.hostView);
        const domElem: any = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        document.getElementById("top-anchor").appendChild(domElem);
        this.greenBannerComponentRef = componentRef;
        (this.greenBannerComponentRef.instance as GreenBannerComponent).eventOut.subscribe((value: string) => {
            switch (value) {
                case "discount-modal":
                    this.discountModal();
                    this.setGreenBannerSlide("");
                    break;
            }
        });
    }
    public setGreenBannerSlide(value: string): void {
        if (this.greenBannerComponentRef !== undefined) {
            (this.greenBannerComponentRef.instance as GreenBannerComponent).setCurrentSlide(value);
        }
    }
    public destroyGreenBanner(): void {
        if (this.greenBannerComponentRef !== undefined) {
            this.appRef.detachView(this.greenBannerComponentRef.hostView);
            this.greenBannerComponentRef.destroy();
        }
    }
    public toolTip(copy: string, helpId: string): ToolTipComponent {
        this.destroyOtherToolTips(helpId);
        const componentFactory: any = this.componentFactoryResolver.resolveComponentFactory(ToolTipComponent);
        const componentRef: any = componentFactory.create(this.injector);
        this.appRef.attachView(componentRef.hostView);
        const domElem: any = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
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
            const toolTip: any = this.toolTipComponentRefList.get(helpId);
            (toolTip.instance as ToolTipComponent).show = false;
            (toolTip.instance as ToolTipComponent).helpIcon.show = false;
            this.toolTipOpen = false;
            setTimeout(() => {
                toolTip.destroy();
            }, 50);
        }
    }
    public loadingNotification(message: string): LoadingNotificationComponent {
        if (this.loadingComponentRef !== undefined) {
            this.destroyLoading();
        }
        const componentFactory: any = this.componentFactoryResolver.resolveComponentFactory(LoadingNotificationComponent);
        const componentRef: any = componentFactory.create(this.injector);
        this.appRef.attachView(componentRef.hostView);
        const domElem: any = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
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
    public errorNotification(message: string): ErrorNotificationComponent {
        if (this.errorComponentRef !== undefined) {
            this.destroyError();
        }
        const componentFactory: any = this.componentFactoryResolver.resolveComponentFactory(ErrorNotificationComponent);
        const componentRef: any = componentFactory.create(this.injector);
        this.appRef.attachView(componentRef.hostView);
        const domElem: any = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        document.body.appendChild(domElem);
        this.errorComponentRef = componentRef;
        this.errorComponentRef.instance.message = message;
        return (this.errorComponentRef.instance as ErrorNotificationComponent);
    }
    public destroyError(): void {
        if (this.errorComponentRef !== undefined) {
            this.appRef.detachView(this.errorComponentRef.hostView);
            this.errorComponentRef.destroy();
        }
    }
    public calendar(): CalendarComponent {
        if (this.calendarComponentRef !== undefined) {
            this.destroyCalendar();
        }
        const componentFactory: any = this.componentFactoryResolver.resolveComponentFactory(CalendarComponent);
        const componentRef: any = componentFactory.create(this.injector);
        this.appRef.attachView(componentRef.hostView);
        const domElem: any = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
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
    public offset(nativeElement: any): any  {
        const rect: any = (nativeElement as HTMLElement).getBoundingClientRect();
        const topPos: any = rect.top;
        const leftPos: any = rect.left;
        const docEl: any = document.documentElement;
        const rectTop: any = rect.top + window.pageYOffset - docEl.clientTop;
        const rectLeft: any = rect.left + window.pageXOffset - docEl.clientLeft;
        return {left: leftPos, top: topPos, offsetLeft: rectLeft, offsetTop: rectTop};
    }
    public scrollToTop(): void {
        const topBar: any = document.querySelector(".top-bar");
        let top: any = 0;
        if (topBar !== null) {
          top = document.querySelector(".top-bar").getBoundingClientRect().height;
        }
        this.scrollTo(top);
    }
    public scrollTo(top: number = 0): void {
        window.scrollTo({left: 0, top: top, behavior: "smooth"});
    }
    public getAproxAgeDate(label: string,value: any): Date {
        const age: Date = new Date();
        switch(label) {
          case "days":
            age.setDate(age.getDate() - Number(value));
            break;
          case "weeks":
            age.setDate(age.getDate() - (Number(value) * 7));
            break;
          case "months":
            let days: number = 0;
            let month: number = age.getMonth();
            let year: number = age.getFullYear();
            for (let months: number = Number(value); months > 0; months--) {
              month--;
              if (month <= -1) {
                year--;
                month = 11;
              }
              days += new Date(year, month, 0).getDate();
            }
            age.setDate(age.getDate() - days);
            break;
          case "years":
            age.setFullYear( age.getFullYear() - Number(value));
            break;
        }
        return age;
    }
}
