// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                SDG.configureSettings();
                SDG.setDecisionMatrix(function () {

                    _settings = {
                        deckCount: 6,
                        playerCount: 6,
                        shuffleCount: 7,
                        bet: 10,
                        maxGames: 1000,
                        dealerStands: 17
                    };

                    _game = new Game(_settings.playerCount, _settings.deckCount, _settings.shuffleCount);

                    var playerYou = _game.Players[0];
                    
                    var idx = 0;
                    while (idx < 1000 && playerYou.Dollars > 0) {

                        SDG.Deal();

                        SDG.PlayHands();

                        idx++;
                    }

                    _game.RefreshDisplay();

                });



            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }
            args.setPromise(WinJS.UI.processAll());
        }
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // args.setPromise().
    };

    app.start();
})();
 
var _game;
var _settings;