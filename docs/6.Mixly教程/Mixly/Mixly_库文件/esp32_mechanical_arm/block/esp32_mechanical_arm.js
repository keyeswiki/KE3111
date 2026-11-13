'use strict';
goog.provide('Blockly.Blocks.esp32_mechanical_arm');
goog.require('Blockly.Blocks');

// ===== 网页编辑PRO（Keyes ESPDash / webPro）=====
var WEB_HUE = 270; // 对应 Kidsblock #7b68ee 紫色系

// 通用下拉选项
var WEB_IDS = [
  ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"],
  ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"],
  ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"],
  ["13", "13"], ["14", "14"], ["15", "15"], ["16", "16"]
];

// 显示类组件类型（对应 Kidsblock type=1~7）
var WEB_DISPLAY_TYPE = [
  ["温度", "1"],
  ["湿度", "2"],
  ["气压", "3"],
  ["能量", "4"],
  ["进度条", "6"],
  ["标签", "7"]
];

// 状态组件图标
var WEB_STATUS_ICON = [
  ["正常", "success"],
  ["警告", "warning"],
  ["危险", "danger"],
  ["空闲", "idle"]
];

// 图表类型
var WEB_CHART_TYPE = [
  ["条形图", "1"],
  ["折线图", "2"],
  ["区域图", "3"],
  ["饼图", "4"]
];

// 控件类组件类型
var WEB_CTRL_TYPE = [
  ["按钮", "1"],
  ["滑块", "2"],
  ["文本输入", "3"]
];

// 摇杆类型
var WEB_JOY_TYPE = [
  ["双向", "1"],
  ["横向(锁定X)", "2"],
  ["纵向(锁定Y)", "3"]
];

// 设置组件页面：全部已创建组件类型
var WEB_COMP_TYPE = [
  ["温度", "temp"],
  ["湿度", "hum"],
  ["气压", "air"],
  ["能量", "energy"],
  ["状态", "status"],
  ["进度条", "progress"],
  ["标签", "generic"],
  ["按钮", "button"],
  ["滑块", "slider"],
  ["文本输入", "text"],
  ["摇杆", "joystick"],
  ["条形图", "bar"],
  ["折线图", "line"],
  ["区域图", "area"],
  ["饼图", "pie"]
];

// 回调内常用打印变量（辅助块）
var WEB_PRINT_VAR = [["value", "value"], ["x", "x"], ["y", "y"]];

// 1. 更新显示组件（温度/湿度/气压/能量/进度条/标签）
Blockly.Blocks.espdashpro_display_components = {
  init: function() {
    this.setColour(WEB_HUE);
    this.appendDummyInput("").appendField("更新组件");
    this.appendValueInput("Label")
      .setCheck(String)
      .appendField("组件标签");
    this.appendValueInput("unit")
      .setCheck(String)
      .appendField("组件单位");
    this.appendDummyInput("")
      .appendField("组件类型")
      .appendField(new Blockly.FieldDropdown(WEB_DISPLAY_TYPE), "type");
    this.appendDummyInput("")
      .appendField("组件ID")
      .appendField(new Blockly.FieldDropdown(WEB_IDS), "id");
    this.appendValueInput("value")
      .setCheck(Number)
      .appendField("值为");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("更新显示类组件（温度/湿度/气压/能量/进度条/标签），数值实时推送到网页");
  }
};

// 2. 设置状态组件
Blockly.Blocks.espdashpro_state_component = {
  init: function() {
    this.setColour(WEB_HUE);
    this.appendDummyInput("").appendField("设置状态组件");
    this.appendValueInput("Label")
      .setCheck(String)
      .appendField("组件标签");
    this.appendDummyInput("")
      .appendField("组件图标")
      .appendField(new Blockly.FieldDropdown(WEB_STATUS_ICON), "type");
    this.appendDummyInput("")
      .appendField("组件ID")
      .appendField(new Blockly.FieldDropdown(WEB_IDS), "id");
    this.appendValueInput("value")
      .setCheck(String)
      .appendField("值为");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("设置状态组件：标签/图标，并显示文本值（如 正常、警告、危险）");
  }
};

// 3. 更新图表（数据源X/Y 为数组变量名）
Blockly.Blocks.espdashpro_update_chart = {
  init: function() {
    this.setColour(WEB_HUE);
    this.appendDummyInput("").appendField("更新图表");
    this.appendValueInput("Label")
      .setCheck(String)
      .appendField("图表表头");
    this.appendDummyInput("")
      .appendField("图表类型")
      .appendField(new Blockly.FieldDropdown(WEB_CHART_TYPE), "type");
    this.appendDummyInput("")
      .appendField("组件ID")
      .appendField(new Blockly.FieldDropdown(WEB_IDS), "id");
    this.appendValueInput("abscissa")
      .appendField("数据源X");
    this.appendValueInput("ordinate")
      .appendField("数据源Y");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("整组更新图表：数据源X/Y 填数组变量名（用「数组」分类的创建数组积木定义，如 mylistx）");
  }
};

// 4. 更新控件组件（按钮/滑块/文本输入）
Blockly.Blocks.espdashpro_display_components1 = {
  init: function() {
    this.setColour(WEB_HUE);
    this.appendDummyInput("").appendField("更新组件");
    this.appendValueInput("Label")
      .setCheck(String)
      .appendField("组件标签");
    this.appendDummyInput("")
      .appendField("组件类型")
      .appendField(new Blockly.FieldDropdown(WEB_CTRL_TYPE), "type");
    this.appendDummyInput("")
      .appendField("组件ID")
      .appendField(new Blockly.FieldDropdown(WEB_IDS), "id");
    this.appendValueInput("value")
      .appendField("值为");
    this.appendDummyInput("")
      .appendField("最小值")
      .appendField(new Blockly.FieldNumber(0, 0, 255), "min");
    this.appendDummyInput("")
      .appendField("最大值")
      .appendField(new Blockly.FieldNumber(180, 0, 255), "max");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("更新控件组件（按钮/滑块/文本输入），数值实时推送到网页；最小/最大值为网页组件范围");
  }
};

// 5. 获取组件值（回调 hat 块，凹槽内可用变量 value）
Blockly.Blocks.espdashpro_get_component_value = {
  init: function() {
    this.setColour(WEB_HUE);
    this.appendDummyInput("").appendField("获取组件值");
    this.appendValueInput("Label")
      .setCheck(String)
      .appendField("组件标签");
    this.appendDummyInput("")
      .appendField("组件类型")
      .appendField(new Blockly.FieldDropdown(WEB_CTRL_TYPE), "type");
    this.appendDummyInput("")
      .appendField("组件ID")
      .appendField(new Blockly.FieldDropdown(WEB_IDS), "id");
    this.appendDummyInput("")
      .appendField("最小值")
      .appendField(new Blockly.FieldNumber(0, 0, 255), "min");
    this.appendDummyInput("")
      .appendField("最大值")
      .appendField(new Blockly.FieldNumber(180, 0, 255), "max");
    this.appendStatementInput("function")
      .appendField("网页操作时执行");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("在网页操作按钮/滑块/输入框时触发：把要执行的积木放进凹槽（变量 value 为当前值）；最小/最大值为网页组件范围");
  }
};

// 6. 获取摇杆值（回调 hat 块，凹槽内可用变量 x、y）
Blockly.Blocks.espdashpro_get_joystick_value = {
  init: function() {
    this.setColour(WEB_HUE);
    this.appendDummyInput("").appendField("获取摇杆值");
    this.appendValueInput("Label")
      .setCheck(String)
      .appendField("组件标签");
    this.appendDummyInput("")
      .appendField("摇杆类型")
      .appendField(new Blockly.FieldDropdown(WEB_JOY_TYPE), "type");
    this.appendDummyInput("")
      .appendField("组件ID")
      .appendField(new Blockly.FieldDropdown(WEB_IDS), "id");
    this.appendStatementInput("function")
      .appendField("拖动摇杆时执行");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("在网页拖动摇杆时触发：把要执行的积木放进凹槽（变量 x、y 为当前坐标）");
  }
};

// 7. 设置网页标题
Blockly.Blocks.espdashpro_set_title = {
  init: function() {
    this.setColour(WEB_HUE);
    this.appendDummyInput("").appendField("设置网页标题为");
    this.appendValueInput("title")
      .setCheck(String);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("设置网页标题（浏览器标签页显示）");
  }
};

// 8. 设置访问用户名/密码
Blockly.Blocks.espdashpro_setting_permissions = {
  init: function() {
    this.setColour(WEB_HUE);
    this.appendDummyInput("").appendField("设置访问用户名");
    this.appendValueInput("name")
      .setCheck(String);
    this.appendDummyInput("").appendField("密码");
    this.appendValueInput("pass")
      .setCheck(String);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("设置网页访问账号密码（浏览器打开时要求登录）");
  }
};

// 9. 添加页面
Blockly.Blocks.espdashpro_add_page = {
  init: function() {
    this.setColour(WEB_HUE);
    this.appendDummyInput("").appendField("添加页面");
    this.appendValueInput("page")
      .setCheck(String)
      .appendField("页面名称");
    this.appendDummyInput("")
      .appendField("页面ID")
      .appendField(new Blockly.FieldDropdown(WEB_IDS), "id");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("添加一个页面（页签），组件可通过「设置组件页面」分配到该页");
  }
};

// 10. 添加统计信息
Blockly.Blocks.espdashpro_add_statistics = {
  init: function() {
    this.setColour(WEB_HUE);
    this.appendDummyInput("").appendField("添加统计信息");
    this.appendValueInput("Statistic")
      .setCheck(String)
      .appendField("统计标签");
    this.appendValueInput("Value")
      .setCheck(String)
      .appendField("值");
    this.appendDummyInput("")
      .appendField("统计ID")
      .appendField(new Blockly.FieldDropdown(WEB_IDS), "id");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("在页面顶部添加统计条目（如作者、版本），仅需设置一次");
  }
};

// 11. 设置组件页面
Blockly.Blocks.espdashpro_set_component_page = {
  init: function() {
    this.setColour(WEB_HUE);
    this.appendDummyInput("").appendField("设置组件页面");
    this.appendDummyInput("")
      .appendField("组件类型")
      .appendField(new Blockly.FieldDropdown(WEB_COMP_TYPE), "type");
    this.appendDummyInput("")
      .appendField("组件ID")
      .appendField(new Blockly.FieldDropdown(WEB_IDS), "id");
    this.appendDummyInput("")
      .appendField("设置为页面ID")
      .appendField(new Blockly.FieldDropdown(WEB_IDS), "page_id");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("把组件分配到某个页面（先「添加页面」，组件类型需与创建该组件的类型一致）");
  }
};

// 12. 串口打印回调变量（辅助块，放在回调凹槽内使用）
Blockly.Blocks.espdashpro_serial_print = {
  init: function() {
    this.setColour(WEB_HUE);
    this.appendDummyInput("")
      .appendField("串口打印")
      .appendField(new Blockly.FieldDropdown(WEB_PRINT_VAR), "VAR");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("串口打印回调变量：value（获取组件值）、x/y（获取摇杆值）。需放在回调凹槽内");
  }
};

// ===== ESP32 网络（WiFi）=====
var NET_HUE = 20;

// 13. 连接WiFi名称/密码
Blockly.Blocks.wifi_connect = {
  init: function() {
    this.setColour(NET_HUE);
    this.appendDummyInput("").appendField("连接WiFi名称");
    this.appendValueInput("SSID").setCheck(String);
    this.appendDummyInput("").appendField("密码");
    this.appendValueInput("PASS").setCheck(String);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("连接WiFi（阻塞等待），连接成功后串口打印IP地址");
  }
};

// 14. WiFi 读取IP
Blockly.Blocks.wifi_get_ip = {
  init: function() {
    this.setColour(NET_HUE);
    this.appendDummyInput("").appendField("WiFi 读取IP");
    this.setInputsInline(true);
    this.setOutput(true, String);
    this.setTooltip("返回当前WiFi的IP地址（如 192.168.1.100）");
  }
};

// ===== 机械手臂（4路舵机：底座/左关节/右关节/夹爪）=====
var ARM_HUE = 160; // 青绿色系，与网页紫色、WiFi橙色区分
var ARM_JOINT = [["底座", "0"], ["左关节", "1"], ["右关节", "2"], ["夹爪", "3"]];
var ARM_SPEED = [["慢", "20"], ["中", "10"], ["快", "5"]];
var ARM_GRIP = [["打开", "0"], ["关闭", "100"]];

// 15. 初始化机械手臂中四个舵机的GPIO引脚
Blockly.Blocks.arm_init = {
  init: function() {
    this.setColour(ARM_HUE);
    this.appendDummyInput("").appendField("初始化机械手臂:");
    this.appendValueInput("PIN_BASE", Number).setCheck(Number).appendField("底座GPIO");
    this.appendValueInput("PIN_LEFT", Number).setCheck(Number).appendField("左关节GPIO");
    this.appendValueInput("PIN_RIGHT", Number).setCheck(Number).appendField("右关节GPIO");
    this.appendValueInput("PIN_GRIP", Number).setCheck(Number).appendField("夹爪GPIO");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("初始化机械臂：按引脚连接4个舵机，并转到初始姿态（底座90° 左关节60° 右关节130° 夹爪0°）");
  }
};

// 16. 移动某关节到指定角度
Blockly.Blocks.arm_move = {
  init: function() {
    this.setColour(ARM_HUE);
    this.appendDummyInput("")
      .appendField("移动")
      .appendField(new Blockly.FieldDropdown(ARM_JOINT), "JOINT")
      .appendField("到");
    this.appendValueInput("ANGLE", Number).setCheck(Number);
    this.appendDummyInput("")
      .appendField("°，速度")
      .appendField(new Blockly.FieldDropdown(ARM_SPEED), "SPEED");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("让机械臂指定关节平滑转动到0~180之间的角度");
  }
};

// 17. 平滑跟随目标值（非阻塞，主循环里跟随滑杆）
Blockly.Blocks.arm_follow_target = {
  init: function() {
    this.setColour(ARM_HUE);
    this.appendDummyInput("")
      .appendField("平滑跟随")
      .appendField(new Blockly.FieldDropdown(ARM_JOINT), "JOINT")
      .appendField("目标值");
    this.appendValueInput("TARGET", Number).setCheck(Number);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("每 10ms 让指定关节向目标值靠近最多 3°，非阻塞（不卡循环）；放在主循环里即可顺滑跟随网页滑杆，且滑块值与舵机最终角度一一对应");
  }
};

// 18. 打开/关闭夹爪
Blockly.Blocks.arm_gripper = {
  init: function() {
    this.setColour(ARM_HUE);
    this.appendDummyInput("")
      .appendField(new Blockly.FieldDropdown(ARM_GRIP), "GRIP")
      .appendField("夹爪，速度")
      .appendField(new Blockly.FieldDropdown(ARM_SPEED), "SPEED");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("打开或关闭夹爪（关闭0°、打开100°，方向相反可在代码里调换）");
  }
};

// 19. 回到初始姿态
Blockly.Blocks.arm_home = {
  init: function() {
    this.setColour(ARM_HUE);
    this.appendDummyInput("")
      .appendField("回到初始姿态，速度")
      .appendField(new Blockly.FieldDropdown(ARM_SPEED), "SPEED");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("4个关节平滑回到初始姿态（底座90° 左关节60° 右关节130° 夹爪0°）");
  }
};

// 20. 读取某关节当前角度
Blockly.Blocks.arm_readjoint = {
  init: function() {
    this.setColour(ARM_HUE);
    this.appendDummyInput("")
      .appendField(new Blockly.FieldDropdown(ARM_JOINT), "JOINT")
      .appendField("当前角度");
    this.setInputsInline(true);
    this.setOutput(true, Number);
    this.setTooltip("读取指定关节当前角度（0~180）");
  }
};

// 21. 移动到姿态（4关节组合）
Blockly.Blocks.arm_pose = {
  init: function() {
    this.setColour(ARM_HUE);
    this.appendDummyInput("").appendField("移动到姿态:");
    this.appendValueInput("ANGLE_BASE", Number).setCheck(Number).appendField("底座");
    this.appendValueInput("ANGLE_LEFT", Number).setCheck(Number).appendField("° 左关节");
    this.appendValueInput("ANGLE_RIGHT", Number).setCheck(Number).appendField("° 右关节");
    this.appendValueInput("ANGLE_GRIP", Number).setCheck(Number).appendField("° 夹爪");
    this.appendDummyInput("")
      .appendField("°，速度")
      .appendField(new Blockly.FieldDropdown(ARM_SPEED), "SPEED");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("让4个关节依次平滑运动到指定角度组合");
  }
};

// 22. 记录当前姿态
Blockly.Blocks.arm_record = {
  init: function() {
    this.setColour(ARM_HUE);
    this.appendDummyInput("").appendField("记录当前姿态 (最多10个)");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("把当前4个关节角度记录到姿态列表（最多10个）");
  }
};

// 23. 播放已记录姿态
Blockly.Blocks.arm_play = {
  init: function() {
    this.setColour(ARM_HUE);
    this.appendDummyInput("")
      .appendField("播放已记录姿态，速度")
      .appendField(new Blockly.FieldDropdown(ARM_SPEED), "SPEED");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("按记录顺序依次播放所有已记录姿态");
  }
};

// 24. 清空已记录姿态
Blockly.Blocks.arm_clear = {
  init: function() {
    this.setColour(ARM_HUE);
    this.appendDummyInput("").appendField("清空全部已记录姿态");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("清空姿态列表");
  }
};

// 25. 已记录姿态数量
Blockly.Blocks.arm_posecount = {
  init: function() {
    this.setColour(ARM_HUE);
    this.appendDummyInput("").appendField("已记录姿态数量");
    this.setInputsInline(true);
    this.setOutput(true, Number);
    this.setTooltip("返回当前已记录姿态数量（0~10）");
  }
};

// ===== 双摇杆控制 =====
var JOY_SIDE = [["左", "L"], ["右", "R"]];
var JOY_AXIS = [["X", "X"], ["Y", "Y"]];

// 26. 初始化双摇杆（左/右摇杆的X/Y模拟引脚 + 按键数字引脚）
Blockly.Blocks.joystick_init = {
  init: function() {
    this.setColour(ARM_HUE);
    this.appendDummyInput("").appendField("初始化摇杆");
    this.appendValueInput("LX").setCheck(Number).appendField("左摇杆X");
    this.appendValueInput("LY").setCheck(Number).appendField("Y");
    this.appendValueInput("LBTN").setCheck(Number).appendField("按键");
    this.appendValueInput("RX").setCheck(Number).appendField("右摇杆X");
    this.appendValueInput("RY").setCheck(Number).appendField("Y");
    this.appendValueInput("RBTN").setCheck(Number).appendField("按键");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("初始化双摇杆：左/右摇杆的X/Y模拟引脚 + 按键数字引脚");
  }
};

// 27. 读取摇杆轴数值
Blockly.Blocks.joystick_read = {
  init: function() {
    this.setColour(ARM_HUE);
    this.appendDummyInput("")
      .appendField(new Blockly.FieldDropdown(JOY_SIDE), "SIDE")
      .appendField("摇杆")
      .appendField(new Blockly.FieldDropdown(JOY_AXIS), "AXIS")
      .appendField("轴数值");
    this.setInputsInline(true);
    this.setOutput(true, Number);
    this.setTooltip("读取指定摇杆的X/Y轴模拟值（0~4095）");
  }
};

// 28. 读取摇杆按键
Blockly.Blocks.joystick_button = {
  init: function() {
    this.setColour(ARM_HUE);
    this.appendDummyInput("")
      .appendField(new Blockly.FieldDropdown(JOY_SIDE), "SIDE")
      .appendField("摇杆 按键被按下?");
    this.setInputsInline(true);
    this.setOutput(true, Boolean);
    this.setTooltip("读取指定摇杆按键是否被按下（按下为true）");
  }
};
