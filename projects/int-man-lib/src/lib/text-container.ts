import { ContainerSetting } from './container-setting';
import { IntManLibService } from './int-man-lib.service';
import { TextualContent } from './textual-content';
import { Renderer2 } from '@angular/core';
import { Language } from './language';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Translation } from './translation';

export class TextContainer {
  public id: string;
  public nativeElement: any;
  public renderer: Renderer2;
  public domSignature: string;
  public currentLang: Language;
  public altLangDisplayed: Language;
  public contents: TextualContent[];

  private containerSetting: ContainerSetting;

  private altLangNotification: any;

  private translationCache = { };

  private defaultTranslations: string[];

  constructor(id: string, nativeElement: any, renderer: Renderer2, private intManLibService: IntManLibService) {
    this.id = id;
    this.nativeElement = nativeElement;
    this.renderer = renderer;

    this.intManLibService.getCurrentLanguage().subscribe(
      lang => {
        this.currentLang = lang;
        this.contents.forEach(cont => cont.initiateLanguage(lang));
      }
    );

    this.contents = [];

    // calculate domSignature and gather textual contents
    this.domSignature = this.exploreDOM(this.nativeElement);

    this.intManLibService.registerContainer(this);

    // load containerSetting or create it and update if necessary
    this.intManLibService.getContainerSettings(this.id).subscribe(
      setting => {
        if (setting === undefined || this.domSignature === setting.domSignature) {
          const newSetting = new ContainerSetting();
          newSetting.id = this.id;
          newSetting.domSignature = this.domSignature;
          newSetting.contains = this.contents.length;
          if (setting === undefined) {
            // create new setting
            this.intManLibService.addContainerSetting(newSetting).subscribe(s => {
              this.containerSetting = s;
              // trigger registration of default translation
              this.registerDefaultTranslation(undefined, (this.containerSetting.contains - 1));
            });
          } else {
            // update setting
            this.intManLibService.updateContainerSetting(this.id, newSetting).subscribe();
            this.containerSetting = newSetting;
            // trigger registration of default translation
            this.registerDefaultTranslation(undefined, (this.containerSetting.contains - 1));
          }
        } else {
          this.containerSetting = setting;
          // trigger registration of default translation
          this.registerDefaultTranslation(undefined, (this.containerSetting.contains - 1));

        }
      }
    );
  }

  /**
   * receive default translation from contents and interact with server when all are received
   */
  public registerDefaultTranslation(text: string, index: number): void {

    if (this.defaultTranslations === undefined) {
      this.defaultTranslations = Array();
    }

    while (this.defaultTranslations.length <= index) { this.defaultTranslations.push(undefined); }

    if (text !== undefined) { this.defaultTranslations[index] = text; }

    // interact with server only after containerSetting is loaded
    if (this.containerSetting !== undefined && this.defaultTranslations.length === this.containerSetting.contains) {

      let registeredAll = true;
      this.defaultTranslations.forEach(t => registeredAll = registeredAll && (t !== undefined));

      if (registeredAll) {

        // check whether service knows default translation, create otherwise, update on detected changes
        this.intManLibService.defLang.subscribe(defLang => {
          this.intManLibService.getTranslation(this.id, defLang.id).subscribe(defTranslation => {
            // only use translations matching language exactly

            defTranslation = defTranslation.filter(t => t.langId === defLang.id);

            if (defTranslation.length === 0) {

              // create default translation
              const newTranslation = new Translation();
              newTranslation.containerId = this.id;
              newTranslation.langId = defLang.id;
              newTranslation.id = this.id + '-' + defLang.id;
              newTranslation.preferAltLang = Array();
              while (newTranslation.preferAltLang.length < this.containerSetting.contains) { newTranslation.preferAltLang.push(false); }
              newTranslation.contents = this.defaultTranslations;

              this.intManLibService.addTranslation(newTranslation).subscribe();

            } else {
              let identicalTexts = true;
              // compare default translation to registered translations
              defTranslation[0].contents.forEach((t, i) => identicalTexts = identicalTexts && t === this.defaultTranslations[i]);

              if (!identicalTexts) {
                defTranslation[0].contents = this.defaultTranslations;
                this.intManLibService.updateTranslation(defTranslation[0]).subscribe();
              }
            }
          });
        });

      }
    }

    /*
    */
  }

  /**
   * get translation for textual content
   * filter translations from server for matching domSignature,
   * return an empty observable to allow for an alternative language to be chosen
   */
  public getTranslations(langId: string): Observable<Translation[]> {
    if (this.translationCache[langId] === undefined) {
      this.translationCache[langId] = this.intManLibService.getTranslation(this.id, langId).pipe(
        map(translations => translations.filter(translation => translation.contents.length === this.contents.length))
      );
    }
    return this.translationCache[langId];
  }

  /**
   * this function is called upon destruction of the connected component
   */
  public destroy(): void {
    this.intManLibService.unregisterContainer(this);
    while (this.contents.length > 0) {
      this.contents.pop().destroy();
    }
    this.translationCache = {};
  }

  /**
   * removes all translations from cache and triggers cache flush on all contents
   */
  public flushTranslations(): void {
    this.translationCache = { };
    this.contents.forEach(cont => cont.flushTranslations());
  }

  /**
   * Display the texts of all contents in another language.
   */
  public switchLanguage (targetLanguage: Language): void {
    // resets displayed language
    if (this.altLangDisplayed !== undefined) {
      this.altLangDisplayed = undefined;
      this.renderer.removeChild(this.altLangNotification.parentNode, this.altLangNotification);
      this.altLangNotification = undefined;
    }
    // set language on all contents
    this.contents.forEach(element => {
     element.switchLanguage(targetLanguage.id);
    });
    this.currentLang = targetLanguage;
  }

  /**
   * Check all contents for whether there is still some content in the containers language and switch internally otherwise.
   */
  public checkLanguage (): void {
    let someContentStillSameLanguage = false;
    this.contents.forEach(element => {
      // compare to current Language or to displayed language
      if (
        (this.currentLang !== undefined && element.currentLangId === this.currentLang.id)
        ||
        (this.altLangDisplayed !== undefined && element.currentLangId === this.altLangDisplayed.id)
        ) {
        someContentStillSameLanguage = true;
      }
    });

    // Switch language to first contents language if there are no content parts left in original language
    if (!someContentStillSameLanguage && this.contents.length > 0) {
      this.intManLibService.getLanguage(this.contents[0].currentLangId).subscribe(lang => this.currentLang = lang);
    }
  }

  /**
   * In case the current language cannot be displayed because of missing translations and there is also no
   * compatible translation, switch the whole container to an alternatively chosen language
   */
  public switchToAlternativeLanguage(): void {
    // only run if alternative language isn't already chosen
    if (this.altLangDisplayed === undefined) {
      // future implementations may use also other criteria for choosing alternative language
      // for now, only use default language
      // for default language, no translations have to be fetched from server as default translations are provided via source code
      // for other languages the domSignature might have to be checked!
      this.intManLibService.defLang.subscribe(defLang => {
        // sets displayed language
        this.altLangDisplayed = defLang;
        // set language on all contents
        this.contents.forEach(element => {
          element.switchLanguage(defLang.id);
        });

        // show notification for alternative translation if not already showing
        if (this.altLangNotification === undefined) {
          this.altLangNotification = this.renderer.createElement('div');
          this.renderer.appendChild(this.altLangNotification, this.renderer.createText('(' + this.currentLang.unavailableText + ')'));
          this.renderer.addClass(this.altLangNotification, 'intmanAltNotification');
          this.renderer.appendChild(this.nativeElement, this.altLangNotification);
          this.renderer.setStyle(this.altLangNotification, 'color', 'red');
        }

      });
    }
  }

  /**
   * Log a message within the message service provided by the libService.
   */
  public log(message: string): void {
    this.intManLibService.log(message);
  }

  /**
   * Internal Method to gather all textual contents as well as the DOM-Signature of the container.
   */
  private exploreDOM(node: any): string {

    let signature = '';

    if (node.nodeName === '#text') {

      // if it's a text node, generate new textual content object and register it
      const textualContent = new TextualContent(this, this.contents.length, node, this.intManLibService);
      this.contents.push(textualContent);
      signature += node.nodeName;

    } else {
      if (node.nodeName.substr(0, 1) !== '#') {
        signature += '<' + node.nodeName + '>';
      }
    }

    // if there are child nodes, invoke method recursively
    node.childNodes.forEach(cur => signature += this.exploreDOM(cur));

    if (node.nodeName.substr(0, 1) !== '#') {
      signature += '</' + node.nodeName + '>';
    }

    return signature;
  }

}
