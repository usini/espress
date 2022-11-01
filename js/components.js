const urlParams = new URLSearchParams(window.location.search);
component = urlParams.get("c");
board = urlParams.get("b");
board_avr = false;

if (component == undefined) {
  component = "led";
}
if (board == undefined) {
  board = "lolin_d32";
}

if (board == "uno") {
  board_avr = true;
}

if (document.getElementById("diagram") != null) {
  load_svg(`apps/${component}/boards/${board}/${board}_${component}.svg`);
}

app_json = [{
  "name": "Test",
  "path": "test"
}];

app_html = "";
if (navigator.serial) {
  document.getElementById("not-supported").remove();

} else {
  document.getElementById("app_selector").remove();
}

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

function generate_html_template() {
  document.getElementById("html_app").innerHTML = app_html;
  generate_javascript();
}

function generate_javascript_template(path) {
  var script_app = document.createElement('script');
  script_app.src = path
  document.head.appendChild(script_app);
}

function generate_javascript() {
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
      if (text !== undefined) {
        generate_javascript_template(text);
      }
    }).catch(function (error) {
      console.log(`ERROR JS : apps/${component}/html/${element.path}.js`);
    });
  });
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
      if (text !== undefined) {
        app_html = text;
        generate_html_template();
      }
    }).catch(function (error) {
      console.log("Error HTML");
    });
  });
}

function generate_apps_template() {

  app_json.forEach(element => {
    app_name = element.name;
    app_path = element.path;

    if (board_avr) {
      app_installer_template = `
      <center>
      <button
        id="installer"
        arduino-uploader
        hex-href="apps/${component}/boards/${board}/bins/${component}_${app_path}/firmware.hex"
        board="${board}"
        data-target="modal-apps" 

        >
        ${app_name}
        <span class="upload-progress"></span>
        
      </button>
      </center>
      `
    } else {
      app_installer_template = `    
    <center>
    <esp-web-install-button id="installer" manifest="apps/${component}/boards/${board}/bins/${component}_${app_path}/manifest.json">
      <button data-target="modal-apps" onClick="toggleModal(event)" slot="activate">${app_name}</button>
    </esp-web-install-button>   
    </center>
    `
    }

    document.getElementById("apps").innerHTML += app_installer_template;

  });
  if(board_avr){
    add_avr_uploader();
  }
}

function add_avr_uploader() {
  var script_i18n = document.createElement('script');
  script_i18n.src = "js/arduino-web-uploader/main.js"
  document.head.appendChild(script_i18n);
}