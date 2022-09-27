
// Board display


function get_boards() {
    fetch(`boards/boards.json`).then(response => response.json()).then(function (json) {
        boards_list = json;
        boards_template();
    });
}

function boards_template() {
    selected_board = document.getElementById("selected_board");
    for (const [key, value] of Object.entries(boards_list)) {
        var opt = document.createElement("option")
        if (board == value.board) {
            opt.selected = "true";
        }
        opt.value = value.board
        opt.innerHTML = value.name
        selected_board.appendChild(opt);

    }
    //document.getElementById("selected_board").innerHTML = boards_list[board].name;
    document.getElementById("selected_board_image").src = `boards/${boards_list[board].board}.svg`
}
get_boards();

function change_board() {
    board = document.getElementById("selected_board").value;
    localStorage.setItem("espress_board", board)
    document.getElementById("selected_board_image").src = `boards/${boards_list[board].board}.svg`
    var link_components = document.getElementsByClassName('link_component');
    for (var i = 0; i < link_components.length; ++i) {
        var item = link_components[i];
        item.href = `c.html?c=${item.id}&b=${board}`;
    }
}

// Components lists manager
components_list = ""
function get_components() {
    fetch(`apps/apps.json`).then(response => response.json()).then(function (json) {
        components_list = json;
        components_template();
    });
}

function components_template() {
    grider = 0;
    components_list_template = "";
    components_list.forEach(function (element) {
        if (grider == 0) {
            components_list_template += `
<div class="grid">`
        }
        grider++;
        components_list_template += `    
    <div>
        <a class="link_component" id="${element}" href="c.html?c=${element}&b=${board}"><img class="components" src="apps/${element}/thumbnail_${element}.svg" alt="${element}"></a>
    </div>`
        if (grider == 4) {
            components_list_template += `
</div>
        `
            grider = 0;
        }


    });

    if (grider != 0) {
        for (i = grider; i < 4; i++) {
            components_list_template += `
    <div>
    </div>
            `
        }
        components_list_template += `
</div>
`
    }

    document.getElementById("components").innerHTML = components_list_template;
}

get_components();