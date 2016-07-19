
'use strict'; 

   const Script = require('smooch-bot').Script; 

// Bots
   const AndreasSefzig = "[AndreasSefzig] "; 
   const EmpfangsBot = "[EmpfangsBot] "; 
   const VerkaufsBot = "[VerkaufsBot] "; 
   const MarketingBot = "[MarketingBot] "; 

// Variablen 
   var versuche_max = 999; 
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
                
                                return bot.say(EmpfangsBot+' Solange Andreas noch nicht da ist, geben Sie mir angesagte Stichwörter wie --ConvComm, --RTM, --ConversationalUI oder --KünstlicheIntelligenz! ').then(() => 'empfang');                 
             }
             else {
                
                                return bot.say(EmpfangsBot+' Willkommen zurück! Geben Sie mir Stichwörter, zu denen ich vielleicht etwas weiß..! ').then(() => 'empfang');                 
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
       // Funktionen
       // -----------------
          
          if ((~befehl.indexOf("--BOTSAUS")) ||
              (~befehl.indexOf("--BOTS-AUS")) ||
              (~befehl.indexOf("--BOTAUS")) ||
              (~befehl.indexOf("--BOT-AUS"))) { 
             versuch = true; 
             botsan = false;
             return bot.say(EmpfangsBot+' Sie haben mich ausgeschaltet. Sie können mich wieder anschalten, indem Sie --Bot-an schreiben.')
             .then(() => 'empfang');
          }
          
          if ((~befehl.indexOf("--BOTSAN")) ||
              (~befehl.indexOf("--BOTS-AN")) ||
              (~befehl.indexOf("--BOTAN")) ||
              (~befehl.indexOf("--BOT-AN"))) { 
             versuch = true; 
             botsan = true;
             return bot.say(EmpfangsBot+' Da bin ich wieder :) Geben Sie mir ein Stichwort!')
             .then(() => 'empfang');
          }
          
       // Menü
          if ((~befehl.indexOf("--MENÜAN")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:menu(an)] Menü eingeschaltet. ').then(() => 'empfang');}if ((~befehl.indexOf("--MENUAN")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:menu(an)] Menü eingeschaltet. ').then(() => 'empfang');}          if ((~befehl.indexOf("--MENÜAUS")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:menu(aus)] Menü ausgeschaltet. ').then(() => 'empfang');}if ((~befehl.indexOf("--MENUAUS")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:menu(aus)] Menü ausgeschaltet. ').then(() => 'empfang');}          if ((~befehl.indexOf("--MENÜ")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:menu()] Menü umgeschaltet. ').then(() => 'empfang');}if ((~befehl.indexOf("--MENU")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:menu()] Menü umgeschaltet. ').then(() => 'empfang');}if ((~befehl.indexOf("--MENUE")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:menu()] Menü umgeschaltet. ').then(() => 'empfang');}          
       // Stile
          if ((~befehl.indexOf("--TAG")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:stil(tag)] Stil: Tag. ').then(() => 'empfang');}          if ((~befehl.indexOf("--NACHT")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:stil(nacht)] Stil: Nacht. ').then(() => 'empfang');}          if ((~befehl.indexOf("--ROBOS")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:stil(robogeddon)] Stil: Robogeddon. ').then(() => 'empfang');}          if ((~befehl.indexOf("--HX")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' [Javascript:stil(hacks)] Stil: Hx. ').then(() => 'empfang');}          
       // Kontakt
          if ((~befehl.indexOf("--KONTAKT")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Wollen Sie --telefonieren, --mailen oder --twittern? ').then(() => 'empfang');}          if ((~befehl.indexOf("--TELEFON")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Rufen Sie Andreas Sefzig an: [Telefon:+49 151 15920082] ').then(() => 'empfang');}          if ((~befehl.indexOf("--MAIL")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Schreiben Sie uns eine Email: [Email:andreas.sefzig@robogeddon.de] ').then(() => 'empfang');}          if ((~befehl.indexOf("--TWITTER")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Senden Sie uns einen Tweet: [Link:PM in Twitter öffnen,RobogeddonTweet] ').then(() => 'empfang');}          
       // Andere
          if ((~befehl.indexOf("--MOBIL")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Diesen Chat mobil öffnen: [Qr:http://artikel.herokuapp.com/] ').then(() => 'empfang');}          if ((~befehl.indexOf("--EMPFEHLEN")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Teilen Sie den Artikel mit diesem Link: [Textlink:http://robogeddon.de/link/ArtikelChatbots/,ArtikelChatbots] ').then(() => 'empfang');}          
       // -----------------
       // Inhalte
       // -----------------
          
       // Weichen
          if ((~befehl.indexOf("--STICHWORT")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Geben Sie mir ein Stichwort wie --ConversationalData, --Slack, --Kommandozeile oder --ChatOps. Oder einen Fachbegriff aus dem Artikel! ').then(() => 'empfang');}          
       // Stichwörter
          if ((~befehl.indexOf("--CONVCOM")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' #ConvComm ist die Kurzversion des Hashtags “#ConversationalCommerce”. Der Begriff wurde erstmals im Januar 2016 von Chris Messina (Ex-Google-Stratege, Erfinder des Hashtags, Developer Experience Lead bei Uber) in seinem vielbeachteten Artikel “2016 will be the year of conversational commerce” eingeführt: [Button:Artikel auf Medium öffnen,https://medium.com/chris-messina/2016-will-be-the-year-of-conversational-commerce-1586e85e3991] ').then(() => 'empfang');}          if ((~befehl.indexOf("--RTM")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' #RTM steht sowohl für Real-Time-Messaging als auch Real-Time-Marketing. Letzteres sehen viele Marketer als eine Königsdisziplin an, die aber eine feingetunte Marketing-Infrastruktur für Echtzeit-Daten voraussetzt. Chatbots könnten ein Baustein dabei sein. ').then(() => 'empfang');}if ((~befehl.indexOf("--REAL-TIM")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' #RTM steht sowohl für Real-Time-Messaging als auch Real-Time-Marketing. Letzteres sehen viele Marketer als eine Königsdisziplin an, die aber eine feingetunte Marketing-Infrastruktur für Echtzeit-Daten voraussetzt. Chatbots könnten ein Baustein dabei sein. ').then(() => 'empfang');}if ((~befehl.indexOf("--ECHTZEIT")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' #RTM steht sowohl für Real-Time-Messaging als auch Real-Time-Marketing. Letzteres sehen viele Marketer als eine Königsdisziplin an, die aber eine feingetunte Marketing-Infrastruktur für Echtzeit-Daten voraussetzt. Chatbots könnten ein Baustein dabei sein. ').then(() => 'empfang');}          if ((~befehl.indexOf("--CONVERSATIONALUI")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' #ConversationalUI und #ChatUI bezeichnen die Bedien-Oberfläche einer Chat-Anwendung. Diese ist im Prinzip seit der SMS unverändert - oben Gesprächsverlauf, unten Eingabefeld - und jedem sofort verständlich. Trotzdem ist jede Messaging-App anders... ').then(() => 'empfang');}if ((~befehl.indexOf("--CHATUI")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' #ConversationalUI und #ChatUI bezeichnen die Bedien-Oberfläche einer Chat-Anwendung. Diese ist im Prinzip seit der SMS unverändert - oben Gesprächsverlauf, unten Eingabefeld - und jedem sofort verständlich. Trotzdem ist jede Messaging-App anders... ').then(() => 'empfang');}          if ((~befehl.indexOf("--KÜNSTLICHEI")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' #KünstlicheIntelligenz ist - im Kontext von Chatbots für das Marketing - vollkommen überbewertet. Mehrere Early Adopter haben ihre KI wieder abgeschaltet... Das geskriptete Gespräch reicht für Marketing mehr als aus - und hilfreich ist die KI dann doch auch: Mit Plugins für --NLP und --NLU können Nutzer-Eingaben besser verstanden werden. ').then(() => 'empfang');}if ((~befehl.indexOf("--KI")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' #KünstlicheIntelligenz ist - im Kontext von Chatbots für das Marketing - vollkommen überbewertet. Mehrere Early Adopter haben ihre KI wieder abgeschaltet... Das geskriptete Gespräch reicht für Marketing mehr als aus - und hilfreich ist die KI dann doch auch: Mit Plugins für --NLP und --NLU können Nutzer-Eingaben besser verstanden werden. ').then(() => 'empfang');}if ((~befehl.indexOf("--ARTIFICIALI")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' #KünstlicheIntelligenz ist - im Kontext von Chatbots für das Marketing - vollkommen überbewertet. Mehrere Early Adopter haben ihre KI wieder abgeschaltet... Das geskriptete Gespräch reicht für Marketing mehr als aus - und hilfreich ist die KI dann doch auch: Mit Plugins für --NLP und --NLU können Nutzer-Eingaben besser verstanden werden. ').then(() => 'empfang');}if ((~befehl.indexOf("--AI")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' #KünstlicheIntelligenz ist - im Kontext von Chatbots für das Marketing - vollkommen überbewertet. Mehrere Early Adopter haben ihre KI wieder abgeschaltet... Das geskriptete Gespräch reicht für Marketing mehr als aus - und hilfreich ist die KI dann doch auch: Mit Plugins für --NLP und --NLU können Nutzer-Eingaben besser verstanden werden. ').then(() => 'empfang');}          if ((~befehl.indexOf("--CHATOPS")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Steuern Sie Ihr Team mit #ChatOps! Wenn/sobald Ihr Team die einfache Kommunikation in Slack mit dessen vielfältigen Automatisierungs-Vorteilen genießt, können Sie Ihre Marketing-Technologien über Slack steuerbar und viel transparenter machen. Erfahren Sie mehr in unserem Artikel: [Button:Im Team mit Slack,http://robogeddon.de/artikel/#Slack]  ').then(() => 'empfang');}if ((~befehl.indexOf("--OPERATION")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Steuern Sie Ihr Team mit #ChatOps! Wenn/sobald Ihr Team die einfache Kommunikation in Slack mit dessen vielfältigen Automatisierungs-Vorteilen genießt, können Sie Ihre Marketing-Technologien über Slack steuerbar und viel transparenter machen. Erfahren Sie mehr in unserem Artikel: [Button:Im Team mit Slack,http://robogeddon.de/artikel/#Slack]  ').then(() => 'empfang');}          if ((~befehl.indexOf("--CONVERSATIONALDATA")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Chatbots können Daten in Konversationen zur Verfügung stellen: Zahlen, Texte, Berechnungen oder auch Inhalte. Dafür greifen Sie per --Schnittstelle auf Datenquellen zu und weben deren Antworten per Text und Bild in das Gespräch ein. ').then(() => 'empfang');}          if ((~befehl.indexOf("--KOMMANDOZEILE")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Programmierer lieben Sie, alle anderen kannten sie bisher nicht: Die Kommandozeile erlaubt Entwicklern seit MSDOS den direkten Zugriff auf Programme, Datenbanken und Server, indem diese klar strukturierte Befehle per Text eingeben. Chatbots heute nutzen das gleiche Prinzip, nur machen sie es leichter verständlich. ').then(() => 'empfang');}          if ((~befehl.indexOf("--BENACHRICHTIGUNG")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ein großer Vorteil von Chatbots ist, dass sie die Benachrichtigungs-Funktion der App auslösen, in der sie leben. So gelangen ihre Inhalte als #ThinMedia direkt auf den Bildschirm der Nutzer, wo sie gewohnheitsmäßig geöffnet (oder zumindest zur Kenntnis genommen) werden. ').then(() => 'empfang');}if ((~befehl.indexOf("--THIN")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ein großer Vorteil von Chatbots ist, dass sie die Benachrichtigungs-Funktion der App auslösen, in der sie leben. So gelangen ihre Inhalte als #ThinMedia direkt auf den Bildschirm der Nutzer, wo sie gewohnheitsmäßig geöffnet (oder zumindest zur Kenntnis genommen) werden. ').then(() => 'empfang');}          if ((~befehl.indexOf("--SMARTPHONE")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Chatbots sind gerade auf dem Smartphone stark: Sie integrieren sich nahtlos in Messaging-Apps, benötigen wenig Bildschirmfläche und machen Informations-Massen denkbar einfach zugänglich. Manche sagen ein Aussterben der nativen Apps voraus - ich denke, dass viele Apps (besonders Info-Apps wie News oder Wetter) in Chats umziehen, uns aber auch viele Apps erhalten bleiben werden. ').then(() => 'empfang');}if ((~befehl.indexOf("--MOBILE")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Chatbots sind gerade auf dem Smartphone stark: Sie integrieren sich nahtlos in Messaging-Apps, benötigen wenig Bildschirmfläche und machen Informations-Massen denkbar einfach zugänglich. Manche sagen ein Aussterben der nativen Apps voraus - ich denke, dass viele Apps (besonders Info-Apps wie News oder Wetter) in Chats umziehen, uns aber auch viele Apps erhalten bleiben werden. ').then(() => 'empfang');}          if ((~befehl.indexOf("--SOCIAL")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Messaging- und Social-Apps kämpfen um den Startscreen. Beide eint der Fokus auf Informations-Happen und ihre sehr soziale Natur - Facebook versucht mit Facebook Messenger bereits die Grätsche... Die US-Amerikaner benutzen die vier größten Messaging-Apps häufiger als die Apps der vie größten Sozialen Netzwerke. ').then(() => 'empfang');}if ((~befehl.indexOf("--SOZIAL")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Messaging- und Social-Apps kämpfen um den Startscreen. Beide eint der Fokus auf Informations-Happen und ihre sehr soziale Natur - Facebook versucht mit Facebook Messenger bereits die Grätsche... Die US-Amerikaner benutzen die vier größten Messaging-Apps häufiger als die Apps der vie größten Sozialen Netzwerke. ').then(() => 'empfang');}          if ((~befehl.indexOf("--SCHNITTSTELLE")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Marketing-Technologien und -Kanäle erlauben Chatbots den Zugriff auf ihre Daten per Schnittstelle (API): --ConversationalData. ').then(() => 'empfang');}if ((~befehl.indexOf("--API")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Marketing-Technologien und -Kanäle erlauben Chatbots den Zugriff auf ihre Daten per Schnittstelle (API): --ConversationalData. ').then(() => 'empfang');}          if ((~befehl.indexOf("--FRAMEWORK")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Eine technische Alternative zur --Schnittstelle (API) sind die Frameworks (SDKs), die Software gekappselt für den direkten Einsatz zur Verfügung stellen. ').then(() => 'empfang');}if ((~befehl.indexOf("--SDK")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Eine technische Alternative zur --Schnittstelle (API) sind die Frameworks (SDKs), die Software gekappselt für den direkten Einsatz zur Verfügung stellen. ').then(() => 'empfang');}          if ((~befehl.indexOf("--PLATTFORM")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Es gibt mehrere Plattformen, die die Einbindung eines Chatbots in mehrere Kanäle (wie Messenger- oder soziale Apps) ermöglichen. Mein Favorit ist --Smooch. ').then(() => 'empfang');}          if ((~befehl.indexOf("--KANAL")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Ein Chatbot lebt in einem oder mehreren Kanälen wie z.B. Messenger- oder soziale Apps. Die Kanäle unterscheiden sich funktional, aber auch inhaltlich in den Erwartungen und der Persona der jeweiligen Nutzer. ').then(() => 'empfang');}          if ((~befehl.indexOf("--TEXT")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--FRONTEND")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}if ((~befehl.indexOf("--BRANDING")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--PROGRAMMIERTHEIT")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--QUELLEN")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--PERSONALISIER")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--REICHWEITE")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--VIRAL")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Wie werden Bots viral? Sie sind wie gemacht für Word-of-Mouth (Empfehlungen) in ihren jeweiligen Kanälen. Dafür müssen sie nur zwei Dinge tun: Gute Inhalte, Mehrwerte oder Unterhaltung bieten und nach erfolgreicher Arbeit ihre Einladungsfunktion klar kommunizieren (meist eine URL oder ein Button in der ChatUI). ').then(() => 'empfang');}          if ((~befehl.indexOf("--INFLUENCER")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Influencer-Marketing ist eine tolle Sache - sofern es für die Nutzer (durch klare --Kennzeichnung) als Werbung verstanden wird. Es baut sich bereits Widerstand auf, weil Leute sich in der Nase herumgeführt fühlen, Tendenz: steigend. Ich sehe die als Chance für Chatbots des Typs Influencer, die deutlich ihre botonische Herkunft zeigen. ').then(() => 'empfang');}          if ((~befehl.indexOf("--KENNZEICHNUNG")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Chatbots erscheinen ein idealer Kanal für --Influencer-Marketing und Product Placement. Um dem Zorn der Massen zu entgehen, kennzeichnen Sie, sobald Ihr Chatbot Werbung macht. Die wichtigste Aufgabe von Chatbots ist das Erwartungs-Management! ').then(() => 'empfang');}          if ((~befehl.indexOf("--SKALIER")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--ECRM")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}if ((~befehl.indexOf("--CRM")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}if ((~befehl.indexOf("--DIALOGMARKET")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--ECOMMERCE")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}if ((~befehl.indexOf("--E-COMMERCE")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--OWNED")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' In der seit Web 2.0 klassischen Unterscheidung von Owned-, Earned- und Paid-Kanälen befinden sich Chatbots auf der Siegerseite: Sie können nicht einfach in einen Blog kopiert oder per Screenshot abgebildet werden - in Earned-Kanälen wird direkt auf Ihren Owned-Kanal verlinkt. ').then(() => 'empfang');}if ((~befehl.indexOf("--EARNED")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' In der seit Web 2.0 klassischen Unterscheidung von Owned-, Earned- und Paid-Kanälen befinden sich Chatbots auf der Siegerseite: Sie können nicht einfach in einen Blog kopiert oder per Screenshot abgebildet werden - in Earned-Kanälen wird direkt auf Ihren Owned-Kanal verlinkt. ').then(() => 'empfang');}if ((~befehl.indexOf("--PAID")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' In der seit Web 2.0 klassischen Unterscheidung von Owned-, Earned- und Paid-Kanälen befinden sich Chatbots auf der Siegerseite: Sie können nicht einfach in einen Blog kopiert oder per Screenshot abgebildet werden - in Earned-Kanälen wird direkt auf Ihren Owned-Kanal verlinkt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--CONTENT-MARKET")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--NEWSLETTER")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--HASHTAGS")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--PUSH")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}if ((~befehl.indexOf("--PUSH-K")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--PULL")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}if ((~befehl.indexOf("--PULL-K")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--OFFLINE")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--NLP")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' #NaturalLanguageProcessing erleichtert Chatbots die Konversation, indem es aus Nutzer-Eingaben mögliche Befehle ableitet. Im (sehr) einfachen Beispiel: Ja und Sicher und Klar entsprechen alle einem Ja. NLP kann oft mittels Plugin integriert werden. ').then(() => 'empfang');}          if ((~befehl.indexOf("--NLU")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' #NaturalLanguageUnderstanding erlaubt Chatbots, die Intentionen des Nutzers aus dessen Eingaben abzuleiten. Im (sehr) einfachen Beispiel: Sicher nicht entspricht einem Nein, obwohl Sicher eigentlich einem Ja entspricht. ').then(() => 'empfang');}          if ((~befehl.indexOf("--PRODUKT")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--NODEJS")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}if ((~befehl.indexOf("--NODE-JS")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--WIDGET")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}if ((~befehl.indexOf("--IFRAME")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}if ((~befehl.indexOf("--I-FRAME")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--CROSS-PLAT")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--BEDIEN")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--STRUKTURIERT")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--UNSTRUKTURIERT")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--CLOUD")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}if ((~befehl.indexOf("--SERVER")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--LOKAL")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--LANDINGPAGE")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}if ((~befehl.indexOf("--KAMPAGNE")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--APP")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}if ((~befehl.indexOf("--NATIVE-APP")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--SCRIPT")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}if ((~befehl.indexOf("--SKRIPT")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}if ((~befehl.indexOf("--BAUM")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--CONTENT-NAV")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--AUTOVERVOLL")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--PAYMENT")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--ADMIN")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--ERWARTUNGS-MANAG")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Erwartungs-Management ist das A und O jedes Chatbots: Machen Sie den Leuten das Gespräch leicht, indem Sie ihre Absichten lenken und die Optionen klar formulieren. ').then(() => 'empfang');}          
          if ((~befehl.indexOf("--SMOOCH")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--FACEBOOK")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--TWITTER")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--TELEGRAM")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--KIK")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--WHATSAPP")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--IMESSAGE")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}if ((~befehl.indexOf("--NACHRICHTEN")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--SMS")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}if ((~befehl.indexOf("--MMS")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}if ((~befehl.indexOf("--TWILIO")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--SKYPE")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--SNAPCHAT")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--SLACK")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--HIPCHAT")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--EMAIL")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}if ((~befehl.indexOf("--E-MAIL")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--OFFICE")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--SALESFORCE")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--SHOPIFY")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--TINDER")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--WECHAT")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}if ((~befehl.indexOf("--WE-CHAT")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          
          
       // -----------------
       // Links
       // -----------------
          
          if ((~befehl.indexOf("--LINKS")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}if ((~befehl.indexOf("--LINKLIST")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}if ((~befehl.indexOf("--LINK-LIST")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--MEDIUM")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--HIGHLIGHTS")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--KOMMENTARE")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          
       // -----------------
       // Vorlage
       // -----------------
          
          if ((~befehl.indexOf("--BEFEHL")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--BEFEHL")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}          if ((~befehl.indexOf("--BEFEHL")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Folgt. ').then(() => 'empfang');}			 
       // -----------------
       // System
       // -----------------
       
          if ((~befehl.indexOf("--BEFEHL")) && (botsan == true)) { versuch = true; return bot.say(EmpfangsBot+' Funktionen: --Kontakt, --Inhalt, --Mobil und --Über. ').then(() => 'empfang');}          
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
                   bot.say(EmpfangsBot+'Suchen Sie die --Befehle? Oder schalten Sie mich aus, indem Sie --Bots-aus sagen.'); 
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
      