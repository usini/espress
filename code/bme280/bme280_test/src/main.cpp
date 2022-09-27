/***************************************************************************
  This is a library for the BME280 humidity, temperature & pressure sensor

  Designed specifically to work with the Adafruit BME280 Breakout
  ----> http://www.adafruit.com/products/2650

  These sensors use I2C or SPI to communicate, 2 or 4 pins are required
  to interface. The device's I2C address is either 0x76 or 0x77.

  Adafruit invests time and resources providing this open source code,
  please support Adafruit andopen-source hardware by purchasing products
  from Adafruit!

  Written by Limor Fried & Kevin Townsend for Adafruit Industries.
  BSD license, all text above must be included in any redistribution
  See the LICENSE file for details.
 ***************************************************************************/

#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>

Adafruit_BME280 bme; // I2C

#ifdef M5STICKC
TwoWire I2CBME = TwoWire(0);
#endif

unsigned long delayTime;
bool sensor_detected = false;
void printValues()
{
    Serial.print("Temperature = ");
    Serial.print(bme.readTemperature());
    Serial.println(" °C");

    Serial.print("Pressure = ");

    Serial.print(bme.readPressure() / 100.0F);
    Serial.println(" hPa");

    Serial.print("Humidity = ");
    Serial.print(bme.readHumidity());
    Serial.println(" %");

    Serial.println();
}

bool bme_begin(){
    #ifdef M5STICKC
    return bme.begin(0x76, &I2CBME);
    #endif

    #ifdef LOLIN_D32
    return bme.begin(0x76);
    #endif
}

void setup()
{
    Serial.begin(115200);
    #ifdef M5STICKC
    pinMode(10, OUTPUT);
    digitalWrite(10, LOW);
    uint32_t frequency = 100000;
    I2CBME.begin(0, 26, frequency);
    #endif

    Serial.println(F("BME280 test"));
    sensor_detected = bme_begin();
    delayTime = 50;
    Serial.println();
}

void loop()
{
    sensor_detected = true;
    if (sensor_detected)
    {
        printValues();
        delay(delayTime);
    }
    else
    {
        Serial.println("Sensor Error");
        sensor_detected = bme_begin();
        delay(1000);
    }
}
