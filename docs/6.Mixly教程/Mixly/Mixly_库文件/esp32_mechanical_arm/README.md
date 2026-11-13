# 网页编辑PRO + 机械手臂 + WiFi 三合一 Mixly 扩展包

本包由 Kidsblock 的 `ESP_WEB_PRO` 扩展转换而来，并合并了 4 路舵机机械臂控制与 WiFi 连接功能，可直接在 Mixly 3.0 中使用。

## 目录结构

```
esp_web_pro_mixly/
├── esp_web_pro.xml          # 工具箱配置（块分类与默认参数）
├── block/
│   └── esp_web_pro.js       # 图形化块定义（27 个积木）
├── generator/
│   └── esp_web_pro.js       # Arduino C++ 代码生成器
└── libraries/                # 后端依赖库
    ├── webPro/               # 核心库（ESPDash 网页后端）
    ├── ESPAsyncWebServer/    # 异步 Web 服务器
    └── ArduinoJson/          # JSON 解析
```

## 安装步骤

### 1. 安装图形化积木扩展

把整个 `esp_web_pro_mixly` 文件夹复制到：

```
D:\Mixly3.0-win32-x64\resources\app\src\boards\default\arduino_esp32\libraries\ThirdParty\
```

复制后路径应为：
```
...\ThirdParty\esp_web_pro_mixly\esp_web_pro.xml
...\ThirdParty\esp_web_pro_mixly\block\esp_web_pro.js
...\ThirdParty\esp_web_pro_mixly\generator\esp_web_pro.js
```

### 2. 安装后端 C++ 库

打开 Arduino CLI 的库目录：

```
D:\Mixly3.0-win32-x64\arduino-cli\libraries\
```

把本包 `libraries/` 里的三个文件夹（`webPro`、`ESPAsyncWebServer`、`ArduinoJson`）复制进去；若已存在旧版则覆盖。

> 机械臂用的 `ESP32Servo` 库由 ESP32 Arduino 核心自带，无需额外安装。

### 3. 重启 Mixly

重启后左侧工具箱出现三个新分类：
- **ESP32 网络**（橙色）：连接WiFi、读取IP、设置串口波特率
- **网页编辑PRO**（紫色）：仪表盘组件控制
- **机械手臂**（青绿色）：4路舵机控制，含连接/控制/姿态三个子分类

## 积木清单（共 27 个）

### ESP32 网络（3 个）
| 块名 | 功能 |
|---|---|
| `wifi_connect` | 连接WiFi名称/密码，阻塞等待并打印IP |
| `wifi_get_ip` | 返回当前IP地址 |
| `serial_baud` | 设置串口波特率115200（修复乱码） |

### 网页编辑PRO（12 个）
| 块名 | 功能 |
|---|---|
| `espdashpro_display_components` | 更新显示组件（温度/湿度/气压/能量/进度条/标签） |
| `espdashpro_state_component` | 设置状态组件（正常/警告/危险/空闲） |
| `espdashpro_update_chart` | 更新图表（条形/折线/区域/饼图） |
| `espdashpro_display_components1` | 更新控件（按钮/滑块/文本输入） |
| `espdashpro_get_component_value` | 获取组件值（回调，凹槽内用变量 value） |
| `espdashpro_get_joystick_value` | 获取摇杆值（回调，凹槽内用变量 x、y） |
| `espdashpro_set_title` | 设置网页标题 |
| `espdashpro_setting_permissions` | 设置访问用户名/密码 |
| `espdashpro_add_page` | 添加页面（页签） |
| `espdashpro_add_statistics` | 添加统计信息 |
| `espdashpro_set_component_page` | 把组件分配到指定页面 |
| `espdashpro_serial_print` | 串口打印回调变量（辅助块） |

### 机械手臂（12 个）
| 块名 | 功能 |
|---|---|
| `arm_setpins` | 设置4个舵机GPIO引脚（底座/左关节/右关节/夹爪） |
| `arm_init` | 初始化机械臂并转到初始姿态（90/60/130/0） |
| `arm_move` | 移动指定关节到0~180°，可选速度 |
| `arm_follow_target` | 平滑跟随目标值（非阻塞，主循环里跟随滑杆） |
| `arm_gripper` | 打开/关闭夹爪 |
| `arm_home` | 4关节回到初始姿态 |
| `arm_readjoint` | 读取指定关节当前角度 |
| `arm_pose` | 4关节组合角度一次到位 |
| `arm_record` | 记录当前姿态（最多10个） |
| `arm_play` | 按顺序播放已记录姿态 |
| `arm_clear` | 清空姿态列表 |
| `arm_posecount` | 返回已记录姿态数量 |

## 典型使用流程（网页滑杆控制机械臂）

```
setup:
  设置串口波特率 115200
  初始化机械手臂（底座16 左关节17 右关节4 夹爪5）
  连接WiFi名称 "xxx" 密码 "xxx"
  设置网页标题为 "我的机械臂"
  更新控件 组件标签"底座" 类型滑块 ID1 值0 最小0 最大180
  获取组件值 组件标签"底座" 类型滑块 ID1 最小0 最大180:
      （凹槽内可放串口打印 value）

loop:
  平滑跟随 底座 目标值 value
```

## 常见问题

- **编译报 `webPro.h: No such file`**：第 2 步后端库未复制到 `arduino-cli\libraries\`。
- **积木没出现**：确认 `ThirdParty\esp_web_pro_mixly\` 下直接就是 `block/ generator/ esp_web_pro.xml`，没有多套一层目录；重启 Mixly。
- **串口乱码/看不到打印**：串口监视器必须选 115200；本包回调已自动恢复 115200。
- **舵机只往一个方向转**：确认用的是「平滑跟随」块（内部变量跟踪角度），不是 `armServo.read()` 回读方式。
- **舵机抖动/不转**：4 路舵机建议外部 5V 供电，不要全靠 ESP32 3.3V 引脚供电。
- **手机进页面慢 / 页面空白**：v2 已把网页从 178KB gzip（解压 1.5MB 的 Svelte 大页面）重写为 5KB 级轻量页面；WebSocket 断线改为自动重连，不再整页刷新。若仍慢，请在手机浏览器地址栏直接输入 `http://IP`（不要放进搜索引擎框），并确认手机与 ESP32 在同一路由器下。
- **滑块来回跳动**：v2 已修复回显竞争——服务器不再把用户自己拖动的滑块值原样推回，网页端拖动期间也会忽略服务器回推；滑块现在稳定停在目标值。
- **滑块值与舵机角度不对应**：v2 平滑跟随改为非阻塞定时调度（每 10ms 最多走 3°，全行程约 1~2 秒到位），到位后滑块值与舵机角度严格一致；运动过程中滑块显示目标值、舵机平滑追近属正常设计。
- **网页卡片顺序和我想的不一样**：v2.1 起页面顺序 = 积木里填的**编号数字从小到大**（生成器自动 `setIndex(编号)`）。想调顺序就改编号：例如让夹爪排第一，把夹爪滑块编号改成 1 即可。旧固件若仍按声明顺序显示，请重新编译烧录。

## v2 优化日志（2026-10）

| 问题 | 根因 | 修复 |
|---|---|---|
| 进页面缓慢 | 前端为 178KB gzip / 1.5MB 解压的 Svelte+Chart.js 大页面，每次加载都整页下载；且页面固定延时 1.3s 才显示 | 重写轻量前端：约 5.3KB gzip，布局到达即渲染，无人工延时 |
| 页面空白 | 前端每 5 秒检查一次 WebSocket，一旦断开就 `location.reload()` 整页刷新，造成“白屏-重载”循环 | 改为指数退避自动重连 + 状态提示，永不整页刷新 |
| 滑块来回跳动 | ①滑块回调把用户值 `slider.update(value)+sendUpdates()` 回显给网页；②主循环每 10ms 再次推送目标值，与用户拖动竞争 | ①回调只存值到 `v{id}`，不再回显；②网页端拖动期间及值等于本机已发值时忽略服务器回推（同时保留多端远程同步能力） |
| 滑块与舵机角度不对应 | 平滑跟随用 `±1°/循环` + `delay(10)`，节拍受主循环负载影响，大行程要数秒才到位 | 改为 `millis()` 非阻塞调度（10ms 步进、最多 3°/步、角度限幅 0~180），到位快且平滑，最终角度与滑块一一对应 |
| **网页卡片顺序不对（v2.1）** | 页面顺序 = 生成的 `Card xxx_N(...)` 全局声明的先后顺序（webPro 库把所有卡片的 index 置 0，页面只能按声明顺序显示），与积木在界面的摆放顺序/编号无关；Mixly 输出这些全局声明的顺序可能和界面不一致 | 生成器在 setup 里自动为每个控件调用 `xxx_N.setIndex(N)`，网页按**编号数字从小到大**排序，顺序严格可控、与声明顺序无关 |

### 网页卡片顺序规则（v2.1）
- 网页上卡片的显示顺序 = 你在积木里填的**编号数字从小到大**，不再取决于积木摆放位置或 Mixly 的生成顺序。
- 想让某个滑块排第一：把它在积木里的编号改成最小（如 1）；想调整顺序，改编号即可。
- 例：底座=1、左关节=2、右关节=3、夹爪=4 → 页面按 底座、左关节、右关节、夹爪 显示。

### v2 前端页面特性
- 保留全部协议与组件：滑块 / 按钮 / 文本输入 / 摇杆 / 温度湿度气压能量 / 进度条 / 状态 / 图表（条形、折线、区域、饼图）/ 多页签 / 统计信息，用户名密码登录不变。
- 手机端优化：无外部依赖、无框架加载、触摸拖动滑块、页面自适应。
- 断线自动重连：1.2s → 2.4s → 4.8s（上限 5s）指数退避，页面顶部显示“连接中…/已连接”。
