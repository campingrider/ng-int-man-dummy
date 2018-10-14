import { TextContainer } from './text-container';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap, flatMap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Language } from './language';
import { Translation } from './translation';
import { AdminTranslationComponent } from './admin-translation/admin-translation.component';
import { AdminLanguageComponent } from './admin-language/admin-language.component';
import { AdminComponent } from './admin/admin.component';
import { SwitcherComponent } from './switcher/switcher.component';
import { ContainerSetting } from './container-setting';

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

  private containers: TextContainer[] = [];

  private translationComponents: AdminTranslationComponent[] = [];

  private languageComponents: AdminLanguageComponent[] = [];

  private adminComponents: AdminComponent[] = [];

  private switcherComponents: SwitcherComponent[] = [];

  /** Register some text container to the general service in order to receive updates */
  public registerContainer(which: TextContainer): void { this.containers.push(which); }

  /** Unregister some text container from the general service in order to receive updates */
  public unregisterContainer(which: TextContainer): void { this.containers = this.containers.filter(comp => comp !== which); }

  /** Register some switcher component to the general service in order to receive updates */
  public registerSwitcherComponent(which: SwitcherComponent): void { this.switcherComponents.push(which); }

  /** Unregister some switcher component from the general service in order to receive updates */
  public unregisterSwitcherComponents(which: SwitcherComponent): void {
    this.switcherComponents = this.switcherComponents.filter(comp => comp !== which);
  }

  /** Register some translation component to the general service in order to receive updates */
  public registerTranslationComponent(which: AdminTranslationComponent): void { this.translationComponents.push(which); }

  /** Unregister some translation component from the general service in order to receive updates */
  public unregisterTranslationComponent(which: AdminTranslationComponent): void {
    this.translationComponents = this.translationComponents.filter(comp => comp !== which);
  }

  /** Register some language component to the general service in order to receive updates */
  public registerLanguageComponent(which: AdminLanguageComponent): void {
    this.languageComponents.push(which);
  }

  /** Unregister some language component from the general service in order to receive updates */
  public unregisterLanguageComponent(which: AdminLanguageComponent): void {
    if (this.languageComponents !== undefined) {
      this.languageComponents = this.languageComponents.filter(comp => comp !== which);
    }
  }

  /** Register some admin component to the general service in order to receive updates */
  public registerAdminComponent(which: AdminComponent): void { this.adminComponents.push(which); }

  /** Unregister some admin component from the general service in order to receive updates */
  public unregisterAdminComponent(which: AdminComponent): void {
    this.adminComponents = this.adminComponents.filter(comp => comp !== which);
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
    this.switcherComponents.forEach(comp => {
      comp.lang = to.id;
    });
  }

  /**
   * gets a single language from server by server id
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
   * gets all container settings from server
   */
  public getAllContainerSettings(): Observable<ContainerSetting[]> {
    const url = `${this.dataUrl}/containerSettings/`;
    return this.http.get<ContainerSetting[]>(url)
    .pipe(
      tap(_ => this.log(`fetched settings for all containers`)),
      catchError(this.handleError<ContainerSetting[]>(`getAllContainerSettings`))
    );
  }

  /**
   * gets settings for a specific container from server
   */
  public getContainerSettings(containerId: string): Observable<ContainerSetting> {
    const url = `${this.dataUrl}/containerSettings/${containerId}`;
    return this.http.get<ContainerSetting>(url)
    .pipe(
      tap(_ => this.log(`fetched settings for container id=${containerId}`)),
      catchError(this.handleError<ContainerSetting>(`getContainerSettings id=${containerId}`, undefined))
    );
  }

  /**
   * POSTs a new Language to the server
   */
  public addLanguage(newLang: Language): Observable<Language> {
    const url = `${this.dataUrl}/languages`;
    return this.http.post<Language>(url, newLang, httpOptions).pipe(
      tap((l: Language) => this.log(`language with id ${l.id} saved to server.`)),
      // register new language
      tap((l: Language) => this.adminComponents.forEach(aC => aC.langs.push(l))),
      // renew switcher components
      tap((l: Language) => this.switcherComponents.forEach(sC => sC.langs.push(l)) ),
      catchError(this.handleError<Language>('addLanguage'))
    );
  }

  /**
   * PUTs an updated Language to the server
   */
  updateLanguage(newLang: Language): Observable<any> {
    const url = `${this.dataUrl}/languages`;
    return this.http.put<any>(url, newLang, httpOptions).pipe(
      tap(_ => this.log(`language with id ${newLang.id} updated on server.`)),
      // register new language
      tap(_ => this.adminComponents.forEach(aC => this.getLanguages().subscribe(langs => aC.langs = langs))),
      // renew switcher components
      tap(_ => this.switcherComponents.forEach(sC => this.getLanguages().subscribe(
        langs => sC.langs = langs.filter(lang => lang.selectable)
      ))),
      catchError(this.handleError<Language>('updateLanguage'))
    );
  }

  /**
   * POSTs a new Translation to the server
   */
  public addTranslation(newTranslation: Translation): Observable<Translation> {
    const url = `${this.dataUrl}/translations`;
    return this.http.post<Translation>(url, newTranslation, httpOptions).pipe(
      tap((t: Translation) => this.log(`translation with id ${t.id} saved to server.`)),
      // register new translation
      tap((t: Translation) => this.translationComponents
        .filter(tC => t.langId === tC.lang.id && t.containerId === tC.containerSetting.id)
        .forEach(tC => tC.ngOnChanges())),
      // flush cached translations if lang is not default lang
      tap((t: Translation) => { this.defLang.subscribe(defLang => { if (defLang.id !== t.langId) {
        this.containers.forEach(c => c.flushTranslations());
      } } ); } ),
      catchError(this.handleError<Translation>('addTranslation'))
    );
  }

  /**
   * PUTs an updated Translation to the server
   */
  updateTranslation(newTranslation: Translation): Observable<any> {
    const url = `${this.dataUrl}/translations`;
    return this.http.put<any>(url, newTranslation, httpOptions).pipe(
      tap(_ => this.log(`translation with id ${newTranslation.id} updated on server.`)),
      // register new translation
      tap(_ => this.translationComponents
        .filter(tC => newTranslation.langId === tC.lang.id && newTranslation.containerId === tC.containerSetting.id)
        .forEach(tC => tC.ngOnChanges())),
      // flush cached translations if lang is not default lang
      tap(_ => { this.defLang.subscribe(defLang => { if (defLang.id !== newTranslation.langId) {
        this.containers.forEach(c => c.flushTranslations());
      } } ); } ),
      catchError(this.handleError<any>('updateTranslation'))
    );
  }

  /**
   * POSTs a new ContainerSetting to the server
   */
  public addContainerSetting(containerSetting: ContainerSetting): Observable<ContainerSetting> {
    const url = `${this.dataUrl}/containerSettings`;
    return this.http.post<ContainerSetting>(url, containerSetting, httpOptions).pipe(
      tap((cS: ContainerSetting) => this.log(`ContainerSetting with id ${cS.id} saved to server.`)),
      // register new setting to admin components
      tap((cS: ContainerSetting) => this.adminComponents.forEach(aC => aC.containerSettings.push(cS))),
      catchError(this.handleError<ContainerSetting>('addContainerSetting'))
    );
  }

  /**
   * PUTs an updated ContainerSetting to the server
   */
  updateContainerSetting(id: string, newSetting: ContainerSetting): Observable<any> {
    const url = `${this.dataUrl}/containerSettings`;
    return this.http.put<any>(url, newSetting, httpOptions).pipe(
      tap(_ => this.log(`ContainerSetting with id ${newSetting.id} updated on server.`)),
      // register new setting to admin components
      tap(_ => this.adminComponents.forEach(aC => {
        aC.containerSettings[aC.containerSettings.findIndex(cS => cS.id === newSetting.id)] = newSetting;
      })),
      catchError(this.handleError<any>('updateContainerSetting'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      // console.error(error); // log to console instead

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
