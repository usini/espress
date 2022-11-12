notes = [
    ["C4", "D4", "E4", "G4", "A4", "C5"],
    ["C#4", "D#4", "F4", "G#4", "A#4", "C#4"],
    ["D4", "E4", "F#4", "A4", "B4", "D4"]
];

note = 0;
scale = 0;
playing = false;
tone_started = false;
const synth = new Tone.FMSynth({
    modulationIndex: 1,
    envelope: {
        attack: 1,
        decay: 0.2
    },
    modulation: {
        type: "triangle"
    },
    modulationEnvelope: {
        attack: 0.2,
        decay: 0.01
    },
}).toDestination();

const feedbackDelay = new Tone.PingPongDelay({
    delayTime: "8n",
    feedback: 0.2,
    wet: 0.5
}).toDestination();



synth.connect(feedbackDelay);

rythm_box = null;
rythm_box = setInterval(arpeggiator, 200);
function play_pause() {
    if(!tone_started){
        Tone.start();
    }
    if (playing) {
        document.getElementById("play_pause").innerHTML = "▶️";
    } else {
        document.getElementById("play_pause").innerHTML = "⏹️";       
    }
    playing = !playing;
}

function changeModulation(){
    synth.modulationIndex.value = document.getElementById("modulation").value;
    document.getElementById("encoder_value").innerHTML = document.getElementById("modulation").value;;
}

function changeNotes(){
    scale++;
    if(scale > notes.length -1){
        scale = 0;
    }
    console.log(scale);
}

function arpeggiator() {
    if (playing) {
        //console.log(notes[scale][note]);
        synth.triggerAttackRelease(notes[scale][note], "8n");
        note++;
        if (note > notes[scale].length - 1) {
            note = 0;
        }
    }
}

translate_all(lang);

function serial_start() {
    play_pause();
}

function serial_read(text) {
    console.log(text);
    switch (text) {
        case "Button Pressed":
            changeNotes();
            break;
        default:
            if(!isNaN(text)){
                document.getElementById("encoder_value").innerHTML = text;
                synth.modulationIndex.value = text;
                document.getElementById("modulation").value = text;
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
