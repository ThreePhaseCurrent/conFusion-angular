import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap, switchMapTo } from 'rxjs/operators';
import { Comment } from '../shared/comment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { visibility, flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    visibility(),
    flyInOut(),
    expand()
  ]
})

export class DishdetailComponent implements OnInit {

    @ViewChild('cform') commentFormDirective;
    errMess: string;
    
    dish: Dish;
    dishIds: string[];
    next: string;
    prev: string;
    dishCopy: Dish;
    visibility = 'shown';

    commentForm: FormGroup;
    comment: Comment;

    formErrors = {
      'author': '',
      'comment': ''
    }

    validationsMessages = {
      'author': {
        'required': 'Author is required!',
        'minlength': 'Author must be at least 2 characters long.'
      },
      'comment': {
        'required': 'Comment is required!' 
      }
    };

  constructor(private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') public baseUrl) { }

  ngOnInit(): void {
    this.createForm();

    this.dishService.getDishIds()
      .subscribe(dishIds => this.dishIds = dishIds);

    this.route.params.pipe(switchMap((Params) => { 
      this.visibility = 'hidden'; 
      return this.dishService.getDish(Params['id']);
    })).subscribe(dish => { 
        this.dish = dish; 
        this.dishCopy = dish; 
        this.setPrevNext(dish.id); 
        this.visibility = 'shown';
      }, 
      errmess => this.errMess = <any>errmess);

    let id = this.route.snapshot.params['id'];
    this.dishService.getDish(id).subscribe((dish) => this.dish = dish);
  }

  goBack(): void {
    this.location.back();
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  createForm(){
    this.commentForm = this.fb.group({
      rating: '5',
      comment: ['', [Validators.required]],
      author: ['', [Validators.required, Validators.minLength(2)]]
    });

    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.validationsMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit(){
    this.comment = this.commentForm.value;
    this.comment.date = Date.now().toString();

    // this.dish.comments.push(this.comment);
    console.log(this.comment);

    this.dishCopy.comments.push(this.comment);
    this.dishService.putDish(this.dishCopy)
      .subscribe(dish => {
        this.dish = dish;
        this.dishCopy = dish;
      },
      errmess => {
        this.errMess = <any>errmess;
        this.dishCopy = null;
        this.dish = null;
      });

    this.commentFormDirective.resetForm();

    this.commentForm.reset({
      author: '',
      rating: '5',
      comment: ''
    });
  }

}
