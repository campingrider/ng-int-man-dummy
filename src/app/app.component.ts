import { Component } from '@angular/core';

class Meal {
  name: string;
  description: string;
  icon: string;
  extras: string[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Casa Del Diavolo - Pizza-Lieferdienst';
  subtitle = 'Inh. Mario Manichino';
  meals: Meal[] = [
    {
      name: 'Pizza Margherita',
      description: 'Pizza mit Tomatensoße und Mozzarella, der zeitlose Klassiker',
      icon: 'assets/img/pizza-cc0.png',
      extras: ['Salami', 'Schinken', 'Mais', 'Champignons']
    },
    {
      name: 'Pizza Salami',
      description: 'Pizza Salami mit Tomatensoße, Salami und Mozzarella, das absolute Muss für Fleischliebhaber',
      icon: 'assets/img/pizza-cc0.png',
      extras: ['Schinken', 'Mais', 'Champignons']
    },
    {
      name: 'Pizza Schinken-Pilze',
      description: 'Pizza Schinken-Pilze mit Tomatensoße, Schinken, frischen Champignons und Mozzarella, für alle, \
      die es gerne rustikaler haben',
      icon: 'assets/img/pizza-cc0.png',
      extras: ['Salami', 'Mais']
    },
    {
      name: 'Pizza Speziale',
      description: 'Pizza Speziale mit Tomatensoße, Schinken, frischen Champignons, Mais, Salami und Mozzarella, für alle, \
      die sich einfach nicht entscheiden können',
      icon: 'assets/img/pizza-cc0.png',
      extras: []
    }

  ];
}
