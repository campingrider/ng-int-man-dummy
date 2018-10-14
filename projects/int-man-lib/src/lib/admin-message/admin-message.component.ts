import { Component, OnInit, Input } from '@angular/core';
import { IntManLibService } from '../int-man-lib.service';

@Component({
  selector: 'intman-admin-message',
  templateUrl: './admin-message.component.html',
  styleUrls: ['./admin-message.component.css']
})
export class AdminMessageComponent implements OnInit {

  @Input() message: string;

  constructor(private intManLibService: IntManLibService) { }

  ngOnInit() {
  }

}
