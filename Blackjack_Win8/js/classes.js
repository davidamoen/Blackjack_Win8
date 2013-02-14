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

                var vals = this.CardValues;
                vals.sort();
                return vals[vals.length - 1];

            },
            LowValue: function () {
                var vals = this.CardValues;
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
    this.Build(deckCount);
},
{
    Decks: [],
    Cards: [], 
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
    Shuffle: function (shuffleCount) {

        for (var i = 0; i < shuffleCount; i++) {
            var newShoe = [];
            var midPoint = this.Cards.length / 2;
            var spread = 10;

            var cut = SDG.rand(midPoint - spread, midPoint + spread);
            var cutA = this.Cards.slice(0, cut);
            cutA.reverse();

            var cutB = this.Cards.slice(cut, this.Cards.length);
            cutB.reverse();

            while (cutA.length > 0 && cutB.length > 0) {

                var riffleA = SDG.rand(1, 5);
                newShoe = newShoe.concat(cutA.splice(0, riffleA));

                var riffleB = SDG.rand(1, 5);
                newShoe = newShoe.concat(cutB.splice(0, riffleB));
            }

            if (cutA.length > 0) {
                newShoe = newShoe.concat(cutA);
            }

            if (cutB.length > 0) {
                newShoe = newShoe.concat(cutB);
            }
        }


    }

});


//////////////////////////////////////////////////////////////////////////////////////////////////
// end Shoe class
//////////////////////////////////////////////////////////////////////////////////////////////////

var Suits = ["Hearts", "Diamonds", "Clubs", "Spades"];

var CardTypes = ["Ace", "Deuce", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King"];
