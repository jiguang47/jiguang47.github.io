# Go by Example 中文学习版

> **[立即访问在线教程](https://jiguang47.github.io/)**

基于示例学习 Go 的中文静态教程，加入了本地学习进度记录，并补充了部分现代 Go 特性。

## 在线访问

### [点击进入 Go by Example 中文学习版](https://jiguang47.github.io/)

## 特性

- 首页显示总学习进度，每节课都可单独标记完成。
- 章节页提供“我学到这里”，可一次完成此前章节。
- 进度保存在浏览器 `localStorage`，不会上传任何学习数据。
- 增加 Go 1.23 的迭代器范围遍历示例。
- 随机数示例使用 Go 1.22 的 `math/rand/v2`。
- WaitGroup 示例使用 Go 1.25 的 `WaitGroup.Go`。
- 新增“现代 Go 1.22-1.27”章节，覆盖整数 range、增强 HTTP 路由、泛型别名、模块工具、`b.Loop`、`new(expr)`、泛型方法和 `go fix`。

## 本地预览

这是一个纯静态站点，可使用任意静态文件服务器预览：

```powershell
python -m http.server 8000
```

然后打开 `http://127.0.0.1:8000/`。

## 致谢

内容源自 [Go by Example](https://gobyexample.com/) 及其 [中文翻译项目](https://github.com/gobyexample-cn/gobyexample)。
