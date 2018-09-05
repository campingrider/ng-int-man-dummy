import { IntManLibService } from './../int-man-lib.service';
import { Component, OnInit, Input, HostListener } from '@angular/core';

@Component({
  selector: 'intman-switcher',
  templateUrl: './switcher.component.html',
  styleUrls: ['./switcher.component.css']
})
export class SwitcherComponent implements OnInit {

  langs: string[];
  @Input() lang: string;

  constructor(private intManLibService: IntManLibService) { }

  ngOnInit() {
    this.langs = this.intManLibService.getLanguages();
    this.lang = this.intManLibService.getLanguage();
  }

  @HostListener('change', ['$event.target'])
  onClick(target) {
    if (target.tagName.toUpperCase() === 'SELECT') {
      this.intManLibService.setLanguage(this.lang);
    }
  }
}
