//Translator

// Language Selector
var script_lang = document.createElement('script');
translation = false;

if (navigator.language.includes("fr")) {
    script_lang.src = "js/lang/fr.js"
    document.head.appendChild(script_lang);
    translation = true
} else {
    translation = false;
    lang = {}
    translate_all(lang);
}



function translate_all(lang) {
    if (translation) {
        for (const [key, value] of Object.entries(document.querySelectorAll(".i18n"))) {
            translation = value.innerHTML;
            if (lang[translation] !== undefined) {
                value.innerHTML = lang[translation];
            }
        }
    }
    document.body.style.opacity = 1;
}
