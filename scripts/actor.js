export class BrigandyneActor extends Actor {
    
    // ============================================
    // 1. CALCULS AUTOMATIQUES (Dérivées)
    // ============================================
    prepareDerivedData() {
        const system = this.system;
        const stats = system.stats;

        // Calcul du TOTAL de base
        for (let [key, stat] of Object.entries(stats)) {
            let base = Number(stat.value) || 0;
            let prog = Number(stat.progression) || 0; 
            
            stat.total = base + (prog * 5);
            stat.isModified = (prog > 0); 
        }

        // Application des modificateurs d'Origine et d'Archétype
        for (let item of this.items) {
            if ((item.type === "origine" || item.type === "archetype") && item.system.stats) {
                for (let [key, stat] of Object.entries(stats)) {
                    let mod = Number(item.system.stats[key]) || 0;
                    if (mod !== 0) {
                        stat.total += mod;
                        stat.isModified = true;
                    }
                }
            }
            if (item.type === "carriere" && item.system.stats) {
                for (let [key, stat] of Object.entries(stats)) {
                    stat.maxProgression = Number(item.system.stats[key]) || 0;
                }
            }
        }

        // Initialisation de la protection, malus et bonus d'origine
        let totalProtection = 0;
        let totalMalusInit = 0;
        let totalMalusMou = 0;
        let originVitBonus = 0;
        let originSfBonus = 0;

        for (let item of this.items) {
            if (item.type === "armure" && item.system.equipe) {
                totalProtection += Number(item.system.protection) || 0;
                totalMalusInit += Number(item.system.malus_init) || 0;
                totalMalusMou += Number(item.system.malus_mou) || 0;
            }
            if (item.type === "origine") {
                originVitBonus += Number(item.system.bonus_vit) || 0;
                originSfBonus += Number(item.system.bonus_sf) || 0;
            }
        }
        system.protection = { value: totalProtection };

        if (system.options?.malus_armure && totalMalusMou > 0) {
            stats.mou.total -= totalMalusMou;
            stats.mou.isModified = true;
        }

        // Calcul des indices (dizaines)
        for (let [key, stat] of Object.entries(stats)) {
            stat.indice = Math.floor(stat.total / 10);
        }
        
        if (this.type === "personnage") {
            system.vitalite.max = Math.floor(stats.for.total / 5) + Math.floor(stats.end.total / 5) + stats.vol.indice + originVitBonus;
            system.sangfroid.max = Math.floor(stats.vol.total / 5) + Math.floor(stats.cns.total / 5) + stats.com.indice + originSfBonus;
        } else if (this.type === "pnj") {
            system.vitalite.max = Math.floor(stats.for.total / 5) + Math.floor(stats.end.total / 10);
        }
        
        let initBase = stats.com.indice + stats.mou.indice + stats.per.indice;
        if (system.options?.malus_armure) {
            initBase -= totalMalusInit;
        }
        system.initiative = { value: initBase };
    }

    // ============================================
    // 2. JETS DE DÉS (Compétences & Oppositions)
    // ============================================
    async rollStat(statKey) {
        const stat = this.system.stats[statKey];
        let target = Array.from(game.user.targets)[0];
        
        let statOptions = "";
        for (let [k, s] of Object.entries(this.system.stats)) {
            statOptions += `<option value="${k}" ${k === statKey ? 'selected' : ''}>${s.label}</option>`;
        }

        const relevantAtouts = this.items.filter(i => i.type === "atout" && (i.system.stat_liee === statKey || i.system.stat_liee === ""));
        let atoutsHtml = "";
        if (relevantAtouts.length > 0) {
            atoutsHtml = `
            <div style="margin-bottom: 12px; background: rgba(212, 175, 55, 0.05); padding: 5px; border: 1px dashed #d4af37; border-radius: 3px;">
                <div style="font-weight: bold; color: #8b6d05; font-size: 0.85em; margin-bottom: 4px; border-bottom: 1px solid rgba(212,175,55,0.3); padding-bottom: 2px;">Spécialités & Talents :</div>
                <div style="display: flex; flex-direction: column; gap: 2px;">`;
            
            for (let a of relevantAtouts) {
                const bonus = Number(a.system.bonus) || 0;
                const effetText = a.system.effet ? ` - <span style="color: #555;">${a.system.effet}</span>` : "";
                if (bonus > 0) {
                    atoutsHtml += `
                    <label style="display: flex; align-items: baseline; gap: 4px; cursor: pointer; font-size: 0.8em; line-height: 1.2; margin: 0; font-weight: normal; color: #111;">
                        <input type="checkbox" class="atout-bonus" value="${bonus}" title="${a.system.effet}" style="margin: 0; width: 12px; height: 12px; transform: translateY(2px);"/>
                        <span><strong>${a.name} (+${bonus})</strong>${effetText}</span>
                    </label>`;
                } else {
                    atoutsHtml += `
                    <div style="padding-left: 16px; font-size: 0.8em; color: #333; line-height: 1.2; margin: 0;">
                        <strong>${a.name}</strong> (Talent)${effetText}
                    </div>`;
                }
            }
            atoutsHtml += `</div></div>`;
        }

        let dialogContent = `
        <form>
            ${target ? `
            <div class="form-group" style="margin-bottom: 15px; background: rgba(139, 0, 0, 0.05); padding: 5px; border: 1px dashed #8b0000; border-radius: 3px;">
                <label style="font-weight: bold; color: #8b0000;">Opposition face à ${target.name} :</label>
                <select id="targetStat" style="width: 100%; margin-top: 5px;">
                    ${statOptions}
                </select>
            </div>
            ` : ''}
            ${atoutsHtml} 
            <div class="form-group" style="margin-bottom: 15px;">
                <label style="font-weight: bold; color: #111;">Difficulté :</label>
                <select id="difficulte" style="width: 100%; padding: 3px;">
                    <option value="40">+40 Triviale</option>
                    <option value="30">+30 Simple</option>
                    <option value="20">+20 Aisée</option>
                    <option value="10">+10 Faisable</option>
                    <option value="0" selected>0 Assez difficile (test sec)</option>
                    <option value="-10">-10 Difficile</option>
                    <option value="-20">-20 Ardue</option>
                    <option value="-30">-30 Complexe</option>
                    <option value="-40">-40 Infaisable</option>
                </select>
            </div>
        </form>
        `;

        new Dialog({
            title: `Test de ${stat.label}`,
            content: dialogContent,
            buttons: {
                roll: {
                    icon: '<i class="fas fa-dice-d20"></i>',
                    label: target ? "Jet d'Opposition" : "Jet Standard",
                    callback: async (html) => {
                        const modDifficulte = parseInt(html.find('#difficulte').val()) || 0;
                        const targetStatKey = target ? html.find('#targetStat').val() : null;
                        let totalBonusAtouts = 0;
                        html.find('.atout-bonus:checked').each(function() { totalBonusAtouts += Number($(this).val()); });
                        await this._executeStatRoll(statKey, target, targetStatKey, modDifficulte, totalBonusAtouts);
                    }
                }
            },
            default: "roll"
        }).render(true);
    }

    async _executeStatRoll(statKey, target, targetStatKey, modDifficulte, totalBonusAtouts) {
        const stat = this.system.stats[statKey];
        const handicaps = this.system.handicaps || {};
        
        let scoreBase = stat.total !== undefined ? stat.total : stat.value;
        let handicapLabels = [];
        let desavantages = 0;

        if (handicaps.aveugle && (statKey === "tir" || statKey === "per")) {
            scoreBase = 0; handicapLabels.push("Aveuglé (Score = 0)");
        }
        if (handicaps.affaibli) {
            desavantages += 1; handicapLabels.push("Affaibli (-10)");
        }
        if (handicaps.aveugle && statKey === "com") {
            desavantages += 2; handicapLabels.push("Aveuglé (-20)");
        }

        let score = scoreBase + totalBonusAtouts + modDifficulte - (desavantages * 10);
        let modo = 0; let targetActor = null; let targetStatLabel = "";

        if (target && targetStatKey) {
            targetActor = target.actor;
            const targetStatScore = targetActor.system.stats[targetStatKey].total || targetActor.system.stats[targetStatKey].value;
            targetStatLabel = targetActor.system.stats[targetStatKey].label;
            modo = 50 - targetStatScore;
            score += modo;
        }

        let recapHtml = `
        <div style="font-size: 0.9em; background: rgba(0,0,0,0.4); padding: 5px; border-radius: 3px; margin-bottom: 8px; text-align: left; border: 1px solid #444;">
            <div><strong style="color:#e0e0e0;">Base (${stat.label}) :</strong> <span style="color:#fff;">${scoreBase}</span></div>
            ${totalBonusAtouts > 0 ? `<div style="color: #d4af37;"><strong>Bonus Spécialités :</strong> +${totalBonusAtouts}</div>` : ''}
            ${targetActor ? `<div><strong style="color:#e0e0e0;">MODO (${target.name} - ${targetStatLabel}) :</strong> <span style="color:#ffcccc;">${modo > 0 ? '+'+modo : modo}</span></div>` : ''}
            ${modDifficulte !== 0 ? `<div><strong style="color:#e0e0e0;">Difficulté :</strong> <span style="color:#85c1e9;">${modDifficulte > 0 ? '+'+modDifficulte : modDifficulte}</span></div>` : ''}
            ${handicapLabels.length > 0 ? `<div style="color: #ff5252; margin-top: 3px; padding-top: 3px; border-top: 1px dashed #ff5252;"><strong>Handicaps :</strong> ${handicapLabels.join(", ")}</div>` : ''}
            <div style="border-top: 1px solid #555; margin-top: 5px; padding-top: 3px; text-align: center; font-size: 1.1em; color: #fff;">
                <strong>Seuil final : ${score}</strong>
            </div>
        </div>`;

        const roll = new Roll("1d100"); await roll.evaluate(); const result = roll.total;
        let ru = result % 10; let isCrit = (ru === 0);
        let message = "Échec"; let cssClass = "fail";

        if (result <= score) {
            if (isCrit) { message = "Réussite Critique !"; cssClass = "crit-success"; }
            else if (result <= 9 && score >= 20) { message = "Réussite Majeure !"; cssClass = "major-success"; }
            else { message = "Réussite"; cssClass = "success"; }
        } else {
            if (isCrit) { message = "Échec Critique !"; cssClass = "crit-fail"; }
            else if (result >= 91 && score < 80) { message = "Échec Majeur"; cssClass = "major-fail"; }
        }

        const content = `<div class="brigandyne-roll"><h3 style="border-bottom: 1px solid #444; padding-bottom: 3px; margin-bottom: 5px; color: #fff;">${targetActor ? `Opposition : ${stat.label} vs ${targetStatLabel}` : `Test : ${stat.label}`}</h3>${recapHtml}<div class="dice-result"><div class="dice-total ${cssClass}">${result}</div></div><div class="roll-result ${cssClass}" style="text-align: center; font-weight: bold; margin-bottom: 5px;">${message}</div></div>`;
        ChatMessage.create({ user: game.user._id, speaker: ChatMessage.getSpeaker({ actor: this }), content: content, rolls: [roll] });
    }

    // ============================================
    // 3. JETS DE MAGIE ULTIMES
    // ============================================
    async rollSpell(itemId) {
        const sort = this.items.get(itemId);
        if (!sort) return;

        const typeSort = sort.system.type_sort || "sortilege";
        const formule = sort.system.formule || "";
        
        // Détection intelligente de la caractéristique de résistance !
        const resistanceStr = sort.system.resistance ? sort.system.resistance.toLowerCase().trim() : "";
        let resistanceKey = "vol"; // Par défaut, la Volonté
        for (let k of Object.keys(this.system.stats)) {
            if (resistanceStr.includes(k)) {
                resistanceKey = k;
                break;
            }
        }

        let target = Array.from(game.user.targets)[0];
        let statOptions = "";
        for (let [k, s] of Object.entries(this.system.stats)) {
            let isSelected = (k === resistanceKey) ? 'selected' : '';
            statOptions += `<option value="${k}" ${isSelected}>${s.label}</option>`;
        }

        const statKey = this.system.stat_magie_defaut || "cns";
        const relevantAtouts = this.items.filter(i => i.type === "atout" && (i.system.stat_liee === statKey || i.system.stat_liee === ""));
        
        let atoutsHtml = "";
        if (relevantAtouts.length > 0) {
            atoutsHtml = `<div style="margin-bottom: 10px; background: rgba(212, 175, 55, 0.05); padding: 5px; border: 1px dashed #d4af37; border-radius: 3px;"><div style="font-weight: bold; color: #8b6d05; font-size: 0.85em; margin-bottom: 4px; border-bottom: 1px solid rgba(212,175,55,0.3); padding-bottom: 2px;">Spécialités & Talents magiques :</div><div style="display: flex; flex-direction: column; gap: 2px;">`;
            for (let a of relevantAtouts) {
                const bonus = Number(a.system.bonus) || 0;
                if (bonus > 0) {
                    atoutsHtml += `<label style="display: flex; align-items: baseline; gap: 4px; cursor: pointer; font-size: 0.8em; margin: 0; color: #111;"><input type="checkbox" class="atout-bonus" value="${bonus}" style="margin: 0; width: 12px; height: 12px; transform: translateY(2px);"/><span><strong>${a.name} (+${bonus})</strong></span></label>`;
                } else {
                    atoutsHtml += `<div style="padding-left: 16px; font-size: 0.8em; color: #333; margin: 0;"><strong>${a.name}</strong></div>`;
                }
            }
            atoutsHtml += `</div></div>`;
        }

        let formuleHtml = "";
        if (formule && typeSort !== "tour") {
            formuleHtml = `<div style="margin-bottom: 10px; padding: 8px; background: rgba(0,0,0,0.05); border-left: 3px solid #8b0000; font-family: 'Georgia', serif; font-style: italic; color: #111;">"${formule.replace(/\n/g, '<br>')}"</div>`;
        }

        let dialogContent = `
        <form>
            <div class="form-group" style="margin-bottom: 10px;">
                <label style="font-weight: bold; color: #111;">Type d'incantation :</label>
                <select id="spellType" style="width: 100%;">
                    <option value="sortilege" ${typeSort === 'sortilege' ? 'selected' : ''}>Sortilège (Normal)</option>
                    <option value="tour_auto" ${typeSort === 'tour' ? 'selected' : ''}>Tour de Magie (Automatique)</option>
                    <option value="tour_jet">Tour de Magie (Jet requis par le MJ)</option>
                    <option value="rituel" ${typeSort === 'rituel' ? 'selected' : ''}>Rituel (Action longue)</option>
                </select>
            </div>
            ${target ? `
            <div class="form-group" style="margin-bottom: 10px; background: rgba(74, 100, 145, 0.1); padding: 5px; border: 1px dashed #4a6491; border-radius: 3px;">
                <label style="font-weight: bold; color: #4a6491;">Cible : ${target.name}</label>
                <select id="targetStat" style="width: 100%; margin-top: 5px;">${statOptions}</select>
                <p style="font-size: 0.8em; color: #555; margin-top: 4px;">Compétence utilisée par la cible pour résister.</p>
            </div>` : ''}
            ${atoutsHtml}
            ${formuleHtml}
            <div class="form-group" style="margin-bottom: 10px;">
                <label style="font-weight: bold; color: #111;">Avantages / Désav. circonstanciels :</label>
                <input type="number" id="advC" value="0" style="width: 100%; text-align: center;">
            </div>
            <hr style="margin: 10px 0;">
            ${formule ? `
            <div class="form-group" style="margin-bottom: 5px; display: flex; justify-content: space-between;">
                <label style="color: #111;"><i class="fas fa-comment-dots"></i> Formule prononcée (+5%)</label>
                <input type="checkbox" id="formule" />
            </div>` : ''}
            <div class="form-group" style="margin-bottom: 5px; display: flex; justify-content: space-between;">
                <label style="color: #111;"><i class="fas fa-brain"></i> Dépenser 2 Sang-froid (+10%)</label>
                <input type="checkbox" id="sangfroid" />
            </div>
            <div class="form-group" style="margin-bottom: 5px; display: flex; justify-content: space-between;">
                <label style="color: #111;"><i class="fas fa-exclamation-triangle" style="color:#8b0000;"></i> Dépassement de limite</label>
                <input type="checkbox" id="limite" title="Coûte 2 PV (Tour), 4 PV (Sort) ou 6 PV (Rituel)"/>
            </div>
            <div class="form-group" style="margin-top: 10px;">
                <label style="font-weight: bold; color: #8b0000;"><i class="fas fa-tint"></i> Sacrifice de Vitalité (Sang) :</label>
                <input type="number" id="sacrifice" value="0" min="0" style="width: 100%; text-align: center;">
            </div>
        </form>`;

        new Dialog({
            title: `Lancement : ${sort.name}`,
            content: dialogContent,
            buttons: {
                lancer: {
                    icon: '<i class="fas fa-magic"></i>',
                    label: "Incantater",
                    callback: async (html) => {
                        let totalBonusAtouts = 0;
                        html.find('.atout-bonus:checked').each(function() { totalBonusAtouts += Number($(this).val()); });

                        const options = {
                            spellType: html.find('#spellType').val(),
                            targetStatKey: target ? html.find('#targetStat').val() : null,
                            advC: parseInt(html.find('#advC').val()) || 0,
                            bonusAtouts: totalBonusAtouts, 
                            formule: html.find('#formule').is(':checked'),
                            useSF: html.find('#sangfroid').is(':checked'),
                            exceedLimit: html.find('#limite').is(':checked'),
                            sacrifice: parseInt(html.find('#sacrifice').val()) || 0,
                            targetActor: target ? target.actor : null
                        };
                        await this._executeSpellRoll(sort, options);
                    }
                }
            },
            default: "lancer"
        }).render(true);
    }

    async _executeSpellRoll(sort, options) {
        const statKey = this.system.stat_magie_defaut || "cns";
        let scoreBase = this.system.stats[statKey].total || this.system.stats[statKey].value;
        const handicaps = this.system.handicaps || {};
        let handicapLabels = []; let desavantages = 0;

        if (handicaps.aveugle && (statKey === "tir" || statKey === "per")) { scoreBase = 0; handicapLabels.push("Aveuglé"); }
        if (handicaps.affaibli) { desavantages += 1; handicapLabels.push("Affaibli (-10)"); }
        if (handicaps.aveugle && statKey === "com") { desavantages += 2; handicapLabels.push("Aveuglé (-20)"); }
        
        let bloqueRPlus = handicaps.affame || handicaps.demoralise;
        if (handicaps.affame) handicapLabels.push("Affamé");
        if (handicaps.demoralise) handicapLabels.push("Démoralisé");

        let score = scoreBase;
        const difficulteSort = Number(sort.system.difficulte) || 0;
        let pertePV = 0; let perteSF = 0;

        if (options.useSF) perteSF += 2;
        if (options.sacrifice > 0) pertePV += options.sacrifice;
        if (options.exceedLimit) {
            if (options.spellType.includes("tour")) pertePV += 2;
            else if (options.spellType === "sortilege") pertePV += 4;
            else if (options.spellType === "rituel") pertePV += 6;
        }

        if (options.spellType === "tour_auto") {
            this._applyMagicCosts(pertePV, perteSF);
            ChatMessage.create({ user: game.user._id, speaker: ChatMessage.getSpeaker({ actor: this }), content: `<div class="brigandyne-roll"><h3 style="border-bottom: 1px solid #222; margin-bottom: 5px;">${sort.name} (Tour)</h3><div style="text-align: center; font-size: 1.2em; font-weight: bold; color: #1a5b1a; margin: 10px 0;">✨ Succès Automatique</div>${pertePV > 0 || perteSF > 0 ? `<div style="font-size: 0.85em; color: #8b0000; text-align: center;">Coût payé : ${pertePV>0 ? '-'+pertePV+' PV ' : ''} ${perteSF>0 ? '-'+perteSF+' SF' : ''}</div>` : ''}</div>` });
            return;
        }

        let bonusFixes = 0;
        if (options.formule) bonusFixes += 5;
        if (options.useSF) bonusFixes += 10;
        if (options.sacrifice > 0) bonusFixes += options.sacrifice;

        let netAdv = Math.max(-3, Math.min(3, options.advC - desavantages)); 
        let bonusAvantage = netAdv * 10; 
        score += bonusFixes + (options.bonusAtouts || 0) + bonusAvantage;

        let diffFinale = difficulteSort;
        let detailResistance = `Difficulté du sort : ${difficulteSort}`;
        if (options.targetActor && options.targetStatKey) {
            const targetStatScore = options.targetActor.system.stats[options.targetStatKey].total || options.targetActor.system.stats[options.targetStatKey].value;
            const targetModo = 50 - targetStatScore;
            diffFinale = Math.min(difficulteSort, targetModo);
            detailResistance = `Résistance (${options.targetActor.name}) : MODO ${targetModo > 0 ? '+'+targetModo : targetModo}<br>Diff. du sort : ${difficulteSort > 0 ? '+'+difficulteSort : difficulteSort}<br><em>Malus retenu : ${diffFinale > 0 ? '+'+diffFinale : diffFinale}</em>`;
        }
        score += diffFinale;

        const portee = sort.system.portee || "-";
        const duree = sort.system.duree || "-";

        let recapHtml = `<div style="font-size: 0.9em; background: rgba(0,0,0,0.05); padding: 5px; border-radius: 3px; margin-bottom: 8px; text-align: left;">
            <div style="text-align: center; margin-bottom: 5px; color: #555; font-size: 0.9em;"><strong>Portée :</strong> ${portee} | <strong>Durée :</strong> ${duree}</div>
            <div><strong>Base (${this.system.stats[statKey].label}) :</strong> ${scoreBase}</div>
            ${options.bonusAtouts > 0 ? `<div style="color: #8b6d05;"><strong>Bonus Spécialités :</strong> +${options.bonusAtouts}</div>` : ''}
            ${bonusFixes !== 0 ? `<div><strong>Bonus divers :</strong> +${bonusFixes} <small>(${options.formule?'Formule ':''}${options.useSF?'Sang-Froid ':''}${options.sacrifice>0?'Sacrifice':''})</small></div>` : ''}
            ${netAdv !== 0 ? `<div><strong>Avantages (${netAdv}) :</strong> ${bonusAvantage > 0 ? '+'+bonusAvantage : bonusAvantage}</div>` : ''}
            <div style="margin-top: 5px; padding-top: 5px; border-top: 1px dashed #ccc;">${detailResistance}</div>
            ${handicapLabels.length > 0 ? `<div style="color: #ff5252; margin-top: 3px; padding-top: 3px; border-top: 1px dashed #ff5252;"><strong>Handicaps :</strong> ${handicapLabels.join(", ")}</div>` : ''}
            <div style="border-top: 1px solid #ccc; margin-top: 5px; padding-top: 3px; text-align: center; font-size: 1.1em;"><strong>Seuil final : ${score}</strong></div>
            ${pertePV > 0 || perteSF > 0 ? `<div style="text-align: center; color: #8b0000; font-size: 0.85em; margin-top: 5px;">Coût vital : ${pertePV>0 ? '-'+pertePV+' PV ' : ''} ${perteSF>0 ? '-'+perteSF+' SF' : ''}</div>` : ''}
        </div>`;

        const roll = new Roll("1d100"); await roll.evaluate(); const result = roll.total;
        let ru = result % 10; let isCrit = (ru === 0); if (isCrit) ru = 10;
        let isSuccess = result <= score;
        let message = ""; let cssClass = ""; let narratifHtml = "";
        
        let rPlusText = sort.system.r_plus ? `<br><span style="color: #8b6d05; display:block; margin-top:4px;"><strong>R+ :</strong> ${sort.system.r_plus}</span>` : "";

        if (isSuccess) {
            if (bloqueRPlus) {
                isCrit = false; message = "Réussite (R+ Bloqué !)"; cssClass = "success";
                narratifHtml = `<div style="color: #8b0000; font-size: 0.9em; margin-top: 5px;"><strong>Handicap :</strong> Impossible d'obtenir un effet R+. Dégâts magiques réduits de 1.</div>`;
            } else if (isCrit) {
                message = "Réussite Critique !"; cssClass = "crit-success";
                narratifHtml = `<div style="color: #1a5b1a; font-size: 0.9em; margin-top: 5px;"><strong>Action :</strong> Relancez le "0" OU appliquez l'effet spécial. ${rPlusText}</div>`;
            } else if (result <= 9 && score >= 20) {
                message = "Réussite Majeure !"; cssClass = "major-success";
                narratifHtml = `<div style="color: #1a5b1a; font-size: 0.9em; margin-top: 5px;"><strong>Action :</strong> Appliquez l'effet spécial ! ${rPlusText}</div>`;
            } else {
                message = "Réussite Mineure"; cssClass = "success";
                narratifHtml = `<div style="color: #4a6491; font-size: 0.85em; margin-top: 5px;"><em>Option : Prendre 1 complication mineure pour accéder à un R+ (1/jour).</em></div>`;
            }
        } else {
            if (isCrit) {
                message = "Échec Critique !"; cssClass = "crit-fail";
                narratifHtml = `<div style="color: #8b0000; font-size: 0.9em; margin-top: 5px;"><strong>Conséquence :</strong> Perte d'1 PV ou SF <strong>ET</strong> Complication Majeure !</div>`;
            } else if (result >= 91 && score < 80) {
                message = "Échec Majeur"; cssClass = "major-fail";
                narratifHtml = `<div style="color: #8b0000; font-size: 0.85em; margin-top: 5px;">Complication Mineure.<br><em>Option : Forcer la magie pour réussir avec une Complication Majeure (1/jour).</em></div>`;
            } else {
                message = "Échec Mineur"; cssClass = "fail";
                narratifHtml = `<div style="color: #555; font-size: 0.85em; margin-top: 5px;"><em>Option : Forcer la magie pour réussir avec une Complication Mineure (1/jour).</em></div>`;
            }
        }

        const content = `<div class="brigandyne-roll"><h3 style="border-bottom: 1px solid #222; margin-bottom: 5px;">Lancement : ${sort.name}</h3>${recapHtml}<div class="dice-result"><div class="dice-total ${cssClass}">${result} <span style="font-size: 0.5em; color: #555;">(RU: ${ru})</span></div></div><div class="roll-result ${cssClass}" style="text-align: center; font-weight: bold; margin-bottom: 5px;">${message}</div><div style="background: rgba(255,255,255,0.7); padding: 5px; border-radius: 3px; border: 1px dotted #ccc; text-align: center;">${narratifHtml}</div></div>`;
        ChatMessage.create({ user: game.user._id, speaker: ChatMessage.getSpeaker({ actor: this }), content: content, rolls: [roll] });
        this._applyMagicCosts(pertePV, perteSF);
    }

    async _applyMagicCosts(pertePV, perteSF) {
        if (pertePV === 0 && perteSF === 0) return;
        let updates = {};
        if (pertePV > 0) updates["system.vitalite.value"] = Math.max(0, this.system.vitalite.value - pertePV);
        if (perteSF > 0) updates["system.sangfroid.value"] = Math.max(0, this.system.sangfroid.value - perteSF);
        await this.update(updates);
    }

    // ============================================
    // 4. JETS D'ARMES
    // ============================================
    async rollWeapon(itemId) {
        const weapon = this.items.get(itemId);
        if (!weapon) return;

        const hasShield = this.items.some(i => i.type === "armure" && i.system.equipe && i.name.toLowerCase().includes("bouclier"));
        const forIndice = this.system.stats.for.indice || 0;
        
        const typeArme = weapon.system.type_arme || "melee";
        const isDistance = typeArme === "distance";
        const statKey = isDistance ? "tir" : "com";

        const relevantAtouts = this.items.filter(i => i.type === "atout" && (i.system.stat_liee === statKey || i.system.stat_liee === ""));
        let atoutsHtml = "";
        if (relevantAtouts.length > 0) {
            atoutsHtml = `
            <div style="margin-bottom: 12px; background: rgba(212, 175, 55, 0.05); padding: 5px; border: 1px dashed #d4af37; border-radius: 3px;">
                <div style="font-weight: bold; color: #8b6d05; font-size: 0.85em; margin-bottom: 4px; border-bottom: 1px solid rgba(212,175,55,0.3); padding-bottom: 2px;">Spécialités & Talents :</div>
                <div style="display: flex; flex-direction: column; gap: 2px;">`;
            
            for (let a of relevantAtouts) {
                const bonus = Number(a.system.bonus) || 0;
                const effetText = a.system.effet ? ` - <span style="color: #555;">${a.system.effet}</span>` : "";
                if (bonus > 0) {
                    atoutsHtml += `<label style="display: flex; align-items: baseline; gap: 4px; cursor: pointer; font-size: 0.8em; line-height: 1.2; margin: 0; font-weight: normal; color: #111;"><input type="checkbox" class="atout-bonus" value="${bonus}" title="${a.system.effet}" style="margin: 0; width: 12px; height: 12px; transform: translateY(2px);"/><span><strong>${a.name} (+${bonus})</strong>${effetText}</span></label>`;
                } else {
                    atoutsHtml += `<div style="padding-left: 16px; font-size: 0.8em; color: #333; line-height: 1.2; margin: 0;"><strong>${a.name}</strong> (Talent)${effetText}</div>`;
                }
            }
            atoutsHtml += `</div></div>`;
        }

        let dialogContent = `
        <form>
            ${isDistance ? `
            <div class="form-group" style="margin-bottom: 5px; background: rgba(74, 100, 145, 0.1); padding: 5px; border: 1px dashed #4a6491; border-radius: 3px;">
                <label style="font-weight: bold; color: #4a6491;">Difficulté du tir :</label>
                <select id="modTir" style="width: 100%; margin-top: 5px;">
                    <option value="0">Normal / Cible en mouvement (0)</option>
                    <option value="10">Cible grande (+2m50) ou immobile (+10)</option>
                    <option value="-10">Cible petite (-50cm), rapide, ou mauvais temps (-10)</option>
                    <option value="-20">Longue portée + Couvert partiel... (-20)</option>
                </select>
            </div>
            <div class="form-group" style="margin-bottom: 5px; display: flex; justify-content: space-between; align-items: center;">
                <label title="Prend la pire difficulté entre le tir et le MODO de MOU de la cible." style="color: #333;">Cible consciente du tir ?</label>
                <input type="checkbox" id="cibleConsciente" checked />
            </div>
            <div class="form-group" style="margin-bottom: 5px; display: flex; justify-content: space-between; align-items: center;">
                <label title="Donne 1 Désavantage. Sur un Échec Majeur/Critique, touche l'allié !" style="color: #8b0000; font-weight: bold;">Cible dans une mêlée (Avec allié)</label>
                <input type="checkbox" id="tirMelee" />
            </div>
            <div class="form-group" style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                <label title="Arbalète ou arme à poudre chargée uniquement (+20)." style="color: #333;">Tir engagé au corps-à-corps</label>
                <input type="checkbox" id="tirBoutPortant" />
            </div>
            ` : `
            <div class="form-group" style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; background: rgba(74, 100, 145, 0.1); padding: 5px; border: 1px dashed #4a6491; border-radius: 3px;">
                <label style="font-weight: bold; color: #4a6491;" title="Utilise la compétence TIR. Portée Courte (Moyenne pour lance).">Lancer l'arme (Test de Tir)</label>
                <input type="checkbox" id="lancerArme" />
            </div>
            `}

            <div class="form-group" style="margin-bottom: 10px;">
                <label style="font-weight: bold; color: #111;">Posture de combat :</label>
                <select id="tactique" style="width: 100%;">
                    <option value="standard">Efficace (Standard)</option>
                    ${!isDistance ? `
                    <option value="force">En force (+${forIndice} Dégâts, 1 Désavantage)</option>
                    <option value="finesse">En finesse (Dégâts / 2, 1 Avantage)</option>
                    <option value="defensive">Sur la défensive (0 Dégâts, ${hasShield ? '3' : '2'} Avantages)</option>
                    ` : ''}
                    <option value="viser5">Viser: Armure partielle (-5 au jet, ignore armure)</option>
                    <option value="viser10">Viser: Armure complète (-10 au jet, ignore armure)</option>
                    <option value="viser15">Viser: Complète + 1 accessoire (-15 au jet, ignore armure)</option>
                    <option value="viser20">Viser: Complète + 2 accessoires (-20 au jet, ignore armure)</option>
                    <option value="multi">Attaques multiples (1 Désavantage)</option>
                </select>
            </div>
            
            ${atoutsHtml}

            <div class="form-group" style="margin-bottom: 10px;">
                <label style="font-weight: bold; color: #111;">Coup Tordu (Chifoumi MJ) :</label>
                <select id="chifoumi" style="width: 100%;">
                    <option value="none">Ne pas tenter</option>
                    <option value="win">Gagné (+1 Avantage)</option>
                    <option value="lose">Perdu (1 Désavantage)</option>
                </select>
            </div>
            <div class="form-group" style="margin-bottom: 15px; border-top: 1px solid #ccc; padding-top: 10px;">
                <label style="font-weight: bold; color: #111;">Avantages / Désav. circonstanciels :</label>
                <input type="number" id="advCirconstances" value="0" style="width: 100%; text-align: center;">
            </div>
        </form>
        `;

        new Dialog({
            title: `Attaque avec ${weapon.name}`,
            content: dialogContent,
            buttons: {
                attaquer: {
                    icon: '<i class="fas fa-crosshairs"></i>',
                    label: "Lancer l'attaque",
                    callback: async (html) => {
                        let totalBonusAtouts = 0;
                        html.find('.atout-bonus:checked').each(function() { totalBonusAtouts += Number($(this).val()); });

                        const options = {
                            tactique: html.find('#tactique').val(), chifoumi: html.find('#chifoumi').val(), advC: parseInt(html.find('#advCirconstances').val()) || 0,
                            hasShield: hasShield, forIndice: forIndice, totalBonusAtouts: totalBonusAtouts,
                            tirMelee: html.find('#tirMelee').is(':checked'), tirBoutPortant: html.find('#tirBoutPortant').is(':checked'),
                            modTir: parseInt(html.find('#modTir').val()) || 0, cibleConsciente: html.find('#cibleConsciente').is(':checked'), lancerArme: html.find('#lancerArme').is(':checked')
                        };
                        await this._executeWeaponRoll(weapon, options);
                    }
                }
            },
            default: "attaquer"
        }).render(true);
    }

    async _executeWeaponRoll(weapon, options) {
        const { tactique, chifoumi, advC, hasShield, forIndice, totalBonusAtouts, tirMelee, tirBoutPortant, modTir, cibleConsciente, lancerArme } = options;
        const handicaps = this.system.handicaps || {};

        let finalDamageNum = Number(weapon.system.degats_fixe) || 0;
        let isSpecialDamage = false; 
        
        if (weapon.system.utilise_force) {
            finalDamageNum += (this.system.stats.for.indice || 0);
        }

        let rawDamage = weapon.system.utilise_force ? `FOR${weapon.system.degats_fixe > 0 ? '+'+weapon.system.degats_fixe : (weapon.system.degats_fixe < 0 ? weapon.system.degats_fixe : '')}` : `${weapon.system.degats_fixe}`;

        const typeArme = weapon.system.type_arme || "melee";
        const isDistance = typeArme === "distance" || lancerArme;
        let statLabel = isDistance ? "Tir" : "Combat";
        let statKey = isDistance ? "tir" : "com";
        
        let scoreBase = this.system.stats[statKey].total !== undefined ? this.system.stats[statKey].total : this.system.stats[statKey].value;
        let handicapLabels = [];

        if (handicaps.aveugle && isDistance) { scoreBase = 0; handicapLabels.push("Aveuglé"); }
        let score = scoreBase + totalBonusAtouts;
        
        let avantages = 0; let desavantages = 0; let malusVisee = 0;
        let ignoreArmor = false; let degatsBonus = 0; let degatsDiviseur = 1;
        let degatsNul = false; let tactiqueLabel = "Standard";

        if (handicaps.affaibli) { desavantages += 1; handicapLabels.push("Affaibli"); }
        if (handicaps.aveugle && !isDistance) { desavantages += 2; handicapLabels.push("Aveuglé au CàC"); }
        
        let bloqueRPlus = handicaps.affame || handicaps.demoralise;
        if (handicaps.affame) handicapLabels.push("Affamé");
        if (handicaps.demoralise) handicapLabels.push("Démoralisé");

        if (advC > 0) avantages += advC;
        if (advC < 0) desavantages += Math.abs(advC);

        if (tactique === "force") { desavantages += 1; degatsBonus = forIndice; tactiqueLabel = "En Force"; }
        else if (tactique === "finesse") { avantages += 1; degatsDiviseur = 2; tactiqueLabel = "En Finesse"; }
        else if (tactique === "defensive") { avantages += (hasShield ? 3 : 2); degatsNul = true; tactiqueLabel = "Défensive"; }
        else if (tactique === "multi") { desavantages += 1; tactiqueLabel = "Attaques multiples"; }
        else if (tactique.startsWith("viser")) {
            ignoreArmor = true; tactiqueLabel = "Viser";
            if (tactique === "viser5") malusVisee = -5;
            if (tactique === "viser10") malusVisee = -10;
            if (tactique === "viser15") malusVisee = -15;
            if (tactique === "viser20") malusVisee = -20;
        }

        if (chifoumi === "win") { avantages += 1; tactiqueLabel += " (+ Coup Tordu)"; }
        else if (chifoumi === "lose") { desavantages += 1; tactiqueLabel += " (Coup Tordu raté)"; }
        if (lancerArme) { tactiqueLabel += " (Arme lancée)"; }
        if (tirMelee) { desavantages += 1; tactiqueLabel += " (Dans la mêlée)"; }
        if (tirBoutPortant) { score += 20; tactiqueLabel += " (Bout portant chargé)"; }

        let netAdv = Math.max(-3, Math.min(3, avantages - desavantages)); 
        let bonusAvantage = netAdv * 10; 
        score += bonusAvantage + malusVisee;

        let target = Array.from(game.user.targets)[0];
        let modo = 0; let targetActor = null; let detailResistance = "";

        if (target) {
            targetActor = target.actor;
            if (isDistance) {
                const targetStat = targetActor.system.stats.mou.total || targetActor.system.stats.mou.value;
                const modoMou = 50 - targetStat;
                if (cibleConsciente) {
                    modo = Math.min(modTir, modoMou);
                    detailResistance = `Pire entre Tir (${modTir > 0 ? '+'+modTir : modTir}) et MODO Cible (${modoMou > 0 ? '+'+modoMou : modoMou})`;
                } else {
                    modo = modTir; detailResistance = `Difficulté Tir (${modTir > 0 ? '+'+modTir : modTir}) - Cible ignorante`;
                }
            } else {
                const targetStat = targetActor.system.stats.com.total || targetActor.system.stats.com.value;
                modo = 50 - targetStat; detailResistance = `MODO Combat cible`;
            }
            score += modo; 
        } else if (isDistance) {
            modo = modTir; score += modo; detailResistance = `Difficulté du Tir`;
        }

        let recapHtml = `
        <div style="font-size: 0.9em; background: rgba(0,0,0,0.4); padding: 5px; border-radius: 3px; margin-bottom: 8px; text-align: left; border: 1px solid #444;">
            <div><strong style="color:#e0e0e0;">Base (${statLabel}) :</strong> <span style="color:#fff;">${scoreBase}</span></div>
            ${totalBonusAtouts > 0 ? `<div style="color: #d4af37;"><strong>Bonus Spécialités :</strong> +${totalBonusAtouts}</div>` : ''}
            ${tirBoutPortant ? `<div style="color: #85c1e9;"><strong>Bout Portant :</strong> +20</div>` : ''}
            ${(target || isDistance) && modo !== 0 ? `<div><strong style="color:#e0e0e0;">MODO/Diff. :</strong> <span style="color:#ffcccc;">${modo > 0 ? '+'+modo : modo}</span> <small style="color:#aaa;">(${detailResistance})</small></div>` : ''}
            ${netAdv !== 0 ? `<div><strong style="color:#e0e0e0;">Avantages net (${netAdv}) :</strong> <span style="color:#85c1e9;">${bonusAvantage > 0 ? '+'+bonusAvantage : bonusAvantage}</span></div>` : ''}
            ${malusVisee !== 0 ? `<div><strong style="color:#e0e0e0;">Malus de Visée :</strong> <span style="color:#ffcccc;">${malusVisee}</span></div>` : ''}
            ${handicapLabels.length > 0 ? `<div style="color: #ff5252; margin-top: 3px; padding-top: 3px; border-top: 1px dashed #ff5252;"><strong>Handicaps :</strong> ${handicapLabels.join(", ")}</div>` : ''}
            <div style="border-top: 1px solid #555; margin-top: 5px; padding-top: 3px; text-align: center; font-size: 1.1em; color: #fff;"><strong>Seuil final : ${score}</strong></div>
            <div style="text-align: center; font-style: italic; color: #aaa; margin-top: 4px; font-size: 0.85em;">Posture : ${tactiqueLabel}</div>
        </div>`;

        const roll = new Roll("1d100"); await roll.evaluate(); const result = roll.total;
        let ru = result % 10; let isCrit = false; if (ru === 0) { ru = 10; isCrit = true; } 
        let isSuccess = result <= score;
        let message = ""; let cssClass = ""; let damageHtml = "";

        const rollExplosion = async () => {
            let degatsExplosion = 10; let texteExplosion = "10"; let relance = 10;
            while (relance === 10) {
                let exploRoll = new Roll("1d10"); await exploRoll.evaluate();
                relance = exploRoll.total; degatsExplosion += relance; texteExplosion += ` + ${relance}`;
            }
            return { total: degatsExplosion, texte: texteExplosion };
        };

        if (isSuccess) {
            if (bloqueRPlus) {
                isCrit = false; message = "Réussite (R+ Bloqué !)"; cssClass = "success";
            } else {
                message = isCrit ? "Réussite Critique !" : (result <= 9 && score >= 20 ? "Réussite Majeure !" : "Réussite");
                cssClass = isCrit ? "crit-success" : (result <= 9 && score >= 20 ? "major-success" : "success");
            }
            
            let degatsBruts = 0; let texteJet = `${ru}`;
            
            if (isSpecialDamage) {
                damageHtml = `<div class="weapon-damage success-box" style="color:#fff;">Dégâts : <strong>${rawDamage}</strong></div>`;
            } else {
                if (isCrit) {
                    let explosion = await rollExplosion();
                    degatsBruts = explosion.total + finalDamageNum + degatsBonus; texteJet = explosion.texte;
                } else { degatsBruts = ru + finalDamageNum + degatsBonus; }
                degatsBruts = Math.floor(degatsBruts / degatsDiviseur);
                
                if (bloqueRPlus) degatsBruts = Math.max(0, degatsBruts - 1);
                if (degatsNul) degatsBruts = 0;

                if (targetActor) {
                    let protection = ignoreArmor ? 0 : (Number(targetActor.system.protection?.value) || 0);
                    let degatsFinaux = Math.max(0, degatsBruts - protection);
                    let noteSbire = "";
                    try {
                        let nouvelleVie = targetActor.system.vitalite.value - degatsFinaux;
                        if (targetActor.type === "pnj" && targetActor.system.type_pnj === "sbire" && degatsFinaux > 0) {
                            nouvelleVie = 0; noteSbire = "<br><span style='color: #ffcccc; font-weight: bold;'>💥 Le sbire est vaincu sur le coup !</span>";
                        }
                        await targetActor.update({ "system.vitalite.value": Math.max(0, nouvelleVie) });
                    } catch(e) {}

                    damageHtml = `<div class="weapon-damage ${isCrit ? 'crit-box' : 'success-box'}">Dégâts infligés : <strong><span style="font-size: 1.2em; color: #fff;">${degatsFinaux}</span></strong><br><small style="color: #ccc;">(Base: ${texteJet} + Arme: ${finalDamageNum} ${degatsBonus>0?'+ Force: '+degatsBonus:''} ${degatsDiviseur>1?'/ 2':''} - Armure cible: ${protection})</small>${bloqueRPlus ? '<br><span style="color:#ffcccc; font-weight:bold;">-1 Dégât (Handicap)</span>' : ''}${noteSbire}</div>`;
                    if (degatsNul) damageHtml = `<div class="weapon-damage" style="color: #aaa;"><em>Esquive et Parade pures. Aucun dégât infligé.</em></div>`;
                } else { 
                    damageHtml = `<div class="weapon-damage ${isCrit ? 'crit-box' : 'success-box'}" style="color: #fff;">Dégâts potentiels : <strong>${degatsBruts}</strong> ${bloqueRPlus ? '<span style="color:#ffcccc; font-weight:bold;">(-1 Dégât Handicap)</span>' : ''}</div>`; 
                }
            }
        } else {
            message = isCrit ? "Échec Critique !" : (result >= 91 && score < 80 ? "Échec Majeur" : "Échec");
            cssClass = isCrit ? "crit-fail" : (result >= 91 && score < 80 ? "major-fail" : "fail");
            
            let noteAllie = "";
            if (tirMelee && (isCrit || (result >= 91 && score < 80))) {
                noteAllie = `<div style="margin-top: 8px; color: #ffcccc; font-weight: bold; font-size: 1.1em; border-top: 1px dashed #ffcccc; padding-top: 5px;">💥 Aïe ! Le tir touche un allié dans la mêlée !</div>`;
            }

            if (targetActor && typeArme === "melee" && !lancerArme) {
                let targetWeapon = targetActor.items.find(i => i.type === "arme" && i.system.type_arme !== "distance");
                let targetFinalDamageNum = 0;
                
                if (targetWeapon) {
                    targetFinalDamageNum = Number(targetWeapon.system.degats_fixe) || 0;
                    if (targetWeapon.system.utilise_force) targetFinalDamageNum += (targetActor.system.stats.for.indice || 0);
                }

                let degatsBruts = 0; let texteJet = `${ru}`;
                if (isCrit) {
                    let explosion = await rollExplosion();
                    degatsBruts = explosion.total + targetFinalDamageNum; texteJet = explosion.texte;
                } else { degatsBruts = ru + targetFinalDamageNum; }
                let protection = Number(this.system.protection?.value) || 0;
                let degatsFinaux = Math.max(0, degatsBruts - protection);
                let noteSbire = ""; let nouvelleVie = this.system.vitalite.value - degatsFinaux;
                if (this.type === "pnj" && this.system.type_pnj === "sbire" && degatsFinaux > 0) {
                    nouvelleVie = 0; noteSbire = "<br><span style='color: #ffcccc; font-weight: bold;'>💥 Le sbire est fauché par la contre-attaque !</span>";
                }
                await this.update({ "system.vitalite.value": Math.max(0, nouvelleVie) });
                damageHtml = `<div class="weapon-damage counter-attack-box"><strong style="color: #ffcccc;">Contre-attaque subie !</strong><br>Dégâts reçus : <strong><span style="font-size: 1.2em; color: #fff;">${degatsFinaux}</span></strong><br><small style="color: #ccc;">(Jet adverse: ${texteJet} + Son arme: ${targetFinalDamageNum} - Ton armure: ${protection})</small>${noteSbire}</div>`;
            } else { damageHtml = `<div class="weapon-damage" style="background: rgba(0,0,0,0.5); border: 1px solid #444; color: #ccc;"><em>Attaque manquée.</em>${noteAllie}</div>`; }
        }

        const content = `<div class="brigandyne-roll"><h3 style="border-bottom: 1px solid #444; margin-bottom: 5px; color: #fff;">Attaque : ${weapon.name}</h3>${recapHtml}<div class="dice-result"><div class="dice-total ${cssClass}">${result}</div></div><div class="roll-result ${cssClass}" style="text-align: center; font-weight: bold; margin-bottom: 5px;">${message}</div>${damageHtml}</div>`;
        ChatMessage.create({ user: game.user._id, speaker: ChatMessage.getSpeaker({ actor: this }), content: content, rolls: [roll] });
    }
}