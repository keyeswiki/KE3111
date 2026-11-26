// 添加相关库
#include <WiFi.h>
#include <WebServer.h>
#include <ESP32Servo.h>

// =============== WIFI配置 ===============
// 设置WiFi名称和WiFi密码, ESP32 仅支持 2.4GHz 频段的无线网络  
const char* ssid = "ChinaNet_2.4G"; // 替换为你自己的WiFi名称
const char* password = "ChinaNet@233"; // 替换为你自己的WiFi密码

WiFiServer server(80); // 将网页端口设置为80。你可以直接输入IP地址访问网页,无需输入端口号

// 4 个舵机引脚
const int BaseServoPin = 16; // 底座舵机
const int LeftServoPin = 17; // 左关节舵机
const int RightServoPin = 4; // 右关节舵机
const int GripperServoPin = 5; // 夹爪舵机

// 舵机对象
Servo myservo1;
Servo myservo2;
Servo myservo3;
Servo myservo4;

// 舵机当前角度（开机初始状态）
int BaseServoAngle = 90;
int LeftServoAngle = 60;
int RightServoAngle = 130;
int GripperServoAngle = 0;

void setup() {
  Serial.begin(115200); // 设置波特率为115200
  
  // 将4个舵机绑定到对应舵机对象上
  myservo1.attach(BaseServoPin);
  myservo2.attach(LeftServoPin);
  myservo3.attach(RightServoPin);
  myservo4.attach(GripperServoPin);
  delay(100);

  // 连接 WiFi
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected.");

  server.begin();
  Serial.println("Server started");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  // 开机时，四个舵机的初始姿态
  myservo1.write(90);
  delay(200);
  myservo2.write(60);
  delay(200);
  myservo3.write(130);
  delay(200);
  myservo4.write(0);
  delay(200);
}

void loop() {
  WiFiClient client = server.available(); // 尝试接收来自 WiFi 服务器的请求，并将其分配给名为 client 的 WiFiClient 对象
  if (!client) {                         // 该条件语句用于检查是否已成功接受来自客户端的连接。若未成功，则立即终止执行。
    return;
  }
  while (!client.available()) {  // 该循环将一直等待，直到客户端发送请求且数据就绪。等待期间，代码以 1 毫秒为间隔进行延时。
    delay(1);
  }

  String request = client.readStringUntil('\r');
  Serial.println(request);
  client.flush();

  // 读取 4 个舵机当前角度
  BaseServoAngle = myservo1.read();
  LeftServoAngle = myservo2.read();
  RightServoAngle = myservo3.read();
  GripperServoAngle = myservo4.read();

  int pos1 = request.indexOf("slider1=");
  int pos2 = request.indexOf("slider2=");
  int pos3 = request.indexOf("slider3=");
  int pos4 = request.indexOf("slider4=");

  // 解析滑块值：取到字符串末尾，toInt 自动在非数字处停止（不固定截 3 位），再限制 0-180
  if (pos1 != -1) {
    int val1 = constrain(request.substring(pos1 + 8).toInt(), 0, 180);
    Base_Servo_Control(val1);
  }
  if (pos2 != -1) {
    int val2 = constrain(request.substring(pos2 + 8).toInt(), 0, 180);
    Left_Servo_Control(val2);
  }
  if (pos3 != -1) {
    int val3 = constrain(request.substring(pos3 + 8).toInt(), 0, 180);
    Right_Servo_Control(val3);
  }
  if (pos4 != -1) {
    int val4 = constrain(request.substring(pos4 + 8).toInt(), 0, 180);
    Gripper_Servo_Control(val4);
  }

  // ============ HTML 网页（原始字符串，可读性好） ============
  const char webPage[] = R"rawliteral(
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ESP32 Servo Control</title>
<style>
body {font-family: Arial, sans-serif;background-color: #f5f5f5;margin: 0;padding: 0;}
.container {max-width: 100%;margin: 20px auto;padding: 20px;background-color: #fff;border-radius: 10px;box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);}
h1 {text-align: center;color: #333;}
.gauge-container {display: flex;align-items: center;margin-bottom: 20px;width: 100%;}
.gauge-label {flex: 1;text-align: right;margin-right: 10px;font-weight: bold;color: #333;}
.gauge {flex: 2;position: relative;width: 100px;height: 50px;}
.gauge:before {content: '';position: absolute;width: 100%;height: 50%;background: #ddd;border-top-left-radius: 100px;border-top-right-radius: 100px;top: 0;left: 0;}
.gauge:after {content: '';position: absolute;width: 100%;height: 50%;background: #fff;border-top-left-radius: 100px;border-top-right-radius: 100px;top: 2px;left: 0;z-index: 1;}
.gauge .needle {width: 3px;height: 50px;background: #007bff;position: absolute;top: 0;left: 50%;transform-origin: 50% 100%;z-index: 2;}
.gauge .value {position: absolute;width: 100%;text-align: center;top: 50px;left: 0;font-weight: bold;color: #333;}
input[type="range"] {width: calc(100% - 20px);-webkit-appearance: none;appearance: none;height: 10px;border-radius: 5px;background-color: #ddd;outline: none;margin-top: 10px;margin-bottom: 20px;}
input[type="range"]::-webkit-slider-thumb {-webkit-appearance: none;appearance: none;width: 20px;height: 20px;border-radius: 50%;background-color: #007bff;cursor: pointer;}
</style>
</head>
<body>
<div class="container">
<h1>ESP32 机械手臂</h1>
<div class="gauge-container"><div class="gauge-label">底座舵机</div><div class="gauge"><div id="needle1" class="needle" style="transform: rotate(0deg);"></div><div id="value1" class="value">90</div></div></div>
<input type="range" min="0" max="180" value="90" oninput="show(this.value,'1')" onchange="update(this.value,'1')">
<div class="gauge-container"><div class="gauge-label">左关节舵机</div><div class="gauge"><div id="needle2" class="needle" style="transform: rotate(0deg);"></div><div id="value2" class="value">60</div></div></div>
<input type="range" min="0" max="110" value="60" oninput="show(this.value,'2')" onchange="update(this.value,'2')">
<div class="gauge-container"><div class="gauge-label">右关节舵机</div><div class="gauge"><div id="needle3" class="needle" style="transform: rotate(20deg);"></div><div id="value3" class="value">130</div></div></div>
<input type="range" min="60" max="180" value="130" oninput="show(this.value,'3')" onchange="update(this.value,'3')">
<div class="gauge-container"><div class="gauge-label">夹爪舵机</div><div class="gauge"><div id="needle4" class="needle" style="transform: rotate(-50deg);"></div><div id="value4" class="value">0</div></div></div>
<input type="range" min="0" max="100" value="0" oninput="show(this.value,'4')" onchange="update(this.value,'4')">
</div>
<script>
// show(): 拖动滑杆时实时更新数值和指针（只改页面，不发请求）
// 滑杆量程与舵机实际角度一一对应: 底座舵机0-180 / 左关节舵机0-110 / 右关节舵机60-180 / 夹爪舵机0-100
// 指针以各滑杆量程：中点 = 底座舵机90 / 左关节舵机55 / 右关节舵机120 / 夹爪舵机50
function show(val, slider) {
  document.getElementById('value' + slider).innerHTML = val;
  var mid = [90, 55, 120, 50][slider - 1];
  var rotation = val - mid;
  document.getElementById('needle' + slider).style.transform = 'rotate(' + rotation + 'deg)';
}
// update(): 松手时提交给 ESP32(带 slider 前缀，与后端 "sliderN=" 解析对应)
function update(val, slider) {
  show(val, slider);
  var xhttp = new XMLHttpRequest();
  xhttp.open('GET', '?' + 'slider' + slider + '=' + val, true);
  xhttp.send();
}
</script>
</body>
</html>
)rawliteral";

  // 带滑块参数的请求：只回轻量 "OK"，不再整页重发（省带宽、响应快）
  if (pos1 != -1 || pos2 != -1 || pos3 != -1 || pos4 != -1) {
    client.println("HTTP/1.1 200 OK");
    client.println("Content-Type: text/plain");
    client.println("Connection: close");
    client.println();
    client.println("OK");
  } else {
    // 打开网页：返回完整页面，并带 Content-Length（规范响应头）
    client.println("HTTP/1.1 200 OK");
    client.println("Content-Type: text/html");
    client.println("Connection: close");
    client.println("Content-Length: " + String(strlen(webPage)));
    client.println();
    client.println(webPage);
  }
}

// ============ 舵机控制（滑杆值与舵机实际角度一一对应，直通） ============

// 底座舵机控制：滑杆值即实际角度（0-180）
void Base_Servo_Control(int angle) {
  int angleVal = constrain(angle, 0, 180); // 底座舵机实际范围 0-180
  Serial.println(angleVal);
  if (angleVal > BaseServoAngle) {
    while (angleVal > BaseServoAngle) {
      myservo1.write(BaseServoAngle++);
      if (BaseServoAngle >= 180) BaseServoAngle = 180;
      delay(10);
    }
  } else if (angleVal < BaseServoAngle) {
    while (angleVal < BaseServoAngle) {
      myservo1.write(BaseServoAngle--);
      if (BaseServoAngle <= 0) BaseServoAngle = 0;
      delay(10);
    }
  }
}

// 左关节舵机控制：实际范围 0-110
void Left_Servo_Control(int angle) {
  int angleVal = constrain(angle, 0, 110); // 左关节舵机实际范围 0-110
  if (angleVal > LeftServoAngle) {
    while (angleVal > LeftServoAngle) {
      myservo2.write(LeftServoAngle++);
      if (LeftServoAngle >= 110) LeftServoAngle = 110;
      delay(10);
    }
  } else if (angleVal < LeftServoAngle) {
    while (angleVal < LeftServoAngle) {
      myservo2.write(LeftServoAngle--);
      if (LeftServoAngle <= 0) LeftServoAngle = 0;
      delay(10);
    }
  }
}

// 右关节舵机控制：实际范围 60-180
void Right_Servo_Control(int angle) {
  int angleVal = constrain(angle, 60, 180); // 右关节舵机实际范围 60-180
  if (angleVal > RightServoAngle) {
    while (angleVal > RightServoAngle) {
      myservo3.write(RightServoAngle++);
      if (RightServoAngle >= 180) RightServoAngle = 180;
      delay(10);
    }
  } else if (angleVal < RightServoAngle) {
    while (angleVal < RightServoAngle) {
      myservo3.write(RightServoAngle--);
      if (RightServoAngle <= 60) RightServoAngle = 60;
      delay(10);
    }
  }
}

// 夹爪舵机控制：实际范围 0-100
void Gripper_Servo_Control(int angle) {
  int angleVal = constrain(angle, 0, 100); // 夹爪舵机实际范围 0-100
  if (angleVal > GripperServoAngle) {
    while (angleVal > GripperServoAngle) {
      myservo4.write(GripperServoAngle++);
      if (GripperServoAngle >= 100) GripperServoAngle = 100;
      delay(10);
    }
  } else if (angleVal < GripperServoAngle) {
    while (angleVal < GripperServoAngle) {
      myservo4.write(GripperServoAngle--);
      if (GripperServoAngle <= 0) GripperServoAngle = 0;
      delay(10);
    }
  }
}
