#include <Arduino.h>

#ifdef ESP8266
#include <ESP8266WiFi.h>
#include <espnow.h>
#else
#include <WiFi.h>
#include <esp_now.h>
#endif

#ifdef WEMOS_D1_MINI
const int SWITCH_PIN = D1;
const int LED_PIN = D4;
#define SWITCH_PULLUP
#define INVERT_LED
#endif

#ifdef LOLIN_D32
const int SWITCH_PIN = 13;
const int LED_PIN = 5;
#define SWITCH_PULLUP
#define INVERT_LED
#endif

#ifdef M5STICKC
const int SWITCH_PIN = 37;
const int LED_PIN = 10;
#define INVERT_LED
#define SWITCH_PULLUP
#endif

bool state_button = true;

uint8_t broadcastAddress[] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};

#ifndef ESP8266
esp_now_peer_info_t peerInfo;
#endif

// Structure example to send data
// Must match the receiver structure
typedef struct struct_message
{
	bool led_state;
} struct_message;

struct_message myData;

void setupComponents()
{
	pinMode(LED_PIN, OUTPUT);

#ifdef SWITCH_PULLUP
	pinMode(SWITCH_PIN, INPUT_PULLUP);
#else
	pinMode(SWITCH_PIN, INPUT);
#endif

#ifdef INVERT_LED
	digitalWrite(LED_PIN, HIGH);
#endif
}

void receive()
{

	if (myData.led_state)
	{
#ifdef INVERT_LED
		digitalWrite(LED_PIN, LOW);
#else
		digitalWrite(LED_PIN, HIGH);
#endif
	}
	else
	{
#ifdef INVERT_LED
		digitalWrite(LED_PIN, HIGH);
#else
		digitalWrite(LED_PIN, LOW);
#endif
	}
}

void change_state()
{

	if (state_button != digitalRead(SWITCH_PIN))
	{

		state_button = digitalRead(SWITCH_PIN);
#if defined(SWITCH_PULLUP)
		myData.led_state = !state_button;
#else
		myData.led_state = state_button;
#endif

#if defined(INVERT_LED)
		digitalWrite(LED_PIN, !myData.led_state);
#else
		digitalWrite(LED_PIN, myData.led_state);
#endif

		Serial.println("Sending data");
		esp_now_send(broadcastAddress, (uint8_t *)&myData, sizeof(myData));
	}
}

#ifdef ESP8266
void OnDataRecv(uint8_t *mac, uint8_t *incomingData, uint8_t len)
{
	memcpy(&myData, incomingData, sizeof(myData));
	receive();
}

void OnDataSent(uint8_t *mac_addr, uint8_t sendStatus)
{
	Serial.print("Last Packet Send Status: ");
	if (sendStatus == 0)
	{
		Serial.println("Delivery success");
	}
	else
	{
		Serial.println("Delivery fail");
	}
}
#else

void OnDataRecv(const unsigned char *mac, const unsigned char *incomingData, int len)
{
	memcpy(&myData, incomingData, sizeof(myData));
	receive();
}

void OnDataSent(const uint8_t *mac_addr, esp_now_send_status_t sendStatus)
{
	Serial.print("Last Packet Send Status: ");
	if (sendStatus == ESP_NOW_SEND_SUCCESS)
	{
		Serial.println("Delivery success");
	}
	else
	{
		Serial.println("Delivery fail");
	}
}
#endif

void setup()
{
	Serial.begin(115200);
	Serial.println("ESPNow Switch Broadcast - https://usini.eu/espress");

	setupComponents();
	// Set device in STA mode to begin with
	Serial.println("Wifi mode STA");
	WiFi.mode(WIFI_STA);
	if (esp_now_init() != 0)
	{
		Serial.println("Error initializing ESP-NOW");
		return;
	}

#ifdef ESP8266
	esp_now_set_self_role(ESP_NOW_ROLE_COMBO);
#endif

	esp_now_register_send_cb(OnDataSent);
	esp_now_register_recv_cb(OnDataRecv);

#ifdef ESP8266
	esp_now_add_peer(broadcastAddress, ESP_NOW_ROLE_COMBO, 1, NULL, 0);
#else
	// Register peer
	memcpy(peerInfo.peer_addr, broadcastAddress, 6);
	peerInfo.channel = 0;
	peerInfo.encrypt = false;

	// Add peer
	if (esp_now_add_peer(&peerInfo) != ESP_OK)
	{
		Serial.println("Failed to add peer");
		return;
	}
#endif
}

uint8_t count = 0;
void loop()
{
	change_state();
}
