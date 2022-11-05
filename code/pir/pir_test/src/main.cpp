#include <Arduino.h>

#ifdef ARDUINO_UNO
const int LED_PIN = 13;
const int PIR_PIN = 13;
#endif

#ifdef LOLIN_D32
const int LED_PIN = 5;
const int PIR_PIN = 5;
#endif

#ifdef M5STICKC
const int LED_PIN = 10;
const int PIR_PIN = 26;

#endif

#ifdef WEMOS_D1_MINI
const int LED_PIN = D4;
const int PIR_PIN = D4;
#endif

bool triggered = false;

void setup()
{
  Serial.begin(115200);
  Serial.println("PIR Sensor - https://usini.eu/espress/");
  pinMode(PIR_PIN, INPUT);
}

void loop()
{
  if (digitalRead(PIR_PIN))
  {
    if (!triggered)
    {
      Serial.println("DETECTED");
      triggered = true;
    }
  }
  else
  {
    if (triggered)
    {
      Serial.println("NOT DETECTED");
      triggered = false;
    }
  }
}
