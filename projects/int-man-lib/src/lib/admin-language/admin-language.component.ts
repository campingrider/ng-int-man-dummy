import { Component, OnInit, Input, OnDestroy, OnChanges } from '@angular/core';
import { Language } from '../language';
import { IntManLibService } from '../int-man-lib.service';

@Component({
  selector: 'intman-admin-language',
  templateUrl: './admin-language.component.html',
  styleUrls: ['./admin-language.component.css']
})
export class AdminLanguageComponent implements OnInit, OnDestroy, OnChanges {

  @Input() lang: Language;

  private initialLang: Language;
  public changedSomething = false;
  public isDefLang = false;

  public deletionRequested = false;
  public deletionPossible = false;

  constructor(private intManLibService: IntManLibService) { }

  ngOnInit() {
    this.intManLibService.registerLanguageComponent(this);
  }

  ngOnChanges() {
    this.deletionPossible = false; this.deletionRequested = false;
    if (this.initialLang === undefined) {
      this.initialLang = new Language(this.lang.id, this.lang.title);
      this.initialLang.selectable = this.lang.selectable;
      this.initialLang.unavailableText = this.lang.unavailableText;
    }
    this.changedSomething = false;
    this.intManLibService.defLang.subscribe(defLang => this.isDefLang = defLang.id === this.lang.id);
  }

  ngOnDestroy() {
    this.intManLibService.unregisterLanguageComponent(this);
  }

  /** request deletion - calculate whether deletion is possible */
  public requestDeletion() {
    this.deletionPossible = false;
    this.deletionRequested = true;
    this.intManLibService.getTranslationsByLanguage(this.lang.id).subscribe(
      translations => { if (translations.length === 0) { this.deletionPossible = true; } }
    );
  }

  /** delete language on user input */
  public deleteLanguage() {
    if (this.deletionRequested && this.deletionPossible) {
      this.intManLibService.deleteLanguage(this.lang).subscribe(_ => this.lang = undefined);
    }
  }

  /** change status if there was some change */
  public detectChange(): void { this.changedSomething = true; }

  /** resets form data */
  public reset(): void { this.lang = this.initialLang; this.initialLang = undefined; this.ngOnChanges(); }

  /**
  * saves current form data to server
  */
  public save(): void {
    // save object to server
    this.intManLibService.updateLanguage(this.lang).subscribe();
  }

}
