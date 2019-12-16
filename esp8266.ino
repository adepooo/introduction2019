#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include<cstring>
#include<Servo.h>
Servo myservo;
#define servoPin  2
int pos=0;
int MAXlit=600,MINlit=545;
char status1,status2;
char lastStatus1='0';
const char* ssid = "Honor V8";      // wifi名
const char* password = "12345678";  // wifi密码
const char* host = "api.heclouds.com";  // 连接的主机域名
const int httpsPort = 80;  // https端口
String API_KEY = "hUFB9YXT=zOlaXdQzusWdUd10=4=";  // onenet的 api key
String deviceId = "573456859";    // onenet的设备ID
float getDataToOnenet1();
float getDataToOnenet2();
void lightOn();
void lightClose();
char readData(String line);
void setup() {
  Serial.begin(9600);
  Serial.print("connecting to ");
  Serial.println(ssid);
  WiFi.mode(WIFI_STA);    // 设置wifi模式
  WiFi.begin(ssid, password);   // 连接wifi
  while (WiFi.status() != WL_CONNECTED) { //判断连接状态
    delay(500);
    Serial.print(".");
    
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  myservo.attach(servoPin);
  pinMode(4,OUTPUT);
}
void loop() {
  float data1 = getDataToOnenet1();
  float data2 = getDataToOnenet2();
  //寝室大灯
  if(lastStatus1!=status1)
  {
    if(status1=='0')
      lightClose();
    else if(status1=='1')
      lightOn();
  }
  lastStatus=status1;  

//智能台灯
  if(status2=='0')
    digitalWrite(4, LOW);
  else if(status2=='1')
    digitalWrite(4, HIGH);
  else if(status2=='2')//智能模式
  {
    int sensorValue=analogRead(A0);
    Serial.println(sensorValue);
    if(sensorValue>MAXlit)
      digitalWrite(4, HIGH);
    else if(sensorValue<MINlit)
      digitalWrite(4, LOW);
    else if(sensorValue>=MINlit&&sensorValue<=MAXlit)
    {
      analogWrite(4,map(sensorValue,MINlit,MAXlit,0,255));
    }
  }
  delay(100);
  
}

float getDataToOnenet1(){
  WiFiClient client;         // HTTP
  Serial.print("connecting to ");
  Serial.println(host);
  if (!client.connect(host, httpsPort)) {   // 判断连接情况
    Serial.println("connection failed");
    return -1;
  }
  Serial.print("requesting URL: ");
  // 发送GET请求
  // 组拼url地址
  // 组拼HTTPS请求的Header
  String getStrlight = String("GET /devices/")+deviceId+ "/datapoints?datastream_id=light&limit=1 HTTP/1.1\r\n"+
               "api-key: " + API_KEY + "\r\n" +
               "Host:" + host + "\r\n"
               +"Connection:close\r\n\r\n";
  client.print(getStrlight);
  Serial.println("request sent");
  // 读取连接情况
  while (client.connected()) {
    String line = client.readStringUntil('\n');
    if (line == "\r") {
      Serial.println("headers received");
      break;
    }
  }
  // 读取数据
  String line = client.readStringUntil('~');
  Serial.println("reply was:");
  Serial.println("==========");
  Serial.println(line);   // 打印接受到的数据
  Serial.println("==========");
  Serial.println("closing connection");

  status1=readData(line);
  return 0;
}
float getDataToOnenet2(){
  // Use WiFiClientSecure class to create TLS connection
  WiFiClient client;         // HTTP
  Serial.print("connecting to ");
  Serial.println(host);
  if (!client.connect(host, httpsPort)) {   // 判断连接情况
    Serial.println("connection failed");
    return -1;
  }
  Serial.print("requesting URL: ");
  // 发送GET请求
  // 组拼url地址
  // 组拼HTTPS请求的Header
  String getStrintelight = String("GET /devices/")+deviceId+ "/datapoints?datastream_id=intelight&limit=1 HTTP/1.1\r\n"+
               "api-key: " + API_KEY + "\r\n" +
               "Host:" + host + "\r\n"
               +"Connection:close\r\n\r\n";
  client.print(getStrintelight);
  Serial.println("request sent");
  // 读取连接情况
  while (client.connected()) {
    String line = client.readStringUntil('\n');
    if (line == "\r") {
      Serial.println("headers received");
      break;
    }
  }
  // 读取数据
  String line = client.readStringUntil('~');
  Serial.println("reply was:");
  Serial.println("==========");
  Serial.println(line);   // 打印接受到的数据
  Serial.println("==========");
  Serial.println("closing connection");

  status2=readData(line);
  return 0;
}
 
char readData(String line)
{
  int len=line.length();
  char a;
  if (len > 0)
  {  
    for (int i = 0; i < len; i++) 
    {
      if((char)line[i]=='v'&&(char)line[i+1]=='a'&&(char)line[i+2]=='l'&&(char)line[i+3]=='u'&&(char)line[i+4]=='e')
      {
            a=line[i+8];
            break;
        }
    } 
  }
  return a;
}
void lightOn()
{
    for (pos = 0; pos <= 110; pos += 2) 
  {
    myservo.write(pos);       
    delay(15);
  }
}
void lightClose()
{
  for (pos = 110; pos >= 1; pos -= 2) 
  {
    myservo.write(pos);         
    delay(15);
}
}
