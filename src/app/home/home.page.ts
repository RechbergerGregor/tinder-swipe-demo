import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  cards;

  constructor() {

    this.cards = [];

  }

  loadTinderCards() {
    this.cards = [
      {
        img: "https://placeimg.com/300/300/people",
        title: "Demo card 1",
        description: "This is a demo for Tinder like swipe cards"
      },
      {
        img: "https://placeimg.com/300/300/animals",
        title: "Demo card 2",
        description: "This is a demo for Tinder like swipe cards"
      },
      {
        img: "https://placeimg.com/300/300/nature",
        title: "Demo card 3",
        description: "This is a demo for Tinder like swipe cards"
      },
      {
        img: "https://placeimg.com/300/300/tech",
        title: "Demo card 4",
        description: "This is a demo for Tinder like swipe cards"
      },
      {
        img: "https://placeimg.com/300/300/arch",
        title: "Demo card 5",
        description: "This is a demo for Tinder like swipe cards"
      }
    ]
  };

  logChoice(e){
    console.log(e.payload);
    console.log(e.choice);
  }

}
