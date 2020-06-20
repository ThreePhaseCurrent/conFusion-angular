import { Component, OnInit, Inject } from '@angular/core';
import { LeaderService } from '../services/leader.service';
import { flyInOut, expand } from '../animations/app.animation';
 
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
    animations: [
      flyInOut(),
      expand()
  ]
})
export class AboutComponent implements OnInit {

  leaders;
  errLeadersMsg: string;

  constructor(private leaderService: LeaderService,
    @Inject('BaseURL') public BaseURL) { 
    this.leaderService.getLeaders()
      .subscribe((leaders) => this.leaders = leaders,
      errmess => this.errLeadersMsg = <any>errmess);
  }

  ngOnInit(): void {
  }

}
