import { Component, OnInit, Input, OnDestroy, HostListener, OnChanges } from '@angular/core';
import { TextContainer } from '../text-container';
import { Language } from '../language';
import { IntManLibService } from '../int-man-lib.service';
import { ContainerSetting } from '../container-setting';
import { Translation } from '../translation';

@Component({
  selector: 'intman-admin-translation',
  templateUrl: './admin-translation.component.html',
  styleUrls: ['./admin-translation.component.css']
})
export class AdminTranslationComponent implements OnInit, OnDestroy, OnChanges {

  @Input() lang: Language;
  @Input() containerSetting: ContainerSetting;

  public isDefLang = false;
  public notMatching = false;
  public altLangDisplayed: Language;
  public changedSomething = false;

  public deletionRequested = false;

  public translationContents: string[] = Array();
  public altLangPreferred: boolean[] = Array();
  public defTexts: string[] = Array();

  constructor(private intManLibService: IntManLibService) { }

  ngOnInit() {
    this.intManLibService.registerTranslationComponent(this);
  }

  ngOnDestroy() {
    this.intManLibService.unregisterTranslationComponent(this);
  }


  ngOnChanges() {
    // initialize vars
    this.isDefLang = false; this.notMatching = false; this.altLangDisplayed = undefined; this.changedSomething = false;
    this.deletionRequested = false;

    // initialize content array with empty strings - defTexts don't need to be initialized
    this.translationContents = Array(); this.altLangPreferred = Array(); this.defTexts = Array();
    while (this.translationContents.length < this.containerSetting.contains) { this.translationContents.push(''); }
    while (this.altLangPreferred.length < this.containerSetting.contains) { this.altLangPreferred.push(false); }

    if (this.containerSetting.contains > 0) {
      // gather translation
      this.intManLibService.getTranslation(this.containerSetting.id, this.lang.id).subscribe(
        t => {
          if (t.length > 0) {
            // always use right translation if available
            const filtered = t.filter(trans => trans.langId === this.lang.id);
            if (filtered.length > 0) { t[0] = filtered[0]; }

            // check whether translation language matches language
            if (t[0].langId === this.lang.id) {
              // check whether translation length matches containerSetting
              this.notMatching = t[0].contents.length !== this.containerSetting.contains;
              let contents = t[0].contents;
              const altLangPreferred = t[0].preferAltLang.length === this.containerSetting.contains ? t[0].preferAltLang : Array();
              if (this.notMatching) {
                if (contents.length > this.containerSetting.contains) {
                  // join all contents into first content
                  contents = [contents.join('')];
                }
                // add empty contents to match setting
                while (contents.length < this.containerSetting.contains) { contents.push(''); }
                while (altLangPreferred.length < this.containerSetting.contains) { altLangPreferred.push(false); }
              }

              this.translationContents = contents;
              this.altLangPreferred = altLangPreferred;
            } else {
              // register alternatively displayed language
              this.intManLibService.getLanguage(t[0].langId).subscribe(langDisplayed => this.altLangDisplayed = langDisplayed);
            }
          } else {
            // register default language as alternatively displayed language
            this.intManLibService.defLang.subscribe(langDisplayed => this.altLangDisplayed = langDisplayed);
          }
        }
      );

      // gather default translation
      this.intManLibService.defLang.subscribe(
        defLang => {
          this.isDefLang = defLang.id === this.lang.id;
          this.intManLibService.getTranslation(this.containerSetting.id, defLang.id).subscribe(
            dT => {
              if (dT.length > 0 && dT[0].contents.length === this.containerSetting.contains) {
                this.defTexts = dT[0].contents;
              }
            }
          );
        }
      );
    }
  }

  /**
   * returns the DOM path to some textualContent with given index
   */
  public getDomPath(contentIndex: number): string {
    let domPath = '';
    let searchIndex = -1;

    // get index of contentIndex-nth occurance of #text, return '' if there is none.
    for (let countSearches = 0; countSearches <= contentIndex; countSearches++) {
      searchIndex++;
      searchIndex = this.containerSetting.domSignature.indexOf('#text', searchIndex);
      if (searchIndex === -1) { return ''; }
    }

    // set substring before occurence as domPath
    // e.g. <p>#text<strong>#text</strong><em>#text</em></p> --> <p>#text<strong>#text</strong><em>
    domPath = this.containerSetting.domSignature.substr(0, searchIndex);

    // delete all #text occurances from domPath
    // e.g. <p>#text<strong>#text</strong><em> --> <p><strong></strong><em>
    while (domPath.indexOf('#text') > -1) { domPath = domPath.replace('#text', ''); }

    // delete all > occurances from domPath
    // e.g. <p><strong></strong><em> --> <p<strong</strong<em
    while (domPath.indexOf('>') > -1) { domPath = domPath.replace('>', ''); }

    // split domPath into Array
    // e.g. <p<strong</strong<em --> ['','p','strong','/strong','em']
    const split = domPath.split('<');
    domPath = '';

    let endTags: string[] = Array();

    while (split.length > 0) {
      const current = split.pop();
      // avoid empty strings
      if (current === '') { continue; }
      if (current.substr(0, 1) === '/') {
        // if it's an end tag, register!
        endTags.push(current.substr(1));
      } else {
        // if it's not an end tag, check whether there is an end to it
        if (endTags.indexOf(current) > -1) {
          // if there's an end, purge the end from endTags and do nothing
          endTags = endTags.filter(endTag => endTag !== current);
        } else {
          // if there's no end, add tag to domPath
          if (domPath === '') {
            domPath = current;
          } else {
            domPath = current + ' ➟ ' + domPath;
          }
        }
      }
    }

    return domPath;
  }

  /** request deletion */
  public requestDeletion() {
    this.deletionRequested = true;
  }

  /** delete language on user input */
  public deleteTranslation() {
    const container = this.containerSetting;
    if (this.deletionRequested) {
      this.intManLibService.deleteTranslation(container.id + '-' + this.lang.id).subscribe(_ => {
        // check whether we still need the container
        this.intManLibService.checkDeleteContainer(container.id);
      });
    }
  }

  /** change status if there was some change */
  public detectChange(): void { this.changedSomething = true; }

  /** resets form data */
  public reset(): void { this.ngOnChanges(); }

  /**
  * saves current form data to server
  */
  public save(): void {
    // assemble new Translation object
    const newT = new Translation();
    newT.id = this.containerSetting.id + '-' + this.lang.id;
    newT.langId = this.lang.id;
    newT.containerId = this.containerSetting.id;
    newT.contents = this.translationContents;
    newT.preferAltLang = this.altLangPreferred;
    // save object to server
    this.intManLibService.updateTranslation(newT).subscribe();
  }

}
