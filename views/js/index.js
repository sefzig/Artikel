
 // ------------------------
 // Initialisierung
 // ------------------------
    
 // Jquery ready
    $(document).ready(function() { 
       
    // Mobile Weiche
       var istMobil = {
       android:    function() { return navigator.userAgent.match(/Android/i); },
       blackberry: function() { return navigator.userAgent.match(/BlackBerry/i); },
       ios:        function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
       ipad:       function() { return navigator.userAgent.match(/iPad/i); },
       iphone:     function() { return navigator.userAgent.match(/iPhone/i); },
       ipod:       function() { return navigator.userAgent.match(/iPod/i); },
       opera:      function() { return navigator.userAgent.match(/Opera Mini/i); },
       windows:    function() { return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i); },
       any:        function() { return (istMobil.android() || istMobil.blackberry() || istMobil.iphone() || istMobil.ipod() || istMobil.opera() || istMobil.windows()); }
       };
   
    // Mobile Anpassungen
       if (istMobil.android())    { $("body").attr("data-mobil", "android"); }
       if (istMobil.blackberry()) { $("body").attr("data-mobil", "blackberry"); }
       if (istMobil.ios())        { $("body").attr("data-mobil", "ios"); }
       if (istMobil.ipad())       { $("body").attr("data-mobil", "ipad"); }
       if (istMobil.ipod())       { $("body").attr("data-mobil", "ipod"); }
       if (istMobil.iphone())     { $("body").attr("data-mobil", "iphone"); }
       if (istMobil.opera())      { $("body").attr("data-mobil", "opera"); }
       if (istMobil.windows())    { $("body").attr("data-mobil", "windows"); }
       
    // Titel aus Config einsetzen
       document.title = config["anwendung"]["name"];
       
    // Client aus Config
       var client = config["default"]["client"];
       
    // Client-Templates einsetzen
       $("#daten").load("client/_"+client+"/daten.html", function() {
          
          $("#menu").load("client/_"+client+"/menu.html", function() {
             
          // Anwendung laden
             bereit();
             
          });
          
       });
       
    // Widget-Größe -> Mobil
       $(window).resize(function() {
          if(this.resizeTO) clearTimeout(this.resizeTO);
          this.resizeTO = setTimeout(function() {
             $(this).trigger('resizeEnd');
          }, 500);
       });
       $(window).bind('resizeEnd', function() {
          breite = $(this).width();  breite = Number(breite);
          hohe =   $(this).height(); hohe =   Number(hohe);
          mobil =  $("body").attr("data-mobil");
          console.log(breite+"x"+hohe);
          $("body").attr("data-breite", breite);
          $("body").attr("data-hohe", hohe);
          if      (((!mobil) || (mobil == "") || (mobil == "widget")) && (breite < 401)) { $("body").attr("data-mobil", "widget"); }
          else if (((!mobil) || (mobil == "") || (mobil == "widget")) && (breite > 400)) { $("body").attr("data-mobil", ""); }
       });
    
    });
    
 // Anwendung starten
    function bereit() {
       
    // Variablen
       var selektor = "";
       var befehl = "";
       var starten = "";
       var ansicht = "";
       var startklick = "";
       
    // Stil laden
       stil();
       
    // Datenfelder ausfüllen
       cookie("vorname");
       cookie("nachname");
       cookie("email");
       
    // Chat starten
       starten = config["default"]["ansicht"];
       ansicht = getParameters("v");
       if (ansicht == "chat")  { starten = "chat"; }
       if (ansicht == "daten") { starten = "daten"; }
       window.setTimeout(function() { start(starten); }, 100);
       
    // Benutzeroberfläche
       selektor = "input[data-start], img[data-start], a[data-start], td[data-start]";
       $(selektor).click(function(e) {
          
       // Elemente
          startklick = $(this).attr("data-start");
          
       // Navigation
          start(startklick);
       // console.log("> Start: "+startklick);
          
       // Klick verhindern
          e.preventDefault();
          
       });
       
    // Menü per Default anzeigen
    // menu("an");
       
    // Menü auswählen und anzeigen
       menue = getParameters("menu");
       if ((!menue) || (menue == "")) { 
          menue = config["default"]["menu"];
       }
       $("#menu > div").css("display", "none");
       $("#menu > ."+menue).css("display", "block");
       
    // Befehle im Menü
       selektor = "#seite > #menu div > div button";
       $(selektor).click(function() {
          
          datastil = $(this).attr("data-stil");
          datanav = $(this).attr("data-nav");
          
          if ((datastil) && (datastil != "")) { 
             
             stil(datastil);
             
          }
          else if ((datanav) && (datanav != "")) { 
             
          // alert(window.history.length+", "+window.history.state);
             window.history.go(datanav);
             
          }
          else {
             
             befehl = $(this).text();
             befehlerKlick(befehl);
             
          }
          
       });
       
    // Menü-Button default
       var menuConfig = config["default"]["button"];
       if (menuConfig == "an") { $("#start").fadeIn(); }
       
    // Befehler-Button default
       var befehlerConfig = config["default"]["befehler"];
       if (befehlerConfig == "an") { $("#befehlleiste").fadeIn(); }
       
    // Intro-Texte einsetzen
       $("#namenEingeben").html(texte["intro"]["namenEingeben"]);
       
    // Hash-Navigation
       window.onhashchange = function() {
       
          befehl_letzter = $("body").attr("data-befehl-letzter");
          befehl_neuer = window.location.hash;
          befehl_neuer = befehl_neuer.replace("#","");
          
          if ((befehl_neuer != befehl_letzter) && (befehl_neuer) && (befehl_neuer != "")) {
             
          // Nachricht senden
             befehlen(befehl_neuer);
             
          }
          
       };
       
    }
    
 // Chat starten
    function start(methode) {
       
    // Variablen zurücksetzen
       var vorname = "";
       var nachname = "";
       var email = "";
       var sagen = "";
       
    // Zu Daten umleiten falls Namenzwang und Namenlos
       var namezwang = config["default"]["name"];
       if ((methode == "chat") && (namezwang == "an")) {
          
          bereit = "ja";
          vorname =  $("#vornameDaten").val();  if ((vorname  == daten["label"]["vorname"])  || (!vorname)  || (vorname  == "")) { bereit = "nein"; }
          nachname = $("#nachnameDaten").val(); if ((nachname == daten["label"]["nachname"]) || (!nachname) || (nachname == "")) { bereit = "nein"; }
          
       // Methode zurücksetzen
          if (bereit == "nein") { methode = "daten"; }
          
       }
       
    // Chat starten
       if (methode == "chat") {
          
       // Debuggen
       // console.log('\n\nNeues Gespräch\n');
          
          var vornameZufall = "Nutzer";
          var nachnameZufall = Math.floor(Math.random()*999999);
          
       // Daten aus Formular übernehmen
          vorname =  $("#vornameDaten").val();  if (vorname  == daten["label"]["vorname"])  { vorname =  vornameZufall; }
          nachname = $("#nachnameDaten").val(); if (nachname == daten["label"]["nachname"]) { nachname = nachnameZufall; }
          email =    $("#emailDaten").val();    if (email    == daten["label"]["email"])    { email =    ""; }
          
       // Smooch Js
       // https://github.com/smooch/smooch-js
          var skPromise = Smooch.init({ 
             appToken: config["smooch"]["appToken"],
             embedded: true,
             givenName: vorname,
             surname: nachname,
             customText: {
                headerText:                    texte["chat"]["headerText"],
                inputPlaceholder:              texte["chat"]["inputPlaceholder"],
                sendButtonText:                texte["chat"]["sendButtonText"],
                introText:                     texte["chat"]["startText"],
                settingsText:                  texte["chat"]["settingsText"],
                settingsReadOnlyText:          texte["chat"]["settingsReadOnlyText"],
                settingsInputPlaceholder:      texte["chat"]["settingsInputPlaceholder"],
                settingsSaveButtonText:        texte["chat"]["settingsSaveButtonText"],
                settingsHeaderText:            texte["chat"]["settingsHeaderText"],
                settingsNotificationText:      texte["chat"]["settingsNotificationText"],
                actionPaymentError:            texte["chat"]["actionPaymentError"],
                actionPaymentCompleted:        texte["chat"]["actionPaymentCompleted"],
                messageError:                  texte["chat"]["messageError"],
                invalidFileError:              texte["chat"]["invalidFileError"],
                messageIndicatorTitleSingular: texte["chat"]["messageIndicatorTitleSingular"],
                messageIndicatorTitlePlural:   texte["chat"]["messageIndicatorTitlePlural"]
             }
          })
          .then(function () { window.setTimeout(function() { 
             
          // Addon nach 22.06.16
             anpassen("nachInit");
             
             sagen = getParameters("weiter");
             if ((sagen) && (sagen != "")) { 
             
                window.setTimeout(function() { 
                   
                   nachricht = texte["chat"]["weiterleiten"]; 
                   nachricht = nachricht+"  "; 
                // Smooch.sendMessage(" "+nachricht+" "); 
                   
                   window.setTimeout(function() { 
                      
                      Smooch.sendMessage(" "+sagen+" ");
                      
                   }, 1000);
                   
                }, 1000);
                
             }
             
             var gut =      getParameters("gut");      if ((gut)      && (gut      != "")) { window.setTimeout(function() {  Smooch.sendMessage(" Finde ich       gut: "+schlecht+" "); }, 1000); }
             var schlecht = getParameters("schlecht"); if ((schlecht) && (schlecht != "")) { window.setTimeout(function() {  Smooch.sendMessage(" Finde ich nicht gut: "+gut     +" "); }, 1000); }
             var neutral =  getParameters("neutral");  if ((neutral)  && (neutral  != "")) { window.setTimeout(function() {  Smooch.sendMessage("                      "+neutral +" "); }, 1000); }
             
          }, 333); }); // Addon nach 22.06.16, vorher 100
          
       // Smooch.open();
          Smooch.render(document.getElementById('chatContainer'));
          Smooch.on('message:sent', function(message) {
             
          // console.log('- Nutzer hat eine Nachricht gesendet');
          // $(".sk-messages").append('<img src="img/ui/Schreiben.gif" class="typing" />');
             
             Cookies.set(daten["cookie"]["gesprochen"], "ja");
             $("#menu").css("display","block");
             $('body').animate({scrollLeft: '0px'}, 'slow');
             $('#sk-conversation').animate({scrollTop: $('.sk-messages').height()}, 'slow');
             
          });
          Smooch.on('message:received', function(message) {
             
          // $(".typing").remove();
             window.setTimeout(function() { anpassen("nachNachricht"); }, 1); // Addon nach 22.06.16
             
          // console.log('- Nutzer hat eine Nachricht erhalten');
             
          });
          
       // Konversation rendern
          anpassen(); // nach 22.06.16 auskommentiert
          
       // Inhalt anzeigen
          $("#seite > #"+methode).fadeIn(300, function() {
          
          // Daten ausblenden
             $("#seite > #daten").fadeOut();
       
          });
       
       // Fokus auf Eingabe
          var mobil = $("body").attr("data-mobil");
          if (mobil == "") { $("#sk-footer .message-input").focus(); }
       // window.setTimeout(function() { blink(); }, 2000);
          
       }
       
    // Daten anzeigen starten
       if (methode == "daten") {
          
          var gesprochen = Cookies.get(daten["cookie"]["gesprochen"]);
          var ansicht =    config["default"]["ansicht"];
          
          if (gesprochen == "ja") {
             
             start("chat");
             
          }
          else if (ansicht == "daten") {
             
          // Inhalt anzeigen
             $("#seite > #"+methode).css("display","block");
          
             $('#daten input[type=text], #menu input[type=text]').on('keydown', function(e) {
                
                if (e.which == 13) {
                   
                   start("chat");
                   e.preventDefault();
                   
                }
                
             });
          
             $('#daten input.nachname').on('keydown', function(e) {
                
                if (e.which == 9) {
                   
                   e.preventDefault();
                   
                }
                
             });
             
          }
          else if (ansicht == "chat") {
	          
             start("chat");
             
          }
          else {
	          
             alert("komisch...");
             
          }
          
       }
       
    // Menü anzeigen starten
       if (methode == "menu") {
          
          menu();
          
       }
       
    // CDN-Bilder Pfad ergänzen
       $("[rel='cdn']").each(function() {
          
          src = $(this).attr("src");
          cdn = config["anwendung"]["cdn"];
          $(this).attr("src", cdn+""+src).attr("rel", "");
          
       });
       
    }
    
 // Befehler-Leiste laden
    function befehlerLaden() {
       
       var stand = $("body").attr("data-befehler");
       if (stand == "true") {} else {
          
       // Befehler-Template laden
          template = templates["befehl"]["leiste"];
          if ($.isArray(template)) {
             template = template.join("a-f-z");
             template = template.replace(/a-f-z/g, "");
          }
          
       // Template einsetzen
          selektor = "#sk-footer";
          $(selektor).append(template);
       // console.log("Setze Befehler-Leiste ein: "+template);
          
       // Status merken
          $("body").attr("data-befehler", "true");
          
       // Befehlleiste erzeugen
       // Folgt...
       // alert("Befehler laden: "+inhalt);
          
       // Befehler-Button anzeigen
          $("#befehlleiste").css("display", "block");
          
          selektor = "#sk-footer";
          $(selektor).mouseenter(function() {
             $("#befehlleiste input").addClass("aktiv");
          });

          $(selektor).mouseleave(function() {
             $("#befehlleiste input").removeClass("aktiv");
             befehlerSchalter("aus");
          });
          
       }
       
    }
    
 // ------------------------
 // Hilfs-Funktionen
 // ------------------------
    
 // Texte anpassen
    function inhalt(methode, text_string, var1, var2, var3, var4) {
       
       text_string = " "+text_string+" ";
       var inhalte = text_string;
       var inhalt = "";
       
       if (methode == "befehl") {
       
       // Konfiguration übernehmen
          var befehl_template = templates["befehl"]["link"];
       // console.log("befehl_template: "+befehl_template);
          var befehl_prefix1 = config["syntax"]["befehlPrefix1"];
          var befehl_prefix2 = config["syntax"]["befehlPrefix2"];
          
       // Befehle anpassen
          inhalte = inhalte.replace(befehl_prefix2,befehl_prefix1);
          inhalte = inhalte.split(befehl_prefix1);
          for (i = 1; i < inhalte.length; i++) {
             
          // Befehl-Template übernehmen
             befehl_button = befehl_template;
             
          // Inhalt zurücksetzen
             inhalt = "";
             
          // Befehl freistellen
             inhalt = inhalte[i].split(/,|;|:|\.|\<|!|\?| /)[0];
          // console.log("\ninhalt: "+inhalt);
             
             if ($.isArray(befehl_button)) { 
                befehl_button = befehl_button.join("a-f-z");
                befehl_button = befehl_button.replace(/a-f-z/g, "");
             // console.log("befehl_button array: "+befehl_button);
             }
             
          // Template füllen
             befehl_button = befehl_button.replace(/%inhalt%/g, inhalt);
          // console.log("befehl_button neu: "+befehl_button);
             
          // Template einsetzen
             text_string = text_string.replace(befehl_prefix1+""+inhalt, befehl_button); // ..?
             text_string = text_string.replace(befehl_prefix2+""+inhalt, befehl_button); // ..?
          // console.log("text_string: "+text_string+"");
             
          // Befehler laden
             befehlerLaden();
       
          // Befehler hinzufügen
             befehlerNeu(inhalt);
             
          }
          
       }
       
       if ((methode == "modul") && (var1) && (var1 != "")) {
          
       // Funktions-Parameter
          var modul = var1;
          
       // Modulnamen kamelisieren
       // console.log("modul: "+modul);
       // modul = modul.charAt(0).toUpperCase() + modul.slice(1);
       // console.log("-> modul: "+modul);
          
       // Klasse in Kleinbuchstaben
          var klasse = var1;
          klasse = klasse.toLowerCase();
          
       // Cta-Text von URL trennen
          if ((modul == "Button") || (modul == "Text") || (modul == "Textzeit") || (modul == "Textmobil") || (modul == "Link") || (modul == "Textlink") || (modul == "Linkliste") || (modul == "Email") || (modul == "Telefon")) { 
             
          // console.log("> Button Var: "+var1);
             var buttons = text_string.split("["+modul+":");
             if (buttons[1]) { 
                var buttons2 = buttons[1].split("]");
                if (buttons2[1]) { 
                   var buttons3 = buttons2[0].split(",");
                   if (buttons3[2]) {      var var1 = buttons3[0];   var var2 = ""+buttons3[1]; var var3 = ""+buttons3[2];
                   }
                   else if (buttons3[1]) { var var1 = buttons3[0];   var var2 = ""+buttons3[1]; var var3 = "";
                   }
                   else {                  var var1 = buttons2[0];   var var2 = ""+buttons2[0]; var var3 = ""; }
                }
                else {                     var var1 = "Link öffnen"; var var2 = ""+var1;        var var3 = ""; }
             }
             else {                        var var1 = "Link öffnen"; var var2 = ""+var1;        var var3 = ""; }
             
          // console.log("> Variable 1: "+var1);
          // console.log("> Variable 2: "+var2);
          // console.log("> Variable 3: "+var3);
             
          }
          
       // Template laden und anpassen
          var template = templates["modul"][modul];
          
          if ($.isArray(template)) {
             template = template.join("a-f-z");
             template = template.replace(/a-f-z/g, "");
          }
          template = template.replace(/%var1%/g, var1);
          template = template.replace(/%var2%/g, var2);
          template = template.replace(/%var3%/g, var3);
          
       // Modul anpassen
          inhalte = inhalte.split("["+modul+":");
          for (i = 1; i < inhalte.length; i++) {
             
          // Inhalt freistellen
             var inhalt = inhalte[i].split("]")[0];
             
          // Template anpassen
             template = template.replace(/%klasse%/g, klasse);
             template = template.replace(/%inhalt%/g, inhalt);
          // template = template.replace(/%cta%/g, cta);
             
          // Neuen Text anpassen
             text_string = text_string.replace("["+modul+":"+inhalt+"]", template);
             
          // Debuggen
          // console.log("- "+modul+" angepasst: "+inhalt);
             
          // Zurücksetzen
             var inhalt = "";
             
          }
          
       }
       
       if ((methode == "javascript") && (var1) && (var1 != "") && (var2) && (var2 != "")) {
          
       // Funktions-Parameter
          var funktionen = var1;
          var meldung = var2;
             
       // Javascript ausführen
          inhalte = inhalte.split("[Javascript:");
          for (i = 1; i < inhalte.length; i++) {
             
          // Funktions-Namen freistellen
             var skript = inhalte[i].split("]")[0];
             
             var aufruf = skript.split("(");
             if (aufruf[1]) { 
                var funktion = aufruf[0];
                var params = aufruf[1];
                params = params.replace(")", "");
                
                var ersetzen = funktion+"("+params+")";
             }
             else { 
                var funktion = skript;
                var params = "";
                
                var ersetzen = skript;
             }
             
          // Neuen Text anpassen
             text_string = text_string.replace("[Javascript:"+ersetzen+"]", meldung);
             
          // Bekannte Funktionen ausführen
             funktionen[funktion](params);
             
          // Debuggen
          // console.log("- Javascript ausgeführt: "+skript);
             
          // Zurücksetzen
             var skript = "";
             var funktion = "";
             var params = "";
             
          }
          
       }
       
       if (methode == "direkt") {
          
       // Shortcode entfernen (wird von Slack als Highlight-Word erkannt)
          text_string = text_string.replace(/\[Direkt:.+\]/, "");
          
       }
       
       if ((methode == "bot") && (var1) && (var1 != "") && (var2) && (var2 != "") && (var3) && (var3 != "") && (var4) && (var4 != "")) {
          
       // Funktions-Parameter
          var kurzel = var1;
          var name = var2;
          var zufall = var3;
          var id = var4;
             
       // Wenn Text den Botnamen enthält
          bot_alt = inhalte; bot_neu = inhalte.replace("["+var1+"] ","");
          if (bot_neu != bot_alt) {
             
          // Konfiguration
             var pfad = config["anwendung"]["cdn"]+"Displaybild_"+kurzel+".png";
             var wrap = '<span class="roboter" onclick="befehlen(\''+id+'\');"></span>';
             
          // Bot-Inhalte anpassen
             $(".sk-from.bot"+zufall).html(name);
             $(".sk-msg-avatar.bot"+zufall).attr("src", pfad);
          // $(".sk-msg-avatar-placeholder.bot"+zufall).append('<img src="'+pfad+'" class="sk-msg-avatar bot"'+zufall+'">');
             
          // Neuen Text anpassen
             text_string = text_string.replace("["+kurzel+"] ","");
             
          // Debuggen
          // console.log("- Bot angepasst: "+id);
             
             $("#seite > #menu li button").removeClass("aktiv");
          // $("#seite > #menu li button:contains('"+id+"')").addClass("aktiv");
             $("#seite > #menu li button").filter(function() { return ($(this).text() === id); }).addClass("aktiv");
             
             window.setTimeout(function() { 
                
                $(".sk-from.bot"+zufall).wrap(wrap);
                $(".sk-msg-avatar.bot"+zufall).wrap(wrap);
                
             }, 1000);
             
          }
          
       }
       
       return text_string; 
       
    }
    
 // Inhalte anpassen
    function anpassen(methode) {
       
    // Addon nach 22.06.16
       addon(methode);
       
    // Noch nicht angepasste anpassen
       var selektor = ".sk-msg > span > span > span:not([data-angepasst])";
       $(selektor).each(function() {
          
       // Inhalte lesen
          var text_alt = $(this).html();
          
       // Neuen Inhalt beginnen // String wird von allen folgenden Funktionen angepasst
          var text_neu = text_alt;
          
       // 1 Zufallszahl für jede Nachricht
          var zufall = Math.floor(Math.random()*999999);
          
       // Zugelassene Javascript-Funktionen
          var funktionen = {
             alert:        function (b) { alert(b); },
             konsole:      function (b) { konsolen(b); },
             blinken:      function ()  { blink(); },
             cookies:      function (b) { cookies(b); },
             menu:         function (b) { menu(b); },
             stil:         function (b) { stil(b); }
          };
          
       // Bot-Inhalte markieren (vor 22.06.16)
       // $(this).parent().parent().parent().parent().children().filter(".sk-from").addClass("bot"+zufall);
       // $(this).parent().parent().parent().parent().parent().children().filter("img").addClass("bot"+zufall);
          
       // Bot-Inhalte markieren (nach 22.06.16)
          $(this).parent().parent().parent().parent().parent().children().filter(".sk-from").addClass("bot"+zufall);
          $(this).parent().parent().parent().parent().parent().children().filter("img").addClass("bot"+zufall);
          
       // Inhalte anpassen
          text_neu = inhalt("befehl", text_neu);
          text_neu = inhalt("modul", text_neu, "Link");
          text_neu = inhalt("modul", text_neu, "Textlink");
          text_neu = inhalt("modul", text_neu, "Text");
          text_neu = inhalt("modul", text_neu, "Bild");
          text_neu = inhalt("modul", text_neu, "Qr");
          text_neu = inhalt("modul", text_neu, "Telefon");
          text_neu = inhalt("modul", text_neu, "Email");
          text_neu = inhalt("modul", text_neu, "Button");
          text_neu = inhalt("modul", text_neu, "Iframe");
          text_neu = inhalt("modul", text_neu, "Audio");
          text_neu = inhalt("modul", text_neu, "Youtube");
          text_neu = inhalt("modul", text_neu, "Linkliste"); 
          text_neu = inhalt("modul", text_neu, "Textzeit"); 
          text_neu = inhalt("modul", text_neu, "Textmobil"); 
          text_neu = inhalt("direkt", text_neu, "Direkt"); 
          text_neu = inhalt("javascript", text_neu, funktionen, " ");
          
       // Bots anpassen
          var text_merken = text_neu;
          text_neu = inhalt("bot", text_neu, "AndreasSefzig",  "Andreas Sefzig",         zufall, "Sefzig");
          text_neu = inhalt("bot", text_neu, "EmpfangsBot",    "Andreas Sefzigs Bot",    zufall, "Empfang");
          
       // Chatraum
       // text_neu = inhalt("bot", text_neu, "SefzigBot",      "Andreas Sefzigs Bot",    zufall, "Sefzig");
       // text_neu = inhalt("bot", text_neu, "VerkaufsBot",    "Barbara, Verkaufs-Bot",  zufall, "Verkauf");
       // text_neu = inhalt("bot", text_neu, "MarketingBot",   "Cynthia, Marketing-Bot", zufall, "Marketing");
          
       // Robogeddon
       // text_neu = inhalt("bot", text_neu, "EmpfangsBot",    "Alice, Empfangs-Bot",    zufall, "Empfang");
       // text_neu = inhalt("bot", text_neu, "BeratungsBot",   "Barbara, Beratungs-Bot", zufall, "Beratung");
       // text_neu = inhalt("bot", text_neu, "TechnikBot",     "Cynthia, Technik-Bot",   zufall, "Technik");
       // text_neu = inhalt("bot", text_neu, "KreationsBot",   "Doris, Kreations-Bot",   zufall, "Kreation");
       // text_neu = inhalt("bot", text_neu, "KonzeptionsBot", "Erika, Konzeptions-Bot", zufall, "Konzeption");
       // text_neu = inhalt("bot", text_neu, "StrategieBot",   "Feline, Strategie-Bot",  zufall, "Strategie");
          
       // Bots zusammenfassen
          window.setTimeout(function() { 
             
             $(".sk-from").each(function() {
                
                var dieser =    $(this).html();
             // var vorganger = $(this).parent().parent().prev().find(".sk-from").html(); // vor 22.06.16
                var vorganger = $(this).parent().prev().find(".sk-from").html(); // nach 22.06.16
             // console.log("- "+vorganger+" = "+dieser+"?");
             
             // Bei folgendem Absender
                if (vorganger == dieser) {
                   
                // Namen hier verbergen
                   $(this).css("display","none");
                // $(this).parent().parent().css("padding-top","10px"); // vor 22.06.16
                   $(this).parent().css("padding-top","10px"); // nach 22.06.16
                   
                // Avatar davor verbergen
                // $(this).parent().parent().prev().children().filter("img.sk-msg-avatar").attr("src", config["anwendung"]["cdn"]+"Displaybild_LeerBot.png"); // vor 22.06.16
                // $(this).parent().prev().children().filter("img.sk-msg-avatar").attr("src", config["anwendung"]["cdn"]+"Displaybild_LeerBot.png"); // nach 22.06.16
                   $(this).parent().prev().find(".sk-msg-avatar").css("display", "none"); // nach 22.06.16
                   
                // Pfeilchen davor verbergen
                // $(this).parent().parent().prev().find(".sk-msg").addClass("frei"); // vor 22.06.16
                   $(this).parent().prev().find(".sk-msg").addClass("frei"); // nach 22.06.16
                // $('head').append("<style>.sk-msg.frei::after{ border: none !important }</style>");
                   
                }
                else {
                   
                // console.log("> Anderer Vorganger: "+vorganger+" != "+name+"");
                   $(this).parent().prev().find(".sk-msg-avatar").css("display", "none"); // nach 22.06.16
                   
                }
                
                vorganger = "";
                dieser = "";
                
             });
             
          }, 333);
       
       // Default-Bot
          if (text_neu == text_merken) { text_neu = "[AndreasSefzig] "+text_neu; }
          text_neu = inhalt("bot", text_neu, "AndreasSefzig",  "Andreas Sefzig",         zufall, "Sefzig");
          
       // Angepasste Inhalte schreiben
          $(this).html(text_neu);
          
       // Als angepasst markieren
          $(this).attr("data-angepasst", "true");
          $(this).parent().parent().parent().parent().parent().attr("data-fromt", "true");
          
       });
       
    }
    
 // ------------------------
 // Client-Funktionen
 // ------------------------
    
 // Befehler füllen
    function befehlerNeu(inhalt) {
    // alert("stand: "+stand+", inhalt: "+inhalt);
    
    // Bisherigen Befehl löschen
       $(".befehle .befehler[rel='"+inhalt+"']").remove();
       
    // Befehler-Template laden
       template = templates["befehl"]["befehler"];
       if ($.isArray(template)) {
          template = template.join("a-f-z");
          template = template.replace(/a-f-z/g, "");
       }
       
    // Template ausfüllen
       template = template.replace(/%inhalt%/g, inhalt);
    // console.log("Setze neuen Befehler ein: "+template);
       
    // Template einsetzen
       selektor = ".befehle > div";
       $(selektor).prepend(template);
          
    }
    
 // Befehler-Klicks
    function befehlerKlick(inhalt) {
       
    // console.log("Befehler geklickt: "+inhalt);
       befehlen(inhalt);
       
    }
    
 // Befehler-Klicks
    function befehlerSchalter(methode) {
       
     // console.log("befehlerSchalter('"+methode+"')");
       if ((!methode) || (methode == "")) {
          
          var stand = $("#befehlleiste input").val();
          if (stand == "i") { methode = "an"; }
          else { methode = "aus"; }
       
       }
       
       if (methode == "an") {
          $(".befehle").off().fadeIn();
          $("#befehlleiste input").val("x");
       }
       else {
          $(".befehle").off().fadeOut();
          $("#befehlleiste input").val("i");
       }
       
    // :/
       window.setTimeout(function() { $(".befehle > div").off().css("display","block"); },1);
       
    }
    
 // Klicks auf Befehle
    function befehlen(befehl) {
       
    // Sperrung?
       gesperrt = $("body").attr("data-befehl-sperren");
       
       if (gesperrt != "an") {
          
       // Nachricht senden
       // $(".sk-msg-wrapper:last-child").insertAfter("<span>Letzter!</span>"); // Test nach 22.06.16
          window.Smooch.sendMessage(befehl);
          
       }
       
    // Befehl säubern
       befehl = befehl.replace(config["syntax"]["befehlPrefix1"],config["syntax"]["befehlErsatz"]);
       befehl = befehl.replace(config["syntax"]["befehlPrefix2"],config["syntax"]["befehlErsatz"]);
       
    // Hash-Navigation aktualisieren
       window.location.hash = "#"+befehl;
       
    // Zurück-Tmp aktualisieren
       $("body").attr("data-befehl-letzter", befehl);
       
    // "Doppelklicks" verhindern
       $("body").attr("data-befehl-sperren", "an");
       window.setTimeout(function() { $("body").attr("data-befehl-sperren", "aus"); }, 1000);
       
    }
    
 // Helper: Cookie setzen
    function cookie(name) {
       
       if (name) {
          
          var wert = "";
          
          if ((!wert) || (wert == ""))  { wert = Cookies.get(daten["cookie"][name]); } 
          if ((!wert) || (wert == ""))  { wert = getParameters(name); } 
          if ((!wert) || (wert == ""))  { wert = daten["label"][name]; } 
          
          console.log("Cookie Wert: "+wert);
          
          $("#"+name+"Daten, #"+name+"Menu").val(wert);
          $("#"+name+"Daten").trigger("keydown");
          
          
          $("#"+name+"Daten, #"+name+"Menu").change(function(){  
             
             var wert_neu = $(this).val();
             
             if ((wert_neu) && (wert_neu != "") && (wert_neu != daten["label"][name]) && (wert_neu != daten["default"][name])) {
                
                Cookies.set(daten["cookie"][name], wert_neu);
                $("#"+name+"Daten, #"+name+"Menu").val(wert_neu).trigger("keydown");
                
             }
             else {
                
                $("#"+name+"Daten, #"+name+"Menu").val(daten["label"][name]);
                $("#"+name+"Daten").trigger("keydown");
                
             }
             
             if      (name == "vorname")  { update = { givenName: wert_neu }; }
             else if (name == "nachname") { update = { surname:   wert_neu }; }
             else if (name == "email")    { update = { email:     wert_neu }; }
             else              { update = { properties: { name: wert_neu } }; } 
             window.Smooch.updateUser(update);
          // console.log("Cookie (change): Smooch-User '"+name+"' Info: "+wert_neu);
             
          });
          
          wachsen(""+name+"Menu", 100);
          
       // console.log("cookie input wert: "+wert);
          return wert;
          
       }
       
    }
    
 // Inhalt in Fenster öffnen
    function fenster(methode, kurzel, ansicht) {
       
       if ((!ansicht) || (ansicht == "")) { var ansicht = "einbindung"; }
       
    // URL errechnen
       if (methode == "link")  { var url = "http://sefzig.net/link/"+kurzel+"/"; }
       if (methode == "links") { var url = "http://sefzig.net/link/liste/"+kurzel+"/?ansicht=ansehen"; }
       if (methode == "text")  { var url = "http://sefzig.net/text/"+kurzel+"/#"+ansicht; }
       if (methode == "bild")  { var url = kurzel; }
       
       if ((methode == "link") || (methode == "links") || (methode == "text")) {
          
       // Bild verbergen
          $("#fenster td > img").css("display", "none");
          
       // Iframe laden
          $("#fenster td > iframe").attr("src", url);
          $("#fenster td > iframe").css("display", "block");
          
       }
       else if (methode == "bild") {
          
       // Iframe verbergen
          $("#fenster td > iframe").css("display", "none");
          
       // Bild laden
          $("#fenster td > img").attr("src", url);
          $("#fenster td > img").css("display", "block");
          
       }
       
    // Ebene öffnen
       $("#fenster").fadeIn(500);
          
       return false;
       
    }
    
 // Fenster schliessen
    function fensterSchliessen() {
              
       $('#fenster td > iframe, #fenster td > img').attr('src',''); 
       $('#fenster').css('display','none');
              
    }
    
 // ------------------------
 // Chat-Funktionen
 // ------------------------
    
 // Stil (ggfls. auswählen und) anwenden
    function stil(auswahl) {
       
       zufall = 4;
       dir = "stil";
       
       if ((!auswahl) || (auswahl == "")) { auswahl = Cookies.get(daten["cookie"]["stil"]); }
       if ((!auswahl) || (auswahl == "")) { auswahl = getParameters("stil"); }
       if ((!auswahl) || (auswahl == "")) { auswahl = config["default"]["stil"]; }
       
       if ((auswahl) && (auswahl != "")) {
          
          auswahl = auswahl.replace(config["syntax"]["befehlPrefix1"], config["syntax"]["befehlErsatz"]);
          auswahl = auswahl.replace(config["syntax"]["befehlPrefix2"], config["syntax"]["befehlErsatz"]);
          auswahl = auswahl.toLowerCase();
          
       }
       
       ladenCss(auswahl, zufall, dir);
       $("body").attr("data-stil", auswahl);
       
       auswahl = auswahl.charAt(0).toUpperCase() + auswahl.slice(1);
       dateiendung = "jpg";
       if (auswahl == "Hacks") { dateiendung = "gif"; }
       
       Cookies.set(daten["cookie"]["stil"], auswahl, { expires: 365 });
       
       window.setTimeout(function() {
       
          $("body > #hintergrund img")
          .attr("src", "")
          .attr("src", config["anwendung"]["cdn"]+"Stil_"+auswahl+"_1200x1200."+dateiendung)
          .attr("alt", "Hintergrundbild des Stils '"+auswahl+"'");
       // $("#chat").css("outline", "black 3px solid");
          
       }, 1000);
       
    }
    
 // Menü an- oder ausschalten
    function menu(methode) {
       
    // Auf Mobil zunächst abbrechen 
       var mobil = $("body").attr("data-mobil");
       var hindern = $("body").attr("data-mobil-hindern");
       if ((mobil != "") && (hindern != "aus")) {
          $("#start").fadeIn(300);
          $("body").attr("data-mobil-hindern", "aus");
          return;
       }
       
    // Toggle ermitteln
       if ((methode == "an") || (methode == "aus")) {
          
          methode = methode;
       // console.log("methode übernommen: '"+methode+"'");
          
       }
       else {
          
          var status = $("body").attr("data-menu");
          if (status == "an") {
             
             methode = "an";
             
          }
          else {
             
             methode = "aus";
             
          }
       // console.log("methode aus body-attr: '"+methode+"'");
          
       }
       
    // Aktuelle und gespeicherte Zeit nehmen
       zeit = new Date().getTime();
       zeitClient = $("body").attr("data-menu-zeit");
       
    // Zwei Sekunden abwarten (Konversation laden)
       if ((!zeitClient) || (zeitClient == "")) { zeitClient = 0; }
       else { zeitClient = zeitClient - (-333); }
       
       if (zeit > zeitClient) {
          
          var mobil = $("body").attr("data-mobil");
          
       // Animation vorbreiten
          if (methode == "an") {
                
             methode_neu = "aus";
             left_neu = "0%";
             if (mobil != "") { breite_neu = "100%"; } else { breite_neu = "84%"; }
             zeigen = "block";
          // console.log("neue methode (an): '"+methode+"'");
                
          }
          else {
             
             methode_neu = "an";
             if (mobil != "") { left_neu = "-84%"; } else { left_neu = "-42%"; }
             breite_neu = "100%";
             zeigen = "block"; // "none"
          // console.log("neue methode (aus): '"+methode+"'");
             
          }
          
       // Animieren
          $("#seite > #menu, #sk-footer").animate({ right: left_neu }, 300);
          $("#seite .sk-logo").animate({ width: breite_neu }, 300);
          $("body").attr("data-menu", methode_neu);
          
       // Button einblenden
          window.setTimeout(function() { 
             $("#menu").css("display", zeigen); // s.o.
             $("#start").fadeIn(300); 
          }, 300);
          
       // Zeit speichern
          $("body").attr("data-menu-zeit", zeit);
          
       }
       
    }
    
 // Konsolen-Meldung ausgeben
    function konsolen(b) {
       
       console.log('> '+b);
       
    }
    
 // Cookies
    function cookies(params) {
       
       parameter = params.split(",");
       var id =   parameter[0];
       var name = daten["cookie"][parameter[0]];
       var wert = parameter[1];
       var update = "";
       
       Cookies.set(name, wert, { expires: 365 }); // 1 Jahr
    // console.log("Cookie '"+name+"' gesetzt: "+wert);
       
       if      (id == "vorname")  { update = { givenName: wert }; }
       else if (id == "nachname") { update = { surname:   wert }; }
       else if (id == "email")    { update = { email:     wert }; }
       else              { update = { properties: { id: wert } }; }
       window.Smooch.updateUser(update);
    // console.log("Cookies: Smooch-User '"+id+"' Info: "+wert);
       
       $("."+id).val(wert);
       $("#menu #"+id).trigger("keydown");
       
    }
    