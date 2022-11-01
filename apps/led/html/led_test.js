blink_state = true;
blinker = setInterval(led_blink, 1000);

function led_blink() {
    if (blink_state) {
        led_on();
    } else {
        led_off();
    }
    blink_state = !blink_state;
}

function led_on() {
    if(board == "m5stick-c"){
        document.getElementById("led-light").style.opacity = 0;
    }
    else{
        document.getElementById("led-light").style.opacity = 1;
    }
    
    if (board != "m5stick-c") {
        //document.getElementById("led").style.opacity = 0.8;
        if (board == "uno") {
            document.getElementById("internal_led").style.fill = "rgb(255, 140, 0)";
            document.getElementById("internal_led-light").style.opacity = 1;
        } else {
            document.getElementById("internal_led").style.fill = "#dfd7cd";
            document.getElementById("internal_led-light").style.opacity = 0;

        }

    }
}

function led_off() {
    if(board == "m5stick-c"){
        document.getElementById("led-light").style.opacity = 1;
    }
    else{
        document.getElementById("led-light").style.opacity = 0;
    }
        
    if (board != "m5stick-c") {
        //document.getElementById("led").style.opacity = 1;
        if (board == "uno") {
            document.getElementById("internal_led").style.fill = "#dfd7cd";
            document.getElementById("internal_led-light").style.opacity = 0;
        } else {
            document.getElementById("internal_led").style.fill = "rgb(54, 52, 168)";
            document.getElementById("internal_led-light").style.opacity = 1;
        }
    }
}

translate_all(lang);

function serial_start() {
    clearInterval(blinker);
}

function serial_read(text) {
    console.log(text);
    switch (text) {
        case "ON":
            led_on();
            break;

        case "OFF":
            led_off();
            break;
    }
}

if (navigator.serial) {
    serial = new Esprerial();
    serial.setRead(serial_read);
    serial.setStart(serial_start);
} else {
    document.getElementById("esperial_button").remove();
}