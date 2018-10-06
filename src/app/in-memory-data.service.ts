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
        { id: 'de-DE', title: 'Deutsch (Deutschland)', unavailableText: 'Eine Übersetzung in Deutsch ist leider nicht vorhanden.' },
        { id: 'en-GB', title: 'English (Great Britain)', unavailableText: 'Unfortunately there\'s no translation in English.' },
        { id: 'en-US', title: 'English (United States)', unavailableText: 'Unfortunately there\'s no translation in English.'  },
        { id: 'fr-FR', title: 'Français (France)', unavailableText: 'Malheureusement, il n\'y a pas de traduction.' }
      ],
      translations : [
        { containerId: 'IntManInternalChooseLanguage', langId: 'en-GB', contents: ['Please choose your language:']},
        { containerId: 'IntManInternalChooseLanguage', langId: 'fr-FR', contents: ['Choisissez votre langue:']},
        { containerId: 'CasaTitle', langId: 'de-DE', contents: ['Willkommen bei Casa Del Diavolo - Pizza-Lieferdienst!']  },
        { containerId: 'CasaTitle', langId: 'en-GB', contents: ['Welcome to Pizza-Service Casa Del Diavolo!'] },
        { containerId: 'CasaSubtitle', langId: 'de-DE', contents: ['Inh. Mario Manichino'] },
        { containerId: 'CasaSubtitle', langId: 'en-GB', contents: ['Owner: Mario Manichino'] },
        { containerId: 'CasaDescription', langId: 'en-GB', contents: [
          'Our Pizza is a unique creation only available here. \
          There is a reason for us being no real pizza service: We\'re purely fictional, \
          existing only for one reason - to show a library for internationalisation in action. \
          For instance, we\'re not baking pizza, but rather harvest it from some fictional tree. \
          Some may ask themselves how the pizza is grown by the tree. Well, that\'s something even we don\'t have an answer for. ',
          'The main point is',
          ' that all our pizzas are given to you ',
          'with greatest attention to detail',
          '. All of this text ist completely senseless, just as senseless as mimicking our unique service.'
        ]},
        { containerId: 'CasaOrder', langId: 'en-GB', contents: ['Order Now'] },
        { containerId: 'CasaOrder', langId: 'fr-FR', contents: ['Commande en ligne'] },
        { containerId: 'CasaOffer', langId: 'en-GB', contents: ['Choose from our rich offer:'] }
      ],
      containers : [
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
