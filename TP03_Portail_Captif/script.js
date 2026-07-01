/* =================================================================
   SCRIPT.JS — TP03 Portail Captif
   Rôle purement décoratif (non essentiel au TP) :
   - met à jour l'horloge de la barre des tâches (tray) en direct
   - anime les aiguilles du gadget "horloge" de la Sidebar Vista
   L'accès Internet et le formulaire restent fonctionnels sans JS.
   ================================================================= */

(function () {
    "use strict";

    // Récupération des éléments d'affichage de l'heure
    var heureEl = document.getElementById("tray-heure");
    var dateEl  = document.getElementById("tray-date");
    var aigH    = document.querySelector(".aig-h");
    var aigM    = document.querySelector(".aig-m");

    // Ajoute un zéro devant les nombres < 10 (ex : 6 -> "06")
    function pad(n) {
        return n < 10 ? "0" + n : "" + n;
    }

    // Met à jour l'heure / la date et l'orientation des aiguilles
    function tick() {
        var maintenant = new Date();
        var h = maintenant.getHours();
        var m = maintenant.getMinutes();

        // ----- Barre des tâches -----
        if (heureEl) {
            heureEl.textContent = pad(h) + ":" + pad(m);
        }
        if (dateEl) {
            dateEl.textContent =
                pad(maintenant.getDate()) + "/" +
                pad(maintenant.getMonth() + 1) + "/" +
                maintenant.getFullYear();
        }

        // ----- Gadget horloge analogique (rotation des aiguilles) -----
        if (aigH && aigM) {
            // 360° / 12h = 30° par heure (+ progression selon les minutes)
            var angleH = (h % 12) * 30 + m * 0.5;
            var angleM = m * 6; // 360° / 60min = 6° par minute
            aigH.style.transform = "rotate(" + angleH + "deg)";
            aigM.style.transform = "rotate(" + angleM + "deg)";
        }
    }

    tick();                 // premier affichage immédiat
    setInterval(tick, 1000); // rafraîchissement chaque seconde
})();
