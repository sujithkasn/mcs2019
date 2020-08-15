import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse, HttpParams, HttpResponse, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, filter, takeUntil, map } from 'rxjs/operators';
import { Url } from '../util/util';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(protected httpClient: HttpClient) { }

  async postData(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
    });
    return response.json();
  }

  async postDataWithParams(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async getData(url = '') {
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      redirect: 'follow',
      referrerPolicy: 'no-referrer'
    });
    return response;
  }

  httpGet(url: string): Observable<any> {
    return this.httpClient.get<any[]>(url).pipe(
      map((result: any) => {
        return result.hasOwnProperty('courses') ? result.courses : result;
      }),
      catchError(this.handleErrorNoMsg));
  }

  getCourseCategories(): Observable<any[]> {
    let apiCallUrl = Url.addParam(environment.moodleEndPoint, "wstoken", environment.moodleWsToken);
    apiCallUrl = Url.addParam(apiCallUrl, "wsfunction", environment.moodleWsFuncGetCourseCategories);
    apiCallUrl = Url.addParam(apiCallUrl, "moodlewsrestformat", environment.moodleWsRestFormat);

    return this.httpGet(apiCallUrl);
  }

  getCourses(): Observable<any[]> {
    let apiCallUrl = Url.addParam(environment.moodleEndPoint, "wstoken", environment.moodleWsToken);
    apiCallUrl = Url.addParam(apiCallUrl, "wsfunction", environment.moodleWsFuncGetCourses);
    apiCallUrl = Url.addParam(apiCallUrl, "moodlewsrestformat", environment.moodleWsRestFormat);

    return this.httpGet(apiCallUrl);
  }

  getCourseForums(course?: any): Observable<any[]> {
    let apiCallUrl = Url.addParam(environment.moodleEndPoint, "wstoken", environment.moodleWsToken);
    apiCallUrl = Url.addParam(apiCallUrl, "wsfunction", environment.moodleWsFuncGetForums);
    apiCallUrl = Url.addParam(apiCallUrl, "moodlewsrestformat", environment.moodleWsRestFormat);
    if (course != null) {
      apiCallUrl = Url.addParam(apiCallUrl, "courseids[0]", Number(course.id));
    }

    return this.httpGet(apiCallUrl);
  }

  private handleErrorNoMsg(errorResponse: HttpErrorResponse): any {
    return throwError(errorResponse);
  }
}
