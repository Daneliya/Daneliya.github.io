(window.webpackJsonp=window.webpackJsonp||[]).push([[51],{1289:function(s,a,t){s.exports=t.p+"assets/img/image-1733845825106.7b44f970.png"},1290:function(s,a,t){s.exports=t.p+"assets/img/image-1733845825205.70603b3f.png"},1291:function(s,a,t){s.exports=t.p+"assets/img/image-1733845825230.5c9c9901.png"},1292:function(s,a,t){s.exports=t.p+"assets/img/image-1733845825217.24687b27.png"},1293:function(s,a,t){s.exports=t.p+"assets/img/image-1733845825233.21df7f19.png"},1294:function(s,a,t){s.exports=t.p+"assets/img/image-1733845825238.980e7c7a.png"},1295:function(s,a,t){s.exports=t.p+"assets/img/image-1733845825257.f20f45cc.png"},1940:function(s,a,t){"use strict";t.r(a);var n=t(3),e=Object(n.a)({},(function(){var s=this,a=s._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[a("p",[s._v("CSV是数据分析师最喜欢的数据格式。")]),s._v(" "),a("p",[s._v("与JSON一样，CSV也是纯文本文件，也就是说文字内容不存在粗体、下划线、字号、颜色等特征")]),s._v(" "),a("p",[s._v("如果把逗号对齐，CSV的结构基本上就是一个表格。")]),s._v(" "),a("h2",{attrs:{id:"一、csv"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#一、csv"}},[s._v("#")]),s._v(" 一、CSV")]),s._v(" "),a("h3",{attrs:{id:"_1、概念"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_1、概念"}},[s._v("#")]),s._v(" 1、概念")]),s._v(" "),a("p",[s._v("CSV，全称是Comma-Separated Values，表示逗号分隔值。")]),s._v(" "),a("h3",{attrs:{id:"_2、结构"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2、结构"}},[s._v("#")]),s._v(" 2、结构")]),s._v(" "),a("p",[s._v("1）表头")]),s._v(" "),a("p",[s._v("a、有表头：CSV文件第一行，也就是展示列名那行，大部分情况下是表格头，包含了许多属性名")]),s._v(" "),a("p",[s._v("b、无表头：也可以无表头，以数据直接开始")]),s._v(" "),a("p",[s._v("2）数据")]),s._v(" "),a("p",[s._v("a、在表头下面，每一条数据都是独占一行的，因此当我们把CSV文件转换成DataFrame后，CSV的行与DataFrame的行之间能够直接对应上")]),s._v(" "),a("p",[s._v("b、每行数据里所包含的值的数量应该是相同的，逗号分隔符的数量也必须相同，但凡哪行多了或少了，说明那就不是一个合格有效的CSV")]),s._v(" "),a("h3",{attrs:{id:"_3、特殊情况"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_3、特殊情况"}},[s._v("#")]),s._v(" 3、特殊情况")]),s._v(" "),a("p",[s._v("1）当数据值里面包含英文逗号，可以用引号围完整的值。里面的逗号，就不会被当成分隔符的逗号了")]),s._v(" "),a("p",[s._v("2）当某个值为空缺，可以让两个分隔逗号相邻，表示中间那个值不存在")]),s._v(" "),a("h3",{attrs:{id:"_4、csv与json对比"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_4、csv与json对比"}},[s._v("#")]),s._v(" 4、CSV与JSON对比")]),s._v(" "),a("p",[s._v("CSV本身是一个非常规整的二维结构，能一眼就知道它所对应的表格长什么样子")]),s._v(" "),a("p",[s._v("JSON则不同，它的结构能非常灵活，也可以层层嵌套，很难直观看出对应表格长什么样")]),s._v(" "),a("p",[s._v("因此，JSON是通用编程时受欢迎的数据结构，而CSV是数据分析时受欢迎的数据结构")]),s._v(" "),a("h3",{attrs:{id:"_5、编写csv"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_5、编写csv"}},[s._v("#")]),s._v(" 5、编写CSV")]),s._v(" "),a("p",[s._v("打开代码编辑器或文本编辑器，按照CSV格式的规则写好后，把文件保存为以.csv结尾的文件即可")]),s._v(" "),a("h3",{attrs:{id:"_6、默认规范"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_6、默认规范"}},[s._v("#")]),s._v(" 6、默认规范")]),s._v(" "),a("p",[s._v("用代码分析数据时，尽量让源数据文件，以CSV、JSON等纯文本格式，或者sqlite等数据库文件格式")]),s._v(" "),a("h3",{attrs:{id:"_7、优点"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_7、优点"}},[s._v("#")]),s._v(" 7、优点")]),s._v(" "),a("p",[s._v("体积小，结构工整，容易让人理解，能非常直接地转换成表格。")]),s._v(" "),a("p",[s._v("可以用Excel软件去读取、修改或导出CSV。")]),s._v(" "),a("h3",{attrs:{id:"_8、读取"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_8、读取"}},[s._v("#")]),s._v(" 8、读取")]),s._v(" "),a("p",[s._v("在实际的数据分析中，由于一般数据量比较大，动辄1G以上的CSV数据集是很常见的，")]),s._v(" "),a("p",[s._v("1）Excel")]),s._v(" "),a("p",[s._v("可能会卡住。因为Excel不止要展示数据，还要试图展示格式(虽然文件里可能就没有额外格式)，还得加载一系列功能等")]),s._v(" "),a("p",[s._v("2）代码编辑器或者纯文本编辑器")]),s._v(" "),a("p",[s._v("3）更好的方法")]),s._v(" "),a("p",[s._v("用代码读取，转换成DataFrame，然后用Pandas库里的方法，想看几行看几行，而不用等海量的数据全部加载出来")]),s._v(" "),a("h2",{attrs:{id:"二、读取csv"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#二、读取csv"}},[s._v("#")]),s._v(" 二、读取CSV")]),s._v(" "),a("h3",{attrs:{id:"_1、导入pandas"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_1、导入pandas"}},[s._v("#")]),s._v(" 1、导入Pandas")]),s._v(" "),a("p",[a("code",[s._v("import pandas as pd")])]),s._v(" "),a("h3",{attrs:{id:"_2、read-csv函数"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2、read-csv函数"}},[s._v("#")]),s._v(" 2、read_csv函数")]),s._v(" "),a("p",[s._v("顾名思义是用来读CSV文件的")]),s._v(" "),a("p",[s._v("把文件的路径作为参数")]),s._v(" "),a("p",[a("strong",[s._v("以下用代码而不是软件去处理数据，能更快处理完成")])]),s._v(" "),a("div",{staticClass:"language-python line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-python"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("import")]),s._v(" pandas "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("as")]),s._v(" pd\ndf1 "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" pd"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("read_csv"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'fifa_players_22.csv'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# fifa_players_22.csv文件，里面记录了2万条国际足联球员的信息，文件体积是12MB左右")]),s._v("\ndf1"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("head"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br")])]),a("p",[a("img",{attrs:{src:t(1289),alt:""}})]),s._v(" "),a("h4",{attrs:{id:"_1-可选参数header"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_1-可选参数header"}},[s._v("#")]),s._v(" 1）可选参数header")]),s._v(" "),a("p",[s._v("a、csv文件有表头，省略可选参数header，默认会把第一行内容作为列名")]),s._v(" "),a("p",[s._v("b、csv文件无表头，设置'header=None'，表示不要把第一行当做列名。那解析出来的DataFrame就会把第一行视为第一条数据，列名用从0开始的数据代替")]),s._v(" "),a("div",{staticClass:"language-python line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-python"}},[a("code",[s._v("df "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" pd"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("read_csv"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'fifa_players_22.csv'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" header"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),a("span",{pre:!0,attrs:{class:"token boolean"}},[s._v("None")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\ndf"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("head"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br")])]),a("p",[a("img",{attrs:{src:t(1290),alt:""}})]),s._v(" "),a("h4",{attrs:{id:"_2-可选参数index-col"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-可选参数index-col"}},[s._v("#")]),s._v(" 2）可选参数index_col")]),s._v(" "),a("p",[s._v("a、只用位置索引，省略可选参数index_col，默认用位置索引")]),s._v(" "),a("p",[s._v("b、把某一列作为标签索引，设置'index_col=列名/列的位置索引'，返回的DataFrame就会把列名的值作为标签索引。如下例子，可以通过标签索引'球员ID'，而不是仅通过位置索引，来提取数据了")]),s._v(" "),a("div",{staticClass:"language-python line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-python"}},[a("code",[s._v("df1 "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" pd"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("read_csv"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'fifa_players_22.csv'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" index_col"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'sofifa_id'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\ndf1"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("head"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\ndf1"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("loc"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("261667")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br")])]),a("p",[a("img",{attrs:{src:t(1291),alt:""}})]),s._v(" "),a("h2",{attrs:{id:"三、展示csv的方法"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#三、展示csv的方法"}},[s._v("#")]),s._v(" 三、展示CSV的方法")]),s._v(" "),a("h3",{attrs:{id:"一-、set-option函数"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#一-、set-option函数"}},[s._v("#")]),s._v(" (一)、set_option函数")]),s._v(" "),a("p",[s._v("1、更改展示列数上限")]),s._v(" "),a("p",[s._v("默认只展示20列。")]),s._v(" "),a("p",[s._v("当我们遇到的数据包含非常多列的时候，输入的DataFrame里，中间有些列就会被自动忽略，被用'...'表示。")]),s._v(" "),a("p",[s._v("假如想查看所有列，可以通过set_option函数，提升展示的列数的上限。")]),s._v(" "),a("p",[s._v("第一个参数传入'display.max_columns'，表示展示列数的上限。")]),s._v(" "),a("p",[s._v("第二个参数传入，你希望最多看到的列数")]),s._v(" "),a("div",{staticClass:"language-python line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-python"}},[a("code",[s._v("pd"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("set_option"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'display.max_columns'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("150")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\ndf1\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br")])]),a("p",[a("img",{attrs:{src:t(1292),alt:""}})]),s._v(" "),a("p",[s._v("2、更改展示值的字符上限")]),s._v(" "),a("p",[s._v("默认的字符上限是50")]),s._v(" "),a("p",[s._v("当我们遇到值很长的时候，文字不会展示全，如上例子里，'player_tags'和'player_traits'两列")]),s._v(" "),a("p",[s._v("假如想让值展示的长度更大一些，可以通过set_option函数，提升值展示的字符上限。")]),s._v(" "),a("p",[s._v("第一个参数传入'display.max_colwidths'，每列里的值最多包含几个字符限。")]),s._v(" "),a("p",[s._v("第二个字符上限到的列数")]),s._v(" "),a("div",{staticClass:"language-python line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-python"}},[a("code",[s._v("pd"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("set_option"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'display.max_colwidth'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("500")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\ndf1\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br")])]),a("p",[a("img",{attrs:{src:t(1293),alt:""}})]),s._v(" "),a("h3",{attrs:{id:"二-、head-tail-sample方法"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#二-、head-tail-sample方法"}},[s._v("#")]),s._v(" (二)、head/tail/sample方法")]),s._v(" "),a("p",[s._v("可以得到开头/结尾/随机的N行")]),s._v(" "),a("div",{staticClass:"language-python line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-python"}},[a("code",[s._v("df1"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("head"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\ndf1"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("tail"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 默认随机返回一行的数据")]),s._v("\ndf1"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("sample"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br")])]),a("h3",{attrs:{id:"三-、info方法"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#三-、info方法"}},[s._v("#")]),s._v(" (三)、info方法")]),s._v(" "),a("p",[s._v("快速了解一个DataFrame，除了看它实际的数据之外，还可以通过info，获得DataFrame的概况信息")]),s._v(" "),a("p",[s._v("1、当列数太多时，只会展示部分信息")]),s._v(" "),a("div",{staticClass:"language-python line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-python"}},[a("code",[s._v("df1"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("info"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])]),a("p",[s._v("结果")]),s._v(" "),a("div",{staticClass:"language-python line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-python"}},[a("code",[a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("class")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'pandas.core.frame.DataFrame'")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\nIndex"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("19239")]),s._v(" entries"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("158023")]),s._v(" to "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("264540")]),s._v("\nColumns"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("106")]),s._v(" entries"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" player_url to nation_flag_url\ndtypes"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" float64"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("12")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" int64"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("44")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin"}},[s._v("object")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("50")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\nmemory usage"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("16.2")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("+")]),s._v(" MB\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br")])]),a("p",[s._v("从上到下分别是：类型、索引的范围、列的数量、列的数据类型、占用memory")]),s._v(" "),a("p",[s._v("2、当列的数量较少时，还会返回每列具体的列名，排除掉空值后实际值的数量，和每一列的数据类型")]),s._v(" "),a("div",{staticClass:"language-python line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-python"}},[a("code",[s._v("df3 "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" pd"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("read_csv"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'fifa_players_22_simple.csv'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\ndf3"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("head"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("2")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\ndf3"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("info"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br")])]),a("p",[a("img",{attrs:{src:t(1294),alt:""}})]),s._v(" "),a("h3",{attrs:{id:"四-、descirbe方法"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#四-、descirbe方法"}},[s._v("#")]),s._v(" (四)、descirbe方法")]),s._v(" "),a("p",[s._v("针对数字类型的列，一次性展示多种统计信息")]),s._v(" "),a("div",{staticClass:"language-python line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-python"}},[a("code",[s._v("df1"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("describe"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])]),a("p",[a("img",{attrs:{src:t(1295),alt:""}})])])}),[],!1,null,null,null);a.default=e.exports}}]);