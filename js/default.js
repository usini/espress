
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

change_theme_icon();
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