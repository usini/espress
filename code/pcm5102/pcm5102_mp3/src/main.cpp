#include <Arduino.h>
#ifdef M5STICKC
void setup()
{
  Serial.begin(115200);
  Serial.println("Not Supported");
}
void loop()
{
  Serial.println("Not Supported");
  delay(1000);
}
#else
#ifdef ESP32
#include <WiFi.h>
#include "SPIFFS.h"
#else
#include <ESP8266WiFi.h>
#endif
#include "AudioFileSourceLittleFS.h"
#include "AudioFileSourceID3.h"
#include "AudioGeneratorMP3.h"
#include "AudioOutputI2S.h"

AudioGeneratorMP3 *mp3;
AudioFileSourceLittleFS *file;
AudioOutputI2S *out;
AudioFileSourceID3 *id3;

void setup()
{
  WiFi.mode(WIFI_OFF);
  Serial.begin(115200);
  LittleFS.begin();
  Serial.printf("Sample MP3 playback begins...\n");

  audioLogger = &Serial;
  file = new AudioFileSourceLittleFS("/nyan.mp3");
  id3 = new AudioFileSourceID3(file);
  out = new AudioOutputI2S();
  mp3 = new AudioGeneratorMP3();
  mp3->begin(id3, out);
}

void loop()
{
  if (mp3->isRunning())
  {
    if (!mp3->loop())
    {
      mp3->stop();
      delete file;
      delete mp3;
      mp3 = new AudioGeneratorMP3();
    }
  }
  else
  {
    file = new AudioFileSourceLittleFS("/nyan.mp3");
    mp3->begin(file, out);
  }
}

#endif