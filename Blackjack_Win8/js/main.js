(function () {
    "use strict";

    WinJS.UI.Pages.define("default.html", {
        ready: function (element, options) {
            document.getElementById("dealButton").addEventListener("click", function (event) {

                var game = new Game(_settings.playerCount,_settings.deckCount, _settings.shuffleCount);
                game.PrepCards();
                game.Deal();

                game.Display();

            });


            SDG.configureSettings();


        }
    });




    WinJS.Namespace.define("SDG", {
        clearLog: function () { document.querySelector("div#log").innerHTML = ""; },
        log: function (msg) {
            msg = msg != undefined ? msg : "";
            //TODO: if a div#log does not exist then create one and put it at the end of the body
            //TODO: allow a selector to specify what element(s) will be logged to but default to div#log
            //TODO: consider replacing with WinJS built-in logging
            document.querySelector("div#log").innerHTML += msg + "<br/>";
        },
        rand: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        configureSettings: function () {

            WinJS.Application.onsettings = function (e) {

                e.detail.applicationcommands = { "blackJackSettings": { title: "Configure Simulation", href: "/html/settings.html" } };
                WinJS.UI.SettingsFlyout.populateSettings(e);
                WinJS.Application.start();


                
            }

        }
    });
})();
