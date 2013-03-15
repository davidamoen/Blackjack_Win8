(function () {
    "use strict";

    WinJS.UI.Pages.define("default.html", {
        ready: function (element, options) {
            document.getElementById("dealButton").addEventListener("click", function (event) {
                SDG.Deal();
            });

            document.getElementById("goButton").addEventListener("click", function (event) {
                SDG.PlayHands();
            });
        }
    });
})();
