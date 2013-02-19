(function () {
    "use strict";
    var page = WinJS.UI.Pages.define("/html/settings.html", {
        ready: function (element, options) {

            var deckCount = document.getElementById("deckCount");
            if (deckCount) {

                deckCount.value = _settings.deckCount;
            }

            // clear out the current on settings handler to ensure scenarios are atomic
            WinJS.Application.onsettings = null;

            // Display invocation instructions in the SDK sample output region
            WinJS.log && WinJS.log("To show the settings charm, invoke the charm bar by swiping your finger on the right edge of the screen or bringing your mouse to the lower-right corner of the screen, then select Settings. Or you can just press Windows logo + i. To dismiss the settings charm, tap in the application, swipe a screen edge, right click, invoke another charm or application.", "sample", "status");
        }
    });

    function scenario3AddSettingsFlyout() {
        WinJS.Application.onsettings = function (e) {
            e.detail.applicationcommands = { "legalNotices": { title: "Legal notices", href: "/html/3-SettingsFlyout-Legal.html" } };
            WinJS.UI.SettingsFlyout.populateSettings(e);
        };
        // Make sure the following is called after the DOM has initialized. Typically this would be part of app initialization
        WinJS.Application.start();

        // Display a status message in the SDK sample output region
        WinJS.log && WinJS.log("Legal notices command and settings flyout added from 3-SettingsFlyout-Legal.html", "samples", "status");
    }

})();

