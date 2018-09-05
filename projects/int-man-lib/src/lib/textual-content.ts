import { TextContainer } from './text-container';

/**
 * This class represents any kind of DOM text node and manages its behaviour
 */
export class TextualContent {
  container: TextContainer;
  id: string;
  index: number;
  nativeElement: any;
  translations: {};
  lang: string;

  constructor(container: any, index: number, nativeElement: any) {
    this.container = container;
    this.index = index;
    this.nativeElement = nativeElement;
    this.lang = container.lang;

    this.translations = {};

    // Use default text as translation for default language
    this.translations[this.lang] = this.nativeElement;

    // generate id from container id
    this.id = container.id + '-' + index;
  }

  /**
   * Display the contents of the associated element in another language.
   */
  public switchLanguage (to: string): void {
    // only switch language if not already set to this language
    if (to !== this.lang) {

      // use translation from storage or get from service
      if (this.translations[to] !== undefined) {

        // replace content with translated content
        const renderer = this.container.renderer;
        renderer.insertBefore(this.nativeElement.parentNode, this.translations[to], this.nativeElement);
        renderer.removeChild(this.nativeElement.parentNode, this.nativeElement);
        this.nativeElement = this.translations[to];
        this.lang = to;

        // trigger check for containers language
        this.container.checkLanguage();
      } else {
        // TODO: Übersetzung anfordern und switchLanguage daraufhin erneut triggern
        this.translations[to] = this.container.renderer.createText('Text in Sprache ' + to);
        this.switchLanguage(to);
      }
    }
  }


}
