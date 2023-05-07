import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-access-unauthorized',
  templateUrl: './access-unauthorized.component.html',
  styleUrls: ['./access-unauthorized.component.scss']
})
export class AccessUnauthorizedComponent implements OnInit {
  @Input('display') display!: boolean;
  @Input('redirectUrlLabel') redirectUrlLabel!: string;
  @Input('redirectUrl') redirectUrl!: string;
  @Input('message') message!: string;
  // '/projects'

  constructor() {
    this.message = `401 - Uh-oh, you do not have access.
    Your account is not authorized to view this page. Make sure the URL is correct and your account has access. You
    may request access by contacting the admin.`;
  }

  ngOnInit(): void {
  }

}
