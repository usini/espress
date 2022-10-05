#include <Arduino.h>

#ifdef M5STICKC
void setup(){
  Serial.begin(115200);
  Serial.println("Not Supported");
}
void loop(){
  Serial.println("Not Supported");
  delay(1000);
}
#else
#include "AudioFileSourcePROGMEM.h"
#include "AudioGeneratorMOD.h"
#include "AudioOutputI2S.h"
#if defined(ESP32)
    #include <WiFi.h>
#else
    #include <ESP8266WiFi.h>
#endif

// enigma.mod sample from the mod archive: https://modarchive.org/index.php?request=view_by_moduleid&query=42146
#include "enigma.h"

AudioGeneratorMOD *mod;
AudioFileSourcePROGMEM *file;
AudioOutputI2S *out;

void setup()
{

  WiFi.mode(WIFI_OFF); //WiFi.forceSleepBegin();
  Serial.begin(115200);
  delay(1000);

  audioLogger = &Serial;
  file = new AudioFileSourcePROGMEM( enigma_mod, sizeof(enigma_mod) );
  out = new AudioOutputI2S();
  #ifdef ESP32
  out->SetPinout(26,25,27);
  #endif

  mod = new AudioGeneratorMOD();
  mod->SetBufferSize(3*1024);
  mod->SetSampleRate(44100);
  mod->SetStereoSeparation(32);
  mod->begin(file, out);
}

void loop()
{
  if (mod->isRunning()) {
    if (!mod->loop()) mod->stop();
  } else {
    Serial.printf("MOD done\n");
    delay(1000);
  }
}
#endif


