import {ApplicationRef, Injectable, Injector} from '@angular/core';

declare global {
    interface Window { dataLayer: any[]; }
}

@Injectable({
    providedIn: 'root'
})
export class TrackingService {
    public static coverType = '';
    public currentTitle = '';
    public startTime: number;
    constructor(private appRef: ApplicationRef, private injector: Injector) {}
    event(ev: string, info: any): void {
        this.push({
            event: ev,
            event_info: info
        });
    }
    page(title: string = '', url: string = ''): void {
        this.currentTitle = title === '' ? this.currentTitle : title;
        this.push({
            event: 'pageview',
            page: {
                page_location: window.location.href + url,
                page_title: this.currentTitle
            }
        });
    }
    funnelStart(): void {
        this.startTime = new Date().getTime();
        this.push({
            event: 'funnel_start',
            event_info: {
                funnel_name: 'Online claim'
            },
            cover_type: TrackingService.coverType
        });
    }
    funnelStep(step: string): void {
        this.push({
            event: 'funnel_step',
            event_info: {
                claim_option: step
            },
            cover_type: TrackingService.coverType
        });
    }
    funnelComplete(): void {
        this.push({
            event: 'funnel_complete',
            event_info: {
                funnel_name: 'Online claim',
                funnel_time: (Number(new Date().getTime()) - Number(this.startTime))
            },
            cover_type: TrackingService.coverType
        });
    }
    callToAction(step: string): void {
        this.push({
            event: 'call_to_action',
            event_info: {
                link_text: step
            },
            cover_type: TrackingService.coverType
        });
    }
    popupView(name: string, type: string): void {
        this.push({
            event: 'popup_view',
            event_info: {
                content_name: name,
                content_type: 'popup'
            },
            cover_type: TrackingService.coverType
        });
    }
    fieldInteraction(name: string): void {
        this.push({
            event: 'form_field_interaction',
            event_info: {
                content_name: name
            },
            cover_type: TrackingService.coverType
        });
    }
    push(value: any): void {
        //  console.log('#### Tracking Event ####', value);
        window.dataLayer.push(value);
    }
}
