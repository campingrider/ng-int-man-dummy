import { IntManLibService } from './int-man-lib.service';
import { Translation } from './translation';
import { TextContainer } from './text-container';
import { Language } from './language';

/**
 * This class represents any kind of DOM text node and manages its behaviour
 */
export class TextualContent {
  container: TextContainer;
  id: string;
  index: number;
  currentTextNode: any;
  translatedTextNodes: {};
  currentLangId: string;

  constructor(container: any, index: number, currentTextNode: any, private intManLibService: IntManLibService) {
    this.container = container;
    this.index = index;
    this.currentTextNode = currentTextNode;

    this.translatedTextNodes = {};


    // either use container language or do nothing as the container will inform the content whenever it gets defined
    if (container.lang !== undefined) {
      this.initiateLanguage(container.lang);
    }

    // generate id from container id
    this.id = container.id + '-' + index;
  }

  /**
   * encapsulates initiation of language as there is no way of being sure that language is already loaded on creation
   */
  public initiateLanguage(lang: Language): void {
    this.currentLangId = lang.id;

    // Use default text as translation for default language
    const currentTextNode = this.currentTextNode;
    this.translatedTextNodes[this.currentLangId] = currentTextNode;

    // register default translation at container
    this.container.registerDefaultTranslation(currentTextNode.nodeValue, this.index);
  }

  /**
   * this function is called upon destruction of the connected container
   */
  public destroy(): void {
    this.container = undefined;
    this.translatedTextNodes = {};
  }

  /**
   * Display the contents of the associated element in another language.
   */
  public switchLanguage (targetLangId: string): void {

    // never run if translation and native Element are same - otherwise text will disappear!
    if (this.translatedTextNodes[targetLangId] !== this.currentTextNode) {

      // use translation from storage or get from service
      if (this.translatedTextNodes[targetLangId] !== undefined) {

        // replace content with translated content
        const renderer = this.container.renderer;
        const parent = this.currentTextNode.parentNode;

        renderer.insertBefore(parent, this.translatedTextNodes[targetLangId], this.currentTextNode);
        renderer.removeChild(parent, this.currentTextNode);
        this.currentTextNode = this.translatedTextNodes[targetLangId];
        this.currentLangId = targetLangId;

        // trigger check for containers language
        this.container.checkLanguage();
      } else {
        // ask container for translation and run once again
        this.container.getTranslations(targetLangId).subscribe(translations => {
          // always use right translation if available - e.g. avoids getting translation for en-GB when searching for en
          const filtered = translations.filter(trans => trans.langId === targetLangId);
          if (filtered.length > 0) { translations[0] = filtered[0]; }

          // respect setting for alternative language if applicable
          const altLangPreferred = translations.length === 1 &&
            translations[0].preferAltLang.length === translations[0].contents.length ?
              translations[0].preferAltLang[this.index]
              :
              false;
          if (translations.length === 1 && !altLangPreferred) {
            this.translatedTextNodes[targetLangId] = this.container.renderer.createText(translations[0].contents[this.index]);
            this.switchLanguage(targetLangId);
          } else {

            // fallback no. 1 - if there is no translation, try to find another compatible language
            // as languages starting with i- or x- aren't necessarily related to one another (RFC1766), only use 2-letter-codes
            if (targetLangId.substr(0, 2) !== 'i-' && targetLangId.substr(0, 2) !== 'x-') {
              this.container.getTranslations(targetLangId.substr(0, 2)).subscribe(compTrans => {
                // filter out this language (in case an alternative language is preferred)
                compTrans = compTrans.filter(trans => trans.langId !== targetLangId);

                if (compTrans.length > 0) {

                  // prefer universal phrases
                  let chosenTrans: Translation;
                  compTrans.forEach(t => { if (t.langId === targetLangId.substr(0, 2)) { chosenTrans = t; }});
                  if (chosenTrans === undefined) { chosenTrans = compTrans[0]; }

                  // switch this textual content to compatible language
                  // construct new Language to ensure no alternative language of this language is chosen
                  this.switchLanguage(chosenTrans.langId);
                } else {
                  // fallback no. 2 - if there is no compatible language for a single textual content,
                  // switch container to alternative language in order to keep the containers context together
                  // if the alternative Language was preferred, don't switch container but fall back to default language for single content
                  if (!altLangPreferred) {
                    this.container.switchToAlternativeLanguage();
                  } else {
                    this.intManLibService.defLang.subscribe(defLang => this.switchLanguage(defLang.id));
                  }
                }
              });
            }

            this.log('Es gibt '
                      + translations.length
                      + ' Übersetzungen für Baustein '
                      + this.id + ' in Sprache '
                      + targetLangId
                      + '. Es fand deshalb keine Ersetzung statt.');
          }
        });
      }
    }
  }

  /**
   * Log a message within the message service provided in its container.
   */
  public log(message: string): void {
    this.container.log(message);
  }

  /**
   * reset translation cache and display new texts
   */
  public flushTranslations(): void {
    this.translatedTextNodes = { };
    this.switchLanguage(this.currentLangId);
  }


}
