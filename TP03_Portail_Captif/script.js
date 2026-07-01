/* =================================================================
   SCRIPT.JS — TP03 Portail Captif "Infratech-Guest"
   -----------------------------------------------------------------
   1) Horloge live (barre des tâches + gadget analogique)   [déco]
   2) Authentification front-end simulée                    [démo]
   3) EASTER EGG "AERO OVERDRIVE" : BSOD Vista + mode fête   [surprise]

   NB : Aucune vérification réelle côté serveur. Les mots de passe
   sont ici en clair uniquement parce qu'il s'agit d'une maquette
   pédagogique — on ne fait JAMAIS cela en production.
   ================================================================= */

(function () {
    "use strict";

    /* =============================================================
       PARTIE 1 — HORLOGE (barre des tâches + gadget Sidebar)
       ============================================================= */
    var heureEl = document.getElementById("tray-heure");
    var dateEl  = document.getElementById("tray-date");
    var aigH    = document.querySelector(".aig-h");
    var aigM    = document.querySelector(".aig-m");

    function pad(n) { return n < 10 ? "0" + n : "" + n; }

    function tick() {
        var d = new Date();
        var h = d.getHours(), m = d.getMinutes();

        if (heureEl) heureEl.textContent = pad(h) + ":" + pad(m);
        if (dateEl)  dateEl.textContent =
            pad(d.getDate()) + "/" + pad(d.getMonth() + 1) + "/" + d.getFullYear();

        if (aigH && aigM) {
            aigH.style.transform = "rotate(" + ((h % 12) * 30 + m * 0.5) + "deg)";
            aigM.style.transform = "rotate(" + (m * 6) + "deg)";
        }
    }
    tick();
    setInterval(tick, 1000);

    /* =============================================================
       PARTIE 2 — AUTHENTIFICATION SIMULÉE
       ============================================================= */

    // Comptes de démonstration valides (identifiant -> mot de passe)
    var COMPTES = {
        "invite": "1234",
        "admin":  "infratech"
    };

    // Identifiants SECRETS qui déclenchent l'easter egg (chut ! 🤫)
    var SECRET_USER = "zindozs";
    var SECRET_PASS = "aero";

    var form    = document.querySelector(".auth-form");
    var loginEl = document.getElementById("login");
    var codeEl  = document.getElementById("code");
    var charteEl= document.getElementById("charte");
    var msgEl   = document.getElementById("auth-msg");

    function afficherMsg(texte, type) {
        if (!msgEl) return;
        msgEl.textContent = texte;
        msgEl.className = "auth-msg " + (type || "");
    }

    function trembler() {
        if (!form) return;
        form.classList.remove("shake");
        // Force le reflow pour pouvoir relancer l'animation
        void form.offsetWidth;
        form.classList.add("shake");
    }

    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault(); // on reste sur la page (pas de vrai POST)

            var user = (loginEl.value || "").trim().toLowerCase();
            var pass = codeEl.value || "";

            // La charte doit être acceptée (double sécurité avec "required")
            if (charteEl && !charteEl.checked) {
                afficherMsg("Vous devez accepter la charte informatique.", "erreur");
                trembler();
                return;
            }

            // --- Easter egg : identifiants secrets ---
            if (user === SECRET_USER && pass.toLowerCase() === SECRET_PASS) {
                lancerEasterEgg();
                return;
            }

            // --- Authentification normale ---
            if (COMPTES.hasOwnProperty(user) && COMPTES[user] === pass) {
                afficherMsg("Identifiants valides — connexion en cours…", "succes");
                ouvrirSucces(user);
            } else {
                afficherMsg("Identifiant ou code temporaire incorrect.", "erreur");
                trembler();
            }
        });
    }

    // ----- Écran de succès "Accès accordé" -----
    var overlaySucces = document.getElementById("overlay-succes");
    var succesUser    = document.getElementById("succes-user");
    var succesClose   = document.getElementById("succes-close");

    function ouvrirSucces(user) {
        if (!overlaySucces) return;
        if (succesUser) {
            succesUser.textContent =
                "Bienvenue " + user + " — vous êtes connecté au réseau Infratech‑Guest.";
        }
        overlaySucces.hidden = false;
    }
    if (succesClose) {
        succesClose.addEventListener("click", function () {
            overlaySucces.hidden = true;
            if (form) form.reset();
            afficherMsg("", "");
        });
    }

    /* =============================================================
       PARTIE 3 — EASTER EGG "AERO OVERDRIVE"
       Séquence : BSOD Vista (2,4s) -> mode fête + pluie de logos
       Déclencheurs : identifiants secrets OU code Konami.
       ============================================================= */

    var bsod       = document.getElementById("bsod");
    var bsodPct    = document.getElementById("bsod-pct");
    var overdrive  = document.getElementById("overdrive");
    var overClose  = document.getElementById("overdrive-close");
    var confettiTimer = null;

    function lancerEasterEgg() {
        afficherMsg("", "");
        if (form) form.reset();

        // 1) Faux écran bleu qui "collecte les infos d'erreur"
        if (bsod) {
            bsod.hidden = false;
            var pct = 0;
            var progression = setInterval(function () {
                pct += Math.floor(Math.random() * 12) + 4;
                if (pct >= 100) { pct = 100; clearInterval(progression); }
                if (bsodPct) bsodPct.textContent = pct + "% terminé";
            }, 220);
        }

        // 2) Après ~2,4s : on masque le BSOD et on passe en mode fête
        setTimeout(function () {
            if (bsod) bsod.hidden = true;
            document.body.classList.add("party");
            if (overdrive) overdrive.hidden = false;
            demarrerConfettis();
            jouerMelodie();
        }, 2400);
    }

    // ----- Pluie de logos "Zindozs Vista" -----
    function demarrerConfettis() {
        var COULEURS = ["c1", "c2", "c3", "c4"];
        confettiTimer = setInterval(function () {
            var conf = document.createElement("span");
            conf.className = "confetti";
            // 4 carreaux colorés à l'intérieur = mini logo Vista
            for (var i = 0; i < 4; i++) {
                var carr = document.createElement("span");
                carr.className = "carreau " + COULEURS[i];
                conf.appendChild(carr);
            }
            conf.style.left = Math.random() * 100 + "vw";
            conf.style.animationDuration = (Math.random() * 2 + 2.5) + "s";
            conf.style.opacity = (Math.random() * 0.5 + 0.5).toFixed(2);
            var taille = Math.random() * 18 + 16;
            conf.style.width = conf.style.height = taille + "px";
            document.body.appendChild(conf);
            // Nettoyage : on retire le logo une fois tombé
            setTimeout(function () { conf.remove(); }, 5000);
        }, 150);
    }

    function arreterConfettis() {
        clearInterval(confettiTimer);
        document.querySelectorAll(".confetti").forEach(function (c) { c.remove(); });
    }

    // ----- Petite mélodie chiptune (façon "Vista startup") via WebAudio -----
    function jouerMelodie() {
        try {
            var AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) return;
            var ctx = new AC();
            var notes = [523.25, 659.25, 783.99, 1046.5]; // Do Mi Sol Do (octave)
            notes.forEach(function (freq, i) {
                var osc = ctx.createOscillator();
                var gain = ctx.createGain();
                osc.type = "triangle";
                osc.frequency.value = freq;
                var t = ctx.currentTime + i * 0.18;
                gain.gain.setValueAtTime(0.0001, t);
                gain.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
                osc.connect(gain).connect(ctx.destination);
                osc.start(t);
                osc.stop(t + 0.4);
            });
        } catch (err) {
            /* audio bloqué par le navigateur : pas grave, l'effet visuel suffit */
        }
    }

    if (overClose) {
        overClose.addEventListener("click", function () {
            overdrive.hidden = true;
            document.body.classList.remove("party");
            arreterConfettis();
        });
    }

    // ----- Déclencheur alternatif : CODE KONAMI -----
    // ↑ ↑ ↓ ↓ ← → ← → B A
    var KONAMI = [
        "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
        "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
        "b", "a"
    ];
    var progressionKonami = 0;
    document.addEventListener("keydown", function (e) {
        var touche = e.key.length === 1 ? e.key.toLowerCase() : e.key;
        if (touche === KONAMI[progressionKonami]) {
            progressionKonami++;
            if (progressionKonami === KONAMI.length) {
                progressionKonami = 0;
                lancerEasterEgg();
            }
        } else {
            // Mauvaise touche : on repart du début (ou de 1 si c'est un ArrowUp)
            progressionKonami = (touche === KONAMI[0]) ? 1 : 0;
        }
    });

})();
