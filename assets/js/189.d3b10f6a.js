(window.webpackJsonp=window.webpackJsonp||[]).push([[189],{1840:function(s,a,n){"use strict";n.r(a);var e=n(3),t=Object(e.a)({},(function(){var s=this,a=s._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[a("p",[s._v("https://www.cnblogs.com/luckyleaf/p/11157905.html")]),s._v(" "),a("p",[s._v("https://blog.csdn.net/qq_37837722/article/details/90482512")]),s._v(" "),a("p",[s._v("https://blog.csdn.net/liukuan73/article/details/52525431")]),s._v(" "),a("p",[s._v("https://www.yingtwo.com/article/7990658.html")]),s._v(" "),a("p",[s._v("https://www.cnblogs.com/majiang/p/14380803.html")]),s._v(" "),a("p",[s._v("https://www.jianshu.com/p/0af261b76d0c")]),s._v(" "),a("p",[s._v("graylog_deflector索引作用")]),s._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v('要配置Graylog以使用graylog_deflector索引并根据策略将数据转发到其他索引中，您需要进行以下步骤：\n\n1. 登录到Graylog的Web界面。\n2. 导航到"System"（系统）菜单，然后选择"Indices"（索引）选项。\n3. 在索引列表中，找到名为graylog_deflector的索引。如果不存在，请点击"Create index set"（创建索引集）按钮创建一个新的索引集，并将其命名为graylog_deflector。\n4. 在graylog_deflector索引的配置页面上，您可以设置以下参数：\n- Rotation Strategy（轮询策略）：选择用于切换索引的策略，例如按时间、按大小或其他规则。\n- Index Prefix（索引前缀）：指定其他索引的名称前缀。例如，如果您希望创建名为graylog_2022-01-01、graylog_2022-01-02等的索引，可以将前缀设置为graylog_。\n- Index Template（索引模板）：选择要应用于新创建的索引的模板。模板定义了索引的设置和映射规则。\n- Index Set Configuration（索引集配置）：根据需要配置其他高级设置，例如分片数、副本数等。\n5. 完成配置后，点击"Save"（保存）按钮以保存graylog_deflector索引的配置。\n\n一旦graylog_deflector索引配置完成，Graylog将根据您设置的策略自动将数据转发到其他索引中。根据策略的不同，Graylog可能会创建新的索引并将数据写入其中，或者将数据写入已存在的索引中。\n\n请注意，配置graylog_deflector索引和数据转发策略可能需要根据您的具体需求进行调整。建议参考Graylog的官方文档或寻求更详细的配置指南以获得更准确的配置信息。\n')])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br"),a("span",{staticClass:"line-number"},[s._v("10")]),a("br"),a("span",{staticClass:"line-number"},[s._v("11")]),a("br"),a("span",{staticClass:"line-number"},[s._v("12")]),a("br"),a("span",{staticClass:"line-number"},[s._v("13")]),a("br"),a("span",{staticClass:"line-number"},[s._v("14")]),a("br"),a("span",{staticClass:"line-number"},[s._v("15")]),a("br")])]),a("p",[s._v("Elasticsearch 健康状态为 yellow 问题的解决")]),s._v(" "),a("p",[a("a",{attrs:{href:"https://blog.csdn.net/ale2012/article/details/106992995",target:"_blank",rel:"noopener noreferrer"}},[s._v("单节点 Elasticsearch 健康状态为 yellow 问题的解决_elasticsearch yellow-CSDN博客"),a("OutboundLink")],1)]),s._v(" "),a("p",[a("a",{attrs:{href:"https://blog.csdn.net/myhes/article/details/106076544",target:"_blank",rel:"noopener noreferrer"}},[s._v("Elasticsearch(ES)生产集群健康状况为黄色(yellow)的官方详细解释、原因分析和解决方案(实测可用)_es容器 健康状态yellow-CSDN博客"),a("OutboundLink")],1)]),s._v(" "),a("p",[s._v("单机安装")]),s._v(" "),a("p",[s._v("https://blog.csdn.net/qixiaolinlin/article/details/129966703")]),s._v(" "),a("p",[s._v("https://blog.csdn.net/liukuan73/article/details/52525431")]),s._v(" "),a("p",[s._v("https://huaweicloud.csdn.net/637f7accdacf622b8df85933.html")]),s._v(" "),a("p",[s._v("https://www.cnblogs.com/runliuv/p/15475747.html")]),s._v(" "),a("p",[a("a",{attrs:{href:"https://developer.aliyun.com/article/738051",target:"_blank",rel:"noopener noreferrer"}},[s._v("在生产环境中使用Graylog日志系统所踩过的坑-阿里云开发者社区 (aliyun.com)"),a("OutboundLink")],1)]),s._v(" "),a("p",[s._v("-bash: pwgen: command not found")]),s._v(" "),a("p",[s._v("https://blog.csdn.net/weixin_37391237/article/details/121389868")]),s._v(" "),a("p",[s._v("查看graylog报错日志：如果提示报错，请查看 "),a("strong",[s._v("/var/log/graylog-server")]),s._v("/ 下的日志文件，或 journalctl -xe -u graylog")]),s._v(" "),a("p",[s._v("修改用户名密码")]),s._v(" "),a("p",[s._v("https://www.codeleading.com/article/43856151066")]),s._v(" "),a("p",[s._v("graylog查询语法")]),s._v(" "),a("p",[s._v("https://blog.csdn.net/weixin_43066697/article/details/126303133")]),s._v(" "),a("h2",{attrs:{id:"问题"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#问题"}},[s._v("#")]),s._v(" 问题")]),s._v(" "),a("h3",{attrs:{id:"未启动成功"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#未启动成功"}},[s._v("#")]),s._v(" 未启动成功")]),s._v(" "),a("div",{staticClass:"language-bash line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 运行如下启动命令未成功")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("sudo")]),s._v(" systemctl start graylog-server.service\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 使用journalctl命令来查看Graylog Server服务的日志。这个命令会显示系统日志中与指定服务相关的条目")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("sudo")]),s._v(" journalctl "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-u")]),s._v(" graylog-server.service\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 如果只想查看最近的日志，可以使用-n选项指定条目数量，例如：")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("sudo")]),s._v(" journalctl "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-u")]),s._v(" graylog-server.service "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-n")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("100")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 如果您想实时查看日志更新（类似于tail -f），可以使用-f选项，这将持续显示新的日志条目，直到停止命令")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("sudo")]),s._v(" journalctl "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-u")]),s._v(" graylog-server.service "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-f")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# journalctl命令依赖于systemd的日志系统，这是许多现代Linux发行版（如Ubuntu、CentOS 7及更高版本等）的默认日志管理系统。如果您的系统不使用systemd，那么可能需要使用其他工具（如tail命令查看/var/log目录下的日志文件）来查看服务日志")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br")])]),a("h3",{attrs:{id:"mongo连接问题"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#mongo连接问题"}},[s._v("#")]),s._v(" mongo连接问题")]),s._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v("2024-02-22T14:48:19.007+08:00 INFO  [MongoDBPreflightCheck] MongoDB is not available. Retry #121\n2024-02-22T14:48:21.008+08:00 INFO  [MongoDBPreflightCheck] MongoDB is not available. Retry #122\n2024-02-22T14:48:23.008+08:00 INFO  [MongoDBPreflightCheck] MongoDB is not available. Retry #123\n2024-02-22T14:48:25.009+08:00 INFO  [MongoDBPreflightCheck] MongoDB is not available. Retry #124\n2024-02-22T14:48:27.009+08:00 INFO  [MongoDBPreflightCheck] MongoDB is not available. Retry #125\n2024-02-22T14:48:29.010+08:00 INFO  [MongoDBPreflightCheck] MongoDB is not available. Retry #126\n2024-02-22T14:48:31.011+08:00 INFO  [MongoDBPreflightCheck] MongoDB is not available. Retry #127\n2024-02-22T14:48:33.011+08:00 INFO  [MongoDBPreflightCheck] MongoDB is not available. Retry #128\n2024-02-22T14:48:35.012+08:00 INFO  [MongoDBPreflightCheck] MongoDB is not available. Retry #129\n2024-02-22T14:48:37.012+08:00 INFO  [MongoDBPreflightCheck] MongoDB is not available. Retry #130\n2024-02-22T14:48:39.013+08:00 INFO  [MongoDBPreflightCheck] MongoDB is not available. Retry #131\n2024-02-22T14:48:41.013+08:00 INFO  [MongoDBPreflightCheck] MongoDB is not available. Retry #132\n\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br"),a("span",{staticClass:"line-number"},[s._v("10")]),a("br"),a("span",{staticClass:"line-number"},[s._v("11")]),a("br"),a("span",{staticClass:"line-number"},[s._v("12")]),a("br"),a("span",{staticClass:"line-number"},[s._v("13")]),a("br")])]),a("p",[s._v("修改配置")]),s._v(" "),a("div",{staticClass:"language-bash line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 配置文件路径：/etc/graylog/server/server.conf")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 105行左右")]),s._v("\nhttp_bind_address "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("0.0")]),s._v(".0.0:9000\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 555行左右")]),s._v("\nmongodb_uri "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" mongodb://ekroot:ek070901@localhost:27017/graylog?authSource"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("admin\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br")])]),a("h3",{attrs:{id:"磁盘空间不足"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#磁盘空间不足"}},[s._v("#")]),s._v(" 磁盘空间不足")]),s._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v("2024-02-22T15:01:46.195+08:00 ERROR [PreflightCheckService] Preflight check failed with error: Journal directory </var/lib/graylog-server/journal> has not enough free space (1943 MB) available. You need to provide additional 2518 MB to contain 'message_journal_max_size = 5120 MB'\n2024-02-22T15:01:46.195+08:00 ERROR [CmdLineTool] Startup error:\norg.graylog2.bootstrap.preflight.PreflightCheckException: Journal directory </var/lib/graylog-server/journal> has not enough free space (1943 MB) available. You need to provide additional 2518 MB to contain 'message_journal_max_size = 5120 MB'\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br")])]),a("p",[s._v("1、调低 message_journal_max_size 参数大小")]),s._v(" "),a("p",[s._v("2、清理 dev/vdal")]),s._v(" "),a("p",[s._v("https://wenku.baidu.com/view/52b723d7f405cc1755270722192e453610665bdf.html?fr=sogou&"),a("em",[s._v("wkts")]),s._v("=1708585584306")]),s._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v("[root@iZm5e1egdpr5bckrj8gty5Z ~]# df -h\nFilesystem      Size  Used Avail Use% Mounted on\ndevtmpfs         31G     0   31G   0% /dev\ntmpfs            31G     0   31G   0% /dev/shm\ntmpfs            31G  608K   31G   1% /run\ntmpfs            31G     0   31G   0% /sys/fs/cgroup\n/dev/vda1        40G   36G  1.9G  95% /\ntmpfs            31G  2.0M   31G   1% /tmp\ntmpfs           6.2G     0  6.2G   0% /run/user/0\n[root@iZm5e1egdpr5bckrj8gty5Z ~]# cd /\n[root@iZm5e1egdpr5bckrj8gty5Z /]# du -sh *\n156M    back\n0       bin\n272M    boot\n180M    data\n0       dev\n12G     ekdir\n28M     etc\n4.0K    home\n0       lib\n0       lib64\n16K     lost+found\n4.0K    media\n4.0K    mnt\n16K     opt\ndu: cannot access 'proc/212747/task/212747/fd/3': No such file or directory\ndu: cannot access 'proc/212747/task/212747/fdinfo/3': No such file or directory\ndu: cannot access 'proc/212747/fd/3': No such file or directory\ndu: cannot access 'proc/212747/fdinfo/3': No such file or directory\ndu: cannot access 'proc/212753': No such file or directory\n0       proc\n17M     root\n608K    run\n0       sbin\n4.0K    srv\n0       sys\n896K    tmp\n8.2G    usr\n16G     var\n[root@iZm5e1egdpr5bckrj8gty5Z /]#\n\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br"),a("span",{staticClass:"line-number"},[s._v("10")]),a("br"),a("span",{staticClass:"line-number"},[s._v("11")]),a("br"),a("span",{staticClass:"line-number"},[s._v("12")]),a("br"),a("span",{staticClass:"line-number"},[s._v("13")]),a("br"),a("span",{staticClass:"line-number"},[s._v("14")]),a("br"),a("span",{staticClass:"line-number"},[s._v("15")]),a("br"),a("span",{staticClass:"line-number"},[s._v("16")]),a("br"),a("span",{staticClass:"line-number"},[s._v("17")]),a("br"),a("span",{staticClass:"line-number"},[s._v("18")]),a("br"),a("span",{staticClass:"line-number"},[s._v("19")]),a("br"),a("span",{staticClass:"line-number"},[s._v("20")]),a("br"),a("span",{staticClass:"line-number"},[s._v("21")]),a("br"),a("span",{staticClass:"line-number"},[s._v("22")]),a("br"),a("span",{staticClass:"line-number"},[s._v("23")]),a("br"),a("span",{staticClass:"line-number"},[s._v("24")]),a("br"),a("span",{staticClass:"line-number"},[s._v("25")]),a("br"),a("span",{staticClass:"line-number"},[s._v("26")]),a("br"),a("span",{staticClass:"line-number"},[s._v("27")]),a("br"),a("span",{staticClass:"line-number"},[s._v("28")]),a("br"),a("span",{staticClass:"line-number"},[s._v("29")]),a("br"),a("span",{staticClass:"line-number"},[s._v("30")]),a("br"),a("span",{staticClass:"line-number"},[s._v("31")]),a("br"),a("span",{staticClass:"line-number"},[s._v("32")]),a("br"),a("span",{staticClass:"line-number"},[s._v("33")]),a("br"),a("span",{staticClass:"line-number"},[s._v("34")]),a("br"),a("span",{staticClass:"line-number"},[s._v("35")]),a("br"),a("span",{staticClass:"line-number"},[s._v("36")]),a("br"),a("span",{staticClass:"line-number"},[s._v("37")]),a("br"),a("span",{staticClass:"line-number"},[s._v("38")]),a("br"),a("span",{staticClass:"line-number"},[s._v("39")]),a("br"),a("span",{staticClass:"line-number"},[s._v("40")]),a("br"),a("span",{staticClass:"line-number"},[s._v("41")]),a("br")])])])}),[],!1,null,null,null);a.default=t.exports}}]);