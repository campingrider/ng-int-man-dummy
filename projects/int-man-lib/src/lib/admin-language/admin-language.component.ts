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

  constructor(private intManLibService: IntManLibService) { }

  ngOnInit() {
    this.intManLibService.registerLanguageComponent(this);
  }

  ngOnChanges() {
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
