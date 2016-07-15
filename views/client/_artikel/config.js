
 // Einstellungen
    var config = {
       
    // Anwendung
       "anwendung": {
          
          "id": "Artikel", // Robogeddon, Sefzigbot, Chatraum, Artikel
          "name": "Artikel",
          "cdn" : "http://sefzig.net/text/seiten/ArtikelCdn/dateien/"
          
       },
       
    // Defaults
       "default": {
          
          "ansicht": "chat", // chat, daten
          "stil": "robogeddon", // tag, robogeddon, nacht, hx
          "menu": "artikel", // chatraum, robogeddon, artikel
          "client": "artikel", // chatraum, robogeddon, artikel
       // "intro": "an", // an, aus
          "name": "aus", // an, aus
          "button": "aus", // an, aus
          "befehler": "aus" // an, aus
          
       },
       
    // Syntax
       "syntax": { 
          
       // Befehl
          "befehlPrefix1": "--",
          "befehlPrefix2": "—",
          "befehlErsatz": ""
          
       },
       
    // Smooch-Bot
       "smooch": {
          
          "appToken": "b9dk6lfuba1mjmzw5pyhbwuv2"
          
       }
       
    };
    
 // Nutzerdaten
    var daten = {
       
    // Labels
       "label": {
       	
       // Datensatz
          "vorname": "Vorname",
          "nachname": "Nachname",
          "email": "E-Mail-Adresse"
          
       },
       
    // Defaults
       "default": {
       	
       // Datensatz
          "vorname": "Daniel",
          "nachname": "Tester",
          "email": "daniel.tester@robogeddon.de"
          
       },
       
    // Cookies
       "cookie": {
       	
       // Namen
          "vorname":    ""+config["anwendung"]["id"]+"Vorname",
          "nachname":   ""+config["anwendung"]["id"]+"Nachname",
          "email":      ""+config["anwendung"]["id"]+"Email",
          "gesprochen": ""+config["anwendung"]["id"]+"Gesprochen",
          "stil":       ""+config["anwendung"]["id"]+"Stil"
          
       }
       
    };
       
 // Texte
    var texte = {
       
    // Texte des Intros
       "intro": {
       	 
       // Intro
          "namenEingeben": "Wenn Sie möchten, geben Sie Ihren Namen an:"
       	 
       },
       
    // Texte des Chats
       "chat": {
       	 
       // Benutzeroberfläche
          "headerText": "Chatraum des Artikels über Chatbots",
          "startText": "",
          "inputPlaceholder": "Schreiben Sie eine Nachricht...",
          "sendButtonText": "Absenden",
          
       // Email-Eingabe
          "settingsHeaderText": "E-Mail-Einstellungen",
          "settingsText": "Hinterlassen Sie Ihre E-Mail-Adresse, damit ich Kontakt zu Ihnen aufnehmen kann.",
          "settingsNotificationText": "Sollte ich Ihnen nicht schnell genug antworten, <a href data-ui-settings-link>hinterlassen Sie mir bitte Ihre E-Mail-Adresse</a>.",
          "settingsInputPlaceholder": "Ihre E-Mail-Adresse",
          "settingsSaveButtonText": "Speichern",
          "settingsReadOnlyText": "Ich schreibe Ihnen an diese E-Mail-Adresse, sollen wir uns verpasst haben.",
          
       // Fehlermeldungen
          "messageError": "Beim Versenden ist ein Fehler aufgetreten. Bitte versuchen Sie es nochmal.",
          "invalidFileError": "Es tut mir leid, zur Zeit können nur Bild-Dateien hochgeladen werden. Bitte laden Sie ein Jpg, Png, Gif oder Bmp hoch.",
          "actionPaymentError": "Es ist ein Fehler im Bezahlvorgang aufgetreten. <br> Bitte versuchen Sie es nochmal (oder mit einer anderen Karte).",
          
       // Benachrichtigungen
          "actionPaymentCompleted": "Bezahlvorgang abgeschlossen",
          "messageIndicatorTitleSingular": "({count}) neue Nachricht",
          "messageIndicatorTitlePlural": "({count}) neue Nachrichten",
          
       // URL-Parameter übernehmen
          "weiterleiten": "Weiterleiten zu:"
       }
       
    };
    
 // Templates
    var templates = {
       
    // Templates der Anwendung
       "befehl": {
       	
       // Befehle
          "link": [
             
             "<span class='befehl' ",
                "onclick='",
                   "befehlen(\""+config["syntax"]["befehlPrefix1"]+"%inhalt%\");",
                "'>",
                ""+config["syntax"]["befehlErsatz"]+"%inhalt%",
             "</span>"
             
          ],
          
       // Befehlleiste
          "leiste": [
             
             "<div class='befehle'>",
               "<div style='display:block !important'>",
                 "<div class='befehler' rel='Befehle'><span onclick='befehlerKlick(\"Befehle\"); befehlerSchalter(); $(this).parent().fadeOut();'> Befehle </span><span onclick='$(this).parent().fadeOut();'> x </span> </div>",
                 "<div class='befehler' rel='Über'   ><span onclick='befehlerKlick(\"Über\");    befehlerSchalter(); $(this).parent().fadeOut();'> Über    </span><span onclick='$(this).parent().fadeOut();'> x </span> </div>",
                 "<div class='befehler' rel='Hallo'  ><span onclick='befehlerKlick(\"Hallo\");   befehlerSchalter(); $(this).parent().fadeOut();'> Hallo   </span><span onclick='$(this).parent().fadeOut();'> x </span> </div>",
               "</div>",
             "</div>",
             "<div id='befehlleiste' style=''>",
               "<input tabindex='99' type='button' value='i' onclick='befehlerSchalter();' />",
             "</div>"
             
          ],
          
       // Befehlleiste
          "befehler": [
             
             "<div class='befehler' ",
                "rel='%inhalt%' >",
                "<span onclick='",
                  "befehlerKlick(\"%inhalt%\"); befehlerSchalter(); $(this).parent().fadeOut();",
                "'>",
                  "%inhalt%",
                "</span>",
                "<span ",
                  "onclick='",
                    "$(this).parent().fadeOut();",
                  "'>",
                  " x ",
                "</span> ",
             "</div>"
             
          ]
          
       },
       
    // Module
    // Zeilen werden in Js gejoint
       "modul": {
          
       // Button zu Text
          "Text":
          [
             "<div class='modulButton sk-action'>",
                "<a class='btn btn-sk-primary' ",
                   "href='http://sefzig.net/text/%var2%/#%var3%' ",
                   "target='_blank' ",
                   "onclick='",
                      "fenster(\"text\",\"%var2%\",\"%var3%\"); ",
                      "return false;'>",
                   "%var1%",
                "</a>",
             "</div>"
          ],
          
       // Button zu Linkliste
          "Linkliste":
          [
             "<div class='modulButton sk-action'>",
                "<a class='btn btn-sk-primary' ",
                   "href='http://sefzig.net/link/liste/%var2%/' ",
                   "target='_blank' ",
                   "onclick='",
                      "fenster(\"links\",\"%var2%\"); ",
                      "return false;'>",
                   "%var1%",
                "</a>",
             "</div>"
          ],
          
       // Link aus Linkliste (Button)
          "Link":
          [
             "<div class='modulButton sk-action'>",
                "<a class='btn btn-sk-primary' ",
                   "href='http://sefzig.net/link/%var2%/' ",
                   "target='_blank' ",
                   "onclick='",
                      "fenster(\"link\",\"%var2%\"); ",
                      "return false;'>",
                   "%var1%",
                "</a>",
             "</div>"
          ],
          
       // Link aus Linkliste (Textlink)
          "Textlink":
          [
             "<a class='textLink' ",
                "href='http://sefzig.net/link/%var2%/' ",
                "target='_blank' ",
                "onclick='",
                   "fenster(\"link\",\"%var2%\"); ",
                   "return false;'>",
                "%var1%",
             "</a>",
          ],
          
       // Nach Tageszeit angepasster Text
          "Textzeit":
          [
             "<span class='textZeit'>",
                "%var2%",
             "</span>",
             "<script>",
             "   var zeittext = \"\"; ",
             "   var zeiten = new Date(); ",
             "   zeit = zeiten.getHours(); ",
             "   if (zeit < 12) { zeittext = \"%var1%\"; } ",
             "   else if (zeit < 18) { zeittext = \"%var2%\"; } ",
             "   else { zeittext = \"%var3%\"; } ",
             "   $(\".textZeit\").html(zeittext);",
             "</script>"
          ],
          
       // An Endgerät angepasster Text
          "Textmobil":
          [
             "<span class='nur_mobil'>",
                "%var1%",
             "</span>",
             "<span class='nicht_mobil'>",
                "%var2%",
             "</span>"
          ],
          
       // Button mit Link
          "Button":
          [
             "<div class='modulButton sk-action'>",
                "<a class='btn btn-sk-primary' ",
                   "href='%var2%' ",
                   "target='_blank' ",
                   "onclick='",
                      "fenster(\"link\",\"%var2%\"); ",
                      "return false;'>",
                   "%var1%",
                "</a>",
             "</div>"
          ],
          
       // Bild-Datei
          "Bild": 
          [
             "<center>",
                "<img class='%klasse%' ",
                "src='%inhalt%' ",
                "onclick='",
                   "fenster(\"bild\",\"%inhalt%\"); ",
                   "console.log(\"bild: %inhalt%\"); ",
                   "return false;' />",
             "</center>"
          ],
          
       // QR-Code als Bild
          "Qr":
          [
             "<center>",
                "<img class='%klasse%' ",
                   "src='http://chart.apis.google.com/chart?chs=225x225&cht=qr&chld=L&chf=s,65432100&chl=%inhalt%' />", // &chf=bg,s,65432100
             "</center> ",
             "<a href=%inhalt% target=_blank>%inhalt%</a>"
          ],
          
       // Iframe
          "Iframe":
          [
             "<iframe ",
                "src='%inhalt%' ",
                "width='225' ",
                "height='127' ",
                "frameborder='0'>",
                "Frame laden",
             "</iframe>"
          ],
          
       // Audio-Player
          "Audio":
          [
             "<audio ",
                "class='%klasse%' ",
                "controls='true' ",
                "style='width: 100%; ",
                "max-width: 500px; ",
                "margin-top: 10px;' ",
                "x-webkit-airplay='allow'>",
                "<source src='%inhalt%' type='audio/mpeg'>",
                   "Lade Audio...",
             "</audio>"
          ],
          
       // Email
          "Email":
          [
             "<div class='modulButton sk-action'>",
                "<a class='btn btn-sk-primary email' ",
                   "href='mailto:%var2%?subject=Robogeddon'> ",
                   "%var1%",
                "</a>",
             "</div>"
          ],
          
       // Telefon
          "Telefon":
          [
             "<div class='modulButton sk-action'>",
                "<a class='btn btn-sk-primary telefon' ",
                   "href='tel:%var2%'> ",
                   "%var1%",
                "</a>",
             "</div>"
          ],
          
       // Youtube-Player
          "Youtube":
          [
             "<iframe ",
                "width='225' ",
                "height='127' ",
                "class='%klasse%' ",
                "src='http://www.youtube.com/embed/%inhalt%?rel=0&amp;showinfo=0' ",
                "frameborder='0' ",
                "allowfullscreen>",
             "</iframe>"
          ]
          
       }
       
    };
    