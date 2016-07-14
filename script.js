
'use strict'; 

   const Script = require('smooch-bot').Script; 

// Bots
   const AndreasSefzig = "[AndreasSefzig] "; 
   const EmpfangsBot = "[EmpfangsBot] "; 
   const VerkaufsBot = "[VerkaufsBot] "; 
   const MarketingBot = "[MarketingBot] "; 

// Variablen 
   var versuche_max = 3; 
   var versuche = 0; 
   var zuletzt = ""; 
   var bekannt = false;
   var botsan = true;

// Daten 
   var vorname = "Unbekannter";
   var nachname = "Besucher";
   var email = "test@robogeddon.de";
   var emailkorrekt = true;
   
// Konversationen 
   module.exports = new Script({ 
   
   // ---------------
   // GESPRÄCH ANFANG
   // ---------------
     
    processing: {
        
        prompt: (bot) => bot.say(EmpfangsBot+'Nicht so schnell bitte...'),
        receive: () => 'processing'
        
    },
   
    start: {
    
    // prompt: (bot) => bot.say(EmpfangsBot+'Starte...'),
       receive: (bot, message) => {
            
       // Befehl normalisieren
          var befehl = befehlWort(message.text.trim());
          
       // Nächster Schritt default
          var dann = "empfang";
          
          if (~befehl.indexOf("Weiterleiten zu:")) {
             
          // bot.say(EmpfangsBot+'Ich leite Sie weiter.');
             
          }
          else {
             
             if (bekannt == false) {
                
                             /* return bot.say(EmpfangsBot+' Dies ist die Vorlage des --Chatraums. Wir sind 3 Bots: Ich bin Alice, Barbara ist im --Verkauf und Cynthia macht unser --Marketing. ').then(() => bot.say(EmpfangsBot+' Unterhalten Sie sich mit uns, indem Sie die farbig hinterlegten Wörter schreiben, klicken oder berühren! ')).then(() => bot.say(EmpfangsBot+' [Textmobil:Rechts finden Sie ein Menü - berühren Sie dafür den Knopf oben rechts oder wischen Sie nach links.,Ich habe rechts das Menü für Sie geöffnet. Sie können es mit dem Button oben rechts bedienen - oder indem Sie --Menü schreiben.] [Javascript:menu(an)] ')).then(() => 'empfang');              */ 
             }
             else {
                
                             /* return bot.say(EmpfangsBot+' Willkommen zurück! Sprechen Sie mit mir über --Chatraum! ').then(() => bot.say(EmpfangsBot+' Oder sprechen Sie mit den anderen Bots über --Verkauf und --Marketing. ')).then(() => 'empfang');              */ 
             }
             
          }
          
          return bot.setProp('empfangen', 'ja')
          .then(() => dann);
          
       }
    },
   
 // -------------------------
 // Onboarding
 // -------------------------
    
    name: {
    	
        receive: (bot, message) => {
            
            var antwort = befehlWort(message.text.trim().toUpperCase());
            var dann = "name";
            
            if ((antwort == "--JA") ||
                (antwort == "--NAME") ||
                (antwort == "--ÄNDERN")) { 
               
               bot.say(EmpfangsBot+'Wir werden sorgsam mit Ihren Daten umgehen.');
               dann = "vorname";
               
            }
            if ((antwort == "--NEIN") ||
                (antwort == "--EMPFANG") ||
                (antwort == "--ABBRECHEN")) {
               
               bot.say(EmpfangsBot+'Gehen wir zurück zum --Empfang.');
               dann = "empfang";
               
            }
            if ((antwort == "--EMAIL") ||
                (antwort == "--E-MAIL")) {
               
               bot.say(EmpfangsBot+'Wir geben Ihre Adresse nicht weiter.');
               dann = "emailadresse";
               
            }
            
            return bot.setProp('name_eingabe', 'tmp')
                .then(() => dann);
        }
    },

    vorname: {
    	
        prompt: (bot) => bot.say(EmpfangsBot+'Wie heissen Sie mit Vornamen?'),
        receive: (bot, message) => {
            
            vorname = message.text;
            vorname = vorname.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase(); } );
            
            return bot.setProp('vorname', vorname)
                .then(() => bot.say(EmpfangsBot+''+vorname+', prima.'))
                .then(() => bot.say(EmpfangsBot+'Und wie heissen Sie mit Nachnamen? [Javascript:cookies(vorname,'+vorname+')] '))
                .then(() => 'nachname');
        }
    },

    nachname: {
    	
        receive: (bot, message) => {
            
            nachname = message.text; 
            nachname = nachname.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase(); } );
            nachname = nachname.replace("--","");
            
            bot.setProp('nachname', nachname);
            return bot.getProp('vorname')
                .then((vorname) => bot.say(EmpfangsBot+'Sie heissen also '+vorname+' '+nachname+'. Bitte geben Sie nun Ihre E-Mail-Adresse ein (sie können auch --abbrechen). [Javascript:cookies(nachname,'+nachname+')] '))
                .then(() => 'emailadresse');
            
        }
    },

    emailadresse: {
    	
        receive: (bot, message) => {
            
            email = message.text;
            
         // emailkorrekt = email.test(emailregex);
            emailkorrekt = true;
            
            if (emailkorrekt == true) {
            	
               return bot.setProp('email', email)
                  .then(() => bot.say(EmpfangsBot+''+email+' ist eine valide E-Mail-Adresse. [Javascript:cookies(email,'+email+')] '))
                  .then(() => bot.say(EmpfangsBot+'Schreiben Sie --E-Mail, um sie zu ändern. Oder lassen Sie uns zurück zum --Empfang gehen.'))
                  .then(() => 'empfang');
               
            }
            else {
            	
                return bot.say(+' 0 ').then(() => bot.say(EmpfangsBot+' Bitte geben Sie Ihre E-Mail-Adresse nochmal ein - oder lassen Sie uns zum --Empfang zurückkehren. ')).then(() => 'emailadresse');                
            }
        }
    },
   
 // ---------------------------
 // Empfang (Sefzigbot)
 // ---------------------------
 // - name_klein: empfang
 // - name_kamel: Empfang
 // - name_gross: EMPFANG
 // - frau_klein: sefzigbot
 // - frau_kamel: Sefzigbot
 // - frau_gross: SEFZIGBOT
 // - bot_name:   EmpfangsBot
 // - bot_klein:  empfangsbot
 // - bot_kamel:  Empfangsbot
 // - bot_gross:  EMPFANGSBOT
 // ---------------------------
 
    empfang: {
  	
       receive: (bot, message) => {
          
       // Befehl normalisieren
          var befehl = befehlWort(message.text.trim().toUpperCase());
          
       // Nächster Schritt default
          var dann = "empfang";
          
       // Nicht-Befehl-Eingaben mitzählen
          var versuch = false;
          
       // Default-Zurück
          var zuruck = "Empfang";
          
       // Zuletzt Varianten
          var zuletzt_dann =  dann;
          var zuletzt_klein = zuletzt_dann.toLowerCase();
          var zuletzt_gross = zuletzt_dann.toUpperCase();
          var zuletzt_kamel = zuletzt_dann.charAt(0).toUpperCase() + zuletzt_dann.slice(1);
          
       // -----------------
       // Bot-Schalter
       // -----------------
          
          if ((~befehl.indexOf("--BOTSAUS")) ||
              (~befehl.indexOf("--BOTS-AUS")) ||
              (~befehl.indexOf("--BOTAUS")) ||
              (~befehl.indexOf("--BOT-AUS"))) { 
             versuch = true; 
             botsan = false;
             return bot.say(EmpfangsBot+' Sie haben uns Bots ausgeschaltet. Sie können uns wieder anschalten, indem Sie --Bots-an schreiben.')
             .then(() => 'empfang');
          }
          
          if ((~befehl.indexOf("--BOTSAN")) ||
              (~befehl.indexOf("--BOTS-AN")) ||
              (~befehl.indexOf("--BOTAN")) ||
              (~befehl.indexOf("--BOT-AN"))) { 
             versuch = true; 
             botsan = true;
             return bot.say(EmpfangsBot+' Da sind wir wieder! Schreiben Sie --Empfang, um mit mir zu sprechen - oder dem --Verkauf oder --Marketing!')
             .then(() => 'empfang');
          }
          
       // -----------------
       // Befehle
       // -----------------
          
          if ("empfang" != "empfang") {
          	 
             if ((~befehl.indexOf("--EMPFANG")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Bis später! ').then(() => bot.say(EmpfangsBot+' Willkommen zurück! Wie war es im --Empfang? Schreiben Sie --Befehle um zu sehen, was ich Ihnen sonst noch zeigen kann. ')).then(() => 'empfang');}if ((~befehl.indexOf("--SEFZIGBOT")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Bis später! ').then(() => bot.say(EmpfangsBot+' Willkommen zurück! Wie war es im --Empfang? Schreiben Sie --Befehle um zu sehen, was ich Ihnen sonst noch zeigen kann. ')).then(() => 'empfang');}if ((~befehl.indexOf("--ABBRECHEN")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Bis später! ').then(() => bot.say(EmpfangsBot+' Willkommen zurück! Wie war es im --Empfang? Schreiben Sie --Befehle um zu sehen, was ich Ihnen sonst noch zeigen kann. ')).then(() => 'empfang');}             
          }
          
          if (zuletzt_kamel != "Empfang") { 
             
             if ((~befehl.indexOf("--ZURÜCK")) && (botsan == true)) { versuch = true; }             
          } 
          else {
             
             if ((~befehl.indexOf("--ZURÜCK")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Wollen Sie zurück zum --Empfang? ').then(() => 'empfang');}             
          }
          
          if ((~befehl.indexOf("--MENÜAN")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:menu()] Menü eingeschaltet. ').then(() => 'empfang');}if ((~befehl.indexOf("--MENUAN")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:menu()] Menü eingeschaltet. ').then(() => 'empfang');}          if ((~befehl.indexOf("--MENÜAUS")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:menu()] Menü ausgeschaltet. ').then(() => 'empfang');}if ((~befehl.indexOf("--MENUAUS")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:menu()] Menü ausgeschaltet. ').then(() => 'empfang');}          if ((~befehl.indexOf("--MENÜ")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:menu()] Menü umgeschaltet. ').then(() => 'empfang');}if ((~befehl.indexOf("--MENU")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:menu()] Menü umgeschaltet. ').then(() => 'empfang');}if ((~befehl.indexOf("--MENUE")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:menu()] Menü umgeschaltet. ').then(() => 'empfang');}          
       // -----------------
       // Onboarding
       // -----------------
          
       	 if ((vorname) && (vorname != "") && (vorname != "Unbekannter") && (nachname) && (nachname != "") && (nachname != "Besucher")) {
       	    
             if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; }             
          }
          else if ((vorname) && (vorname != "") && (vorname != "Unbekannter")) {
       	    
             if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; }             
          }
          else if ((nachname) && (nachname != "") && (nachname != "Besucher")) {
       	    
             if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; }             
          }
          else {
       	    
             if ((~befehl.indexOf("--NAME")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Wir kennen Ihren Namen noch nicht. ').then(() => 'vorname');}             
          }
          
       // -----------------
       // Kontakt
       // -----------------
          
          if ((~befehl.indexOf("--KONTAKT")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Alle unsere Kontaktwege: [Text:Kontakt,RobogeddonKontakt] ').then(() => bot.say(EmpfangsBot+' Wollen Sie --telefonieren, --mailen oder --twittern? ')).then(() => 'empfang');}          
          if ((~befehl.indexOf("--TELEFON")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Rufen Sie Andreas Sefzig an: [Telefon:+49 151 15920082] ').then(() => 'empfang');}          
          if ((~befehl.indexOf("--MAIL")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Schreiben Sie uns eine Email: [Email:andreas.sefzig@robogeddon.de] ').then(() => 'empfang');}          
          if ((~befehl.indexOf("--TWITTER")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Senden Sie uns einen Tweet: [Link:PM in Twitter öffnen,RobogeddonTweet] ').then(() => 'empfang');}          
       // -----------------
       // Funktionen
       // -----------------
          
          if ((~befehl.indexOf("--MOBIL")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Diesen Chat mobil öffnen: [Qr:http://chatraum.herokuapp.com/] ').then(() => bot.say(EmpfangsBot+' Oder öffnen Sie [Textlink:Chatraum.herokuapp.com,http://chatraum.herokuapp.com] in Ihrem mobilen Browser. ')).then(() => 'empfang');}          
       // Stile
          if ((~befehl.indexOf("--TAG")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:stil(tag)] Stil: Tag. ').then(() => 'empfang');}          if ((~befehl.indexOf("--NACHT")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:stil(nacht)] Stil: Nacht. ').then(() => 'empfang');}          if ((~befehl.indexOf("--ROBOS")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:stil(robogeddon)] Stil: Robogeddon. ').then(() => 'empfang');}          if ((~befehl.indexOf("--HX")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:stil(hacks)] Stil: Hx. ').then(() => 'empfang');}          
       // -----------------
       // Bots
       // -----------------
          
          if (zuletzt_klein != "empfang") { 
             if ((~befehl.indexOf("--EMPFANG")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ich übergebe an Alice. Schreiben Sie --Empfang, um wieder mit mir zu sprechen. ').then(() => bot.say(EmpfangsBot+' Hallo, ich bin Alice, der Empfangs-Bot. Darf ich Ihnen die Bots aus --Verkauf und --Marketing vorstellen? ')).then(() => 'empfang');}if ((~befehl.indexOf("--ALICE")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ich übergebe an Alice. Schreiben Sie --Empfang, um wieder mit mir zu sprechen. ').then(() => bot.say(EmpfangsBot+' Hallo, ich bin Alice, der Empfangs-Bot. Darf ich Ihnen die Bots aus --Verkauf und --Marketing vorstellen? ')).then(() => 'empfang');} } else { 
             if ((~befehl.indexOf("--EMPFANG")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Sprechen Sie mit mir über den --Chatraum - oder mit den anderen Bots über --Verkauf oder --Marketing! ').then(() => 'empfang');}if ((~befehl.indexOf("--ALICE")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Sprechen Sie mit mir über den --Chatraum - oder mit den anderen Bots über --Verkauf oder --Marketing! ').then(() => 'empfang');}          }
          
       // Vorlage (Gewerk, Name)
          if ((~befehl.indexOf("--GEWERK")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ich übergebe an Name. Schreiben Sie --Empfang, um wieder mit mir zu sprechen. ').then(() => bot.say(GewerksBot+' Hallo Gewerk Text 1: Hallo, ich bin Name, der Gewerks-Bot. ')).then(() => bot.say(GewerksBot+' Hallo Gewerk Text 2: --Befehle folgt. ')).then(() => bot.say(GewerksBot+' Hallo Gewerk Text 3. ')).then(() => 'gewerk');}
       // -----------------
       // System
       // -----------------
       
          if ((~befehl.indexOf("--BEFEHL")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Funktionen: --Kontakt, --Inhalt, --Mobil und --Über. ').then(() => 'empfang');}          
          if ((~befehl.indexOf("--ÜBER")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ich bin Andreas Sefzigs Bot. Soll ich Andreas --Sefzig rufen? ').then(() => bot.say(EmpfangsBot+' Geben Sie mir Stichwörter wie --ConversationalUI, --ConvComm oder --Künstliche Intelligenz - ich habe zu vielem eine Meinung :D ')).then(() => 'empfang');}          
       // -----------------
       // Inhalte
       // -----------------
          
          if ((~befehl.indexOf("--DATEN")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Lassen Sie uns Ihre Daten durchgehen. ').then(() => 'name');}          
       // -----------------
       // Vorlage
       // -----------------
       
          if ((~befehl.indexOf("--VORLAGE")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Text Vorlage 1. ').then(() => 'empfang');}          

       // -----------------
       // Bot aus
       // -----------------
       
       // Zurück merken
          zuletzt = zuruck;
          
       // Irrläufer
          if (versuch == true) { 
             versuche = 0;
          }
          else { 
             if (botsan == true) {
                versuche++; 
                if (versuche == versuche_max)
                {
                   bot.say(EmpfangsBot+'Suchen Sie die --Befehle? Oder schalten Sie den --Bot-aus.'); 
                   versuche = 0;
                }
             }
          }
          
       // Weiterleiten
          return bot.setProp('empfang', 'gesprochen')
              .then(() => dann);
          
       }
        
    },
   
    finish: {
       receive: (bot, message) => {
          return bot.getProp('name')
             .then(() => 'finish');
       }
    }
    
   // --------------
   // GESPRÄCH AUS 
   // -------------- 

   });
   
 // Befehle
    function befehlWort(befehl) {
       
    // Wenn die Nachricht nur ein Wort ist
       var test = befehl.split(" "); 
       if ((!test[1]) || (test[1] == "")) {
          
       // In Befehl umwandeln
          befehl = befehl.replace("--", "");
          befehl = "--"+befehl;
          
       // Satzzeichen entfernen
          befehl = befehl.replace(".", "");
          befehl = befehl.replace("!", "");
          befehl = befehl.replace("?", "");
               
       }
            
       return befehl;
       
    }
    
 // Bots vereinfachen
    function sagenhaft(befehl, dann, bot, text1, text2, text3, text4, text5) {
    // sagenhaft('Strategie', dann, bot,
    //    SefzigBot+'Chatten ist die häufigste digitale Beschäftigung in Deutschland: [Text:Aktuelle Statistiken,RobogeddonChatten] Ein weltweiter --Trend mit erheblichen absehbaren Auswirkungen auf die Benutzeroberflächen des Internets.',
    //    SefzigBot+'Chat-Bots gibt es schon --lange. Sie werden gerade jetzt für das Marketing interessant, weil die meisten Menschen mit Chatten vertraut sind und große Anwendungen wie --Facebook, --Slack u.a. ihre Plattformen für Bots öffnen.',
    //    SefzigBot+'Interessieren Sie sich eher für Bots, die --intern (z.B. mit Ihrem Team) oder --extern (z.B. mit Ihren Kunden) kommunizieren?'
    //  );  
       if  (~befehl.indexOf("--STRATEGIE")) { 
          
          versuch = true; 
          
          if ((text5) && (text5 != "")) {
             bot.say(text1).then(function(){
             return bot.say(text2) }).then(function(){
             return bot.say(text3) }).then(function(){
             return bot.say(text4) }).then(function(){
             return bot.say(text5); });
          }
          else if ((text4) && (text4 != "")) {
             bot.say(text1).then(function(){
             return bot.say(text2) }).then(function(){
             return bot.say(text3) }).then(function(){
             return bot.say(text4); });
          }
          else if ((text3) && (text3 != "")) {
             bot.say(text1).then(function(){
             return bot.say(text2) }).then(function(){
             return bot.say(text3); });
          }
          else if ((text2) && (text2 != "")) {
             bot.say(text1).then(function(){
             return bot.say(text2); });
          }
          else if ((text1) && (text1 != "")) {
             bot.say(text1);
          }
          
       }
       
    }
      