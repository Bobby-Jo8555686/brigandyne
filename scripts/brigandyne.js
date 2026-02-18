import { BrigandyneActorSheet } from "./actor-sheet.js";
import { BrigandyneActor } from "./actor.js"; 
import { BrigandyneItemSheet } from "./item-sheet.js";

Hooks.once("init", function() {
    console.log("Brigandyne | Chargement du système");

    // Définir la classe d'acteur personnalisée
    CONFIG.Actor.documentClass = BrigandyneActor; 

    // DÉFINITION DE LA FORMULE D'INITIATIVE DANS LE COMBAT TRACKER
    CONFIG.Combat.initiative = {
        formula: "1d10 + @initiative.value", 
        decimals: 2
    };
  
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("brigandyne", BrigandyneActorSheet, { makeDefault: true });

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("brigandyne", BrigandyneItemSheet, { makeDefault: true });

    // Helper pour afficher les dizaines
    Handlebars.registerHelper('brigandyne-dizaine', function(value) {
        return Math.floor(value / 10);
    });
    Handlebars.registerHelper('eq', function (a, b) {
        return a === b;
    });
});