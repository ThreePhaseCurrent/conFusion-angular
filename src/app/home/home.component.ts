import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { LeaderService } from '../services/leader.service';
import { from } from 'rxjs';
import { Leader } from '../shared/leader';
import { flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
    animations: [
      flyInOut(),
      expand()
  ]
})

export class HomeComponent implements OnInit {

  dish: Dish;
  promotion: Promotion;
  leader: Leader;
  errMess: string;
  errPromotionMess: string;
  errLeaderMess: string;

  constructor(private dishService: DishService,
    private promotionService: PromotionService,
    private leaderService: LeaderService,
    @Inject('BaseURL') public BaseURL) { }

  ngOnInit(): void {
    this.dishService.getFeatureDish()
      .subscribe((dish) => this.dish = dish,
      errmess => this.errMess = <string>errmess);

    this.promotionService.getFeaturePromotion()
      .subscribe((promotion) => this.promotion = promotion,
      errmess => this.errPromotionMess = <string>errmess);

    this.leaderService.getFeatureLeader()
      .subscribe((leader) => this.leader = leader,
      errmess => this.errLeaderMess = <any>errmess);
  }

}
