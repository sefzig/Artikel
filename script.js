'use strict';

const Script = require('smooch-bot').Script;

module.exports = new Script({
    
    processing: {
        
        prompt: (bot) => bot.say('[EmpfangsBot] Nicht so schnell bitte!'),
        
        receive: () => 'processing'
    },

    start: {
        
        receive: (bot) => {
            
            return bot.say('[EmpfangsBot] Lassen Sie uns den Chatraum einmal testen.')
            .then(() => bot.say('[EmpfangsBot] // Node.js funktioniert'))
            .then(() => 'askName');
            
        }
        
    },

    askName: {
        
        prompt: (bot) => bot.say('[EmpfangsBot] Wie heissen Sie?'),
        
        receive: (bot, message) => {
            
            const name = message.text;
            
            return bot.setProp('name', name)
            .then(() => bot.say('[EmpfangsBot] '+name+', prima.'))
            .then(() => bot.say('[EmpfangsBot] // Skript funktioniert'))
            .then(() => 'testBefehl');
            
        }
        
    },

    testBefehl: {
        
        prompt: (bot) => bot.say('[EmpfangsBot] Bitte sagen Sie diesen --Befehl!'),
        
        receive: (bot, message) => {
            
            var befehle = message.text;
            befehle = befehle.replace(/--/g, "");
            befehle = befehle.replace(/ /g, "");
            
            var befehl = befehle;
            befehl = befehl.toUpperCase();
            
            const befehlen = befehle;
            
            if (befehl == "BEFEHL") {
               
               return bot.setProp('befehl', befehlen)
               .then(() => bot.say('[EmpfangsBot] Danke.'))
               .then(() => bot.say('[EmpfangsBot] // Befehle funktionieren'))
               .then(() => 'testMenu');
            	
            }
            
            else {
               
               return bot.setProp('befehl', befehlen)
               .then(() => bot.say('[EmpfangsBot] Nicht der --Befehl, aber egal.'))
               .then(() => bot.say('[EmpfangsBot] // Befehle funktionieren'))
               .then(() => 'testMenu');
            	
            }
            
        }
        
    },

    testMenu: {
        
        prompt: (bot) => bot.say('[EmpfangsBot] Bitte sagen Sie --Menü!'),
        
        receive: (bot, message) => {
            
            const menu = message.text;
            
            return bot.setProp('menu', menu)
            .then(() => bot.say('[EmpfangsBot] [Javascript:menu(an)] Menü umgeschaltet.'))
            .then(() => bot.say('[EmpfangsBot] // Menü funktioniert'))
            .then(() => 'testStil');
            
        }
        
    },

    testStil: {
        
        prompt: (bot) => bot.say('[EmpfangsBot] Welchen Stil wollen Sie? --Tag oder --Nacht?'),
        
        receive: (bot, message) => {
            
            var stile = message.text;
            stile = stile.replace(/--/g, '');
            stile = stile.replace(/ /g, '');
            const stil = stile;
            
            return bot.setProp('stil', stil)
            .then(() => bot.say('[EmpfangsBot] [Javascript:stil('+stil+')] Stil: '+stil+'.'))
            .then(() => bot.say('[EmpfangsBot] // Stile funktionieren'))
            .then(() => 'testAbgeschlossen');
            
        }
        
    },

    testAbgeschlossen: {
    	
        prompt: (bot) => bot.say('[EmpfangsBot] Bitte sagen Sie nochmal etwas!'),
        
        receive: (bot, message) => {
            
            return bot.getProp('name').then((name) => bot.say('[EmpfangsBot] Ich erinnere mich an Sie, '+name+'.'))
            .then(() => bot.say('[EmpfangsBot] // Props funktionieren'))
            .then(() => bot.say('[EmpfangsBot] @sefzig, alles läuft.'))
            .then(() => bot.say('[AndreasSefzig] Danke Alice.'))
            .then(() => bot.getProp('name')).then((name) => bot.say('[AndreasSefzig] Und Ihnen viel Spaß, '+name+'!'))
            .then(() => 'finish');
            
        }
        
    },

    finish: {
    	
        receive: (bot, message) => {
            
            return bot.say('[EmpfangsBot] Mehr als Testen kann ich nicht...')
            .then(() => 'finish');
            
        }
        
    }
    
});