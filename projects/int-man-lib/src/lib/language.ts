export class Language {
  public id: string;
  public title: string;
  public unavailableText: string;
  public selectable: boolean;

  constructor(id: string, title: string = id) {
    this.id = id;
    this.title = title;
  }
}
