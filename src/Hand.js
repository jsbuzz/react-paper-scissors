export class Hand {
  constructor(id, name, beatList) {
    this.beatList = {};
    this.id = id;
    this.name = name;
    this.beatList = beatList;
    Hand.list.push(this);
  }

  clone() {
    return new Hand(this.id, this.name, this.beatList);
  }

  beats(hand) {
    return this.beatList.hasOwnProperty(hand.name);
  }

  beatString(hand) {
    return this.name + " " + this.beatList[hand.name] + " " + hand.name;
  }

  static draw() {
    var id = Math.floor(((Math.random() * 100) % 5) + 1);
    switch (id) {
      case 1:
        return Rock;
      case 2:
        return Paper;
      case 3:
        return Scissors;
      case 4:
        return Lizard;
      case 5:
      default:
        return Spock;
    }
  }

  toString() {
    return this.name;
  }
}

Hand.list = [];

export const Rock = new Hand(1, "Rock", {
  Scissors: "crushes",
  Lizard: "crushes",
  "Empty hand": "smashes",
});

export const Paper = new Hand(2, "Paper", {
  Rock: "covers",
  Spock: "disproves",
  "Empty hand": "cuts into",
});

export const Scissors = new Hand(3, "Scissors", {
  Paper: "cuts",
  Lizard: "decapitate",
  "Empty hand": "cut off",
});

export const Lizard = new Hand(4, "Lizard", {
  Paper: "eats",
  Spock: "poisons",
  "Empty hand": "bites off",
});

export const Spock = new Hand(5, "Spock", {
  Scissors: "smashes",
  Rock: "vaporises",
  "Empty hand": "laughs at",
});

export const EmptyHand = new Hand(0, "Empty hand", {});
