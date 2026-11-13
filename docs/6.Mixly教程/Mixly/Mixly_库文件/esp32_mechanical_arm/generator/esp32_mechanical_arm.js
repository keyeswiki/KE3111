'use strict';
goog.provide('Blockly.Arduino.esp32_mechanical_arm');
goog.require('Blockly.Arduino');

// ===== 网页编辑PRO 公共初始化 =====
// 注入：#include <webPro.h>、AsyncWebServer server(80)、ESPDash dashboard(&server,1)、setup 里 server.begin()
function webProInit() {
  Blockly.Arduino.definitions_['include_webPro'] = '#include <ArduinoJson.h>\n#include <webPro.h>';
  Blockly.Arduino.definitions_['var_declare_webPro'] =
    'AsyncWebServer server(80);\nESPDash dashboard(&server, 1);\n';
  Blockly.Arduino.setups_['var_webPro'] = 'server.begin();';
  // 优化：节流刷新，每 100ms 统一 sendUpdates() 一次，避免网页不断更新
  Blockly.Arduino.loops_begin_['webpro_throttle_update'] =
    'static unsigned long lastWebUpdate = 0;\n'
    + 'if (millis() - lastWebUpdate >= 100) {\n'
    + '  dashboard.sendUpdates();\n'
    + '  lastWebUpdate = millis();\n'
    + '}\n';
}

// 1. 更新显示组件（温度/湿度/气压/能量/进度条/标签）
Blockly.Arduino.forBlock.espdashpro_display_components = function() {
  var label = Blockly.Arduino.valueToCode(this, 'Label', Blockly.Arduino.ORDER_ATOMIC) || '"温度"';
  var unit = Blockly.Arduino.valueToCode(this, 'unit', Blockly.Arduino.ORDER_ATOMIC) || '""';
  var type = this.getFieldValue('type');
  var id = this.getFieldValue('id');
  var value = Blockly.Arduino.valueToCode(this, 'value', Blockly.Arduino.ORDER_ATOMIC) || '0';
  webProInit();

  var decl = '';
  var obj = '';
  switch (type) {
    case '1': decl = 'Card temp_' + id + '(&dashboard, TEMPERATURE_CARD, ' + label + ', ' + unit + ');\n'; obj = 'temp_'; break;
    case '2': decl = 'Card hum_' + id + '(&dashboard, HUMIDITY_CARD, ' + label + ', ' + unit + ');\n'; obj = 'hum_'; break;
    case '3': decl = 'Card air_' + id + '(&dashboard, AIR_CARD, ' + label + ', ' + unit + ');\n'; obj = 'air_'; break;
    case '4': decl = 'Card energy_' + id + '(&dashboard, ENERGY_CARD, ' + label + ', ' + unit + ');\n'; obj = 'energy_'; break;
    case '6': decl = 'Card progress_' + id + '(&dashboard, PROGRESS_CARD, ' + label + ', ' + unit + ', 0, 100);\n'; obj = 'progress_'; break;
    case '7': decl = 'Card generic_' + id + '(&dashboard, GENERIC_CARD, ' + label + ', ' + unit + ');\n'; obj = 'generic_'; break;
  }
  Blockly.Arduino.definitions_['var_web_disp_' + type + '_' + id] = decl;
  // v2.1：显式设置页面排序序号 = 控件编号，网页顺序严格按编号 1,2,3... 排列，
  // 不再受 Mixly 生成 Card 全局声明顺序的影响
  if (obj) {
    Blockly.Arduino.setups_['web_index_disp_' + type + '_' + id] = obj + id + '.setIndex(' + id + ');\n';
  }
  return obj + id + '.update((int)' + value + ');\ndashboard.sendUpdates();\n';
};

// 2. 设置状态组件
Blockly.Arduino.forBlock.espdashpro_state_component = function() {
  var label = Blockly.Arduino.valueToCode(this, 'Label', Blockly.Arduino.ORDER_ATOMIC) || '"系统状态"';
  var icon = this.getFieldValue('type');
  var id = this.getFieldValue('id');
  var value = Blockly.Arduino.valueToCode(this, 'value', Blockly.Arduino.ORDER_ATOMIC) || '"正常"';
  webProInit();
  Blockly.Arduino.definitions_['var_web_status_' + id] =
    'Card status_' + id + '(&dashboard, STATUS_CARD, ' + label + ', "success");\n';
  // v2.1：排序序号 = 编号
  Blockly.Arduino.setups_['web_index_status_' + id] = 'status_' + id + '.setIndex(' + id + ');\n';
  return 'status_' + id + '.update(' + value + ', "' + icon + '");\ndashboard.sendUpdates();\n';
};

// 3. 更新图表（数据源X/Y 为数组变量名）
Blockly.Arduino.forBlock.espdashpro_update_chart = function() {
  var header = Blockly.Arduino.valueToCode(this, 'Label', Blockly.Arduino.ORDER_ATOMIC) || '"温度曲线"';
  var type = this.getFieldValue('type');
  var id = this.getFieldValue('id');
  var x = Blockly.Arduino.valueToCode(this, 'abscissa', Blockly.Arduino.ORDER_ATOMIC) || 'mylistx';
  var y = Blockly.Arduino.valueToCode(this, 'ordinate', Blockly.Arduino.ORDER_ATOMIC) || 'mylisty';
  webProInit();

  var decl = '';
  var obj = '';
  switch (type) {
    case '1': decl = 'Chart bar_' + id + '(&dashboard, BAR_CHART, ' + header + ');\n'; obj = 'bar_'; break;
    case '2': decl = 'Chart line_' + id + '(&dashboard, LINE_CHART, ' + header + ');\n'; obj = 'line_'; break;
    case '3': decl = 'Chart area_' + id + '(&dashboard, AREA_CHART, ' + header + ');\n'; obj = 'area_'; break;
    case '4': decl = 'Chart pie_' + id + '(&dashboard, PIE_CHART, ' + header + ');\n'; obj = 'pie_'; break;
  }
  Blockly.Arduino.definitions_['var_web_chart_' + type + '_' + id] = decl;
  // v2.1：排序序号 = 编号
  if (obj) {
    Blockly.Arduino.setups_['web_index_chart_' + type + '_' + id] = obj + id + '.setIndex(' + id + ');\n';
  }
  return obj + id + '.updateX(' + x + ', sizeof(' + x + ')/sizeof(' + x + '[0]));\n'
    + obj + id + '.updateY(' + y + ', sizeof(' + y + ')/sizeof(' + y + '[0]));\n'
    + 'dashboard.sendUpdates();\n';
};

// 4. 更新控件组件（按钮/滑块/文本输入）
Blockly.Arduino.forBlock.espdashpro_display_components1 = function() {
  var label = Blockly.Arduino.valueToCode(this, 'Label', Blockly.Arduino.ORDER_ATOMIC) || '"卧室开关"';
  var type = this.getFieldValue('type');
  var id = this.getFieldValue('id');
  var value = Blockly.Arduino.valueToCode(this, 'value', Blockly.Arduino.ORDER_ATOMIC) || '0';
  var min = this.getFieldValue('min') || '0';
  var max = this.getFieldValue('max') || '180';
  webProInit();

  var decl = '';
  var upd = '';
  var obj = '';
  switch (type) {
    case '1':
      decl = 'Card button_' + id + '(&dashboard, BUTTON_CARD, ' + label + ');\n';
      upd = 'button_' + id + '.update((int)' + value + ');\n';
      obj = 'button_';
      break;
    case '2':
      decl = 'Card slider_' + id + '(&dashboard, SLIDER_CARD, ' + label + ', "", ' + min + ', ' + max + ');\n';
      upd = 'slider_' + id + '.update((int)' + value + ');\n';
      obj = 'slider_';
      break;
    case '3':
      decl = 'Card text_' + id + '(&dashboard, TEXT_INPUT_CARD, ' + label + ');\n';
      upd = 'text_' + id + '.update(String(' + value + '));\n';
      obj = 'text_';
      break;
  }
  Blockly.Arduino.definitions_['var_web_ctl_' + type + '_' + id] = decl;
  // v2.1：排序序号 = 控件编号，网页顺序严格按编号 1,2,3... 排列，
  // 不再受 Mixly 生成 Card 全局声明顺序的影响
  if (obj) {
    Blockly.Arduino.setups_['web_index_' + type + '_' + id] = obj + id + '.setIndex(' + id + ');\n';
  }
  // 优化：去掉自动 sendUpdates()，改成统一节流刷新，避免网页不断更新
  return upd;
};

// 5. 获取组件值（回调 hat 块）
Blockly.Arduino.forBlock.espdashpro_get_component_value = function() {
  var label = Blockly.Arduino.valueToCode(this, 'Label', Blockly.Arduino.ORDER_ATOMIC) || '"卧室开关"';
  var type = this.getFieldValue('type');
  var id = this.getFieldValue('id');
  var branch = Blockly.Arduino.statementToCode(this, 'function');
  branch = branch.replace(/(^\s*)|(\s*$)/g, '');
  var min = this.getFieldValue('min') || '0';
  var max = this.getFieldValue('max') || '180';
  webProInit();

  // 组件声明
  var decl = '';
  var obj = '';
  if (type == '1') {
    decl = 'Card button_' + id + '(&dashboard, BUTTON_CARD, ' + label + ');\n';
    obj = 'button_';
  } else if (type == '2') {
    decl = 'Card slider_' + id + '(&dashboard, SLIDER_CARD, ' + label + ', "", ' + min + ', ' + max + ');\n';
    obj = 'slider_';
  } else if (type == '3') {
    decl = 'Card text_' + id + '(&dashboard, TEXT_INPUT_CARD, ' + label + ');\n';
    obj = 'text_';
  }
  Blockly.Arduino.definitions_['var_web_ctl_' + type + '_' + id] = decl;
  // v2.1：排序序号 = 控件编号，网页顺序严格按编号 1,2,3... 排列
  if (obj) {
    Blockly.Arduino.setups_['web_index_' + type + '_' + id] = obj + id + '.setIndex(' + id + ');\n';
  }

  // 回调注册
  if (type == '1') {
    // 按钮：凹槽代码直接放在回调里
    var cb = 'button_' + id + '.attachCallback([&](int value) {\n'
      + branch + '\n'
      + 'button_' + id + '.update(value);\n'
      + 'dashboard.sendUpdates();\n'
      + '});\n';
    Blockly.Arduino.setups_['var_web_cb_' + type + '_' + id] = cb;
  } else if (type == '2') {
    // 滑块：回调只存值到 v{id}，不再回显 slider.update()/sendUpdates()，
    // 避免服务器把用户自己的滑块值原样推回网页造成滑块跳动（回显竞争）。
    // 凹槽里的控制代码放在 loop() 里循环执行，滑块显示值由 loop 里的"更新组件"统一推送。
    var cb = 'slider_' + id + '.attachCallback([&](int value) {\n'
      + 'v' + id + ' = value;\n'
      + '});\n';
    Blockly.Arduino.setups_['var_web_cb_' + type + '_' + id] = cb;
    // 凹槽里的控制代码放在 loop() 开头循环执行
    Blockly.Arduino.loops_begin_['webpro_slider_loop_' + type + '_' + id] = branch + '\n';
  } else if (type == '3') {
    // 文本输入：凹槽代码直接放在回调里
    var cb = 'text_' + id + '.attachCallback([&](const char* value) {\n'
      + branch + '\n'
      + 'text_' + id + '.update(value);\n'
      + 'dashboard.sendUpdates();\n'
      + '});\n';
    Blockly.Arduino.setups_['var_web_cb_' + type + '_' + id] = cb;
  }

  return '';
};

// 6. 获取摇杆值（回调 hat 块）
Blockly.Arduino.forBlock.espdashpro_get_joystick_value = function() {
  var label = Blockly.Arduino.valueToCode(this, 'Label', Blockly.Arduino.ORDER_ATOMIC) || '"摇杆"';
  var type = this.getFieldValue('type');
  var id = this.getFieldValue('id');
  var branch = Blockly.Arduino.statementToCode(this, 'function');
  branch = branch.replace(/(^\s*)|(\s*$)/g, '');
  webProInit();

  var decl = '';
  switch (type) {
    case '1': decl = 'Card joystick_' + id + '(&dashboard, JOYSTICK_CARD, ' + label + ');\n'; break;
    case '2': decl = 'Card joystick_' + id + '(&dashboard, JOYSTICK_CARD, ' + label + ', "lockX");\n'; break;
    case '3': decl = 'Card joystick_' + id + '(&dashboard, JOYSTICK_CARD, ' + label + ', "lockY");\n'; break;
  }
  Blockly.Arduino.definitions_['var_web_joy_' + type + '_' + id] = decl;
  Blockly.Arduino.setups_['var_web_joycb_' + type + '_' + id] =
    'joystick_' + id + '.attachCallback([&](int8_t x, int8_t y) {\nSerial.begin(115200);\n' + branch + '\n});\n';
  return '';
};

// 7. 设置网页标题
Blockly.Arduino.forBlock.espdashpro_set_title = function() {
  var title = Blockly.Arduino.valueToCode(this, 'title', Blockly.Arduino.ORDER_ATOMIC) || '"科易互动机器人"';
  webProInit();
  return 'dashboard.setTitle(' + title + ');\n';
};

// 8. 设置访问用户名/密码
Blockly.Arduino.forBlock.espdashpro_setting_permissions = function() {
  var name = Blockly.Arduino.valueToCode(this, 'name', Blockly.Arduino.ORDER_ATOMIC) || '"keyes"';
  var pass = Blockly.Arduino.valueToCode(this, 'pass', Blockly.Arduino.ORDER_ATOMIC) || '"123456"';
  webProInit();
  return 'dashboard.setAuthentication(' + name + ', ' + pass + ');\n';
};

// 9. 添加页面
Blockly.Arduino.forBlock.espdashpro_add_page = function() {
  var name = Blockly.Arduino.valueToCode(this, 'page', Blockly.Arduino.ORDER_ATOMIC) || '"卧室"';
  var id = this.getFieldValue('id');
  webProInit();
  Blockly.Arduino.definitions_['var_web_tab_' + id] = 'Tab settings_' + id + '(&dashboard, ' + name + ');\n';
  return '';
};

// 10. 添加统计信息
Blockly.Arduino.forBlock.espdashpro_add_statistics = function() {
  var stat = Blockly.Arduino.valueToCode(this, 'Statistic', Blockly.Arduino.ORDER_ATOMIC) || '"作者"';
  var val = Blockly.Arduino.valueToCode(this, 'Value', Blockly.Arduino.ORDER_ATOMIC) || '"科易互动机器人"';
  var id = this.getFieldValue('id');
  webProInit();
  Blockly.Arduino.definitions_['var_web_stat_' + id] = 'Statistic stat_' + id + '(&dashboard, ' + stat + ', ' + val + ');\n';
  return '';
};

// 11. 设置组件页面
Blockly.Arduino.forBlock.espdashpro_set_component_page = function() {
  var type = this.getFieldValue('type');
  var id = this.getFieldValue('id');
  var pageId = this.getFieldValue('page_id');
  webProInit();
  return type + '_' + id + '.setTab(&settings_' + pageId + ');\n';
};

// 12. 串口打印回调变量（辅助块）
Blockly.Arduino.forBlock.espdashpro_serial_print = function() {
  var v = this.getFieldValue('VAR');
  return 'Serial.println(' + v + ');\n';
};

// ===== ESP32 网络（WiFi）=====
function wifiDefs() {
  Blockly.Arduino.definitions_['include_wifi'] = '#include <WiFi.h>';
}

// 13. 连接WiFi
Blockly.Arduino.forBlock.wifi_connect = function() {
  var ssid = Blockly.Arduino.valueToCode(this, 'SSID', Blockly.Arduino.ORDER_ATOMIC) || '"ChinaNet_2.4G"';
  var pass = Blockly.Arduino.valueToCode(this, 'PASS', Blockly.Arduino.ORDER_ATOMIC) || '"123456"';
  wifiDefs();
  Blockly.Arduino.setups_['setup_wifi'] = 'WiFi.mode(WIFI_STA);\n'
    + 'WiFi.begin(' + ssid + ', ' + pass + ');\n'
    + 'while (WiFi.status() != WL_CONNECTED) {\n'
    + '  delay(500);\n'
    + '}\n'
    + 'Serial.print("WiFi IP: ");\n'
    + 'Serial.println(WiFi.localIP());';
  return '';
};

// 14. WiFi 读取IP
Blockly.Arduino.forBlock.wifi_get_ip = function() {
  wifiDefs();
  return ['WiFi.localIP().toString()', Blockly.Arduino.ORDER_ATOMIC];
};

// ===== 机械手臂（4路舵机）=====
// 公共定义：Servo库、4路舵机对象、当前角度跟踪、平滑移动函数
// 优化：armFollowTarget 改为基于 millis() 的非阻塞调度（每 10ms 最多走 3°，且不依赖主循环节拍），
// 避免 delay() 阻塞、保证网页/舵机联动顺滑稳定；目标角度统一夹在 0~180。
function armCommonDefs() {
  Blockly.Arduino.definitions_['include_servo'] = '#if defined(ARDUINO_ARCH_ESP32)\n'
    + '#include <ESP32Servo.h>\n'
    + '#else\n'
    + '#include <Servo.h>\n'
    + '#endif';
  Blockly.Arduino.definitions_['var_arm_servos'] = 'Servo armServo[4];';
  Blockly.Arduino.definitions_['var_arm_curangle'] = 'int armCurAngle[4] = {90, 60, 130, 0};';
  Blockly.Arduino.definitions_['var_arm_laststep'] = 'unsigned long armLastStep[4] = {0, 0, 0, 0};';
  Blockly.Arduino.definitions_['func_arm_move'] = 'void armMoveTo(int joint, int target, int stepDelay) {\n'
    + '  if (target < 0) target = 0; if (target > 180) target = 180;\n'
    + '  int dir = (target > armCurAngle[joint]) ? 1 : -1;\n'
    + '  while (armCurAngle[joint] != target) {\n'
    + '    armCurAngle[joint] += dir;\n'
    + '    armServo[joint].write(armCurAngle[joint]);\n'
    + '    delay(stepDelay);\n'
    + '  }\n'
    + '}\n'
    + 'void armFollowTarget(int joint, int target) {\n'
    + '  if (target < 0) target = 0; if (target > 180) target = 180;\n'
    + '  if (millis() - armLastStep[joint] < 10) return;\n'
    + '  armLastStep[joint] = millis();\n'
    + '  if (armCurAngle[joint] < target) {\n'
    + '    int step = target - armCurAngle[joint]; if (step > 3) step = 3;\n'
    + '    armCurAngle[joint] += step;\n'
    + '  } else if (armCurAngle[joint] > target) {\n'
    + '    int step = armCurAngle[joint] - target; if (step > 3) step = 3;\n'
    + '    armCurAngle[joint] -= step;\n'
    + '  }\n'
    + '  armServo[joint].write(armCurAngle[joint]);\n'
    + '}\n';
}

// 姿态存储公共定义
function armPoseDefs() {
  Blockly.Arduino.definitions_['var_arm_pose'] = '#define ARM_MAX_POSE 10\n'
    + 'int armPose[ARM_MAX_POSE][4];\n'
    + 'int armPoseCount = 0;';
  Blockly.Arduino.definitions_['func_arm_record'] = 'void armRecordPose() {\n'
    + '  if (armPoseCount >= ARM_MAX_POSE) return;\n'
    + '  for (int i = 0; i < 4; i++) armPose[armPoseCount][i] = armCurAngle[i];\n'
    + '  armPoseCount++;\n'
    + '}\n';
  Blockly.Arduino.definitions_['func_arm_play'] = 'void armPlayPoses(int stepDelay) {\n'
    + '  for (int p = 0; p < armPoseCount; p++) {\n'
    + '    for (int i = 0; i < 4; i++) armMoveTo(i, armPose[p][i], stepDelay);\n'
    + '  }\n'
    + '}\n';
  Blockly.Arduino.definitions_['func_arm_clear'] = 'void armClearPoses() {\n'
    + '  armPoseCount = 0;\n'
    + '}\n';
}

// 15. 初始化机械手臂中的四个舵机GPIO引脚
Blockly.Arduino.forBlock.arm_init = function() {
  var p0 = Blockly.Arduino.valueToCode(this, 'PIN_BASE', Blockly.Arduino.ORDER_ATOMIC) || '16';
  var p1 = Blockly.Arduino.valueToCode(this, 'PIN_LEFT', Blockly.Arduino.ORDER_ATOMIC) || '17';
  var p2 = Blockly.Arduino.valueToCode(this, 'PIN_RIGHT', Blockly.Arduino.ORDER_ATOMIC) || '4';
  var p3 = Blockly.Arduino.valueToCode(this, 'PIN_GRIP', Blockly.Arduino.ORDER_ATOMIC) || '5';
  armCommonDefs();
  Blockly.Arduino.definitions_['var_arm_pins'] = 'int armPins[4] = {' + p0 + ',' + p1 + ',' + p2 + ',' + p3 + '};';
  Blockly.Arduino.definitions_['var_arm_init_angle'] = 'int armInitAngle[4] = {90, 60, 130, 0};';
  Blockly.Arduino.setups_['setup_arm_attach'] = '#if defined(ARDUINO_ARCH_ESP32)\n'
    + '  ESP32PWM::allocateTimer(0);\n'
    + '#endif\n'
    + 'for (int i = 0; i < 4; i++) {\n'
    + '  armServo[i].attach(armPins[i], 500, 2500);\n'
    + '  armServo[i].write(armInitAngle[i]);\n'
    + '  armCurAngle[i] = armInitAngle[i];\n'
    + '}\n';
  return '';
};

// 16. 移动某关节到指定角度
Blockly.Arduino.forBlock.arm_move = function() {
  var joint = this.getFieldValue('JOINT');
  var angle = Blockly.Arduino.valueToCode(this, 'ANGLE', Blockly.Arduino.ORDER_ATOMIC) || '90';
  var speed = this.getFieldValue('SPEED') || '20';
  armCommonDefs();
  return 'armMoveTo(' + joint + ', ' + angle + ', ' + speed + ');\n';
};

// 17. 平滑跟随目标值（非阻塞，主循环里跟随滑杆）
Blockly.Arduino.forBlock.arm_follow_target = function() {
  var joint = this.getFieldValue('JOINT');
  var target = Blockly.Arduino.valueToCode(this, 'TARGET', Blockly.Arduino.ORDER_ATOMIC) || '90';
  armCommonDefs();
  return 'armFollowTarget(' + joint + ', (int)' + target + ');\n';
};

// 18. 打开/关闭夹爪
Blockly.Arduino.forBlock.arm_gripper = function() {
  var grip = this.getFieldValue('GRIP') || '0';
  var speed = this.getFieldValue('SPEED') || '20';
  armCommonDefs();
  return 'armMoveTo(3, ' + grip + ', ' + speed + ');\n';
};

// 19. 回到初始姿态
Blockly.Arduino.forBlock.arm_home = function() {
  var speed = this.getFieldValue('SPEED') || '20';
  armCommonDefs();
  Blockly.Arduino.definitions_['var_arm_init_angle'] = 'int armInitAngle[4] = {90, 60, 130, 0};';
  return 'for (int i = 0; i < 4; i++) armMoveTo(i, armInitAngle[i], ' + speed + ');\n';
};

// 20. 读取某关节当前角度
Blockly.Arduino.forBlock.arm_readjoint = function() {
  var joint = this.getFieldValue('JOINT');
  armCommonDefs();
  return ['armCurAngle[' + joint + ']', Blockly.Arduino.ORDER_ATOMIC];
};

// 21. 移动到姿态
Blockly.Arduino.forBlock.arm_pose = function() {
  var a0 = Blockly.Arduino.valueToCode(this, 'ANGLE_BASE', Blockly.Arduino.ORDER_ATOMIC) || '90';
  var a1 = Blockly.Arduino.valueToCode(this, 'ANGLE_LEFT', Blockly.Arduino.ORDER_ATOMIC) || '60';
  var a2 = Blockly.Arduino.valueToCode(this, 'ANGLE_RIGHT', Blockly.Arduino.ORDER_ATOMIC) || '130';
  var a3 = Blockly.Arduino.valueToCode(this, 'ANGLE_GRIP', Blockly.Arduino.ORDER_ATOMIC) || '0';
  var speed = this.getFieldValue('SPEED') || '20';
  armCommonDefs();
  return 'armMoveTo(0, ' + a0 + ', ' + speed + ');\n'
    + 'armMoveTo(1, ' + a1 + ', ' + speed + ');\n'
    + 'armMoveTo(2, ' + a2 + ', ' + speed + ');\n'
    + 'armMoveTo(3, ' + a3 + ', ' + speed + ');\n';
};

// 22. 记录当前姿态
Blockly.Arduino.forBlock.arm_record = function() {
  armCommonDefs();
  armPoseDefs();
  return 'armRecordPose();\n';
};

// 23. 播放已记录姿态
Blockly.Arduino.forBlock.arm_play = function() {
  var speed = this.getFieldValue('SPEED') || '20';
  armCommonDefs();
  armPoseDefs();
  return 'armPlayPoses(' + speed + ');\n';
};

// 24. 清空已记录姿态
Blockly.Arduino.forBlock.arm_clear = function() {
  armCommonDefs();
  armPoseDefs();
  return 'armClearPoses();\n';
};

// 25. 已记录姿态数量
Blockly.Arduino.forBlock.arm_posecount = function() {
  armCommonDefs();
  armPoseDefs();
  return ['armPoseCount', Blockly.Arduino.ORDER_ATOMIC];
};

// ===== 双摇杆控制 =====

// 26. 初始化双摇杆
Blockly.Arduino.forBlock.joystick_init = function() {
  var lx = Blockly.Arduino.valueToCode(this, 'LX', Blockly.Arduino.ORDER_ATOMIC) || '33';
  var ly = Blockly.Arduino.valueToCode(this, 'LY', Blockly.Arduino.ORDER_ATOMIC) || '32';
  var lbtn = Blockly.Arduino.valueToCode(this, 'LBTN', Blockly.Arduino.ORDER_ATOMIC) || '25';
  var rx = Blockly.Arduino.valueToCode(this, 'RX', Blockly.Arduino.ORDER_ATOMIC) || '13';
  var ry = Blockly.Arduino.valueToCode(this, 'RY', Blockly.Arduino.ORDER_ATOMIC) || '15';
  var rbtn = Blockly.Arduino.valueToCode(this, 'RBTN', Blockly.Arduino.ORDER_ATOMIC) || '12';

  Blockly.Arduino.definitions_['var_joy_pins'] =
    'const int JOY_LX = ' + lx + ';\n' +
    'const int JOY_LY = ' + ly + ';\n' +
    'const int JOY_LBTN = ' + lbtn + ';\n' +
    'const int JOY_RX = ' + rx + ';\n' +
    'const int JOY_RY = ' + ry + ';\n' +
    'const int JOY_RBTN = ' + rbtn + ';\n';

  Blockly.Arduino.setups_['setup_joy_pins'] =
    'pinMode(JOY_LBTN, INPUT_PULLUP);\n' +
    'pinMode(JOY_RBTN, INPUT_PULLUP);\n';

  return '';
};

// 27. 读取摇杆轴数值
Blockly.Arduino.forBlock.joystick_read = function() {
  var side = this.getFieldValue('SIDE');
  var axis = this.getFieldValue('AXIS');
  var pin = 'JOY_' + side + axis;
  return ['analogRead(' + pin + ')', Blockly.Arduino.ORDER_ATOMIC];
};

// 28. 读取摇杆按键
Blockly.Arduino.forBlock.joystick_button = function() {
  var side = this.getFieldValue('SIDE');
  var pin = 'JOY_' + side + 'BTN';
  return ['(digitalRead(' + pin + ') == HIGH)', Blockly.Arduino.ORDER_ATOMIC];
};
