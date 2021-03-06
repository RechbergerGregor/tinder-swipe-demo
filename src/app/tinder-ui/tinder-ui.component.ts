import { Component, Input, ViewChildren, QueryList, ElementRef, Renderer2, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-tinder-ui',
  templateUrl: './tinder-ui.component.html',
  styleUrls: ['./tinder-ui.component.scss'],
})
export class TinderUiComponent{

  @Input('cards') cards: Array<{
    img: string,
    title: string,
    description: string
  }>;

  @Output() choiceMade = new EventEmitter();
  @ViewChildren('tinderCard') tinderCards: QueryList<ElementRef>;

  recipeCardsArray: Array<ElementRef>;
  
  hookVisible : boolean = false;
  crossVisible : boolean = false;
  moveOutWidth: number; // value in pixels that a card needs to travel to dissapear from screen
  shiftRequired: boolean; // state variable that indicates we need to remove the top card of the stack
  transitionInProgress: boolean; // state variable that indicates currently there is transition on-going

  constructor(private renderer: Renderer2) { // we imported Renderer to be able to alter style's of elements safely
  }

  userClickedButton(event, choice) {
    event.preventDefault();
    if (!this.cards.length) return false;

    if (choice) {
      this.recipeCardsArray[0].nativeElement.style.transform = 'translate(' + this.moveOutWidth + 'px, -100px) rotate(-30deg)';
      this.toggleChoiceIndicator(true,false);
    } 
  	else {
      this.recipeCardsArray[0].nativeElement.style.transform = 'translate(-' + this.moveOutWidth + 'px, -100px) rotate(30deg)';
      this.toggleChoiceIndicator(false,true);
    };
    this.shiftRequired = true;
    this.transitionInProgress = true;
    this.emitChoice(choice, this.cards[0]);

    setTimeout( () => { this.toggleChoiceIndicator(false,false) }, 500 );
  };


  toggleChoiceIndicator(cross, heart) {
    this.crossVisible = cross;
    this.hookVisible = heart;
  };

  emitChoice(heart, card) {
    this.choiceMade.emit({
      choice: heart,
      payload: card
    })
  };

  handleShift() {
    this.transitionInProgress = false;
    if (this.shiftRequired) {
      this.shiftRequired = false;
      this.cards.shift();
    };
  };

  handlePan(event) {

    if (event.deltaX === 0 || (event.center.x === 0 && event.center.y === 0) || !this.cards.length) return;

    if (this.transitionInProgress) {
      this.handleShift();
    }

    this.renderer.addClass(this.recipeCardsArray[0].nativeElement, 'moving');


    let xMulti = event.deltaX * 0.03;
    let yMulti = event.deltaY / 80;
    let rotate = xMulti * yMulti;

    this.renderer.setStyle(this.recipeCardsArray[0].nativeElement, 'transform', 'translate(' + event.deltaX + 'px, ' + event.deltaY + 'px) rotate(' + rotate + 'deg)');

    this.shiftRequired = true;

  };

  handlePanEnd(event) {

    if (!this.cards.length) return;

    this.renderer.removeClass(this.recipeCardsArray[0].nativeElement, 'moving');

    let keep = Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;
    if (keep) {

      this.renderer.setStyle(this.recipeCardsArray[0].nativeElement, 'transform', '');
      this.shiftRequired = false;

    } else {

      let endX = Math.max(Math.abs(event.velocityX) * this.moveOutWidth, this.moveOutWidth);
      let toX = event.deltaX > 0 ? endX : -endX;
      let endY = Math.abs(event.velocityY) * this.moveOutWidth;
      let toY = event.deltaY > 0 ? endY : -endY;
      let xMulti = event.deltaX * 0.03;
      let yMulti = event.deltaY / 80;
      let rotate = xMulti * yMulti;

      this.renderer.setStyle(this.recipeCardsArray[0].nativeElement, 'transform', 'translate(' + toX + 'px, ' + (toY + event.deltaY) + 'px) rotate(' + rotate + 'deg)');

      this.shiftRequired = true;

      this.emitChoice(!!(event.deltaX > 0), this.cards[0]);

      if(!!(event.deltaX > 0))
      {
        this.toggleChoiceIndicator(true,false);
      }
      else{
        this.toggleChoiceIndicator(false,true);
      }
    }
    this.transitionInProgress = true;
  };

  ngAfterViewInit() {
    this.moveOutWidth = document.documentElement.clientWidth * 1.5;
    this.recipeCardsArray = this.tinderCards.toArray();
    this.tinderCards.changes.subscribe(()=>{
      this.recipeCardsArray = this.tinderCards.toArray();
    })
  };
}
