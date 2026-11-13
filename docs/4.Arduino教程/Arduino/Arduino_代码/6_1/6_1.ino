// 添加相关库
#include <WiFi.h>
#include <WebServer.h>

/*请注意:
  ESP32 仅支持 2.4GHz 频段的 WiFi。
  如果 WiFi 连接失败，请检查 WiFi 名称、密码以及频段。
  将 "ChinaNet_2.4G" 修改为你的 WiFi 名称
  将 "ChinaNet@233" 修改为你的 WiFi 密码*/

// =============== WIFI配置 ===============
// 设置WiFi名称和WiFi密码, ESP32 仅支持 2.4GHz 频段的无线网络  
const char* ssid = "ChinaNet_2.4G"; // 替换为你自己的WiFi名称
const char* password = "ChinaNet@233"; // 替换为你自己的WiFi密码

WiFiServer server(80); // 将网页端口设置为80。你可以直接输入IP地址访问网页,无需输入端口号

void setup() {
  Serial.begin(115200); // 设置波特率为115200
  // 连接到 WiFi 网络
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
  // 启动服务器
  server.begin();
  Serial.println("Server started");
  // 打印 IP 地址
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  WiFiClient client = server.available(); // 尝试接收来自 WiFi 服务器的请求，并将其分配给名为 client 的 WiFiClient 对象
  if (!client) {                          // 该条件语句用于检查是否已成功接受来自客户端的连接。若未成功，则立即终止执行。
    return;
  }
  Serial.println("New client");
  while (!client.available()) {   // 该循环将一直等待，直到客户端发送请求且数据就绪。等待期间，代码以 1 毫秒为间隔进行延时。
    delay(1);
  }

  // HTML页面，CSS：圆形绿色勾选图标，还原原图样式
  String webPage = "<!DOCTYPE html>";
  webPage += "<html lang='zh-CN'>";
  webPage += "<head>";
  webPage += "<meta charset='UTF-8'>";
  webPage += "<meta name='viewport' content='width=device-width, initial-scale=1.0'>";
  webPage += "<title>Keyes</title>";
  webPage += "<style>";
  webPage += "body {background:#f7f8fa;font-family:system-ui;padding:16px;margin:0;}";
  webPage += ".item{background:#ffffff;border-radius:18px;padding:22px;margin-bottom:14px;display:flex;align-items:center;gap:18px;}";
  /* 圆形绿底 + 白色对勾，和截图一致 */
  webPage += ".check{width:46px;height:46px;border-radius:50%;background:#dcf6e8;color:#28b968;display:flex;justify-content:center;align-items:center;font-size:26px;font-weight:bold;}";
  webPage += ".text{font-size:24px;color:#6b7280;}";
  webPage += "</style>";
  webPage += "</head>";
  webPage += "<body>";
  webPage += "<div class='item'><div class='check'>✓</div><div class='text'>Hello,Keyes !!</div></div>";
  webPage += "<div class='item'><div class='check'>✓</div><div class='text'>欢迎光临 !!</div></div>";
  webPage += "<div class='item'><div class='check'>✓</div><div class='text'>keyesrobot.cn</div></div>";
  webPage += "</body></html>";
    
  client.println("HTTP/1.1 200 OK");         // 发送 HTTP 响应头，表明服务器已成功处理该请求
  client.println("Content-Type: text/html"); // 将响应内容的类型设置为 HTML
  client.println("Connection: close");       // 响应完成后断开与客户端的连接
  client.println();                          // 发送一个空行以结束 HTTP 响应头并开始正文内容
  client.println(webPage);                   // 将定义好的 HTML 页面内容发送给客户端，使客户端收到一条包含“Hello,Keyes !!”、“欢迎光临 !!”、“keyesrobot.cn”的响应消息

  delay(100); // 增加延迟，确保响应完整发送
  client.stop(); // 断开与客户端的连接
}
