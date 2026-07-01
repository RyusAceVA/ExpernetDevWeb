/* =================================================================
   SCRIPT.JS - Filtrage fonctionnel du tableau d'événements SOC
   Filtre les lignes selon l'IP source saisie ET le niveau de criticité.
   ================================================================= */

// On récupère les éléments de la page dont on a besoin
const formulaire   = document.querySelector("form");
const champIP      = document.getElementById("ip");
const menuCrit     = document.getElementById("criticite");
const lignes       = document.querySelectorAll("tbody tr");
const messageVide  = document.getElementById("aucun-resultat");

// Fonction principale : parcourt chaque ligne et l'affiche ou la cache
function filtrer() {
    const ipCherchee = champIP.value.trim().toLowerCase(); // texte tapé (IP)
    const critChoisie = menuCrit.value;                    // criticité choisie
    let nbVisibles = 0;                                    // compteur de résultats

    lignes.forEach(function (ligne) {
        // La 3e colonne (index 2) contient l'IP source
        const ipLigne = ligne.children[2].textContent.toLowerCase();
        // La criticité est stockée dans l'attribut data-criticite
        const critLigne = ligne.dataset.criticite;

        // Condition 1 : l'IP de la ligne contient le texte cherché
        const correspondIP = ipLigne.includes(ipCherchee);
        // Condition 2 : "Toutes" accepte tout, sinon la criticité doit être égale
        const correspondCrit = (critChoisie === "toutes") || (critLigne === critChoisie);

        // La ligne s'affiche seulement si les DEUX conditions sont vraies
        if (correspondIP && correspondCrit) {
            ligne.style.display = "";   // valeur par défaut = visible
            nbVisibles++;
        } else {
            ligne.style.display = "none"; // cachée
        }
    });

    // On affiche le message "aucun résultat" si le compteur est à zéro
    messageVide.style.display = (nbVisibles === 0) ? "block" : "none";
}

// Filtrage au clic sur le bouton (on empêche le rechargement de la page)
formulaire.addEventListener("submit", function (evenement) {
    evenement.preventDefault();
    filtrer();
});

// Bonus : filtrage "en direct" quand on tape ou qu'on change la criticité
champIP.addEventListener("input", filtrer);
menuCrit.addEventListener("change", filtrer);
