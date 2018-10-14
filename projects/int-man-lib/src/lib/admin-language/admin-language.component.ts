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
  public isDefLang = false;

  constructor(private intManLibService: IntManLibService) { }

  ngOnInit() {
    this.intManLibService.registerLanguageComponent(this);
  }

  ngOnChanges() {
    this.intManLibService.defLang.subscribe(defLang => this.isDefLang = defLang.id === this.lang.id);
  }

  ngOnDestroy() {
    this.intManLibService.unregisterLanguageComponent(this);
  }

}
