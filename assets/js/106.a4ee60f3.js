(window.webpackJsonp=window.webpackJsonp||[]).push([[106],{1801:function(t,a,s){"use strict";s.r(a);var e=s(3),r=Object(e.a)({},(function(){var t=this,a=t._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("p",[t._v("Trace 是Rabbitmq用于记录每一次发送的消息，方便使用Rabbitmq的开发者调试、排错。")]),t._v(" "),a("h2",{attrs:{id:"_1、启动tracing插件"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_1、启动tracing插件"}},[t._v("#")]),t._v(" 1、启动Tracing插件")]),t._v(" "),a("div",{staticClass:"language-sh line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("## 进入rabbitMq中")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("docker")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v("exec")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("-it")]),t._v(" rabbitmq1 "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("bash")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("## 启动日志插件")]),t._v("\nrabbitmq-plugins "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v("enable")]),t._v(" rabbitmq_tracing\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("## 开启rabbitmq的tracing插件")]),t._v("\nrabbitmqctl trace_on\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br"),a("span",{staticClass:"line-number"},[t._v("2")]),a("br"),a("span",{staticClass:"line-number"},[t._v("3")]),a("br"),a("span",{staticClass:"line-number"},[t._v("4")]),a("br"),a("span",{staticClass:"line-number"},[t._v("5")]),a("br"),a("span",{staticClass:"line-number"},[t._v("6")]),a("br")])]),a("p",[t._v("开启了插件后，无需重启，rabbitMq管理界面就会出现Tracing项，可新建追踪。")]),t._v(" "),a("h2",{attrs:{id:"_2、新建trace"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2、新建trace"}},[t._v("#")]),t._v(" 2、新建trace")]),t._v(" "),a("p",[t._v("新建trace时，JSON模式的数据会被Base64加密，不好观察，所以选择Text模式，同时可在Pattern中配置过滤条件")]),t._v(" "),a("p",[a("img",{attrs:{src:s(999),alt:"image-20241113103421842"}})]),t._v(" "),a("h2",{attrs:{id:"其他命令"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#其他命令"}},[t._v("#")]),t._v(" 其他命令")]),t._v(" "),a("div",{staticClass:"language-sh line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 查看打开的插件 ")]),t._v("\nrabbitmq-plugins list\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 关闭trace功能")]),t._v("\nrabbitmqctl trace_off\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 停止tracing")]),t._v("\nrabbitmq-plugins disable rabbitmq_tracing\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br"),a("span",{staticClass:"line-number"},[t._v("2")]),a("br"),a("span",{staticClass:"line-number"},[t._v("3")]),a("br"),a("span",{staticClass:"line-number"},[t._v("4")]),a("br"),a("span",{staticClass:"line-number"},[t._v("5")]),a("br"),a("span",{staticClass:"line-number"},[t._v("6")]),a("br")])]),a("h2",{attrs:{id:"trace消息跟踪显示乱码-谷歌如何修改字符编码"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#trace消息跟踪显示乱码-谷歌如何修改字符编码"}},[t._v("#")]),t._v(" trace消息跟踪显示乱码（谷歌如何修改字符编码）")]),t._v(" "),a("p",[t._v("从github上下载最新的crx：https://"),a("a",{attrs:{href:"https://so.csdn.net/so/search?q=github&spm=1001.2101.3001.7020",target:"_blank",rel:"noopener noreferrer"}},[t._v("github"),a("OutboundLink")],1),t._v(".com/jinliming2/Chrome-Charset/releases")]),t._v(" "),a("p",[t._v("选择谷歌设置–扩展程序，将crx拖入谷歌浏览器，确认即可。")]),t._v(" "),a("p",[t._v("选择插件修改编码格式为utf-8,问题解决。")]),t._v(" "),a("h2",{attrs:{id:"参考资料"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#参考资料"}},[t._v("#")]),t._v(" 参考资料")]),t._v(" "),a("p",[t._v("https://blog.51cto.com/u_15002821/8984730")]),t._v(" "),a("p",[t._v("https://blog.csdn.net/theconqueror/article/details/109177781")]),t._v(" "),a("p",[t._v("https://blog.csdn.net/m0_59281987/article/details/131876259")])])}),[],!1,null,null,null);a.default=r.exports},999:function(t,a,s){t.exports=s.p+"assets/img/image-20241113103421842.75ac68d0.png"}}]);