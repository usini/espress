/**
ESPNOW - Control LED with a Switch Remotely
Author : µsini (Rémi Sarrailh)

Source---------------------------
Date: 28th September 2017
Original Author: Arvind Ravulavaru <https://github.com/arvindr21>
modified by Daniel de kock
Purpose: ESPNow Communication using Broadcast

Resources: (A bit outdated)
a. https://espressif.com/sites/default/files/documentation/esp-now_user_guide_en.pdf
b. http://www.esploradores.com/practica-6-conexion-esp-now/
*/

#include <Arduino.h>
#include <esp_now.h>
#include <WiFi.h>
#include <esp_wifi.h>

#ifdef LOLIN_D32
const int BUTTON_PIN = 13;
const int LED_PIN = 5;
#endif

#ifdef M5STICKC
const int BUTTON_PIN = 37;
const int LED_PIN = 10;
#endif

bool state_button = true;

void setupComponents(){
	pinMode(LED_PIN, OUTPUT);
	
	#ifdef LOLIN_D32
	pinMode(BUTTON_PIN,INPUT_PULLUP);
	#endif

	#ifdef M5STICKC
	pinMode(BUTTON_PIN,INPUT);
	#endif
}

void receive(String s) {
 if(s == "1"){
    digitalWrite(LED_PIN, HIGH);
  } else if (s == "0") {
	digitalWrite(LED_PIN, LOW);
    Serial.println("RECV Button ON");
  }
}

void sendData(uint8_t counter);
void send() {
  if(state_button != digitalRead(BUTTON_PIN)) {
	digitalWrite(LED_PIN, digitalRead(BUTTON_PIN));
    state_button = digitalRead(BUTTON_PIN);
  	sendData(int(state_button));
  }
}

// Global copy of slave / peer device
// for broadcasts the addr needs to be ff:ff:ff:ff:ff:ff
// all devices on the same channel
esp_now_peer_info_t slave;

#define CHANNEL 1
#define PRINTSCANRESULTS 0
#define DELETEBEFOREPAIR 0

bool manageSlave();
void deletePeer();

// Init ESP Now with fallback
void InitESPNow() {
	Serial.println("Init ESPNow");
	if (esp_now_init() == ESP_OK) {
		Serial.println("ESPNow Init Success");
	}
	else {
		Serial.println("ESPNow Init Failed");
		// Retry InitESPNow, add a counte and then restart?
		// InitESPNow();
		// or Simply Restart
		ESP.restart();
	}
}
void initBroadcastSlave() {
	// clear slave data
	memset(&slave, 0, sizeof(slave));
	for (int ii = 0; ii < 6; ++ii) {
		slave.peer_addr[ii] = (uint8_t)0xff;
	}
	slave.channel = CHANNEL; // pick a channel
	slave.encrypt = 0; // no encryption
	manageSlave();
}


// Check if the slave is already paired with the master.
// If not, pair the slave with master
bool manageSlave() {
	if (slave.channel == CHANNEL) {
		if (DELETEBEFOREPAIR) {
			deletePeer();
		}

		Serial.print("Slave Status: ");
		const esp_now_peer_info_t *peer = &slave;
		const uint8_t *peer_addr = slave.peer_addr;
		// check if the peer exists
		bool exists = esp_now_is_peer_exist(peer_addr);
		if (exists) {
			// Slave already paired.
			Serial.println("Already Paired");
			return true;
		}
		else {
			// Slave not paired, attempt pair
			esp_err_t addStatus = esp_now_add_peer(peer);
			if (addStatus == ESP_OK) {
				// Pair success
				Serial.println("Pair success");
				return true;
			}
			else if (addStatus == ESP_ERR_ESPNOW_NOT_INIT) {
				// How did we get so far!!
				Serial.println("ESPNOW Not Init");
				return false;
			}
			else if (addStatus == ESP_ERR_ESPNOW_ARG) {
				Serial.println("Invalid Argument");
				return false;
			}
			else if (addStatus == ESP_ERR_ESPNOW_FULL) {
				Serial.println("Peer list full");
				return false;
			}
			else if (addStatus == ESP_ERR_ESPNOW_NO_MEM) {
				Serial.println("Out of memory");
				return false;
			}
			else if (addStatus == ESP_ERR_ESPNOW_EXIST) {
				Serial.println("Peer Exists");
				return true;
			}
			else {
				Serial.println("Not sure what happened");
				return false;
			}
		}
	}
	else {
		// No slave found to process
		Serial.println("No Slave found to process");
		return false;
	}
}

void deletePeer() {
	const esp_now_peer_info_t *peer = &slave;
	const uint8_t *peer_addr = slave.peer_addr;
	esp_err_t delStatus = esp_now_del_peer(peer_addr);
	Serial.print("Slave Delete Status: ");
	if (delStatus == ESP_OK) {
		// Delete success
		Serial.println("Success");
	}
	else if (delStatus == ESP_ERR_ESPNOW_NOT_INIT) {
		// How did we get so far!!
		Serial.println("ESPNOW Not Init");
	}
	else if (delStatus == ESP_ERR_ESPNOW_ARG) {
		Serial.println("Invalid Argument");
	}
	else if (delStatus == ESP_ERR_ESPNOW_NOT_FOUND) {
		Serial.println("Peer not found.");
	}
	else {
		Serial.println("Not sure what happened");
	}
}

// send data
void sendData(uint8_t counter) {
	uint8_t data = counter;
	// const uint8_t *peer_addr = NULL;
	const uint8_t *peer_addr = slave.peer_addr;

	Serial.print("Sending: "); Serial.println(data);
	esp_err_t result = esp_now_send(peer_addr, &data, sizeof(data));
	Serial.print("Send Status: ");
	if (result == ESP_OK) {
		Serial.println("Success");
	}
	else if (result == ESP_ERR_ESPNOW_NOT_INIT) {
		// How did we get so far!!
		Serial.println("ESPNOW not Init.");
	}
	else if (result == ESP_ERR_ESPNOW_ARG) {
		Serial.println("Invalid Argument");
	}
	else if (result == ESP_ERR_ESPNOW_INTERNAL) {
		Serial.println("Internal Error");
	}
	else if (result == ESP_ERR_ESPNOW_NO_MEM) {
		Serial.println("ESP_ERR_ESPNOW_NO_MEM");
	}
	else if (result == ESP_ERR_ESPNOW_NOT_FOUND) {
		Serial.println("Peer not found.");
	}
	else {
		Serial.println("Not sure what happened");
	}
}

// callback when data is sent from Master to Slave
void OnDataSent(const uint8_t *mac_addr, esp_now_send_status_t status) {
	char macStr[18];
	snprintf(macStr, sizeof(macStr), "%02x:%02x:%02x:%02x:%02x:%02x",
		mac_addr[0], mac_addr[1], mac_addr[2], mac_addr[3], mac_addr[4], mac_addr[5]);
	Serial.print("Last Packet Sent to: "); Serial.println(macStr);
	Serial.print("Last Packet Send Status: "); Serial.println(status == ESP_NOW_SEND_SUCCESS ? "Delivery Success" : "Delivery Fail");
}

// callback when data is recv from Master
void OnDataRecv(const uint8_t *mac_addr, const uint8_t *data, int data_len) {
	char macStr[18];
	snprintf(macStr, sizeof(macStr), "%02x:%02x:%02x:%02x:%02x:%02x",
		mac_addr[0], mac_addr[1], mac_addr[2], mac_addr[3], mac_addr[4], mac_addr[5]);
	Serial.print("Last Packet Recv from: "); Serial.println(macStr);
	Serial.print("Last Packet Recv Data: "); Serial.println(*data);
	Serial.println("");
  String s = String(*data);
	receive(s); 
}



void setup() {
	Serial.begin(115200);
	Serial.println("ESPNow Multicast example");

	setupComponents();
	//Set device in STA mode to begin with
	Serial.println("Wifi mode STA");
	WiFi.mode(WIFI_STA);
	Serial.println("Wifi mode STA OK");

	// Init ESPNow with a fallback logic
	InitESPNow();
	// Once ESPNow is successfully Init, we will register for Send CB to
	// get the status of Trasnmitted packet
	esp_now_register_send_cb(OnDataSent);
	esp_now_register_recv_cb(OnDataRecv);

	// add a broadcast peer
	initBroadcastSlave();
}


uint8_t count = 0;
void loop() {
	send();
}
