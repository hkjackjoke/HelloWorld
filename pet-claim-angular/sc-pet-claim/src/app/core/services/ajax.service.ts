import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormModel } from '../models/form.model';
import { ApplicationResultModel } from '../models/application-result.model';
import { OrganisationModel } from '../models/organisation.model';


@Injectable({
    providedIn: 'root'
})
export class AjaxService {
    private baseUrl = '/make-a-claim';
    constructor(private http: HttpClient) {

    }
    public submitApplication(form: FormModel): Observable<ApplicationResultModel> {
        return this.http.post<ApplicationResultModel>(`${this.baseUrl}/submit-application`, form.data);
    }
    public getVets(): Observable<OrganisationModel[]> {
        return this.http.get<OrganisationModel[]>(`${this.baseUrl}/get-vets`);
    }
}
