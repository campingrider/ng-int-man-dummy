import { IntManLibService } from './../int-man-lib.service';
import { Component, OnInit, Input, HostListener, OnDestroy } from '@angular/core';
import { Language } from '../language';

@Component({
  selector: 'intman-switcher',
  templateUrl: './switcher.component.html',
  styleUrls: ['./switcher.component.css']
})
export class SwitcherComponent implements OnInit, OnDestroy {

  langs: Language[];

  @Input() variant = 'dropdown';  // possible variants: dropdown, select, radio, buttons

  @Input() lang: string;

  constructor(private intManLibService: IntManLibService) { }

  ngOnInit() {
    this.intManLibService.getLanguages().subscribe(languages => this.langs = languages.filter(lang => lang.selectable));
    this.intManLibService.defLang.subscribe(lang => this.lang = lang.id);
    this.intManLibService.registerSwitcherComponent(this);
  }

  ngOnDestroy() {
    this.intManLibService.unregisterSwitcherComponents(this);
  }

  @HostListener('change', ['$event.target'])
  onClick(target) {
    this.intManLibService.getLanguage(this.lang).subscribe(lang => this.intManLibService.setLanguage(lang));
  }

  buttonClick(lang) {
    this.intManLibService.getLanguage(lang).subscribe(l => this.intManLibService.setLanguage(l));
  }
}
