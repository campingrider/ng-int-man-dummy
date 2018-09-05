import { IntManLibService } from './int-man-lib.service';
import { TextualContent } from './textual-content';
import { Renderer2 } from '@angular/core';

export class TextContainer {
  public id: string;
  public nativeElement: any;
  public renderer: Renderer2;
  public domSignature: string;
  public lang: string;
  public contents: TextualContent[];

  private index: number;

  constructor(id: string, nativeElement: any, renderer: Renderer2, intManLibService: IntManLibService) {
    this.id = id;
    this.nativeElement = nativeElement;
    this.renderer = renderer;

    // TODO: Standard-Sprache hier einstellen
    this.lang = 'de-DE';

    this.index = 0;
    this.contents = [];

    // calculate domSignature and gather textual contents
    this.domSignature = this.exploreDOM(this.nativeElement);

    intManLibService.registerContainer(this);
  }

  /**
   * Display the texts of all contents in another language.
   */
  public switchLanguage (to: string): void {
    // set language on all contents
    this.contents.forEach(element => {
     element.switchLanguage(to);
    });
    this.lang = to;
  }

  /**
   * Check all contents for whether there is still some content in the containers language and switch internally otherwise.
   */
  public checkLanguage (): void {
    let someContentStillSameLanguage = false;
    this.contents.forEach(element => {
      if (element.lang === this.lang) {
        someContentStillSameLanguage = true;
      }
    });

    // Switch language to first contents language if there are no content parts left in original language
    if (!someContentStillSameLanguage && this.contents.length > 0) {
      this.lang = this.contents[0].lang;
    }
  }

  /**
   * Internal Method to gather all textual contents as well as the DOM-Signature of the container.
   */
  private exploreDOM(node: any): string {

    let signature = '';

    if (node.nodeName === '#text') {

      // if it's a text node, generate new textual content object and register it
      const textualContent = new TextualContent(this, this.index++, node);
      this.contents.push(textualContent);
      signature += node.nodeName;

    } else {
      signature += '<' + node.nodeName + '>';
    }

    // if there are child nodes, invoke method recursively
    node.childNodes.forEach(cur => signature += this.exploreDOM(cur));

    if (node.nodeName !== '#text') {
      signature += '</' + node.nodeName + '>';
    }

    return signature;
  }

}
