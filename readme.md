# 插件爬虫

## 程序简述
```
root
|
|---api  // 服务端
|
|---plugins  // 客户端
|------popup  // 插件主页。与活动tab交互。
|------facebook  // facebook 功能实现
|------ins  // ins 功能实现
|------twitter  // twitter 功能实现
```
## 功能
+ [ ] token认证
+ [x] ins
+ [x] fb
+ [x] tw
+ [ ] ~~添加遮罩~~
  + 添加遮罩会影响操作页面
+ [x] 导出csv

## 流程
1. 点击插件
2. 上传认证token文件
3. 上传关键词文件
4. 执行任务并等待
5. 保存csv文件
   | 风险帐号ID | 所属平台 | 主页链接 |
   | ---------- | -------- | -------- |
   | aaaa       | ins      | url      |
   | aaaa       | fb       | url      |
