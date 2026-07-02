/* =================================================================
   SCRIPT.JS — Client "Zindozs Mail" (vitrine du TP04)
   Rôle : rendre le client de messagerie vivant.
     1) Horloge de la barre des tâches
     2) Sélection d'un message dans la liste
     3) Bannière "images bloquées" (démo de résilience)
     4) Interception du bouton CTA de l'e-mail -> console SSH simulée
     5) Boutons Répondre / Transférer / Supprimer (feedback simple)
     6) Easter egg : code Konami -> auto-remédiation du disque
   Le livrable email.html reste 100% autonome (tables + CSS inline).
   ================================================================= */

(function () {
    "use strict";

    /* ---------- 1) Horloge ---------- */
    var heureEl = document.getElementById("tray-heure");
    var dateEl  = document.getElementById("tray-date");
    function pad(n) { return n < 10 ? "0" + n : "" + n; }
    function tick() {
        var d = new Date();
        if (heureEl) heureEl.textContent = pad(d.getHours()) + ":" + pad(d.getMinutes());
        if (dateEl)  dateEl.textContent =
            pad(d.getDate()) + "/" + pad(d.getMonth() + 1) + "/" + d.getFullYear();
    }
    tick();
    setInterval(tick, 1000);

    /* ---------- 2) Sélection d'un message ---------- */
    var messages    = document.querySelectorAll(".msg");
    var objetEl     = document.getElementById("lecture-objet");
    var corpsMail   = document.getElementById("lecture-corps");
    var autreVue    = document.getElementById("lecture-autre");
    var banniere    = document.getElementById("banniere-images");

    messages.forEach(function (msg) {
        msg.addEventListener("click", function () {
            // Met à jour la sélection visuelle
            messages.forEach(function (m) { m.classList.remove("actif"); });
            msg.classList.add("actif");

            var obj = msg.querySelector(".msg-obj").textContent;
            if (objetEl) objetEl.textContent = obj;

            // Seule l'alerte critique affiche le vrai template (l'iframe)
            if (msg.getAttribute("data-vue") === "alerte") {
                corpsMail.hidden = false;
                banniere.hidden = false;
                autreVue.hidden = true;
            } else {
                corpsMail.hidden = true;
                banniere.hidden = true;
                autreVue.hidden = false;
            }
        });
    });

    /* ---------- 3) Bannière "images bloquées" ---------- */
    var btnImages = document.getElementById("btn-afficher-images");
    if (btnImages) {
        btnImages.addEventListener("click", function () {
            banniere.classList.add("masquee");
            // Le template ne contient volontairement AUCUNE image : les
            // données critiques restent lisibles même images bloquées.
            // (S'il y en avait, on remplacerait ici les img[data-src].)
            flash("Aucune image distante — le contenu critique est en texte (résilience).");
        });
    }

    /* ---------- 4) Interception du CTA de l'e-mail (console SSH) ---------- */
    var overlay      = document.getElementById("console-overlay");
    var sortie       = document.getElementById("console-sortie");
    var consoleClose = document.getElementById("console-close");

    // Lignes affichées progressivement (effet "vraie" console)
    var LIGNES = [
        "$ ssh soc@SRV-DB-PROD-01",
        "Connexion sécurisée établie (SSH-2.0).",
        "$ sudo du -sh /var/log/*.gz | sort -h | tail -3",
        "  4.2G  /var/log/postgresql/archive.gz",
        "  6.8G  /var/log/audit/audit.gz",
        " 12.0G  /var/log/journal.gz",
        "$ sudo find /var/log -name '*.gz' -mtime +7 -delete",
        "Purge des journaux compressés > 7 jours...",
        "42 fichiers supprimés · 61 Go libérés.",
        "$ df -h /dev/sda3",
        "/dev/sda3   500G  419G   81G  84%  /   [OK]",
        "",
        "Occupation ramenee de 96% a 84%. Incident resolu."
    ];

    function ouvrirConsole() {
        if (!overlay || !sortie) return;
        overlay.hidden = false;
        sortie.textContent = "";
        var i = 0;
        (function ecrire() {
            if (i >= LIGNES.length) return;
            sortie.textContent += LIGNES[i] + "\n";
            i++;
            setTimeout(ecrire, 320);
        })();
    }

    // Le CTA est intégré en ligne dans le volet de lecture : on intercepte
    // son clic pour ouvrir la console SSH simulée au lieu de suivre le lien.
    var cta = document.getElementById("cta-ssh");
    if (cta) {
        cta.addEventListener("click", function (e) {
            e.preventDefault();      // on reste dans le client
            ouvrirConsole();
        });
    }

    if (consoleClose) {
        consoleClose.addEventListener("click", function () { overlay.hidden = true; });
    }
    if (overlay) {
        overlay.addEventListener("click", function (e) {
            if (e.target === overlay) overlay.hidden = true;
        });
    }

    /* ---------- 5) Boutons de la barre d'outils ---------- */
    function flash(texte) {
        var t = document.getElementById("toast");
        if (!t) {
            t = document.createElement("div");
            t.id = "toast";
            t.style.cssText =
                "position:fixed;left:50%;bottom:64px;transform:translateX(-50%);" +
                "background:rgba(15,40,75,0.92);color:#eaf3ff;padding:10px 18px;" +
                "border-radius:8px;font:13px 'Segoe UI',sans-serif;z-index:3000;" +
                "box-shadow:0 6px 20px rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.3);";
            document.body.appendChild(t);
        }
        t.textContent = texte;
        t.style.opacity = "1";
        clearTimeout(t._timer);
        t._timer = setTimeout(function () { t.style.opacity = "0"; }, 1800);
        t.style.transition = "opacity 0.4s ease";
    }
    var brep = document.getElementById("btn-repondre");
    var btra = document.getElementById("btn-transferer");
    var bsup = document.getElementById("btn-supprimer");
    if (brep) brep.addEventListener("click", function () { flash("Réponse à SOC Automation…"); });
    if (btra) btra.addEventListener("click", function () { flash("Transfert de l'alerte à l'équipe DBA…"); });
    if (bsup) bsup.addEventListener("click", function () {
        flash("Impossible de supprimer une alerte SEV-1 non traitée.");
    });

    /* ---------- 6) Easter egg : code Konami ---------- */
    // ↑ ↑ ↓ ↓ ← → ← → B A  ->  auto-remédiation instantanée du disque
    var KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown",
                  "ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
    var pos = 0;
    document.addEventListener("keydown", function (e) {
        var k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
        if (k === KONAMI[pos]) {
            pos++;
            if (pos === KONAMI.length) { pos = 0; autoRemediation(); }
        } else {
            pos = (k === KONAMI[0]) ? 1 : 0;
        }
    });

    function autoRemediation() {
        // Passe la jauge du gadget au vert + confettis "Zindozs"
        var jauge = document.querySelector(".jauge-crit span");
        if (jauge) {
            jauge.style.transition = "width 1s ease, background 1s ease";
            jauge.style.width = "84%";
            jauge.style.background = "linear-gradient(to bottom, #9dffce, #35c96f)";
        }
        var badge = document.querySelector(".badge.rouge");
        if (badge) { badge.textContent = "0"; badge.classList.remove("rouge"); }
        flash("🛠️ AUTO-REMÉDIATION : 61 Go libérés, disque à 84%. Easter egg !");
        pluieLogos();
    }

    function pluieLogos() {
        var COUL = ["c1","c2","c3","c4"];
        var n = 0;
        var timer = setInterval(function () {
            var conf = document.createElement("span");
            conf.style.cssText =
                "position:fixed;top:-40px;z-index:2500;width:22px;height:22px;" +
                "display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;" +
                "gap:2px;pointer-events:none;left:" + (Math.random()*100) + "vw;" +
                "animation:chute " + (Math.random()*2+2.5) + "s linear forwards;";
            for (var i = 0; i < 4; i++) {
                var c = document.createElement("span");
                c.className = "carreau " + COUL[i];
                conf.appendChild(c);
            }
            document.body.appendChild(conf);
            setTimeout(function () { conf.remove(); }, 5000);
            if (++n > 40) clearInterval(timer);
        }, 120);
    }

    // Keyframe de chute injectée une seule fois (pour les confettis)
    var st = document.createElement("style");
    st.textContent = "@keyframes chute { to { transform: translateY(110vh) rotate(540deg); } }";
    document.head.appendChild(st);

})();
