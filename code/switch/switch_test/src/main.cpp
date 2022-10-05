#include <Arduino.h>

#ifdef WEMOS_D1_MINI
const int SWITCH_PIN = D1;
const int LED_PIN = D4;
#define SWITCH_PULLUP
const bool ON_STATE = LOW;
#endif

#ifdef LOLIN_D32
const int SWITCH_PIN = 13;
const int LED_PIN = 5;
#define SWITCH_PULLUP
const bool ON_STATE = LOW;
#endif

#ifdef M5STICKC
const int SWITCH_PIN = 37;
const int LED_PIN = 10;
#define SWITCH_PULLUP
const bool ON_STATE = LOW;
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
  if (digitalRead(SWITCH_PIN) == ON_STATE)
  {
    Serial.println("Pressed");
    digitalWrite(LED_PIN, HIGH);
  }
  else
  {
    digitalWrite(LED_PIN, LOW);
  }
}
