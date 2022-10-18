function led_on() {

    document.getElementById("ir_led_light").style.opacity = 0.5;

}

function led_off() {
    document.getElementById("ir_led_light").style.opacity = 0;
}

led_state = false;
blinked = 0;
blinker_state = false;

function blinker() {
    if (led_state) {
        document.getElementById("ir_led_light").style.opacity = 0;
    } else {
        document.getElementById("ir_led_light").style.opacity = 0.5;
    }
    led_state = !led_state
    
    if (blinked == 4) {
        clearInterval(blinky);
        blinked = 0;
        document.getElementById("ir_led_light").style.opacity = 0;
        led_state = false;
        blinker_state = false;
    } else {
        blinked++;
    }
   
}

function buttons_opacity(opacity) {
    document.getElementById("ir_0").style.opacity = opacity;
    document.getElementById("ir_1").style.opacity = opacity;
    document.getElementById("ir_2").style.opacity = opacity;
    document.getElementById("ir_3").style.opacity = opacity;
    document.getElementById("ir_4").style.opacity = opacity;
    document.getElementById("ir_5").style.opacity = opacity;
    document.getElementById("ir_6").style.opacity = opacity;
    document.getElementById("ir_7").style.opacity = opacity;
    document.getElementById("ir_8").style.opacity = opacity;
    document.getElementById("ir_9").style.opacity = opacity;
    document.getElementById("ir_*").style.opacity = opacity;
    document.getElementById("ir_#").style.opacity = opacity;
    document.getElementById("ir_up").style.opacity = opacity;
    document.getElementById("ir_down").style.opacity = opacity;
    document.getElementById("ir_left").style.opacity = opacity;
    document.getElementById("ir_right").style.opacity = opacity;
    document.getElementById("ir_ok").style.opacity = opacity;
}

function highlight_button(button){
    document.getElementById("ir_" + button).style.opacity = 1;
}



translate_all(lang);

function blink() {
    blinky = setInterval(blinker, 70);
    blinker_state = true;
}

function button_emulation(){
    document.getElementById("ir_0").setAttribute("onclick",'serial_read("P=7 A=0x0 C=0x19 Raw=0xE619FF00")');
    document.getElementById("ir_1").setAttribute("onclick",'serial_read("P=7 A=0x0 C=0x45 Raw=0xBA45FF00")');
    document.getElementById("ir_2").setAttribute("onclick",'serial_read("P=7 A=0x0 C=0x46 Raw=0xB946FF00")');
    document.getElementById("ir_3").setAttribute("onclick",'serial_read("P=7 A=0x0 C=0x47 Raw=0xB847FF00")');
    document.getElementById("ir_4").setAttribute("onclick",'serial_read("P=7 A=0x0 C=0x44 Raw=0xBB44FF00")');
    document.getElementById("ir_5").setAttribute("onclick",'serial_read("P=7 A=0x0 C=0x40 Raw=0xBF40FF00")');
    document.getElementById("ir_6").setAttribute("onclick",'serial_read("P=7 A=0x0 C=0x43 Raw=0xBC43FF00")');
    document.getElementById("ir_7").setAttribute("onclick",'serial_read("P=7 A=0x0 C=0x7 Raw=0xF807FF00")');
    document.getElementById("ir_8").setAttribute("onclick",'serial_read("P=7 A=0x0 C=0x15 Raw=0xEA15FF00")');
    document.getElementById("ir_9").setAttribute("onclick",'serial_read("P=7 A=0x0 C=0x9 Raw=0xF609FF00")');
    document.getElementById("ir_*").setAttribute("onclick",'serial_read("P=7 A=0x0 C=0x16 Raw=0xE916FF00")');
    document.getElementById("ir_#").setAttribute("onclick",'serial_read("P=7 A=0x0 C=0xD Raw=0xF20DFF00")');
    document.getElementById("ir_up").setAttribute("onclick",'serial_read("P=7 A=0x0 C=0x18 Raw=0xE718FF00")');
    document.getElementById("ir_down").setAttribute("onclick",'serial_read("P=7 A=0x0 C=0x52 Raw=0xAD52FF00")');
    document.getElementById("ir_left").setAttribute("onclick",'serial_read("P=7 A=0x0 C=0x8 Raw=0xF708FF00")');
    document.getElementById("ir_right").setAttribute("onclick",'serial_read("P=7 A=0x0 C=0x5A Raw=0xA55AFF00")');
    document.getElementById("ir_ok").setAttribute("onclick",'serial_read("P=7 A=0x0 C=0x1C Raw=0xE31CFF00")');
}

function serial_start() {
}

button_emulation();

function serial_read(text) {
    if (!blinker_state) {
        blink();
    }
    console.log(text);
    document.getElementById("ir_receiver_text").value = text;
    if (text.includes("Raw=")) {
        //console.log(text.split("="));
        switch (text.split("=")[3]) {
            case ("0x45 Raw"):
                buttons_opacity(0.2)
                highlight_button("1");
                console.log("1");
                break;

            case ("0x46 Raw"):
                buttons_opacity(0.2)
                highlight_button("2");
                console.log("2");
                break;

            case ("0x47 Raw"):
                buttons_opacity(0.2)
                highlight_button("3");
                console.log("3");
                break;

            case ("0x44 Raw"):
                buttons_opacity(0.2)
                highlight_button("4");
                console.log("4");
                break;

            case ("0x40 Raw"):
                buttons_opacity(0.2)
                highlight_button("5");
                console.log("5")
                break;

            case ("0x43 Raw"):
                buttons_opacity(0.2)
                highlight_button("6");
                console.log("6")
                break;

            case ("0x7 Raw"):
                buttons_opacity(0.2)
                highlight_button("7");
                console.log("7")
                break;

            case ("0x15 Raw"):
                buttons_opacity(0.2)
                highlight_button("8");
                console.log("8");
                break;

            case ("0x9 Raw"):
                buttons_opacity(0.2)
                highlight_button("9");
                console.log("9");
                break;

            case ("0x16 Raw"):
                buttons_opacity(0.2)
                highlight_button("*");
                console.log("*");
                break;

            case ("0x19 Raw"):
                buttons_opacity(0.2)
                highlight_button("0");
                console.log("0");
                break;

            case ("0xD Raw"):
                buttons_opacity(0.2)
                highlight_button("#");
                console.log("#")
                break;

            case ("0x18 Raw"):
                buttons_opacity(0.2)
                highlight_button("up");
                console.log("up");
                break;

            case ("0x52 Raw"):
                buttons_opacity(0.2)
                highlight_button("down");
                console.log("down");
                break;

            case ("0x8 Raw"):
                buttons_opacity(0.2)
                highlight_button("left");
                console.log("left");
                break;

            case ("0x5A Raw"):
                buttons_opacity(0.2)
                highlight_button("right");
                console.log("right");
                break;

            case ("0x1C Raw"):
                buttons_opacity(0.2)
                highlight_button("ok");
                console.log("ok");
                break;
        }
    }
}



if (navigator.serial) {
    serial = new Esprerial();
    serial.setRead(serial_read);
    serial.setStart(serial_start);
} else {
    document.getElementById("esperial_button").remove();
}

led_off();