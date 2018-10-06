import { TextContainer } from './text-container';
import { Injectable, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap, flatMap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Language } from './language';
import { Translation } from './translation';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class IntManLibService {

  private dataUrl = 'api';

  public defLang: Observable<Language>;

  private curLang: Language;

  private containers: TextContainer[];

  /**
   * Register some text container to the general service in order to receive updates
   */
  public registerContainer(which: TextContainer): void {
    if (this.containers === undefined) {
      this.containers = [];
    }
    this.containers.push(which);
  }

  /**
   * returns the current language the application shall be served in
   */
  public getCurrentLanguage(): Observable<Language> {

    if (this.curLang === undefined) {
      return this.defLang;
    } else {
      return of(this.curLang);
    }

  }

  /**
   * sets the current language of the application to the given one
   */
  public setLanguage(to: Language): void {
    this.curLang = to;
    this.containers.forEach(container => {
      container.switchLanguage(to);
    });
  }

  /**
   * gets a single language from server by server id
   * ToDo: generate language definition for 'en'/'fr'/... from 'en-GB', 'fr-FR', ...
   */
  public getLanguage(id: string): Observable<Language> {
    const url = `${this.dataUrl}/languages/${id}`;
    return this.http.get<Language>(url)
    .pipe(
      tap(_ => this.log(`fetched language id=${id}`)),
      catchError(this.handleError<Language>(`getLanguage id=${id}`))
    );
  }

  /**
   * gets all available languages from server
   */
  public getLanguages(): Observable<Language[]> {
    const url = `${this.dataUrl}/languages`;
    return this.http.get<Language[]>(url)
      .pipe(
        tap(ls => this.log('fetched ' + ls.length + ' languages')),
        catchError(this.handleError('getLanguages', []))
      );
  }

  /**
   * gets all translations for a given container in a given language
   */
  public getTranslation(containerId: string, langId: string): Observable<Translation[]> {
    const url = `${this.dataUrl}/translations/?containerId=${containerId}&langId=${langId}`;
    return this.http.get<Translation[]>(url)
    .pipe(
      tap(_ => this.log(`fetched translation for container id=${containerId} with language lang=${langId}`)),
      catchError(this.handleError<Translation[]>(`getLanguage id=${containerId} with language lang=${langId}`))
    );
  }

  /**
   * gets all translations for a given container
   */
  public getAllTranslations(containerId: string): Observable<Translation[]> {
    const url = `${this.dataUrl}/translations/?containerId=${containerId}`;
    return this.http.get<Translation[]>(url)
    .pipe(
      tap(_ => this.log(`fetched translation for container id=${containerId} with all languages`)),
      catchError(this.handleError<Translation[]>(`getLanguage id=${containerId} with all languages`))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /**
   * Log a message.
   */
  public log(message: string) {
    console.log('Message: ' + message);
  }

/**
 * Creates an instance of IntManLibService.
 */
constructor(
    private http: HttpClient
  ) {
    this.http = http;

    // get default language from server
    const url = `${this.dataUrl}/defLangId`;
    this.defLang = this.http.get<string>(url)
    .pipe(
      tap(langId => this.log(`fetched default language for app: ${langId}`)),
      catchError(this.handleError<string>(`IntManLibService constructor - default language`)),
      flatMap(langId => this.getLanguage(langId))
    );
  }
}
