selected_obj = "";
current_id = 0;
selected_id = 0;

function load_breadboard(svg_info) {
    fetch("boards/breadboard.svg").then(function (response) {
        return response.text();
    }).then(function (svg) {
        document.getElementById("diagram").innerHTML = svg;
        load_component(svg_info)
    }).catch(function (error) {
        console.log(error);
    });
}

function get_group_in_svg(svg_code, id) {
    console.log("Loading ... " + id)
    var svg_xml = new window.DOMParser().parseFromString(svg_code, "text/xml");
    var svg_group = svg_xml.getElementById(id);
    svg_group.setAttribute("transform-box", "fill-box");
    svg_group.setAttribute("transform-origin", "center");
    svg_group.setAttribute("transform", svg_info[current_id].transform);
    return new XMLSerializer().serializeToString(svg_group);
}


function load_component(svg_info) {
    still_loading = false;
    var id = 0;
    var svg_element = ""
    for (const element of svg_info) {
        if (element.loaded === undefined) {
            svg_info[id].id = id
            current_id = id;
            svg_info[id].loaded = false;
            still_loading = true;
            break;
        }
        id++;
    }

    if (still_loading) {
        fetch(svg_info[current_id].path).then(function (response) {
            if (response.ok) {
                return response.text();
            } else {
                return undefined;
            }
        }).then(function (svg) {
            document.getElementById("breadboard").innerHTML += get_group_in_svg(svg, svg_info[current_id].name);
            document.getElementById(svg_info[current_id].name).setAttribute("onclick", `selected_svg(${current_id})`);
            svg_info[current_id].loaded = true;
            load_component(svg_info);
        }).catch(function (error) {
            console.log(error);
        });
    }
}

function selected_svg(id) {
    console.log("Selected svg: " + svg_info[id].name);
    selected_id = id;
}

function transform_to_coordinate(id) {
    coordinate = {}
    coordinate.r = parseFloat(svg_info[id].transform.split("rotate(")[1].split(")")[0]);
    coordinate.x = parseFloat(svg_info[id].transform.split("translate(")[1].split(",")[0]);
    coordinate.y = parseFloat(svg_info[id].transform.split(",")[1].split(")")[0]);
    return coordinate;
}

function object_to_coordinate(coordinate) {
    coordinate.x = parseFloat(coordinate.x.toFixed(1));
    coordinate.y = parseFloat(coordinate.y.toFixed(1));
    return `rotate(${coordinate.r}) translate(${coordinate.x},${coordinate.y})`
}

function mover(e, mover_id) {

    var coordinate = transform_to_coordinate(selected_id);

    if (e.shiftKey) {
        val = 0.1;
    }
    else {
        val = 1;
    }

    switch (e.key) {
        case ("ArrowRight"):
            if (coordinate.r == 180) {
                coordinate.x -= val;
            } else {
                coordinate.x += val;
            }
            break;
        case ("ArrowLeft"):
            if (coordinate.r == 180) {
                coordinate.x += val;
            } else {
                coordinate.x -= val;
            }
            break;
        case ("ArrowUp"):
            if (coordinate.r == 180) {
                coordinate.y += val;
            } else {
                coordinate.y -= val;
            }
            break;
        case ("ArrowDown"):
            if (coordinate.r == 180) {
                coordinate.y -= val;
            } else {
                coordinate.y += val;
            }
            break;
        case ("+"):
            coordinate.r += 90;
            break;
        case ("-"):
            coordinate.r -= 90;
            break;
    }

    transform_attr = object_to_coordinate(coordinate);
    console.log(transform_attr);
    document.getElementById(svg_info[selected_id].name).setAttribute("transform", object_to_coordinate(coordinate));
    svg_info[selected_id].transform = transform_attr;
    document.getElementById(mover_id).innerHTML = JSON.stringify(svg_info);

}

function load_svg(svg_file) {
    fetch(svg_file).then(function (response) {
        return response.text();
    }).then(function (svg) {
        document.getElementById("diagram").innerHTML = svg;

        //Resize SVG to the size of the buttons underneath
        resize_svg();

        //Observe any size change
        const ro = new ResizeObserver(entries => {
            resize_svg();
        });
        ro.observe(document.getElementById("app_selector"));
    }).catch(function (error) {
    });
}


function resize_svg() {
    document.getElementById("diagram").children[0].setAttribute("width", document.getElementById("goback").offsetWidth);
}

// Responsive SVG

// Observe orientation change to resize SVG
window.addEventListener("orientationchange", (event) => {
    setTimeout(resize_svg,200);
});


