// Animates white pixels to simulate flying through a star field
#include <Arduino.h>

#ifdef UNSUPPORTED
void setup()
{
   Serial.begin(115200);
}

void loop()
{
  Serial.println("Not supported");
}
#else

#include <TFT_eSPI.h>
#include <SPI.h>
#include "FS.h"
#include <LITTLEFS.h>
#include <TJpg_Decoder.h>

TFT_eSPI tft = TFT_eSPI(); // Ecran TFT

bool tft_output(int16_t x, int16_t y, uint16_t w, uint16_t h, uint16_t *bitmap)
{
  if (y >= tft.height())
    return 0;
  tft.pushImage(x, y, w, h, bitmap);
  return 1;
}

void setup_tft()
{
  Serial.begin(115200);
  tft.begin();
  if (!LittleFS.begin())
  {
    Serial.println("LittleFS is not properly setup");
    return;
  } else {
    Serial.println("Little FS OK!");
  }
  tft.setSwapBytes(true);
  TJpgDec.setJpgScale(1);
  TJpgDec.setCallback(tft_output);
}

void display_image(const char *filename)
{
  Serial.println(filename);
  uint16_t w = 0, h = 0;
  TJpgDec.drawFsJpg(0, 0, filename, LittleFS);
}

void setup()
{
  setup_tft();
}

void loop()
{
  display_image("/ia.jpg");
  delay(3000);
  display_image("/ia2.jpg");
  delay(3000);
  display_image("/ia3.jpg");
  delay(3000);
  display_image("/ia4.jpg");
  delay(3000);
  display_image("/ia5.jpg");
  delay(3000);
  display_image("/ia6.jpg");
  delay(3000);
  display_image("/ia7.jpg");
  delay(3000);
}

#endif