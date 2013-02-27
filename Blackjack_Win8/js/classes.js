/// <reference path="//Microsoft.WinJS.1.0/js/base.js" />

//////////////////////////////////////////////////////////////////////////////////////////////////
// Card class
//////////////////////////////////////////////////////////////////////////////////////////////////

var Card = WinJS.Class.define(
function (suit, cardType) {
    this.Suit = suit;
    this.CardType = cardType;
},
{
    Suit: '',
    CardType: '',
    CardValues: function () {
        var arr = [];
        switch (this.CardType) {
            case "Deuce":
                arr.push(2);
                break;
            case "Three":
                arr.push(3);
                break;
            case "Four":
                arr.push(4);
                break;
            case "Five":
                arr.push(5);
                break;
            case "Six":
                arr.push(6);
                break;
            case "Seven":
                arr.push(7);
                break;
            case "Eight":
                arr.push(8);
                break;
            case "Nine":
                arr.push(9);
                break;
            case "Ten":
            case "Jack":
            case "Queen":
            case "King":
                arr.push(10);
                break;
            case "Ace":
                arr.push(1);
                arr.push(11);
                break;
        }

        return arr;
    },
    HighValue: function () {

        var vals = this.CardValues();
        vals.sort();
        return vals[vals.length - 1];

    },
    LowValue: function () {
        var vals = this.CardValues();
        vals.sort();
        return vals[0];
    }
});
//////////////////////////////////////////////////////////////////////////////////////////////////
// end Card class
//////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////
// Deck class
//////////////////////////////////////////////////////////////////////////////////////////////////
var Deck = WinJS.Class.define(
function () {
    this.Build();
},
{
    Cards: [],
    Build: function () {
        this.Cards = [];
        for (var suitIdx in Suits) {
            for (var cardTypeIdx in CardTypes) {
                this.Cards.push(new Card(Suits[suitIdx], CardTypes[cardTypeIdx]));
            }
        }
    }

});
//////////////////////////////////////////////////////////////////////////////////////////////////
// end Deck class
//////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////
// Shoe class
//////////////////////////////////////////////////////////////////////////////////////////////////
var Shoe = WinJS.Class.define(
function (deckCount) {
    this.Decks = [];
    this.Cards = [];
    this.Shuffled = false;
    this.Build(deckCount);
    this.CardCounter = new CardCounter();
},
{
    Decks: [],
    Cards: [],
    CardCounter: null,
    Build: function (deckCount) {
        for (var i = 0; i < deckCount; i++) {
            var deck = new Deck();

            // add the new deck to the deck collection
            this.Decks.push(deck);

            // add the new deck's cards to the shoe's card array
            for (var deckIdx in deck.Cards) {
                this.Cards.push(deck.Cards[deckIdx]);
            }
        }
    },
    // logic for shuffling cards
    // tried to emulate a human shuffling cards rather than simply randomizing our array
    Shuffle: function (shuffleCount) {

        // repeat the shuffling logic shuffleCount times
        // research says that 7 shuffles is needed to really randomize a deck of cards 
        for (var i = 0; i < shuffleCount; i++) {

            // create variables that will help determine where we cut the cards
            var newShoe = [];
            var midPoint = this.Cards.length / 2;
            var spread = 10;

            // use a random cut of the cards within a certain range
            var cut = SDG.rand(midPoint - spread, midPoint + spread);

            // create first pile of cards
            var cutA = this.Cards.slice(0, cut);

            // reverse them so we can deal them properly
            cutA.reverse();

            // create second pile of cards
            var cutB = this.Cards.slice(cut, this.Cards.length);

            // reverse them so we can deal them properly
            cutB.reverse();

            // loop until one of the piles is empty
            // a riffle is a small number of cards from one pile that are interlaid 
            // with a riffle from the second pile
            while (cutA.length > 0 && cutB.length > 0) {

                // determinethe size of the first riffle and move that 
                // number of cards from the pile to the newShoe pile
                var riffleA = SDG.rand(1, 3);
                newShoe = newShoe.concat(cutA.splice(0, riffleA));

                // repeat for the second pile
                var riffleB = SDG.rand(1, 3);
                newShoe = newShoe.concat(cutB.splice(0, riffleB));
            }

            // after one of the piles is empty, some cards remain in the other
            // add those to the end of the shoe
            if (cutA.length > 0) {
                newShoe = newShoe.concat(cutA);
            }

            if (cutB.length > 0) {
                newShoe = newShoe.concat(cutB);
            }

            this.Cards = newShoe;

        }
    },
    // vegas dealers put a red card in the shoe
    // when they reach that red card, they reshuffle
    // this is effective discarding all cards in the shoe after the red card
    AddRedCard: function () {
        // determine the low end of the range where the red card can go
        var low = this.Cards.length - Math.floor(this.Cards.length * .20);

        // determine the high end of the range
        var high = this.Cards.length;

        // select a random number from within the range
        var cardPosition = SDG.rand(low, high);

        // discard all cards after the position selected
        this.Cards = this.Cards.slice(0, cardPosition);
    }
});

var CardCounter = WinJS.Class.define(function () { },
    {
        Aces: 0,
        Deuces: 0,
        Threes: 0,
        Fours: 0,
        Fives: 0,
        Sixes: 0,
        Sevens: 0,
        Eights: 0,
        Nines: 0,
        Tens: 0,
        Jacks: 0,
        Queens: 0,
        Kings: 0,
        FaceCards: 0,
        TotalCards: 0,
        AddCard: function (card) {
            this.TotalCards++;
            switch (card.CardType) {
                case "Ace":
                    this.Aces++;
                    break;
                case "Deuce":
                    this.Deuces++;
                    break;
                case "Three":
                    this.Threes++;
                    break;
                case "Four":
                    this.Fours++;
                    break;
                case "Five":
                    this.Fives++;
                    break;
                case "Six":
                    this.Sixes++;
                    break;
                case "Seven":
                    this.Sevens++;
                    break;
                case "Eight":
                    this.Eights++;
                    break;
                case "Nine":
                    this.Nines++;
                    break;
                case "Ten":
                    this.Tens++;
                    this.FaceCards++;
                    break;
                case "Jack":
                    this.Jacks++;
                    this.FaceCards++;
                    break;
                case "Queen":
                    this.Queens++;
                    this.FaceCards++;
                    break;
                case "King":
                    this.Kings++;
                    this.FaceCards++;
                    break;
            }
        }
    });


//////////////////////////////////////////////////////////////////////////////////////////////////
// end Shoe class
//////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////
// Hand class
//////////////////////////////////////////////////////////////////////////////////////////////////

var Hand = WinJS.Class.define(
    function () {
        this.Cards = [];
        this.Bet = _settings.bet;
    },
    {
        Cards: [],
        Values: function () {
            var vals = [];
            for (var cardIdx in this.Cards) {
                var card = this.Cards[cardIdx];
                if (card.HighValue() == card.LowValue()) {
                    if (vals.length == 0) {
                        vals.push(card.HighValue());
                    }
                    else {
                        var len = vals.length;
                        for (var valIdx = 0; valIdx < len; valIdx++) {
                            vals[valIdx] += card.HighValue();
                        }
                    }
                }
                else {

                    if (vals.length == 0) {
                        vals.push(card.HighValue());
                        vals.push(card.LowValue());
                    }
                    else {
                        var newList = [];
                        var len = vals.length;
                        for (var valIdx = 0; valIdx < len; valIdx++) {
                            newList.push(vals[valIdx] + card.LowValue());
                            vals[valIdx] += card.HighValue();
                        }
                        vals = vals.concat(newList);
                    }
                }
            }
            return vals;
        },
        HighValue: function () {
            var values = this.Values();
            values = values.sort(function (num1, num2) {
                return num1 - num2;
            });
            return values[values.length - 1];
        },
        LowValue: function () {
            var values = this.Values();
            values = values.sort(function (num1, num2) {
                return num1 - num2;
            });
            return values[0];
        },
        IsBust: function () {
            var isBust = true;
            var vals = this.Values();
            for (var valIdx in vals) {
                if (vals[valIdx] <= 21) {
                    isBust = false;
                    break;
                }
            }
            return isBust;
        },
        IsBlackJack: function () {
            return this.Cards.length == 2
                    && (this.Cards[0].HighValue() == 11 || this.Cards[1].HighValue() == 11)
                    && (this.Cards[0].HighValue() == 10 || this.Cards[1].HighValue() == 10);

        },
        IsSplittable: function () {
            return this.Cards.length == 2 && this.Cards[0].CardType == this.Cards[1].CardType;
        },
        HasAce: function () {
            var hasAce = false;
            for (var cardIdx in this.Cards) {
                if (this.Cards[cardIdx].CardType == "Ace") {
                    hasAce = true;
                    break;
                }
            }
            return hasAce;
        },
        NonAce: function () {
            if (this.Cards.length == 2 && this.HasAce()) {
                if (this.Cards[0].CardType == "Ace") {
                    return this.Cards[1];
                }
                else {
                    return this.Cards[0];
                }
            }
            else {
                return false;
            }
        },
        IsDoubleDown: false,
        IsStand: false,
        Bet: 0
    });


//////////////////////////////////////////////////////////////////////////////////////////////////
// end Hand class
//////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////
// Player class
//////////////////////////////////////////////////////////////////////////////////////////////////
var Player = WinJS.Class.define(
    function (name, dollars) {
        this.Name = name;
        this.Dollars = dollars;
        this.Hands = [];
    },
    {
        Name: '',
        Dollars: 0,
        Hands: [],
        PlayerAction: function () { }
    });

//////////////////////////////////////////////////////////////////////////////////////////////////
// End Player class
//////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////
// Game class
//////////////////////////////////////////////////////////////////////////////////////////////////
var Game = WinJS.Class.define(
    function (playerCount, deckCount, shuffleCount) {
        this.Players = [];
        this.DeckCount = deckCount;
        this.ShuffleCount = shuffleCount;
        for (var playerIdx = 0; playerIdx < playerCount; playerIdx++) {
            if (playerIdx == 0) {
                this.Players.push(new Player("You", 1000));
            }
            else {
                this.Players.push(new Player("Player " + (playerIdx + 1), 1000));
            }
        }

        this.Dealer = new Player("Dealer", 0);
    },
    {
        Players: [],
        Dealer: null,
        Shoe: null,
        DeckCount: 0,
        ShuffleCount: 0,
        PrepCards: function () {
            this.Shoe = new Shoe(this.DeckCount);
            this.Shoe.Shuffle(this.ShuffleCount);
            this.Shoe.AddRedCard();
        },
        Deal: function () {
            this.Shoe.Cards.reverse();
            for (var cardIdx = 0; cardIdx < 2; cardIdx++) {
                for (var playerIdx in this.Players) {
                    var player = this.Players[playerIdx];
                    if (cardIdx == 0) {
                        player.Hands = [];
                        this.Players[playerIdx].Hands.push(new Hand());
                    }

                    if (this.Shoe.Cards.length > 0) {
                        var nextCard = this.Shoe.Cards.pop();
                        this.Shoe.CardCounter.AddCard(nextCard);
                        this.Players[playerIdx].Hands[0].Cards.push(nextCard);
                    }
                    else {
                        this.PrepCards();
                        var nextCard = this.Shoe.Cards.pop();
                        this.Shoe.CardCounter.AddCard(nextCard);
                        this.Players[playerIdx].Hands[0].Cards.push(nextCard);
                    }
                }

                if (cardIdx == 0) {
                    this.Dealer.Hands = [];
                    this.Dealer.Hands.push(new Hand());
                }

                var nextCard = this.Shoe.Cards.pop();
                this.Shoe.CardCounter.AddCard(nextCard);
                this.Dealer.Hands[0].Cards.push(nextCard);
            }

            this.Shoe.Cards.reverse();
        },
        AcceptRecommendation: function (event) {
            var btn = event.srcElement;
            // TODO: refactor to make DRY
            switch (btn.Recommendation) {
                case "Stand":
                    btn.classList.add("hidden");
                    btn.Hand.IsStand = true;
                    btn.Game.RefreshDisplay();
                    break;
                case "Hit":
                    btn.Game.DealCardToHand(btn.Hand);
                    btn.Game.RefreshDisplay();
                    break;
                case "Double Down":
                    btn.Hand.IsDoubleDown = true;
                    btn.Hand.Bet = btn.Hand.Bet * 2;
                    btn.Game.DealCardToHand(btn.Hand);
                    btn.Game.RefreshDisplay();
                    break;
                case "Split":
                    break;
            }

        },
        DealCardToHand: function (Hand) {
            var nextCard = this.Shoe.Cards.pop();
            this.Shoe.CardCounter.AddCard(nextCard);
            Hand.Cards.push(nextCard);
        },
        RefreshDisplay: function () {
            this.Display();
            this.DisplayInfo();
        },
        Display: function () {
            var resultsDiv = document.getElementById("results");
            var dealerDiv = document.getElementById("dealer");

            if (resultsDiv && dealerDiv) {

                resultsDiv.innerHTML = '';
                dealerDiv.innerHTML = '';

                var tmpPlayers = [];
                tmpPlayers.push(this.Dealer);
                tmpPlayers = tmpPlayers.concat(this.Players);

                for (var playerIdx in tmpPlayers) {
                    var player = tmpPlayers[playerIdx];
                    var handDisplay = document.createElement('div');
                    handDisplay.innerHTML = "<div class='playerName'>" + player.Name + "</div>";
                    
                    handDisplay.classList.add("singleHand");

                    for (handIdx in player.Hands) {
                        var hand = player.Hands[handIdx];

                        if (player.Name != "Dealer") {
                            handDisplay.innerHTML += "<p class='bold'>Bet: $" + hand.Bet + "</p>";
                        }


                        for (var cardIdx in hand.Cards) {

                            var card = hand.Cards[cardIdx];
                            var cardDisplay = document.createElement('div');
                            cardDisplay.classList.add("card");

                            if (player.Name == "Dealer" && cardIdx == 1) {
                                cardDisplay.classList.add("hiddenCard");
                            }
                            else {
                                cardDisplay.classList.add(card.Suit);
                                cardDisplay.classList.add(card.CardType);
                            }
                            handDisplay.appendChild(cardDisplay);
                        }

                        var infoDisplay = document.createElement('div');
                        infoDisplay.classList.add("handInfo");

                        if (hand.IsBust()) {
                            infoDisplay.innerHTML += "<p class='bold'>Busted!</p>";
                        }
                        else if (!hand.IsStand) {
                            infoDisplay.innerHTML += "<p class='bold'>Recomendation: " + DecisionHelper.MakeDecision(this.Dealer.Hands[0], hand) + "</p>";
                        }

                        if (player.Name == "You" && !hand.IsBust() && !hand.IsDoubleDown && !hand.IsStand) {
                            var acceptButton = document.createElement('button');
                            acceptButton.Recommendation = DecisionHelper.MakeDecision(this.Dealer.Hands[0], hand);
                            acceptButton.Game = this;
                            acceptButton.Hand = hand;
                            acceptButton.innerText = "Accept";
                            acceptButton.addEventListener("click", this.AcceptRecommendation);
                            infoDisplay.appendChild(acceptButton);
                        }
                    }

                    if (player.Name == "Dealer") {
                        dealerDiv.appendChild(handDisplay);
                    }
                    else {
                        handDisplay.appendChild(infoDisplay);
                        resultsDiv.appendChild(handDisplay);
                    }
                }
            }
        },
        DisplayInfo: function () {
            var html = "";
            html += "<p><label>Total played: </label>" + this.Shoe.CardCounter.TotalCards + "</p>";
            html += "<p><label>Deuces played: </label>" + this.Shoe.CardCounter.Deuces + "</p>";
            html += "<p><label>Threes played: </label>" + this.Shoe.CardCounter.Threes + "</p>";
            html += "<p><label>Fours played: </label>" + this.Shoe.CardCounter.Fours + "</p>";
            html += "<p><label>Fives played: </label>" + this.Shoe.CardCounter.Fives + "</p>";
            html += "<p><label>Sixes played: </label>" + this.Shoe.CardCounter.Sixes + "</p>";
            html += "<p><label>Sevens played: </label>" + this.Shoe.CardCounter.Sevens + "</p>";
            html += "<p><label>Eights played: </label>" + this.Shoe.CardCounter.Eights + "</p>";
            html += "<p><label>Nines played: </label>" + this.Shoe.CardCounter.Nines + "</p>";
            html += "<p><label>Tens played: </label>" + this.Shoe.CardCounter.Tens + "</p>";
            html += "<p><label>Jacks played: </label>" + this.Shoe.CardCounter.Jacks + "</p>";
            html += "<p><label>Queens played: </label>" + this.Shoe.CardCounter.Queens + "</p>";
            html += "<p><label>Kings played: </label>" + this.Shoe.CardCounter.Kings + "</p>";
            html += "<p><label>Aces played: </label>" + this.Shoe.CardCounter.Aces + "</p>";
            html += "<p><label>Face cards played: </label>" + this.Shoe.CardCounter.FaceCards + "</p>";

            document.getElementById("info").innerHTML = html;
        },

    });

//////////////////////////////////////////////////////////////////////////////////////////////////
// End Game class
//////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////
// DecisionHelper class
//////////////////////////////////////////////////////////////////////////////////////////////////
function DecisionHelper() { }
 
// static method MakeDecision
DecisionHelper.MakeDecision = function(dealerHand, playerHand)
{
    var dm = null;

    if (playerHand.IsSplittable()) {
        var dm = SDG.DecisionMatrix.documentElement.selectSingleNode("section[@name='split']");
    }
    else if (playerHand.HasAce()) {
        var dm = SDG.DecisionMatrix.documentElement.selectSingleNode("section[@name='hasAce']");
    }
    else {
        var dm = SDG.DecisionMatrix.documentElement.selectSingleNode("section[@name='standard']");
    }

    if (dm) {

        // get node for the appropriate dealer upcard
        var upCardValues = dm.selectSingleNode("dealerUpCard[@value='" + dealerHand.Cards[0].CardType + "']");

        if (upCardValues) {
            var selector;
            if (playerHand.IsSplittable()) {
                selector = playerHand.Cards[0].HighValue();
            }
            else if (playerHand.HasAce()) {
                var nonAce = playerHand.NonAce();
                selector = nonAce.HighValue();
            }
            else {
                selector = playerHand.HighValue();
            }

            var decisionValue = upCardValues.selectSingleNode("hand[@value='" + selector + "']");

            if (decisionValue) {

                switch (decisionValue.innerText) {

                    case "H":
                        return "Hit";
                        break;
                    case "D":
                        return "Double Down";
                        break;
                    case "S":
                        return "Stand";
                        break;
                    case "SP":
                        return "Split";
                        break;

                }
            }
        }
    }
    else {
        return "TBD";

    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////
// End DecisionHelper class
//////////////////////////////////////////////////////////////////////////////////////////////////


var Suits = ["Hearts", "Diamonds", "Clubs", "Spades"];

var CardTypes = ["Ace", "Deuce", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King"];

