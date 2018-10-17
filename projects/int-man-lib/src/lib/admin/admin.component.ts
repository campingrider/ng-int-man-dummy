import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { IntManLibService } from '../int-man-lib.service';
import { Language } from '../language';
import { TextContainer } from '../text-container';
import { ContainerSetting } from '../container-setting';

@Component({
  selector: 'intman-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {

  public messages: string[];
  public langs: Language[];
  public containerSettings: ContainerSetting[];

  public missingTranslations: Object[];

  public changedSomethingOnNewLang = false;
  public newLangMeetsRequirements = false;

  public newLangId = '';

  @Input() langId = '';
  @Input() containerId = '';

  constructor(private intManLibService: IntManLibService) { }

  ngOnInit() {
    this.intManLibService.registerAdminComponent(this);
    this.intManLibService.getLanguages().subscribe(langs => this.langs = langs);
    this.intManLibService.getAllContainerSettings().subscribe(containerSettings => this.containerSettings = containerSettings);
    this.collectMissingTranslations();
  }

  ngOnDestroy() {
    this.intManLibService.unregisterAdminComponent(this);
    this.changedSomethingOnNewLang = false;
  }

  /** collects missing translations */
  public collectMissingTranslations() {
    this.missingTranslations = [];
    this.intManLibService.getAllContainerSettings().subscribe(containers => {
      this.intManLibService.getLanguages().subscribe(langs => {
        langs = langs.filter(l => l.selectable);
        const langIds = langs.map(l => l.id);
        containers.forEach(container => {
          this.intManLibService.getAllTranslations(container.id).subscribe(translations => {
            this.missingTranslations = this.missingTranslations.filter(mT => mT['containerId'] !== container.id);
            translations = translations.filter(
              translation => translation.contents.length === container.contains && langIds.indexOf(translation.langId) >= 0
            );
            const translationLangIds = translations.map(t => t.langId);
            if (translations.length < langIds.length) {
              const missing = [];
              langIds.forEach(lid => { if (translationLangIds.indexOf(lid) < 0) { missing.push(lid); }});
              this.missingTranslations.push( {
                'containerId': container.id,
                'langTitles': langs.filter(l => missing.indexOf(l.id) >= 0).map(l => l.title)
              } );
            }
          });
        });
      });
    });
  }

  /**
   * returns language object for given langId
   */
  public findLang(langId: string) {
    if (this.langs === undefined) { return undefined; }
    return this.langs.find(tlang => tlang.id === langId);
  }

  /**
   * returns containerSetting object for given containerId
   */
  public findContainerSetting(containerId: string) {
    if (this.containerSettings === undefined) { return undefined; }
    return this.containerSettings.find(tSetting => tSetting.id === containerId);
  }

   /** change status if there was some change */
  public detectChangeOnNewLang(): boolean {
    this.changedSomethingOnNewLang = true;
    this.newLangMeetsRequirements = this.newLangId.substr(0, 2) === 'i-'
                                    || this.newLangId.substr(0, 2) === 'x-'
                                    || this.newLangId.substr(2, 1) === '-';
    return this.newLangMeetsRequirements;
  }


   /** add a new language */
   public addLang(): void {
     if (this.changedSomethingOnNewLang === true && this.detectChangeOnNewLang()) {
      const newLang = new Language(this.newLangId, 'Neue Sprache');
      newLang.selectable = false;
      this.intManLibService.addLanguage(newLang).subscribe(_ => this.newLangId = '');
     }
   }

}
