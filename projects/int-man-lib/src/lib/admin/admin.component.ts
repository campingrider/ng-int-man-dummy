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

  @Input() langId = '';
  @Input() containerId = '';

  constructor(private intManLibService: IntManLibService) { }

  ngOnInit() {
    this.intManLibService.registerAdminComponent(this);
    this.intManLibService.getLanguages().subscribe(langs => this.langs = langs);
    this.intManLibService.getAllContainerSettings().subscribe(containerSettings => this.containerSettings = containerSettings);
  }

  ngOnDestroy() {
    this.intManLibService.unregisterAdminComponent(this);
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

}
