const urlParams = new URLSearchParams(window.location.search);
component = urlParams.get("c");
board = urlParams.get("b");

if (component == undefined) {
  component = "led";
}
if (board == undefined) {
  board = "lolin_d32";
}
document.getElementById("schematics").src = `apps/${component}/boards/${board}/${board}_${component}.svg`;

app_json = [{
  "name": "Test",
  "path": "test"
}];

app_html = "";
if(navigator.serial){
document.getElementById("not-supported").remove();
generate_apps();
function generate_apps() {
  try {
    fetch(`apps/${component}/${component}.json`).then(response => response.json()).then(function (json) {
      app_json = app_json.concat(json);
      generate_apps_template();
      generate_html();
    });
  } catch (ex) {
    generate_apps_template();
    generate_html();
    console.log("No JSON file at `apps/${component}/${component}.json`");
  }
}

function generate_html_template(){
  document.getElementById("html_app").innerHTML = app_html;
}

function generate_javascript_template(path){
  var script_app = document.createElement('script');
  script_app.src = path
  document.head.appendChild(script_app); 
}

function generate_html() {
  app_json.forEach(element => {
    fetch(`apps/${component}/html/${component}_${element.path}.html`).then(function (response) {
      if (response.ok) {
        return response.text();

      } else {
        return undefined;
      }
    }).then(function (text) {
      if(text !== undefined){
      app_html = text;
      generate_html_template();
      }
    }).catch(function (error) {
      console.log("Error HTML");
    });
  });

  app_json.forEach(element => {
    path = `apps/${component}/html/${component}_${element.path}.js`
    fetch(path).then(function (response) {
      if (response.ok) {
        
        console.log(path);
        return path

      } else {
        return undefined;
      }
    }).then(function (text) {
      if(text !== undefined){
      generate_javascript_template(text);
      }
    }).catch(function (error) {
      console.log(`ERROR JS : apps/${component}/html/${element.path}.js`);
    });
  });
}

function generate_apps_template() {
  app_json.forEach(element => {
    app_name = element.name;
    app_path = element.path;
    app_installer_template = `    
    <center>
    <esp-web-install-button id="installer" manifest="apps/${component}/boards/${board}/bins/${component}_${app_path}/manifest.json">
      <button data-target="modal-apps" onClick="toggleModal(event)" slot="activate">${app_name}</button>
    </esp-web-install-button>   
    </center>
    `
    document.getElementById("apps").innerHTML += app_installer_template;
  });
}

} else {
  document.getElementById("app_selector").remove();
}