import { TextContainer } from './text-container';
import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IntManLibService {

  // TODO: fetch this list from server
  private languages: string[] = [
    'de-DE', 'en-GB', 'fr-FR'
  ];

  private defLang = 'de-DE';

  private curLang: string;

  private containers: TextContainer[];

  constructor() { }

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
  public getLanguage(): string {

    if (this.curLang === undefined) {
      return this.defLang;
    } else {
      return this.curLang;
    }

  }

  /**
   * sets the current language of the application to the given one
   */
  public setLanguage(to: string): void {
    this.curLang = to;
    this.containers.forEach(container => {
      container.switchLanguage(to);
    });
  }

  /**
   * gets all available languages
   */
  public getLanguages(): string[] {
    return this.languages;
  }
}
