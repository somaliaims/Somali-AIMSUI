import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UrlHelperService } from './url-helper-service';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Organization } from '../models/organization-model';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  constructor(private httpClient: HttpClient, private urlHelper: UrlHelperService) { }

  searchOrganizations(filter: {name: string} = {name: ''}, page = 1): Observable<Organization[]> {
    var url = this.urlHelper.organizationsListUrl();
    return this.httpClient.get<Organization[]>(url)
    .pipe(
      tap((response: Organization[]) => {
           response = response
          .map(org => new Organization(org.id, org.organizationName))
          .filter(org => org.organizationName.includes(filter.name))
        return response;
      })
      );
    }

    getOrganizationTypes() {
      var url = this.urlHelper.organizationTypesUrl();
        return this.httpClient
            .get<any>(url);
    }
}
