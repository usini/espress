#include <Arduino.h>
#include <IRremote.hpp>

#ifdef ARDUINO_UNO
const int IR_RECEIVE_PIN = 2;
#endif

#ifdef LOLIN_D32
const int IR_RECEIVE_PIN = 15;
#endif

#ifdef M5STICKC
const int IR_RECEIVE_PIN = 26;
#endif

#ifdef WEMOS_D1_MINI
const int IR_RECEIVE_PIN = D5;
#endif

void setup()
{
  Serial.begin(115200);
  Serial.println("IR Receiver - https://usini.eu/espress/");
  IrReceiver.begin(IR_RECEIVE_PIN, ENABLE_LED_FEEDBACK);
  Serial.print(F("Ready to receive IR signals of protocols: "));
  printActiveIRProtocols(&Serial);
}

void loop()
{
  if (IrReceiver.decode())
  {
    Serial.println();
    IrReceiver.printIRResultMinimal(&Serial);
    IrReceiver.resume();
  }
}