#include <ESP32Servo.h>
#include <FirebaseESP32.h>
#include <DHT.h>



#define FIREBASE_HOST "https://iotwebbased-32566-default-rtdb.firebaseio.com/"
#define FIREBASE_AUTH "gIpCrOWP6cbk7LGlMsQKQjATpEPSeKTix8Gh4n89"
#define WIFI_SSID "Do Ban" // Thay đổi tên wifi của bạn
#define WIFI_PASSWORD "01694132025" // Thay đổi password wifi của bạn
#define DHTPIN 14    // Chân dữ liệu của DHT 11 , với NodeMCU chân D5 GPIO là 14
#define DHTTYPE DHT11   // DHT 11
#define servoPin 13  
#define lightPin 16  
#define buzzerPin 17  
#define rainPin 34
DHT dht(DHTPIN, DHTTYPE);
FirebaseData fbdo;

unsigned long sendDataPrevMillis = 0;
int pos = 0;
Servo myservo;
float h, t;
int l;
int a;

void setup() {
  pinMode(rainPin,INPUT);
  pinMode(servoPin, OUTPUT);
  pinMode(lightPin, OUTPUT);
  pinMode(buzzerPin, OUTPUT);
  ESP32PWM::allocateTimer(0);
  ESP32PWM::allocateTimer(1);
  ESP32PWM::allocateTimer(2);
  ESP32PWM::allocateTimer(3);
  myservo.setPeriodHertz(50);    // standard 50 hz servo
  myservo.attach(servoPin, 500, 2500);
  Serial.begin(115200);
  delay(1000);
  WiFi.begin (WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Dang ket noi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  dht.begin();
  Serial.println ("");
  Serial.println ("Da ket noi WiFi!");
  Serial.println(WiFi.localIP());
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
}
void loop() {
  Display_Serial();
}
void ReadDHT( float temp, float Hum, float L_rain){
  Firebase.setFloat( fbdo,"/sensor/temperature", temp);
  Firebase.setFloat ( fbdo,"/sensor/humidity", Hum);
  Firebase.setFloat ( fbdo,"/sensor/rain", L_rain);  
}

void Display_Serial()
{
     if (Firebase.ready() && (millis() - sendDataPrevMillis > 500 || sendDataPrevMillis == 0))
  {
    sendDataPrevMillis = millis();
    bool servoVal;
    Serial.printf("Servo status: %s\n", Firebase.getBool(fbdo, F("/status/servo"), &servoVal) ? servoVal ? "true" : "false" : fbdo.errorReason().c_str());

    if(servoVal){
      for (pos = 0; pos <= 180; pos += 1) { 
    myservo.write(pos);    
    delay(15);             
  }
  for (pos = 180; pos >= 0; pos -= 1) { 
    myservo.write(pos);    
    delay(15);
  }
      }
    else{
      myservo.write(0); 
    }
    bool lightVal;
    Serial.printf("Light Status: %s\n", Firebase.getBool(fbdo, F("/status/light"), &lightVal) ? lightVal ? "true" : "false" : fbdo.errorReason().c_str());
    if(lightVal){
      digitalWrite(lightPin,HIGH);
      }
    else{
      digitalWrite(lightPin,LOW);
    }
    bool buzzerVal;
    Serial.printf("Buzzer Status: %s\n", Firebase.getBool(fbdo, F("/status/buzzer"), &buzzerVal) ? buzzerVal ? "true" : "false" : fbdo.errorReason().c_str());
    if(buzzerVal){
      digitalWrite(buzzerPin,HIGH);
      }
    else{
      digitalWrite(buzzerPin,LOW);
    }
  }
  
  h = dht.readHumidity();
  t = dht.readTemperature();  // Đọc nhiệt độ theo độ C
//  l = map(analogRead(34), 150, 440, 1023, 0);
  a = analogRead(rainPin);
  l = map(analogRead(rainPin), 4095, 0, 0, 100);
  if (isnan(h) || isnan(t)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }
  
  ReadDHT(t,h,l);
  Serial.print("Nhiet do: ");
  Serial.print(t);
  Serial.print("*C  ");
  Serial.print("Do am: ");
  Serial.print(h);
  Serial.print("%  ");        
  Serial.print("Luong mua: ");
  Serial.print(l);
  Serial.println("%  ");
}
