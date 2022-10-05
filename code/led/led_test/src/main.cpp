#include <Arduino.h>

#ifdef LOLIN_D32
  const int LED_PIN = 5;
#endif

#ifdef M5STICKC
  const int LED_PIN = 10;
#endif

#ifdef WEMOS_D1_MINI
  const int LED_PIN = D4;
#endif

void setup() {
  Serial.begin(115200);
  Serial.println("LED Blink - https://usini.eu/espress/");
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  Serial.println("ON");
  digitalWrite(LED_PIN, HIGH);
  delay(1000);
  Serial.println("OFF");
  digitalWrite(LED_PIN, LOW);
  delay(1000);
}

