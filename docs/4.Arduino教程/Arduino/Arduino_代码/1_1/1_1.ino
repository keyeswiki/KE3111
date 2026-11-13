#include <ESP32Servo.h> // 添加舵机库

const int servoPin = 16; // 定义舵机引脚为IO16
Servo myservo;  // 创建舵机对象

void setup() {
   myservo.attach(servoPin); // 初始化舵机
   myservo.write(0); // 转动到0°
   delay(1000);  // 等待1秒
}

void loop() {
   for (uint8_t angle = 0; angle < 180; angle++) { // 从0到180度
      myservo.write(angle); // 转动到angle角度
      delay(15);  // 等待一会,以免转得太快
   }
   for (uint8_t angle = 180; angle > 0; angle--) { // 从180到0度
      myservo.write(angle); // 转动到angle角度
      delay(15);
   }
} 