import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {

  createDb() {
    const db = {
      defLangId : 'de-DE',
      languages : [
        { id: 'de-DE', title: 'Deutsch (Deutschland)',
          unavailableText: 'Eine Übersetzung in Deutsch ist leider nicht vorhanden.', selectable: true },
        { id: 'en-GB', title: 'English (Great Britain)',
          unavailableText: 'Unfortunately there\'s no translation in English.', selectable: true },
        { id: 'en-US', title: 'English (United States)',
          unavailableText: 'Unfortunately there\'s no translation in English.', selectable: true  },
        { id: 'fr-FR', title: 'Français (France)',
          unavailableText: 'Malheureusement, il n\'y a pas de traduction.', selectable: true },
        { id: 'de', title: 'Deutsch', unavailableText: '', selectable: false },
        { id: 'en', title: 'English', unavailableText: '', selectable: false },
        { id: 'fr', title: 'Français', unavailableText: '', selectable: false }
      ],
      translations : [
        { id: 'IntManInternalChooseLanguage-en', containerId: 'IntManInternalChooseLanguage', langId: 'en',
          contents: ['Please choose your language:'], preferAltLang: [false]},
        { id: 'IntManInternalChooseLanguage-fr', containerId: 'IntManInternalChooseLanguage', langId: 'fr',
          contents: ['Choisissez votre langue:'], preferAltLang: [false]},
        { id: 'CasaTitle-de-DE', containerId: 'CasaTitle', langId: 'de-DE',
          contents: ['Willkommen bei Casa Del Diavolo - Pizza-Lieferdienst!'], preferAltLang: [false] },
        { id: 'CasaTitle-en-GB', containerId: 'CasaTitle', langId: 'en-GB',
          contents: ['Welcome to Pizza-Service Casa Del Diavolo!'], preferAltLang: [false] },
        { id: 'CasaSubtitle-de-DE', containerId: 'CasaSubtitle', langId: 'de-DE',
          contents: ['Inh. Mario Manichino'], preferAltLang: [false] },
        { id: 'CasaSubtitle-en-GB', containerId: 'CasaSubtitle', langId: 'en-GB',
          contents: ['Owner: ', 'Mario Manichino'], preferAltLang: [false, true] },
        { id: 'CasaSubtitle-en', containerId: 'CasaSubtitle', langId: 'en',
          contents: ['Owner: Mario Manichino'], preferAltLang: [false] },
        { id: 'CasaSubtitle-en-GB', containerId: 'CasaDescription', langId: 'en-GB',
          contents: [
            'Our Pizza is a unique creation only available here. \
There is a reason for us being no real pizza service: We\'re purely fictional, \
existing only for one reason - to show a library for internationalisation in action. \
For instance, we\'re not baking pizza, but rather harvest it from some fictional tree. \
Some may ask themselves how the pizza is grown by the tree. Well, that\'s something even we don\'t have an answer for. ',
            'The main point is',
            ' that all our pizzas are given to you ',
            'with greatest attention to detail',
            '. All of this text ist completely senseless, just as senseless as mimicking our unique service.'
          ], preferAltLang: [false, false, false, false, false]},
        { id: 'CasaOrder-en-GB', containerId: 'CasaOrder', langId: 'en-GB',
          contents: ['Order Now'], preferAltLang: [false] },
        { id: 'CasaOrder-fr-FR', containerId: 'CasaOrder', langId: 'fr-FR',
          contents: ['Commande en ligne'], preferAltLang: [false] },
        { id: 'CasaOffer-en-GB', containerId: 'CasaOffer', langId: 'en-GB',
          contents: ['Choose from our rich offer:'], preferAltLang: [false] }
      ],
      containerSettings : [
        {
          id: 'CasaTitle',
          domSignature: '<H1>#text</H1>',
          contains: 1
        },
        {
          id: 'CasaSubtitle',
          domSignature: '<P>#text</P>',
          contains: 1
        }
      ]
    };

    return db;
  }

}
