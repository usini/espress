const renderer = {
    image(href, title, text) {
  
      return `
              <center>
              <img src="md/${href}" alt=${text}>
              <br><strong>${text}</strong>
              </center>
              `
    },

    strong(text) {
        return `
            <center>
             <b>${text}</b>
            </center>
        `
    },
  };
  

marked.use({ renderer });

about_page = "md/pres_stgely.md";
fetch(about_page).then(response => response.text()).then(function (text) {
   generate_about(text);
});


function generate_about(text){
document.getElementById('content').innerHTML =
      marked.parse(text);
}

