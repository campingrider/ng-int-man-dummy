export class Language {
  public id: string;
  public title: string;
  public unavailableText: string;

  constructor(id: string, title: string = id) {
    this.id = id;
    this.title = title;
  }
}
