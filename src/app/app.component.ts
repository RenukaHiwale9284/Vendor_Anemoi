// import { Component } from '@angular/core';
import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  Inject,
  ViewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {
  Idle,
  DEFAULT_INTERRUPTSOURCES,
  IdleExpiry,
  NgIdleModule,
} from '@ng-idle/core';
import { Keepalive, NgIdleKeepaliveModule } from '@ng-idle/keepalive';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Idle, Keepalive],
})
export class AppComponent implements OnInit, OnDestroy {
  // Access the nonce using CSP_NONCE injection token

  // constructor() {
  //
  // }

  title = 'VE Tool';
  idleState = 'Not started.';
  timedOut = false;
  lastPing: any = null;

  @ViewChild('childModal', { static: false }) childModal: any;
  constructor(
    private idle: Idle,
    private keepalive: Keepalive,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) {
    // sets an idle timeout of 5 seconds, for testing purposes.
    idle.setIdle(15);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(900);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => {
      this.idleState = 'No longer idle.';
      console.log(this.idleState);
      this.reset();
    });

    idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
      console.log(this.idleState);
      // this.router.navigate(['/']);
      sessionStorage.clear();
      window.location.href = 'https://login-stg.pwc.com/openam/UI/Logout';
    });

    idle.onIdleStart.subscribe(() => {
      this.idleState = "You've gone idle!";
      console.log(this.idleState);
      this.childModal.show();
    });

    idle.onTimeoutWarning.subscribe((countdown) => {
      this.idleState = 'You will time out in ' + countdown + ' seconds!';
      console.log(this.idleState);
    });

    // sets the ping interval to 15 seconds
    keepalive.interval(5);

    keepalive.onPing.subscribe(() => (this.lastPing = new Date()));

    this.reset();

    window.onbeforeunload = function (e) {
      window.onunload = function () {
        window.sessionStorage[0].isMySessionActive = 'false';
      };
      return undefined;
    };

    window.onload = function () {
      window.sessionStorage[0].isMySessionActive = 'true';
    };
    // window.onbeforeunload = function() {
    // alert('before closing the tab , please logout')
    // };
  }

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  ngOnInit(): void {}
  ngOnDestroy(): void {
    sessionStorage.clear();
  }
}
