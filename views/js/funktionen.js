
 /* Helper: URL-Parameter lesen
  * 
  * Beschreibung
  */
    function getParameters(name) {
       
    /* Titel
     * 
     * Beschreibung
     */
       if (name == "hash")
       {
       /* Titel
        * 
        * Beschreibung
        */
          var hashUrl = window.location.hash;
          
       /* Titel
        * 
        * Beschreibung
        */
          var hashUrl = hashUrl.replace("#","");
          return hashUrl;
       }
       else
       {
       /* Titel
        * 
        * Beschreibung
        */
          name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
          
       /* Titel
        * 
        * Beschreibung
        */
          var regexS = "[\\?&]"+name+"=([^&#]*)";
          
       /* Titel
        * 
        * Beschreibung
        */
          var regex = new RegExp( regexS );
          
       /* Titel
        * 
        * Beschreibung
        */
          var results = regex.exec( window.location.href );
          
       /* Titel
        * 
        * Beschreibung
        */
          if (results == null)
          {
            return "";
          }
          else
          {
            return results[1];
          }
       }
    }
  
 /* Eingabe blinken lassen
  * 
  * Beschreibung
  */
    function blink() {
       
       window.setTimeout(function() { blinken(5); }, 1000);
       $("body").attr("data-blink", 0);
       
    }
    function blinken(max) {
       
       selektor = ".blink"; // , #sk-footer .input-container
       max = max - (-1);
          
       $(selektor).animate({opacity:0.33}, 300, "linear", function(){
          
          $("#sk-footer input.message-input").animate({opacity:0.33}, 300, "linear");
          
          $(this).delay(300);
          
          $(this).animate({opacity:1}, 300, function(){
             
             menge = $("body").attr("data-blink");
             if (menge < max) { blinken(max); }
             
             $("#sk-footer .message-input").animate({opacity:1}, 300, "linear");
             
          });
       
          $(this).delay(300);
          
          menge = $("body").attr("data-blink");
          menge = menge - (-1); 
       // console.log("menge: "+menge);
          $("body").attr("data-blink", menge);
       
       });
       
       $("#sk-footer, #sk-footer *, #befehle input").click(function() { $(selektor).slideUp({ direction: "up" }, 500); $("body").attr("data-blink", max); });
       $("#sk-footer, #sk-footer *").change(function() { $(selektor).slideUp({ direction: "up" }, 500); $("body").attr("data-blink", max); });
       
    }
    
    function wachsen(inputId, breite) {
    
       var min = 10, max = 300, pad_right = 0;
       var input = document.getElementById(inputId);

       input.style.width = breite+'px';
       input.onchange = input.onkeypress = input.onkeydown = input.onkeyup = function(){
          var input = this;
          setTimeout(function(){
             var tmp = document.createElement('div');
             tmp.style.padding = '0';
             if(getComputedStyle)
                tmp.style.cssText = getComputedStyle(input, null).cssText;
             if(input.currentStyle)
                tmp.style.cssText = input.currentStyle.cssText;
             tmp.style.width = '';
             tmp.style.position = 'absolute';
             tmp.innerHTML = input.value
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;")
                .replace(/ /g, '&nbsp;');
             input.parentNode.appendChild(tmp);
             var width = tmp.clientWidth+pad_right+1;
             tmp.parentNode.removeChild(tmp);
             
             if(min <= width && width <= max)
             {
                
             // input.style.width = width+'px';
                
                input_einer =   inputId.replace("Daten", "Menu");
                input_anderer = inputId.replace("Menu", "Daten");
                
                document.getElementById(input_einer).style.width =   width+'px';
                document.getElementById(input_anderer).style.width = width+'px';
                
             } 
              
          }, 1);
       };
    }
    
 // Stylesheet laden (wenn noch nicht geladen)
    function ladenCss(datei, zufall, dir) {
   	
      var cssSelector = document.getElementById("Css"+datei);
   // if (!cssSelector) {
      // var filename = "css/"+dir+"/"+datei+".css?v=3";
         var filename = "css/"+dir+"/"+datei+".css?v="+zufall;
         var fileref = document.createElement("link");
         fileref.setAttribute("href", filename);
         fileref.setAttribute("rel", "stylesheet");
         fileref.setAttribute("type", "text/css");
         fileref.setAttribute("ID", "Css"+datei);
         document.getElementsByTagName("head")[0].appendChild(fileref);
   // }
   
   }
   
 // Javascript laden (wenn noch nicht geladen)
    function ladenJs(datei, zufall, dir) {
   	
      var jsSelector = document.getElementById("Js"+datei);
   // if (!jsSelector) {
      // var filename = "js/"+dir+"/"+datei+".js?v=3";
         var filename = "js/"+dir+"/"+datei+".js?v="+zufall;
         var fileref = document.createElement("script");
         fileref.setAttribute("type", "text/javascript");
         fileref.setAttribute("src", filename);
         fileref.setAttribute("ID", "Js"+datei);
         document.getElementsByTagName("head")[0].appendChild(fileref);
   // }
   
   }
   