


function led_on() {  
    if (board != "m5stick-c") {
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

function speak(message){
    var msg = new SpeechSynthesisUtterance();
    msg.text = message;
    window.speechSynthesis.speak(msg);
}


function serial_start() {
    speak(translate("connected"));
}

function serial_read(text) {
    console.log(text);
    switch (text) {
        case "DETECTED":
            speak(document.getElementById("pir_text").innerHTML);
            led_on();
            document.getElementById("pir_alert").style.visibility = "visible"
            break;

        case "NOT DETECTED":
            led_off();
            document.getElementById("pir_alert").style.visibility = "hidden"
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