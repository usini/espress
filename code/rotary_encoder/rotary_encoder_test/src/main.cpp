#include <Arduino.h>
#include <ezButton.h>

#ifdef ARDUINO_UNO
#include <Encoder.h>
const int ENCODER_CLK = 5;
const int ENCODER_DT = 6;
Encoder encoder(ENCODER_CLK, ENCODER_DT);
const int LED_PIN = 13;
ezButton button(7); 
#endif

#ifdef LOLIN_D32
#include <ESP32Encoder.h>
ESP32Encoder encoder;
const int LED_PIN = 5;
const int ENCODER_CLK = 17;
const int ENCODER_DT = 16;
ezButton button(4); 
#endif

#ifdef M5STICKC
#include <ESP32Encoder.h>
ESP32Encoder encoder;
const int LED_PIN = 10;
const int ENCODER_CLK = 26;
const int ENCODER_DT = 36;
ezButton button(0); 
#endif

#ifdef WEMOS_D1_MINI
#include "ESPRotary.h"
#define ENCODER_CLK D1
#define ENCODER_DT D2
#define CLICKS_PER_STEP 4
ezButton button(D3); 
ESPRotary encoder;
const int LED_PIN = D4;
#endif

long oldPosition = 0;

#ifdef ESP8266
void rotate(ESPRotary &encoder)
{
  Serial.println(encoder.getPosition());
}
#endif

void setup()
{
  Serial.begin(115200);
  Serial.println("Rotary Encoder - https://usini.eu/espress/");
  pinMode(LED_PIN, OUTPUT);
  button.setDebounceTime(50);

#ifdef ESP32
  ESP32Encoder::useInternalWeakPullResistors = UP;
  encoder.attachSingleEdge(ENCODER_DT, ENCODER_CLK);
#endif

#ifdef ESP8266
  encoder.begin(ENCODER_DT, ENCODER_CLK, CLICKS_PER_STEP);
  encoder.setChangedHandler(rotate);
#endif
}

void loop()
{
  button.loop();
  if(button.isReleased()){
    Serial.println("Button Pressed");
  }

#ifdef ESP8266
  encoder.loop();
#endif

#ifdef ESP32
  if (oldPosition != encoder.getCount())
  {
    oldPosition = encoder.getCount();
    Serial.println(encoder.getCount());
  }
#endif

#ifdef ARDUINO_UNO
  long newPosition = encoder.read();
  if (newPosition != oldPosition)
  {
    if (newPosition == oldPosition + 4 || newPosition == oldPosition - 4)
    {
      oldPosition = newPosition;
      Serial.println(newPosition >> 2);
    }
  }
#endif
}
