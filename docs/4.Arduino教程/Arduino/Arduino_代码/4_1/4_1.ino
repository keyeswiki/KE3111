#include "ESP32Servo.h" // 添加舵机库

// 定义左侧摇杆模块的引脚
const int left_X = 33; // 定义左侧摇杆的X引脚为IO33
const int left_Y = 32;  // 定义左侧摇杆的Y引脚为IO32
const int left_B = 25; // 定义左侧摇杆的B引脚为IO25

// 定义右侧摇杆模块的引脚
const int right_X = 13; // 定义右侧摇杆的X引脚为IO13
const int right_Y = 15; // 定义右侧摇杆的Y引脚为IO15 
const int right_B = 12; // 定义右侧摇杆的B引脚为IO12

// 定义4个舵机的引脚
const int baseServoPin = 16; // 定义底座舵机的引脚为IO16
const int leftServoPin = 17; // 定义左关节舵机的引脚为IO17
const int rightServoPin = 4; // 定义右关节舵机的引脚为IO4
const int gripperServoPin = 5; // 定义夹爪舵机的引脚为IO5

// 定义变量，用于存放读取到的左右摇杆的值
int left_B_data, left_Y_data, left_X_data, right_B_data, right_X_data, right_Y_data;

// 创建舵机对象以控制舵机
Servo myservo1;  
Servo myservo2;
Servo myservo3;
Servo myservo4;

// 定义4个舵机角度（就是开机时初始状态角度值）
int BaseServoAngle = 90; // 底座舵机初始角度
int LeftServoAngle = 60; // 左关节舵机初始角度
int RightServoAngle = 130; // 右关节舵机初始角度
int GripperServoAngle = 0;  // 夹爪舵机初始角度

void setup() {
  // 设置左、右摇杆的引脚为输入模式  
  pinMode(left_X, INPUT);
  pinMode(left_Y, INPUT);
  pinMode(left_B, INPUT);
  
  pinMode(right_X, INPUT);
  pinMode(right_Y, INPUT);
  pinMode(right_B, INPUT);

  // 将4个舵机绑定到对应舵机对象上  
  myservo1.attach(baseServoPin);  
  myservo2.attach(leftServoPin);  
  myservo3.attach(rightServoPin);   
  myservo4.attach(gripperServoPin); 
 
  // 开机时4个舵机的初始状态角度
  myservo1.write(BaseServoAngle);  
  delay(1000);
  myservo2.write(LeftServoAngle);
  delay(1000);
  myservo3.write(RightServoAngle);
  delay(1000);
  myservo4.write(GripperServoAngle);
  delay(1000);
}

void loop() {
  Serial.begin(115200); // 设置波特率为115200
  left_X_data = analogRead(left_X);   // 读取左侧摇杆X引脚的值
  left_Y_data = analogRead(left_Y);   // 读取左侧摇杆Y引脚的值
  left_B_data = digitalRead(left_B);  // 读取左侧摇杆B引脚的值
 
  right_X_data = analogRead(right_X);  // 读取右侧摇杆X引脚的值
  right_Y_data = analogRead(right_Y);  // 读取右侧摇杆Y引脚的值
  right_B_data = digitalRead(right_B);  // 读取右侧摇杆B引脚的值

  Serial.print(" left B:");
  Serial.print(left_B_data);
  Serial.print("    left X:");
  Serial.print(left_X_data);
  Serial.print("    left Y:");
  Serial.println(left_Y_data);
  
  Serial.print("right B:");
  Serial.print(right_B_data);
  Serial.print("   right X:");
  Serial.print(right_X_data);
  Serial.print("   right Y:");
  Serial.println(right_Y_data);
  delay(300);

  base_Servo_Control(); // 底座舵机控制
  left_Servo_Control(); // 左关节舵机控制
  right_Servo_Control(); // 右关节舵机控制
  gripper_Servo_Control(); // 夹爪舵机控制
}

// 底座舵机控制
void base_Servo_Control() {
  if (left_X_data > 3000) {
    while (analogRead(left_X) > 3000) {
      myservo1.write(BaseServoAngle++);
      if (BaseServoAngle >= 180) BaseServoAngle = 180;
      delay(10);
    }
  } else if (left_X_data < 20) {
    while (analogRead(left_X) < 20) {
      myservo1.write(BaseServoAngle--);
      if (BaseServoAngle <= 0) BaseServoAngle = 0;
      delay(10);
    }
  }
}

// 左关节舵机控制
void left_Servo_Control() {
  if (left_Y_data > 3000) {           
    while (analogRead(left_Y) > 3000) {
      myservo2.write(LeftServoAngle++);
      if (LeftServoAngle >= 110) LeftServoAngle = 110;
      delay(10);
    }
  } else if (left_Y_data < 20) {
      while (analogRead(left_Y) < 20) {
      myservo2.write(LeftServoAngle--);
      if (LeftServoAngle <= 0) LeftServoAngle = 0;
      delay(10);
    }
  }
}

// 右关节舵机控制
void right_Servo_Control() {
  if (right_Y_data > 3000) {
    while (analogRead(right_Y) > 3000) {
      myservo3.write(RightServoAngle--);
      if (RightServoAngle <= 60) RightServoAngle = 60;
      delay(10);
    }
  } else if (right_Y_data < 20) {
    while (analogRead(right_Y) < 20) {
      myservo3.write(RightServoAngle++);
      if (RightServoAngle >= 180) RightServoAngle = 180;
      delay(10);
    }
  }
}

// 夹爪舵机控制
void gripper_Servo_Control() {
  if (right_X_data > 3000) {
    while (analogRead(right_X) > 3000) {
      myservo4.write(GripperServoAngle++);
      if (GripperServoAngle >= 100) GripperServoAngle = 100;
      delay(10);
    }
  } else if (right_X_data < 20) {
    while (analogRead(right_X) < 20) {
      myservo4.write(GripperServoAngle--);
      if (GripperServoAngle <= 0) GripperServoAngle = 0;
      delay(10);
    }
  }
}
