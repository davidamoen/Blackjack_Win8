(function () {
    "use strict";

    WinJS.UI.Pages.define("default.html", {
        ready: function (element, options) {

            SDG.configureSettings();
            SDG.setDecisionMatrix();

            /*
            var init = function () {
                var testGame = new Game(1, 1, 1);
                testGame.PrepCards();
                var testHand = new Hand();
                testHand.Cards.push(new Card("Hearts", "Six"));
                testHand.Cards.push(new Card("Clubs", "Six"));
                testGame.Players[0].Hands.push(testHand);

                var dealerHand = new Hand();
                dealerHand.Cards.push(new Card("Hearts", "Deuce"));
                dealerHand.Cards.push(new Card("Clubs", "Six"));
                testGame.Dealer.Hands.push(dealerHand);

                if (testHand.IsSplittable()) {
                    var mockBtn = document.createElement('button');

                    mockBtn.addEventListener("click", testGame.AcceptRecommendation);
                    mockBtn.Game = testGame;
                    mockBtn.Hand = testHand;
                    mockBtn.Recommendation = DecisionHelper.MakeDecision(testGame.Dealer.Hands[0], testHand);

                    mockBtn.click();

                    //var evt = document.createEvent("MouseEvents");
                    //evt.initEvent("click", true, false);
                    //mockBtn.dispatchEvent(evt);

                }
            }
            */

            //SDG.setDecisionMatrix(init);

            document.getElementById("dealButton").addEventListener("click", function (event) {

                if (!_game) {
                    _game = new Game(_settings.playerCount, _settings.deckCount, _settings.shuffleCount);
                }
                if (!_game.Shoe) {
                    _game.PrepCards();
                }
                _game.Deal();

                /*
                var testHand = new Hand();
                testHand.Cards.push(new Card("Hearts", "Ace"));
                testHand.Cards.push(new Card("Clubs", "Ace"));

                _game.Players[0].Hands[0] = testHand;
                */

                _game.Display();
                _game.DisplayInfo();
                document.getElementById("goButton").classList.remove("hidden");
            });

            document.getElementById("goButton").addEventListener("click", function (event) {

                _game.Play();


                /*
                var buttons = document.getElementsByClassName("accept");
                for (var buttonIdx = 0; buttonIdx < buttons.length; buttonIdx++) {
                    var button = buttons[buttonIdx];
                    while (button.Recommendation != "Stand" && button.Recommendation != "Bust") {
                        button.click();
                        button.Recommendation = DecisionHelper.MakeDecision(button.Game.Dealer.Hands[0], button.Hand);
                    }
                    button.Hand.IsComplete = true;
                }
                */

                var dealerHand = _game.Dealer.Hands[0];
                while (dealerHand.DealerMustHit()) {
                    _game.DealCardToHand(dealerHand);
                }

                _game.Dealer.Hands[0].IsComplete = true;
                _game.RefreshDisplay();
                
            });
        }
    });

    WinJS.Namespace.define("SDG", {
        rand: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        configureSettings: function () {
            WinJS.Application.onsettings = function (e) {
                e.detail.applicationcommands = { "blackJackSettings": { title: "Configure Simulation", href: "/html/settings.html" } };
                WinJS.UI.SettingsFlyout.populateSettings(e);
                WinJS.Application.start();
            }

        },
        setDecisionMatrix: function () {
            var uri = new Windows.Foundation.Uri("ms-appx:///DecisionMatrix.xml");
            Windows.Storage.StorageFile.getFileFromApplicationUriAsync(uri).done(
                function (file) {
                    if (file) {
                        Windows.Data.Xml.Dom.XmlDocument.loadFromFileAsync(file).done(function (fileContent) {
                            //var sections = contents.documentElement.selectNodes("//section")
                            SDG.DecisionMatrix = fileContent;
                        })
                    }
                });
        },
        DecisionMatrix: null
    });
})();
