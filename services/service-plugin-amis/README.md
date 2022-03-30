### Amis 插件
- 支持 Amis 渲染 Page
- 支持 Amis 编辑器


### monaco worker
- 在require amis时, amis sdk会给window上添加 MonacoEnvironment 函数, 用于处理monaco worker. 
- steedos 提供了默认的 monaco worker 处理器 window.SteedosMonacoEnvironment
- 如果需要使用 steedos 提供的 monaco worker 请在 requie amis 之后,添加代码 `window.MonacoEnvironment = window.SteedosMonacoEnvironment;`