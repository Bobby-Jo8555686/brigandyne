// ============================================
// BASE DE DONNÉES DES SPÉCIALITÉS BRIGANDYNE
// ============================================
const SPECIALITES_DATA = {
    // SPÉCIALITÉS GLOBALES (+10 / +20)
    "acrobaties": { nom: "Acrobaties", stat: "mou", bonus: 10, effet: "Sauter, faire des pirouettes, garder l’équilibre et se réceptionner lors d’une chute" },
    "agriculture": { nom: "Agriculture", stat: "cns", bonus: 20, effet: "Cultiver la terre au rythme des saisons, connaître le folklore paysan" },
    "animaux": { nom: "Animaux", stat: "cns", bonus: 10, effet: "Connaître la faune : habitudes, saisons, comportement, valeur, points faibles" },
    "architecture": { nom: "Architecture", stat: "cns", bonus: 20, effet: "Planifier la construction d’un bâtiment et tout retenir de mémoire" },
    "arts": { nom: "Arts", stat: "cns", bonus: 20, effet: "Connaître la peinture, les artistes, l’histoire de l’art, estimer un tableau" },
    "astrologie": { nom: "Astrologie", stat: "cns", bonus: 20, effet: "Connaissance des astres, des constellations, des cycles lunaires" },
    "attelages": { nom: "Attelages", stat: "hab", bonus: 10, effet: "Conduire un chariot, réparer une roue cassée" },
    "botanique": { nom: "Botanique", stat: "cns", bonus: 10, effet: "Connaître les plantes : leur utilité, leurs dangers, leur entretien" },
    "canotage": { nom: "Canotage", stat: "hab", bonus: 20, effet: "Piloter une petite embarcation : canot, barque, radeau, bateau fluvial" },
    "cartographie": { nom: "Cartographie", stat: "cns", bonus: 20, effet: "Tracer une carte, lire une ancienne carte" },
    "charme": { nom: "Charme", stat: "soc", bonus: 10, effet: "Séduire, plaire, flatter, se faire remarquer" },
    "cheveux_barbe": { nom: "Cheveux et barbe", stat: "hab", bonus: 20, effet: "Couper les cheveux, tailler une barbe, suivre les modes" },
    "chiromancie": { nom: "Chiromancie", stat: "cns", bonus: 20, effet: "Lire l’avenir probable d’une personne dans les lignes de la main" },
    "comedie": { nom: "Comédie", stat: "soc", bonus: 20, effet: "Apprendre un texte, le réciter avec emphase, connaissance des pièces de théâtre" },
    "commandement": { nom: "Commandement", stat: "soc", bonus: 10, effet: "Diriger une troupe, se faire obéir de ses subalternes" },
    "commerce": { nom: "Commerce", stat: "soc", bonus: 10, effet: "Négocier un prix en sa faveur, connaître les usages commerciaux" },
    "contorsion": { nom: "Contorsion", stat: "mou", bonus: 10, effet: "Se défaire de liens, se faufiler dans un conduit ou un tunnel étroit" },
    "courage": { nom: "Courage", stat: "vol", bonus: 10, effet: "Résister à la peur, à la vision d’un mort-vivant ou d’un démon" },
    "course": { nom: "Course", stat: "end", bonus: 10, effet: "Courir vite et longtemps" },
    "crochetage": { nom: "Crochetage", stat: "hab", bonus: 10, effet: "Serrurerie, connaître les crochets, détection des pièges de serrure" },
    "cuisine": { nom: "Cuisine", stat: "hab", bonus: 20, effet: "Préparer et assaisonner un plat, connaître des recettes simples ou complexes" },
    "danse": { nom: "Danse", stat: "mou", bonus: 20, effet: "Rondes paysannes, danses aristocratiques ou improvisées" },
    "deguisement": { nom: "Déguisement", stat: "soc", bonus: 10, effet: "Maquillage, imitation et travestissement" },
    "deplacement_silencieux": { nom: "Déplacement silencieux", stat: "dis", bonus: 10, effet: "Se mouvoir discrètement en ville comme à la campagne" },
    "diplomatie": { nom: "Diplomatie", stat: "soc", bonus: 10, effet: "Calmer un conflit, négocier un traité en sa faveur" },
    "discours": { nom: "Discours", stat: "soc", bonus: 10, effet: "Eloquence, plaidoirie, amener une foule à sa cause, provoquer une révolte" },
    "dissimulation": { nom: "Dissimulation d’objets", stat: "dis", bonus: 10, effet: "Cacher un objet sur soi ou dans un lieu" },
    "dressage": { nom: "Dressage", stat: "soc", bonus: 10, effet: "Calmer une bête, la comprendre et lui apprendre des tours en la récompensant" },
    "droit": { nom: "Droit et usages", stat: "cns", bonus: 10, effet: "Connaître les lois, les peines encourues, le système judiciaire" },
    "ecoute": { nom: "Écoute", stat: "per", bonus: 10, effet: "Entendre des paroles, reconnaître une voix, une mélodie ou un bruit" },
    "elevage": { nom: "Élevage", stat: "cns", bonus: 20, effet: "Connaître les troupeaux : bovins, ovins, porcins…" },
    "equitation": { nom: "Equitation", stat: "mou", bonus: 10, effet: "Monter à cheval ou toute autre monture" },
    "escalade": { nom: "Escalade", stat: "mou", bonus: 10, effet: "Grimper vite et longtemps" },
    "estimation": { nom: "Estimation", stat: "cns", bonus: 20, effet: "Connaître la valeur d’un bijou, d’un vêtements, d’une arme, d’un objet magique" },
    "etiquette": { nom: "Etiquette", stat: "soc", bonus: 20, effet: "Connaître les usages dans un milieu bourgeois ou aristocratique" },
    "faire_pitie": { nom: "Faire pitié", stat: "soc", bonus: 20, effet: "Mendier, obtenir la miséricorde d’un ennemi ou gain de cause auprès d’un jury" },
    "fouille": { nom: "Fouille", stat: "per", bonus: 10, effet: "Trouver un indice, un objet caché dans une salle ou sur un individu" },
    "gestion": { nom: "Gestion", stat: "cns", bonus: 20, effet: "Administrer un commerce, un domaine, repérer des erreurs" },
    "jeux": { nom: "Jeux", stat: "hab", bonus: 10, effet: "Connaître et pratiquer des jeux de dés, de cartes et des paris" },
    "histoire": { nom: "Histoire", stat: "cns", bonus: 20, effet: "Connaître les grands faits historiques, les batailles, les héros et les traîtres" },
    "ingenierie": { nom: "Ingénierie", stat: "cns", bonus: 20, effet: "Manipuler des machines, les concevoir, les saboter" },
    "intimidation": { nom: "Intimidation", stat: "soc", bonus: 10, effet: "Effrayer, faire preuve d’autorité, chantage" },
    "intuition": { nom: "Intuition", stat: "per", bonus: 10, effet: "Jauger l’état d’esprit d’une personne, sentir la peur, le mensonge" },
    "joaillerie": { nom: "Joaillerie", stat: "hab", bonus: 20, effet: "Estimer un bijou, tailler une pierre précieuse" },
    "jonglerie": { nom: "Jonglerie", stat: "hab", bonus: 20, effet: "Jongler avec des balles, des couteaux, des torches..." },
    "langage_demon": { nom: "Langage-Démon", stat: "cns", bonus: 10, effet: "Comprendre et parler la langue démoniaque" },
    "langue_etrangere": { nom: "Langue étrangère", stat: "cns", bonus: 10, effet: "Comprendre et parler une langue étrangère ou un patois local" },
    "legendes": { nom: "Légendes", stat: "cns", bonus: 10, effet: "Connaître les mythes et les contes, les héros imaginaires et les monstres bien réels" },
    "lettres": { nom: "Lettres", stat: "cns", bonus: 20, effet: "Lire, écrire, calligraphier, connaître la littérature, le papier et l’encre" },
    "medecine": { nom: "Médecine", stat: "cns", bonus: 10, effet: "Diagnostiquer des maladies, connaître les remèdes ou l’anatomie" },
    "milieu_naturel": { nom: "Milieu naturel", stat: "sur", bonus: 10, effet: "Trouver un abri, faire du feu, connaître les dangers en forêt/montagne/marais…" },
    "musique_chant": { nom: "Musique et chant", stat: "soc", bonus: 10, effet: "Jouer d’un instrument et chanter juste" },
    "natation": { nom: "Natation", stat: "mou", bonus: 10, effet: "Se déplacer dans l’eau, plonger, pratiquer l’apnée" },
    "navigation": { nom: "Navigation", stat: "cns", bonus: 10, effet: "Piloter un bateau, s’orienter avec les étoiles, reconnaître un navire" },
    "noblesse_politique": { nom: "Noblesse et politique", stat: "cns", bonus: 20, effet: "Connaissance des dynasties, des guerres, des familles nobles, de l’héraldique" },
    "noeuds": { nom: "Noeuds", stat: "hab", bonus: 20, effet: "Connaissance de toutes sortes de noeuds, et comment les défaire" },
    "occultisme": { nom: "Occultisme", stat: "cns", bonus: 10, effet: "Reconnaître l’usage d’une magie spécifique ou un monstre étrange" },
    "odorat_gout": { nom: "Odorat-goût", stat: "per", bonus: 20, effet: "Déceler une odeur, un parfum, un goût particulier, un poison" },
    "orientation": { nom: "Orientation", stat: "sur", bonus: 20, effet: "Retrouver son chemin, deviner sa localisation" },
    "passe_passe": { nom: "Passe-passe", stat: "hab", bonus: 10, effet: "Prestidigitation et tours de passe-passe" },
    "parfumerie": { nom: "Parfumerie", stat: "hab", bonus: 20, effet: "Reconnaître un parfum, en confectionner" },
    "peche": { nom: "Pêche", stat: "sur", bonus: 20, effet: "Repérer un poisson, confectionner une canne à pêche, pêcher avec adresse" },
    "persuasion": { nom: "Persuasion", stat: "soc", bonus: 10, effet: "Argumenter, convaincre par la raison et non l’émotion" },
    "pieges": { nom: "Pièges", stat: "hab", bonus: 10, effet: "Poser et désamorcer un piège" },
    "pistage": { nom: "Pistage", stat: "sur", bonus: 10, effet: "Reconnaître des empreintes, suivre une piste, traquer un animal" },
    "poesie": { nom: "Poésie", stat: "soc", bonus: 20, effet: "Retenir et composer des poèmes, les réciter avec emphase" },
    "poisons": { nom: "Poisons", stat: "cns", bonus: 10, effet: "Reconnaître l’usage d’un poison, en confectionner" },
    "potions": { nom: "Potions et remèdes", stat: "cns", bonus: 10, effet: "Reconnaître l’usage d’une potion, en confectionner" },
    "premiers_soins": { nom: "Premiers soins", stat: "cns", bonus: 10, effet: "Faire un garrot, soigner une blessure, éviter une infection" },
    "reflexes": { nom: "Réflexes", stat: "mou", bonus: 10, effet: "Plonger pour éviter un danger, rattraper un objet ou une personne qui chute" },
    "religions": { nom: "Religions", stat: "cns", bonus: 10, effet: "Connaissance des rites, des costumes, des prières, des cultes" },
    "renseignements": { nom: "Renseignements", stat: "soc", bonus: 10, effet: "Ecouter les rumeurs, s’adresser aux bonnes personnes" },
    "reperage": { nom: "Repérage", stat: "per", bonus: 10, effet: "Déceler un détail, une ombre, une bourse bien remplie" },
    "resistance_alcool": { nom: "Résistance à l’alcool", stat: "end", bonus: 20, effet: "Éviter les gueules de bois, garder le contrôle, ne pas vomir" },
    "resistance_magie": { nom: "Résistance à la magie", stat: "vol", bonus: 10, effet: "Résister aux sortilèges donnant la possibilité d’y résister" },
    "resistance_maladies": { nom: "Résistance aux maladies", stat: "end", bonus: 10, effet: "Résister aux maladies et infections des blessures" },
    "resistance_poisons": { nom: "Résistance aux poisons", stat: "end", bonus: 10, effet: "Résister aux venins, poisons et gaz" },
    "resistance_privations": { nom: "Résistance aux privations", stat: "end", bonus: 10, effet: "Résister à la faim, à la soif et au sommeil" },
    "resistance_chaleur": { nom: "Résistance à la chaleur/froid", stat: "end", bonus: 20, effet: "Résister aux températures étouffantes ou glaciales" },
    "se_cacher": { nom: "Se cacher", stat: "dis", bonus: 10, effet: "Se dissimuler dans les ombres, derrière un mur, suivre quelqu’un" },
    "sexualite": { nom: "Sexualité", stat: "soc", bonus: 20, effet: "Pratiques érotiques, endurance, moyens de contraception" },
    "soins_animaux": { nom: "Soins des animaux", stat: "cns", bonus: 10, effet: "Soigner les maladies et blessures des animaux" },
    "souffle": { nom: "Souffle", stat: "end", bonus: 10, effet: "Endurance, apnée, résistance aux gaz et aux miasmes" },
    "strategie": { nom: "Stratégie", stat: "cns", bonus: 10, effet: "Établir une tactique, jauger le terrain, connaître l’ennemi" },
    "taromancie": { nom: "Taromancie", stat: "cns", bonus: 20, effet: "Lire l’avenir dans les lames du tarot" },
    "torture": { nom: "Torture", stat: "hab", bonus: 10, effet: "Passer un prisonnier à la Question" },
    "travail_pierre": { nom: "Travail de la pierre", stat: "hab", bonus: 20, effet: "Maçonnerie, taille de la pierre, sculpture" },
    "travail_bois": { nom: "Travail du bois", stat: "hab", bonus: 20, effet: "Charpenterie, bûcheronnage, ébénisterie" },
    "travail_metal": { nom: "Travail du métal", stat: "hab", bonus: 20, effet: "Forge, rognure de monnaie" },
    "travail_tissu": { nom: "Travail du tissu", stat: "hab", bonus: 20, effet: "Couture, estimation du tissu" },
    "travaux_force": { nom: "Travaux de force", stat: "for", bonus: 20, effet: "Soulever, maintenir de lourdes charges" },
    "ventriloquie": { nom: "Ventriloquie", stat: "hab", bonus: 20, effet: "Articuler sans remuer les lèvres" },
    "vigilance": { nom: "Vigilance", stat: "per", bonus: 10, effet: "Sentir une présence, sens du danger" },
    "vol_tire": { nom: "Vol à la tire", stat: "hab", bonus: 10, effet: "Couper une bourse en toute discrétion" },

    // SPÉCIALITÉS MARTIALES (+5)
    "arcs": { nom: "Arcs", stat: "tir", bonus: 5, effet: "Tirer à l’arc, confectionner des flèches, réparer une corde cassée" },
    "arbaletes": { nom: "Arbalètes", stat: "tir", bonus: 5, effet: "Tirer à l’arbalète, la réparer" },
    "armes_hast": { nom: "Armes d’hast", stat: "com", bonus: 5, effet: "Manier la lance, la hallebarde, la pertuisane…" },
    "arquebuses": { nom: "Arquebuses", stat: "tir", bonus: 5, effet: "Tirer avec une arquebuse, l’entretenir et la réparer" },
    "batons": { nom: "Bâtons", stat: "com", bonus: 5, effet: "Manier le gourdin ou le bâton" },
    "bombardes": { nom: "Bombardes & explosifs", stat: "tir", bonus: 5, effet: "Utiliser les bombes artisanales" },
    "canons": { nom: "Canons & balistes", stat: "tir", bonus: 5, effet: "Charger, entretenir et déclencher un canon ou une baliste" },
    "couteaux": { nom: "Couteaux", stat: "com", bonus: 5, effet: "Manier la dague, le poignard, le stylet, la miséricorde…" },
    "couteaux_lancer": { nom: "Couteaux de lancer", stat: "tir", bonus: 5, effet: "Lancer un couteau de jet" },
    "deux_armes": { nom: "Deux armes", stat: "com", bonus: 5, effet: "Se battre avec une arme dans chaque main" },
    "epees": { nom: "Épées", stat: "com", bonus: 5, effet: "Manier l’épée courte, large, longue ou bâtarde, le sabre" },
    "escrime": { nom: "Escrime", stat: "com", bonus: 5, effet: "Manier la rapière, connaître les grands escrimeurs" },
    "espadons": { nom: "Espadons", stat: "com", bonus: 5, effet: "Manipuler l’épée à deux mains et l’espadon" },
    "fleaux": { nom: "Fléaux", stat: "com", bonus: 5, effet: "Manier le fléau d’armes" },
    "fouets": { nom: "Fouets", stat: "com", bonus: 5, effet: "Manipuler le fouet avec précision" },
    "frondes": { nom: "Frondes", stat: "tir", bonus: 5, effet: "Tirer avec une fronde ou une fustibale" },
    "haches_masses": { nom: "Haches & Masses", stat: "com", bonus: 5, effet: "Se battre à la hache, la hache lourde, la masse d’armes" },
    "javelots": { nom: "Javelots", stat: "tir", bonus: 5, effet: "Jeter une lance légère, un javelot" },
    "pistolets": { nom: "Pistolets", stat: "tir", bonus: 5, effet: "Tirer au pistolet, le réparer" },
    "pugilat": { nom: "Pugilat", stat: "com", bonus: 5, effet: "Se battre à mains nues ou avec une arme improvisée, pratiquer la lutte" },
    "tromblons": { nom: "Tromblons", stat: "tir", bonus: 5, effet: "Tirer au tromblon, le manipuler, le réparer" },

    // SPÉCIALITÉS MAGIQUES (+5)
    "mag_air": { nom: "Magie de l'Air", stat: "mag", bonus: 5, effet: "Détecter, manipuler, apprendre la magie élémentaire de l’Air" },
    "mag_alchimie": { nom: "Alchimie", stat: "mag", bonus: 5, effet: "Détecter, manipuler, apprendre l’Alchimie" },
    "mag_animalisme": { nom: "Animalisme", stat: "mag", bonus: 5, effet: "Détecter, manipuler, apprendre la magie de l’Animalisme" },
    "mag_avarice": { nom: "Avarice", stat: "mag", bonus: 5, effet: "Détecter, manipuler, apprendre la magie infernale d’Avarice" },
    "mag_chatiment": { nom: "Châtiment", stat: "mag", bonus: 5, effet: "Détecter, manipuler, apprendre la magie du Châtiment" },
    "mag_colere": { nom: "Colère", stat: "mag", bonus: 5, effet: "Détecter, manipuler, apprendre la magie infernale de Colère" },
    "mag_divination": { nom: "Divination", stat: "mag", bonus: 5, effet: "Détecter, manipuler, apprendre la magie de la Divination" },
    "mag_eau": { nom: "Magie de l'Eau", stat: "mag", bonus: 5, effet: "Détecter, manipuler, apprendre la magie élémentaire de l’Eau" },
    "mag_enchantements": { nom: "Enchantements", stat: "mag", bonus: 5, effet: "Détecter, manipuler, apprendre la magie des Enchantements" },
    "mag_envie": { nom: "Envie", stat: "mag", bonus: 5, effet: "Détecter, manipuler, apprendre la magie infernale d’Envie" },
    "mag_feu": { nom: "Magie du Feu", stat: "mag", bonus: 5, effet: "Détecter, manipuler, apprendre la magie élémentaire du Feu" },
    "mag_gourmandise": { nom: "Gourmandise", stat: "mag", bonus: 5, effet: "Détecter, manipuler, apprendre la magie infernale de Gourmandise" },
    "mag_guerre": { nom: "Guerre", stat: "mag", bonus: 5, effet: "Détecter, manipuler, apprendre la magie de la Guerre" },
    "mag_illusions": { nom: "Illusions", stat: "mag", bonus: 5, effet: "Détecter, manipuler, apprendre la magie des Illusions" },
    "mag_luxure": { nom: "Luxure", stat: "mag", bonus: 5, effet: "Détecter, manipuler, apprendre la magie infernale de Luxure" },
    "mag_mentalisme": { nom: "Mentalisme", stat: "mag", bonus: 5, effet: "Détecter, manipuler, apprendre la magie du Mentalisme" },
    "mag_necromancie": { nom: "Nécromancie", stat: "mag", bonus: 5, effet: "Détecter, manipuler, apprendre la magie noire de la Nécromancie" },
    "mag_ombre": { nom: "Ombre", stat: "mag", bonus: 5, effet: "Détecter, manipuler, apprendre la magie de l’Ombre" },
    "mag_orgueil": { nom: "Orgueil", stat: "mag", bonus: 5, effet: "Détecter, manipuler, apprendre la magie infernale d’Orgueil" },
    "mag_paresse": { nom: "Paresse", stat: "mag", bonus: 5, effet: "Détecter, manipuler, apprendre la magie infernale de Paresse" },
    "mag_protection": { nom: "Protection", stat: "mag", bonus: 5, effet: "Détecter, manipuler, apprendre la magie blanche de la Protection" },
    "mag_terre": { nom: "Magie de la Terre", stat: "mag", bonus: 5, effet: "Détecter, manipuler, apprendre la magie élémentaire de la Terre" },
    "mag_voyage": { nom: "Voyage", stat: "mag", bonus: 5, effet: "Détecter, manipuler, apprendre la magie du Voyage" }
};

// ============================================
// BASE DE DONNÉES DES TALENTS BRIGANDYNE
// ============================================
const TALENTS_DATA = {
    "agile": { nom: "Agile [1x/S]", stat: "", bonus: 0, effet: "En mêlée : compétence MOU au lieu de COM" },
    "arme_fetiche": { nom: "Arme fétiche [1x/S]", stat: "", bonus: 0, effet: "Inversion des résultats des dés avec une arme précise" },
    "bagarre": { nom: "Bagarre", stat: "", bonus: 0, effet: "Dégâts mains nues : *FOR*-1, allonge courte (D)" },
    "brute": { nom: "Brute [1x/S]", stat: "", bonus: 0, effet: "En mêlée : compétence FOR au lieu de COM" },
    "calme": { nom: "Calme", stat: "", bonus: 0, effet: "SF +2" },
    "chance_insolente": { nom: "Chance insolente [1x/S]", stat: "", bonus: 0, effet: "Coût SF/2 pour relancer un test" },
    "combat_sol": { nom: "Combat au sol", stat: "", bonus: 0, effet: "Si à terre, l'ennemi n'a pas d'Avantage" },
    "compagnon_animal": { nom: "Compagnon animal", stat: "", bonus: 0, effet: "Un animal fidèle vous suit" },
    "confiance_soi": { nom: "Confiance en soi [1x/S]", stat: "", bonus: 0, effet: "Coût SF/2 pour gagner 1 Avantage" },
    "coup_acrobatique": { nom: "Coup acrobatique [1x/S]", stat: "", bonus: 0, effet: "+*MOU* aux dégâts de mêlée" },
    "coup_adroit": { nom: "Coup adroit [1x/S]", stat: "", bonus: 0, effet: "+*HAB* aux dégâts de mêlée" },
    "coup_maitre": { nom: "Coup de maître [1x/S]", stat: "", bonus: 0, effet: "+*COM* aux dégâts de mêlée" },
    "coup_predateur": { nom: "Coup du prédateur [1x/S]", stat: "", bonus: 0, effet: "+*SUR* aux dégâts de mêlée" },
    "coup_traitre": { nom: "Coup en traître [1x/S]", stat: "", bonus: 0, effet: "+*DIS* aux dégâts de mêlée" },
    "coups_precis": { nom: "Coups précis", stat: "", bonus: 0, effet: "Protection adverse /2 en mêlée" },
    "coups_puissants": { nom: "Coups puissants", stat: "", bonus: 0, effet: "Dégâts de mêlée +1" },
    "coup_surnaturel": { nom: "Coup surnaturel [1x/S]", stat: "", bonus: 0, effet: "+*MAG* aux dégâts de mêlée" },
    "cri_guerre": { nom: "Cri de guerre [1x/S]", stat: "", bonus: 0, effet: "Les ennemis au COM et VOL < vous sont apeurés" },
    "devoue_serviteur": { nom: "Dévoué serviteur", stat: "", bonus: 0, effet: "Un fidèle compagnon vous suit" },
    "distraction": { nom: "Distraction [1x/S]", stat: "", bonus: 0, effet: "1 Désavantage à une cible" },
    "doue": { nom: "Doué (xxx) [1x/S]", stat: "", bonus: 0, effet: "Inversion des résultats des dés" },
    "esquive": { nom: "Esquive", stat: "", bonus: 0, effet: "Protection +1 si pas d'armure lourde, bouclier ou casque" },
    "esprit_competition": { nom: "Esprit de compétition [1x/S]", stat: "", bonus: 0, effet: "Si meilleure réussite qu'un allié, +*SOC* ou *VOL* SF" },
    "esprit_gardien": { nom: "Esprit gardien [1x/S]", stat: "", bonus: 0, effet: "+*MAG* à la protection" },
    "fascination": { nom: "Fascination [1x/S]", stat: "", bonus: 0, effet: "Une cible fait évoluer positivement son avis sur vous" },
    "festoyeur": { nom: "Festoyeur", stat: "", bonus: 0, effet: "Regain de SF x2 (bons moments, repos, idées)" },
    "gardien": { nom: "Gardien [1x/S]", stat: "", bonus: 0, effet: "Vous sauvez un allié et encaissez la moitié des dégâts" },
    "guerison_rapide": { nom: "Guérison rapide", stat: "", bonus: 0, effet: "Regain de PV x2" },
    "inoffensif": { nom: "Inoffensif [1x/S]", stat: "", bonus: 0, effet: "Un adversaire vous ignore pour ce tour" },
    "insaisissable": { nom: "Insaisissable [1x/S]", stat: "", bonus: 0, effet: "Désengagement gratuit" },
    "inspiration": { nom: "Inspiration [1x/S]", stat: "", bonus: 0, effet: "+1 Avantage à vos alliés pendant un tour" },
    "instinct_survie": { nom: "Instinct de survie [1x/S]", stat: "", bonus: 0, effet: "+*SUR* à la protection" },
    "mains_blanches": { nom: "Mains blanches [1x/S]", stat: "", bonus: 0, effet: "+*HAB* PV aux soins" },
    "magie_controlee": { nom: "Magie contrôlée [1x/S]", stat: "", bonus: 0, effet: "Inversion des résultats des dés pour les complications magiques" },
    "magie_destructrice": { nom: "Magie destructrice", stat: "", bonus: 0, effet: "Dégâts magiques +1" },
    "magie_innee": { nom: "Magie innée", stat: "", bonus: 0, effet: "+1 tour et +1 sortilège par jour" },
    "magie_insidieuse": { nom: "Magie insidieuse", stat: "", bonus: 0, effet: "Protection adverse /2 avec vos dégâts magiques" },
    "magie_invisible": { nom: "Magie invisible", stat: "", bonus: 0, effet: "Nature magique indétectable" },
    "magie_sanglante": { nom: "Magie sanglante", stat: "", bonus: 0, effet: "Sacrifice : 1 PV = +2%" },
    "maitre_armes": { nom: "Maître d'armes", stat: "", bonus: 0, effet: "Encerclé, vous pouvez blesser deux adversaires par tour" },
    "maitrise_bouclier": { nom: "Maîtrise du bouclier", stat: "", bonus: 0, effet: "+1 protection si bouclier" },
    "maitrise_poudre": { nom: "Maîtrise de la poudre", stat: "", bonus: 0, effet: "Pas d'effets secondaires avec les armes à poudre" },
    "memoire_faille": { nom: "Mémoire sans faille", stat: "", bonus: 0, effet: "Tests mémoriels réussissent automatiquement" },
    "mensonge_ehonte": { nom: "Mensonge éhonté [1x/J]", stat: "", bonus: 0, effet: "Mensonge crédible cru pendant *SOC* minutes" },
    "nyctalopie": { nom: "Nyctalopie", stat: "", bonus: 0, effet: "Pas de malus dû à l'obscurité" },
    "panache": { nom: "Panache", stat: "", bonus: 0, effet: "Si relance, +1 Avantage" },
    "pattes_chat": { nom: "Pattes de chat", stat: "", bonus: 0, effet: "Dégâts de chute / 2" },
    "polyglotte": { nom: "Polyglotte", stat: "", bonus: 0, effet: "+*CNS* langues supplémentaires" },
    "port_armure": { nom: "Port d'armure", stat: "", bonus: 0, effet: "Pas de malus d'Initiative ou de MOU pour les armures et boucliers" },
    "provocation": { nom: "Provocation [1x/S]", stat: "", bonus: 0, effet: "+*SOC* aux dégâts de mêlée" },
    "prudent": { nom: "Prudent [1x/S]", stat: "", bonus: 0, effet: "1 coup de pouce du Destin gratuit pour la préparation" },
    "recharge_rapide": { nom: "Recharge rapide [1x/S]", stat: "", bonus: 0, effet: "Arme lente rechargée immédiatement" },
    "relations": { nom: "Relations [1x/J]", stat: "", bonus: 0, effet: "Connaissance providentielle" },
    "resilience": { nom: "Résilience [1x/S]", stat: "", bonus: 0, effet: "+*VOL* à la protection" },
    "reflexes_eclairs": { nom: "Réflexes éclairs [1x/S]", stat: "", bonus: 0, effet: "+*MOU* à la protection" },
    "resistance_magique": { nom: "Résistance magique", stat: "", bonus: 0, effet: "Protection +2 contre les dégâts magiques" },
    "riposte": { nom: "Riposte [1x/S]", stat: "", bonus: 0, effet: "Si touché en mêlée, vous infligez des dégâts avec le même RU" },
    "sain_esprit": { nom: "Sain d'esprit", stat: "", bonus: 0, effet: "Si test de Folie raté, perte de SF/2 ; Instabilité -1" },
    "sauvagerie": { nom: "Sauvagerie", stat: "", bonus: 0, effet: "Dégâts +1 si vous restez sous la moitié de vos PV" },
    "sauvegarde": { nom: "Sauvegarde", stat: "", bonus: 0, effet: "Suppression handicap coût / 2" },
    "second_souffle": { nom: "Second souffle [1x/J]", stat: "", bonus: 0, effet: "Si 0 PV, regain immédiat de *END* PV" },
    "sixieme_sens": { nom: "Sixième sens", stat: "", bonus: 0, effet: "Pas d'attaque surprise contre vous" },
    "solidite": { nom: "Solidité", stat: "", bonus: 0, effet: "Vitalité +2" },
    "sommeil_leger": { nom: "Sommeil léger", stat: "", bonus: 0, effet: "Sommeil 4h/jour" },
    "sort_fetiche": { nom: "Sort fétiche [1x/S]", stat: "", bonus: 0, effet: "Inversion des résultats des dés avec un sort précis" },
    "souffle_vie": { nom: "Souffle de vie [1x/J]", stat: "", bonus: 0, effet: "Si 0 PV, regain immédiat de *MAG* PV" },
    "spectacle": { nom: "Spectacle [1x/J]", stat: "", bonus: 0, effet: "+*SOC* SF à vos alliés" },
    "suivre_exemple": { nom: "Suivre l'exemple [1x/S]", stat: "", bonus: 0, effet: "Prenez le score obtenu par un allié" },
    "surnombre": { nom: "Surnombre", stat: "", bonus: 0, effet: "Si en surnombre, dégâts de mêlée +1 pour vos alliés et vous" },
    "travail_equipe": { nom: "Travail d'équipe [1x/S]", stat: "", bonus: 0, effet: "+10% à toute l'équipe lors d'un test de coopération" },
    "tir_precis": { nom: "Tir précis", stat: "", bonus: 0, effet: "Protection adverse /2 à distance" },
    "tireur_elite": { nom: "Tireur d'élite", stat: "", bonus: 0, effet: "Dégâts à distance +1" },
    "tir_chasseur": { nom: "Tir du chasseur [1x/S]", stat: "", bonus: 0, effet: "+*SUR* aux dégâts à distance" },
    "tir_cible": { nom: "Tir ciblé [1x/S]", stat: "", bonus: 0, effet: "+*PER* aux dégâts à distance" },
    "vivacite": { nom: "Vivacité", stat: "", bonus: 0, effet: "Initiative +2" }
};

export class BrigandyneItemSheet extends ItemSheet {
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        classes: ["brigandyne", "sheet", "item"],
        template: "systems/brigandyne/templates/item-sheet.hbs",
        width: 520,
        height: 480,
        tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "details" }],
        dragDrop: [{ dropSelector: ".domaine-container" }] 
      });
    }
  
    getData() {
      const context = super.getData();
      context.system = context.item.system; 
  
      context.isArme = context.item.type === "arme";
      context.isArmure = context.item.type === "armure";
      context.isObjet = context.item.type === "objet";
      context.isSort = context.item.type === "sort";
      context.isAtout = context.item.type === "atout";
      context.isOrigine = context.item.type === "origine";
      context.isArchetype = context.item.type === "archetype";
      context.isCarriere = context.item.type === "carriere";
      context.isDomaine = context.item.type === "domaine";
      context.isNotTour = context.item.system.type_sort !== "tour";

      // On prépare la liste simplifiée pour le menu déroulant des Spécialités
      context.specialitesList = {};
      for (let [key, data] of Object.entries(SPECIALITES_DATA)) {
          context.specialitesList[key] = `${data.nom} (+${data.bonus})`;
      }

      // On prépare la liste pour le menu déroulant des Talents
      context.talentsList = {};
      for (let [key, data] of Object.entries(TALENTS_DATA)) {
          context.talentsList[key] = data.nom; // Pas de bonus affiché car c'est textuel
      }

      return context;
    }

    // ============================================
    // ÉCOUTEURS D'ÉVÉNEMENTS (Listeners)
    // ============================================
    activateListeners(html) {
        super.activateListeners(html);
        if (!this.isEditable) return;

        // --- GESTION DU DRAG & DROP SUR L'OBJET (FORCÉ POUR LE DOMAINE) ---
        html[0].addEventListener("dragover", ev => ev.preventDefault());
        html[0].addEventListener("drop", ev => this._onDrop(ev));

        // ============================================
        // AUTO-AJUSTEMENT DES ZONES DE TEXTE (Textarea)
        // ============================================
        html.find('textarea').each(function() {
            // Ajuste la taille au chargement de la fiche
            this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px; overflow-y:hidden;');
        }).on('input', function() {
            // Ajuste la taille à chaque fois qu'on tape une lettre
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });

        // Écouteur pour la suppression d'un sort dans un domaine
        html.find('.spell-delete').click(ev => {
            const index = ev.currentTarget.dataset.index;
            const spells = [...this.item.system.spells];
            spells.splice(index, 1);
            this.item.update({ "system.spells": spells });
        });

        // --- AUTOMATISATION DE LA SPÉCIALITÉ ---
        html.find('select[name="system.specialite"]').change(ev => {
            const selectedKey = ev.currentTarget.value;
            
            // Si le joueur remet sur "choisissez", on ne fait rien
            if (!selectedKey) return; 

            // On cherche les données dans notre base
            const data = SPECIALITES_DATA[selectedKey];
            
            if (data) {
                // On met à jour l'objet complet d'un seul coup
                this.item.update({
                    name: `Spécialité : ${data.nom}`, // Change le nom de l'item en haut de la fiche
                    "system.stat_liee": data.stat,    // Sélectionne la bonne compétence
                    "system.bonus": data.bonus,       // Rempli le bonus (+10, +20, +5)
                    "system.effet": data.effet        // Rempli la description
                });
            }
        });

	    // ============================================
        // RECHERCHE DANS LES LISTES (Spécialités / Talents)
        // ============================================
        html.find('.search-list').on('input', function() {
            const targetSelector = $(this).data('target');
            
            // On récupère le texte, on le met en minuscules et on supprime les accents (é -> e)
            const searchStr = $(this).val().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); 
            
            html.find(targetSelector + ' option').each(function() {
                const text = $(this).text().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                
                // L'option par défaut ("-- Choisissez --") reste toujours visible
                if ($(this).val() === "" || text.includes(searchStr)) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        });

        // --- AUTOMATISATION DU TALENT ---
        html.find('select[name="system.talent"]').change(ev => {
            const selectedKey = ev.currentTarget.value;
            
            if (!selectedKey) return; 

            const data = TALENTS_DATA[selectedKey];
            
            if (data) {
                this.item.update({
                    name: `Talent : ${data.nom}`, 
                    "system.stat_liee": data.stat,    // La plupart n'ont pas de stat stricte, mais si besoin ça la lie
                    "system.bonus": data.bonus,       // Zéro par défaut pour les talents
                    "system.effet": data.effet        // La description magique du talent
                });
            }
        });
    }

    // ============================================
    // GLISSER-DÉPOSER POUR LES DOMAINES
    // ============================================
    async _onDrop(event) {
        // Empêche le comportement par défaut du navigateur
        event.preventDefault();
        
        // 1. Récupérer les données du drop de manière sécurisée
        let data;
        try {
            data = JSON.parse(event.dataTransfer.getData('text/plain'));
        } catch (err) {
            return false;
        }
        
        // 2. Vérifier si c'est bien un Item qui est glissé
        if (data.type !== "Item") return;

        // 3. Récupérer l'instance de l'item déposé (avec la méthode moderne et sûre)
        const droppedItem = await Item.implementation.fromDropData(data);
        
        // 4. Vérifier si l'item actuel est bien un "domaine"
        if (this.item.type !== "domaine") return;

        // 5. Validation du type d'item déposé (Sort uniquement)
        if (droppedItem.type !== "sort") {
            ui.notifications.warn("Seuls les sorts peuvent être ajoutés à un domaine.");
            return false;
        }

        // 6. Préparation de la mise à jour
        const spells = this.item.system.spells ? [...this.item.system.spells] : [];

        // Éviter les doublons
        if (spells.find(s => s.name === droppedItem.name)) {
            ui.notifications.info("Ce sort est déjà présent dans le domaine.");
            return false;
        }

        // Ajouter le sort à la liste
        spells.push({
            name: droppedItem.name,
            img: droppedItem.img,
            type_sort: droppedItem.system.type_sort || "sortilege",
            difficulte: droppedItem.system.difficulte || 0
        });

        // Mettre à jour l'item Domaine
        await this.item.update({ "system.spells": spells });
    }
}
