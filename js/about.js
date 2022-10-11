if (navigator.language.includes("fr")) {
    about_page = "md/about.fr.md";
} else {
    about_page = "md/about.md";
}

fetch(about_page).then(response => response.text()).then(function (text) {
   generate_about(text);
});


function generate_about(text){
document.getElementById('content').innerHTML =
      marked.parse(text);
}

