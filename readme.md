# 插件爬虫
## 功能
+ [ ] ins
+ [ ] fb
+ [ ] tw
+ [ ] 添加遮罩
+ [ ] 导出csv

## 流程
1. 点击插件开始任务
   1. + [ ] 创建任务目录 `/root/tokenid/others`
   2. + [ ] 添加遮罩
   3. + [ ] 根据网址判断查询流程
2. 执行查询流程
   1. + [ ] 开启网络监听
   2. + [ ] js操作鼠标和键盘
3. 导出csv
   | 风险帐号ID | 所属平台 | 主页链接 |
   | ---------- | -------- | -------- |
   | aaaa       | ins      | url      |
   | aaaa       | fb       | url      |

### 添加遮罩
1. 使用api注入css
2. 使用js创建tag，设置css，定时关闭

## 素材

+ [ ] manifest.json 配置
+ [ ] html 配置（三行，每行有名字，状态，启动）
+ [ ] js 配置（实现操作）

## 记录

+ index
  + 点击插件弹出标签页。HTML+JS都是独立与活动标签页运行
+ content_script
  + 操作活动标签页
+ background
  + 操作插件状态

### 当前功能总结

+ [x] ~~action~~
  + [x] ~~弹出标签页~~
  + 不需要该功能
+ [ ] content_script
  + [ ] 执行任务脚本
+ [ ] background
  + [ ] 更改插件显示状态
  + 不能与action同用
  + 需要该功能。注入css、js