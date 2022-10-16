includeHTML();
// Load translation
var script_i18n = document.createElement('script');
script_i18n.src = "js/i18n.js"
document.head.appendChild(script_i18n);

// Board Manager
if (localStorage.getItem("espress_board") == null) {
    localStorage.setItem("espress_board", "lolin_d32")
}
board = localStorage.getItem("espress_board");

/* Theme Manager */
// Dark mode manager
if (localStorage.getItem("data-theme") == null) {
    localStorage.setItem("data-theme", "dark")
}


function change_theme() {
    theme = localStorage.getItem("data-theme")
    if (theme == "dark") {
        localStorage.setItem("data-theme", "light")
    } else {
        localStorage.setItem("data-theme", "dark")
    }
    change_theme_icon();
}

function change_theme_icon() {
    if (localStorage.getItem("data-theme") == "dark") {
        html_id = document.getElementById("theme").setAttribute("data-theme", "dark")
        document.getElementById("change-theme").innerHTML = "💡";
        document.getElementById("logo").style = "color:white;"
    } else {
        html_id = document.getElementById("theme").setAttribute("data-theme", "light")
        document.getElementById("change-theme").innerHTML = "🌑";
        document.getElementById("logo").style = "color:black;"  
    }
}

function includeHTML(){
        var z, i, elmnt, file, xhttp;
        /* Loop through a collection of all HTML elements: */
        z = document.getElementsByTagName("*");
        for (i = 0; i < z.length; i++) {
          elmnt = z[i];
          /*search for elements with a certain atrribute:*/
          file = elmnt.getAttribute("w3-include-html");
          if (file) {
            /* Make an HTTP request using the attribute value as the file name: */
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
              if (this.readyState == 4) {
                if (this.status == 200) {elmnt.innerHTML = this.responseText;}
                if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
                /* Remove the attribute, and call this function once more: */
                elmnt.removeAttribute("w3-include-html");
                includeHTML();
                change_theme_icon();
              }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            /* Exit the function: */
            return;
          }
        }
}
