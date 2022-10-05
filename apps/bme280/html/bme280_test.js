var temperature_opts = {
    angle: 0, // The span of the gauge arc
    lineWidth: 0.44, // The line thickness
    radiusScale: 1, // Relative radius
    pointer: {
        length: 0.6, // // Relative to gauge radius
        strokeWidth: 0.035, // The thickness
        color: '#000000' // Fill color
    },
    limitMax: false,     // If false, max value increases automatically if value > maxValue
    limitMin: false,     // If true, the min value of the gauge will be fixed
    colorStart: '#6FADCF',   // Colors
    colorStop: '#8FC0DA',    // just experiment with them
    strokeColor: '#E0E0E0',  // to see which ones work best for you
    generateGradient: true,
    highDpiSupport: true,     // High resolution support
    staticLabels: {
        font: "13px sans-serif",  // Specifies font
        labels: [-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50],  // Print labels at these values
        color: "red",  // Optional: Label text color
        fractionDigits: 0  // Optional: Numerical precision. 0=round off.
    },
    staticZones: [
        { strokeStyle: "blue", min: -50, max: -10 },
        { strokeStyle: "cyan", min: -20, max: 0 }, // Blue
        { strokeStyle: "green", min: 0, max: 25 }, // Green
        { strokeStyle: "yellow", min: 20, max: 35 }, // Yellow
        { strokeStyle: "red", min: 30, max: 40 }, // Red
        { strokeStyle: "brown", min: 40, max: 50 }  // Brown
    ],
};
var target_temperature = document.getElementById('temperature'); // your canvas element
var gauge_temperature = new Gauge(target_temperature).setOptions(temperature_opts); // create sexy gauge!
gauge_temperature.maxValue = 50; // set max gauge value
gauge_temperature.minValue = -50
gauge_temperature.setMinValue(-50);  // Prefer setter over gauge.minValue = 0
gauge_temperature.animationSpeed = 32; // set animation speed (32 is default value)
gauge_temperature.set(0); // set actual value

var target_temperature = document.getElementById('temperature'); // your canvas element
var gauge_temperature = new Gauge(target_temperature).setOptions(temperature_opts); // create sexy gauge!
gauge_temperature.maxValue = 50; // set max gauge value
gauge_temperature.minValue = -50
gauge_temperature.animationSpeed = 32; // set animation speed (32 is default value)
gauge_temperature.set(0); // set actual value

var humidity_opts = {
    angle: 0, // The span of the gauge arc
    lineWidth: 0.44, // The line thickness
    radiusScale: 1, // Relative radius
    pointer: {
        length: 0.6, // // Relative to gauge radius
        strokeWidth: 0.035, // The thickness
        color: '#000000' // Fill color
    },
    limitMax: false,     // If false, max value increases automatically if value > maxValue
    limitMin: false,     // If true, the min value of the gauge will be fixed
    colorStart: '#6FADCF',   // Colors
    colorStop: '#8FC0DA',    // just experiment with them
    strokeColor: '#E0E0E0',  // to see which ones work best for you
    generateGradient: true,
    highDpiSupport: true,     // High resolution support
    staticLabels: {
        font: "13px sans-serif",  // Specifies font
        labels: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],  // Print labels at these values
        color: "red",  // Optional: Label text color
        fractionDigits: 0  // Optional: Numerical precision. 0=round off.
    },
    staticZones: [
        { strokeStyle: "black", min: 0, max: 20 },
        { strokeStyle: "lightsteelblue", min: 20, max: 40 }, // Blue
        { strokeStyle: "lightblue", min: 40, max: 60 }, // Green
        { strokeStyle: "skyblue", min: 60, max: 80 }, // Yellow
        { strokeStyle: "steelblue", min: 80, max: 100 }, // Red
    ],
};

var target_humidity = document.getElementById('humidity'); // your canvas element
var gauge_humidity = new Gauge(target_humidity).setOptions(humidity_opts); // create sexy gauge!
gauge_humidity.maxValue = 100; // set max gauge value
gauge_humidity.minValue = 0

gauge_humidity.animationSpeed = 32; // set animation speed (32 is default value)
gauge_humidity.set(0); // set actual value


var pressure_opts = {
    angle: 0, // The span of the gauge arc
    lineWidth: 0.44, // The line thickness
    radiusScale: 1, // Relative radius
    pointer: {
        length: 0.6, // // Relative to gauge radius
        strokeWidth: 0.035, // The thickness
        color: '#000000' // Fill color
    },
    limitMax: false,     // If false, max value increases automatically if value > maxValue
    limitMin: false,     // If true, the min value of the gauge will be fixed
    colorStart: '#6FADCF',   // Colors
    colorStop: '#8FC0DA',    // just experiment with them
    strokeColor: '#E0E0E0',  // to see which ones work best for you
    generateGradient: true,
    highDpiSupport: true,     // High resolution support
    staticLabels: {
        font: "13px sans-serif",  // Specifies font
        labels: [970, 980, 990, 1000, 1010, 1020, 1030, 1040],  // Print labels at these values
        color: "red",  // Optional: Label text color
        fractionDigits: 0  // Optional: Numerical precision. 0=round off.
    }
};

var target_pressure = document.getElementById('pressure'); // your canvas element
var gauge_pressure = new Gauge(target_pressure).setOptions(pressure_opts); // create sexy gauge!
gauge_pressure.minValue = 970;
gauge_pressure.maxValue = 1040; // set max gauge value

gauge_pressure.animationSpeed = 32; // set animation speed (32 is default value)
gauge_pressure.set(970); // set actual value


serial = new Esprerial();
sensor_error = false;
sensor_data = false;

function no_data() {
    if(!sensor_data){
        document.getElementById("app_status").innerHTML = "⚠️ No data sent, did you upload the app ?";
        translate_all(lang);
    }
}

function serial_read(text) {

    console.log(text);
    type = text.split(" ")[0];
    value = text.split(" ")[2];
    if (text.includes("Error")) {
        if (!sensor_error) {
            document.getElementById("app_status").innerHTML = "⚠️ Sensor not detected, check your connections";
            translate_all(lang);
            sensor_error = true;
        }
    } else {
        switch (type) {
            case "Temperature":
                if (sensor_error) {
                    sensor_error = false;
                    document.getElementById("app_status").innerHTML = "👌Sensor OK";
                    translate_all(lang);

                }
                if (value <= 50 || value >= -50) {
                    if (!sensor_data) {
                        sensor_data = true;
                    }
                    gauge_temperature.set(value);
                    document.getElementById("temperature_label").innerHTML = value + " °C"
                }
                break;
            case "Humidity":
                if (value <= 100 || value >= 0) {
                    gauge_humidity.set(value);
                    document.getElementById("humidity_label").innerHTML = value + " %"
                }
                break;
            case "Pressure":
                if (value <= 1040 || value >= 970) {
                    gauge_pressure.set(value);
                    document.getElementById("pressure_label").innerHTML = value + " hPA"
                }
                break;
        }
    }
}

function serial_error(error) {
    document.getElementById("app_status").innerHTML = "⚠️ Communication error, try to unplug/replug your board";
    translate_all(lang);
}

function serial_start() {
    setTimeout(no_data, 2000);
    document.getElementById("app_status").innerHTML = "🔌Board connected";
    translate_all(lang);
}

serial.setRead(serial_read);
serial.setError(serial_error);
serial.setStart(serial_start);
translate_all(lang);