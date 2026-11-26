// 定义左侧摇杆模块的引脚
const int left_X = 33; // 定义左侧摇杆模块的X引脚为IO33
const int left_Y = 32; // 定义左侧摇杆模块的Y引脚为IO32
const int left_B = 25; // 定义左侧摇杆模块的B引脚为IO25

// 定义右边摇杆模块的引脚
const int right_X = 13; // 定义右侧摇杆模块的X引脚为IO13
const int right_Y = 15; // 定义右侧摇杆模块的Y引脚为IO15 
const int right_B = 12; // 定义右侧摇杆模块的B引脚为IO12

// 定义变量，用于存放读取到的左、右摇杆的值
int left_B_data, left_Y_data, left_X_data, right_B_data, right_X_data, right_Y_data;  

void setup() {
  Serial.begin(115200); // 设置波特率为115200
  // 设置左侧摇杆模块与右侧摇杆模块的引脚为输入模式  
  pinMode(left_X, INPUT);
  pinMode(left_Y, INPUT);
  pinMode(left_B, INPUT);
  
  pinMode(right_X, INPUT);
  pinMode(right_Y, INPUT);
  pinMode(right_B, INPUT);
}
void loop() {
  left_X_data = analogRead(left_X);   // 读取左侧摇杆模块X引脚的值
  left_Y_data = analogRead(left_Y);   // 读取左侧摇杆模块Y引脚的值
  left_B_data = digitalRead(left_B);  // 读取左侧摇杆模块B引脚的值
 
  right_X_data = analogRead(right_X);  // 读取右侧摇杆模块X引脚的值
  right_Y_data = analogRead(right_Y);  // 读取右侧摇杆模块Y引脚的值
  right_B_data = digitalRead(right_B);  // 读取右侧摇杆模块B引脚的值

  Serial.print(" left B:");   // 打印字符串" left B:"
  Serial.print(left_B_data);  // 打印左侧摇杆模块的按钮值
  Serial.print("    left X:");  // 打印字符串"    left X:"
  Serial.print(left_X_data);    // 打印左侧摇杆模块的X值
  Serial.print("    left Y:");  // 打印字符串"    left Y:"
  Serial.println(left_Y_data);  // 打印左侧摇杆模块的Y值
  
  Serial.print("right B:");  // 打印字符串"    right B:"
  Serial.print(right_B_data);  // 打印右侧摇杆模块的按钮值
  Serial.print("   right X:");  // 打印字符串"    right X:"
  Serial.print(right_X_data);   // 打印右侧摇杆模块的X值
  Serial.print("   right Y:");  // 打印字符串"    right Y:"
  Serial.println(right_Y_data);  // 打印右侧摇杆模块的Y值
  delay(300);
}
