(window.webpackJsonp=window.webpackJsonp||[]).push([[58],{1370:function(t,a,e){t.exports=e.p+"assets/img/image-20240229000234313.161961d2.png"},1371:function(t,a,e){t.exports=e.p+"assets/img/image-20240301235640449.acda8294.png"},1372:function(t,a,e){t.exports=e.p+"assets/img/image-20240301235022078.0cb668c7.png"},1373:function(t,a,e){t.exports=e.p+"assets/img/image-20240301233912566.d56590f7.png"},1374:function(t,a,e){t.exports=e.p+"assets/img/image-20240301234031521.b3544efd.png"},1895:function(t,a,e){"use strict";e.r(a);var r=e(3),s=Object(r.a)({},(function(){var t=this,a=t._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h2",{attrs:{id:"模型是什么"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#模型是什么"}},[t._v("#")]),t._v(" 模型是什么")]),t._v(" "),a("p",[t._v("1、大模型")]),t._v(" "),a("p",[t._v("AI绘画中的“大模型”，一般指Checkpoint。")]),t._v(" "),a("p",[t._v("定义：AI训练的“数据集”，用来支持AI出图作画。")]),t._v(" "),a("p",[t._v("Checkpoint概念的来源：大部分模型会进行不断的训练、微调、迭代，过程中的“储存点”就是一个大模型。")]),t._v(" "),a("p",[t._v("基本属性：大小（1-7G）；常见格式（.ckpt/.safetensor）")]),t._v(" "),a("p",[t._v("2、除了“大模型”以外，还有“小模型”，例如：LoRA、Embeddings、Hypernetwork等。")]),t._v(" "),a("p",[t._v("3、VAE：变分自编码器")]),t._v(" "),a("p",[t._v("简单理解为“色彩滤镜”。")]),t._v(" "),a("p",[t._v("如果模型没有自带的VAE，需要正确配置VAE（最好根据模型作者的推荐），否则画面发灰发白，生成质量堪忧。几个目前比较主流的VAE（kl-f8-anime、vae-ft-mse-840000等）。")]),t._v(" "),a("p",[a("img",{attrs:{src:e(1370),alt:"image-20240229000234313"}})]),t._v(" "),a("p",[t._v("VAE一般去Huggingface，大部分都可以找到；Civitai上没有专门的VAE分类，但通过搜索也可以找到部分VAE。")]),t._v(" "),a("p",[t._v("模型作者一般会推荐的VAE，是基于训练过程或者试验下来评估出效果最好的一个；使用其他VAE会有一定差别，但不至于“出不了图”。")]),t._v(" "),a("p",[t._v("WebUI左上角没有VAE的选项，需要进入“设置”标签，找到“Stable Diffusion”选项，里面有VAE的相关设置项。如果想把它放到左上角，转到下方“用户界面”选项；在其中的快捷设置列表中添加“sd_vae”的字段（输入会自动补全），再通过最上方按钮重启前端即可。")]),t._v(" "),a("h2",{attrs:{id:"模型下载渠道"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#模型下载渠道"}},[t._v("#")]),t._v(" 模型下载渠道")]),t._v(" "),a("h3",{attrs:{id:"官方模型和私炉模型的区别"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#官方模型和私炉模型的区别"}},[t._v("#")]),t._v(" 官方模型和私炉模型的区别")]),t._v(" "),a("p",[t._v("官方模型：花费了非常大的力气训练出来的基础模型，支持AI作画的根源，但出图效果一般。")]),t._v(" "),a("p",[t._v("私炉模型：在官方模型的基础上“微调”出来的具有风格化特点的模型，由个人创作者训练。")]),t._v(" "),a("p",[t._v("训练模型，也被称为“炼丹”。")]),t._v(" "),a("h3",{attrs:{id:"下载各类模型的渠道"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#下载各类模型的渠道"}},[t._v("#")]),t._v(" 下载各类模型的渠道")]),t._v(" "),a("h4",{attrs:{id:"hugging-face-抱脸"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#hugging-face-抱脸"}},[t._v("#")]),t._v(" Hugging Face（抱脸）")]),t._v(" "),a("p",[t._v("链接："),a("a",{attrs:{href:"https://huggingface.co/models",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://huggingface.co/models"),a("OutboundLink")],1)]),t._v(" "),a("p",[t._v("深度学习和人工智能网站，全世界AI研究与模型共享的前沿阵地，但专业性较强，检索起来不是很直观。")]),t._v(" "),a("p",[a("img",{attrs:{src:e(1371),alt:"image-20240301235640449"}})]),t._v(" "),a("h4",{attrs:{id:"civitai-c站"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#civitai-c站"}},[t._v("#")]),t._v(" Civitai（C站）")]),t._v(" "),a("p",[t._v("链接："),a("a",{attrs:{href:"https://civitai.com",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://civitai.com"),a("OutboundLink")],1)]),t._v(" "),a("p",[t._v("全世界最受欢迎的AI绘画模型分享网站，除了模型还有跟多优秀作品展示")]),t._v(" "),a("p",[a("img",{attrs:{src:e(1372),alt:"image-20240301235022078"}})]),t._v(" "),a("h4",{attrs:{id:"liblibai-哩布哩布"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#liblibai-哩布哩布"}},[t._v("#")]),t._v(" LibLibAI（哩布哩布）")]),t._v(" "),a("p",[t._v("链接："),a("a",{attrs:{href:"https://www.liblib.art",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://www.liblib.art"),a("OutboundLink")],1)]),t._v(" "),a("p",[t._v("国内起步较早的模型网站之一，目前拥有丰富的模型库存与完善的作品展示社区")]),t._v(" "),a("p",[a("img",{attrs:{src:e(1373),alt:"image-20240301233912566"}})]),t._v(" "),a("h4",{attrs:{id:"esheep-电子羊"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#esheep-电子羊"}},[t._v("#")]),t._v(" eSheep（电子羊）")]),t._v(" "),a("p",[t._v("链接："),a("a",{attrs:{href:"https://www.esheep.com",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://www.esheep.com"),a("OutboundLink")],1)]),t._v(" "),a("p",[t._v("国内新锐模型网站，有作品热榜、站内私信互动等多种创新性功能，支持在线ComfyUI工作流。")]),t._v(" "),a("p",[a("img",{attrs:{src:e(1374),alt:"image-20240301234031521"}})]),t._v(" "),a("h3",{attrs:{id:"模型的筛选方式"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#模型的筛选方式"}},[t._v("#")]),t._v(" 模型的筛选方式")]),t._v(" "),a("p",[t._v("训练模型：从基础模型训练得来。")]),t._v(" "),a("p",[t._v("融合模型：多个训练模型混合得到的新模型。")]),t._v(" "),a("p",[t._v("模型标签：模型“擅长”的领域，如真人照片、动漫、插画、建筑、卡通、3D等。")]),t._v(" "),a("h3",{attrs:{id:"学会使用模型"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#学会使用模型"}},[t._v("#")]),t._v(" 学会使用模型")]),t._v(" "),a("p",[t._v("查看版本：有些模型可能存在不同的迭代版本，一般选用最新的。")]),t._v(" "),a("p",[t._v("查看ModelCard与模型说明：作者一般会提供使用说明，推荐采样器、VAE等。")]),t._v(" "),a("p",[t._v("查看例图提示词：在模型网站上，一般都可以直接复制作者或其他创作者上传图片的提示词并加以应用。")]),t._v(" "),a("h2",{attrs:{id:"模型风格分类与推荐"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#模型风格分类与推荐"}},[t._v("#")]),t._v(" 模型风格分类与推荐")]),t._v(" "),a("h3",{attrs:{id:"二次元模型"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#二次元模型"}},[t._v("#")]),t._v(" 二次元模型")]),t._v(" "),a("p",[t._v("偏漫画/插画风，具有较鲜明的绘画笔触质感")]),t._v(" "),a("p",[t._v("推荐模型：AbyssOrangeMix、Counterfeit（精致度满满，室内外场景优秀）、Anything（最受欢迎的二次元模型）、Dreamlike Diffusion（魔幻感十足）")]),t._v(" "),a("h3",{attrs:{id:"真实系模型"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#真实系模型"}},[t._v("#")]),t._v(" 真实系模型")]),t._v(" "),a("p",[t._v("偏真实系的，拟真化程度高，对现实世界还原强")]),t._v(" "),a("p",[t._v("推荐模型：Deliberate2.5D（精细的写实风格）、Realistic Vision（真实朴素）、LOFI（照片级）")]),t._v(" "),a("h3",{attrs:{id:"_2-5d模型"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-5d模型"}},[t._v("#")]),t._v(" 2.5D模型")]),t._v(" "),a("p",[t._v("介于前两者之间，接近目前观众对一些游戏和3D动画的想象")]),t._v(" "),a("p",[t._v("推荐模型：NeverEndingDream（NED，动漫角色的二次创作，即真实又二次元）、Protogen x3.4（超现实的画面）、国风3（国风、小人书、水墨风）")]),t._v(" "),a("h3",{attrs:{id:"其他特化风格模型"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#其他特化风格模型"}},[t._v("#")]),t._v(" 其他特化风格模型")]),t._v(" "),a("p",[t._v("建筑设计、平面设计等")]),t._v(" "),a("p",[t._v("推荐模型：dvArch - Multi-Prompt Archittecture Tuned Model（富有现代感的建筑）、Cheese Daddy's Landscapes mix（富有魔幻感的场景）、Graphic design_2.0（富有高级感的平面设计）、Logo生成器（Logo.Redmond）")]),t._v(" "),a("h2",{attrs:{id:"参考资料"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#参考资料"}},[t._v("#")]),t._v(" 参考资料")]),t._v(" "),a("p",[t._v("模型的使用")]),t._v(" "),a("p",[a("a",{attrs:{href:"https://www.bilibili.com/video/BV1Us4y117Rg/",target:"_blank",rel:"noopener noreferrer"}},[t._v("AI绘画模型新手包！“画风”自由切换，有哪些你不知道的模型使用技巧？ | 零基础入门Stable Diffusion的保姆级新手教程 | SD模型下载方式与推荐_哔哩哔哩_bilibili"),a("OutboundLink")],1)]),t._v(" "),a("p",[t._v("模型推荐")]),t._v(" "),a("p",[a("a",{attrs:{href:"https://www.bilibili.com/video/BV1DP41167bZ/",target:"_blank",rel:"noopener noreferrer"}},[t._v("AI再进化，这次竟然学会摄影了！一秒生成胶片风、拍立得，还能智能“修脸”！Stable Diffusion AI绘画真实系人像模型+LoRA推荐_哔哩哔哩_bilibili"),a("OutboundLink")],1)])])}),[],!1,null,null,null);a.default=s.exports}}]);