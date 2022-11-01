#include <Arduino.h>

#ifdef ARDUINO_UNO
  const int SWITCH_PIN = 12;
  const int LED_PIN = 13;
  const bool BUTTONON_STATE = LOW;
  const bool LEDON_STATE = HIGH;
  #define SWITCH_PULLUP 
#endif

#ifdef WEMOS_D1_MINI
const int SWITCH_PIN = D1;
const int LED_PIN = D4;
#define SWITCH_PULLUP
const bool BUTTONON_STATE = LOW;
const bool LEDON_STATE = LOW;
#endif

#ifdef LOLIN_D32
const int SWITCH_PIN = 13;
const int LED_PIN = 5;
#define SWITCH_PULLUP
const bool BUTTONON_STATE = LOW;
const bool LEDON_STATE = LOW;
#endif

#ifdef M5STICKC
const int SWITCH_PIN = 37;
const int LED_PIN = 10;
#define SWITCH_PULLUP
const bool BUTTONON_STATE = LOW;
const bool LEDON_STATE = LOW;
#endif

void setup()
{
  Serial.begin(115200);
  Serial.println("Switch - https://usini.eu/espress");

  #ifdef SWITCH_PULLUP
    pinMode(SWITCH_PIN, INPUT_PULLUP);
  #else
    pinMode(SWITCH_PIN, INPUT);
  #endif

  pinMode(LED_PIN, OUTPUT);
}


void loop()
{
  if (digitalRead(SWITCH_PIN) == BUTTONON_STATE)
  {
    Serial.println("Pressed");
    digitalWrite(LED_PIN, LEDON_STATE);
  }
  else
  {
    digitalWrite(LED_PIN, !LEDON_STATE);
  }
}
