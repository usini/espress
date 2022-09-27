#include <Arduino.h>

void setup()
{
  Serial.begin(115200);
  Serial.println("Button - https://usini.eu/espress");

#ifdef LOLIN_D32
  pinMode(5, OUTPUT);        // LOLIN D32
  pinMode(13, INPUT_PULLUP); // ESP32
#endif

#ifdef M5STICKC
  pinMode(10, OUTPUT); // M5STICK C
  pinMode(37, INPUT);  // M5STICK C
#endif
}

void loop()
{

#ifdef LOLIN_D32
  if (!digitalRead(13))
  {
    Serial.println("Pressed");
    digitalWrite(5, LOW);
  }
  else
  {
    Serial.println("Not Pressed");
    digitalWrite(5, HIGH);
  }
#endif

#ifdef M5STICKC
  if (!digitalRead(37))
  {
    Serial.println("Pressed");
    digitalWrite(10, LOW);
  }
  else
  {
    Serial.println("Not Pressed");
    digitalWrite(10, HIGH);
  }
#endif
}
