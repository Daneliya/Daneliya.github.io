---
url: /AIGC/05.AIGC/AI绘画提示词.md
---

# AI绘画提示词

## 提示词

::: imgCard

```yaml
config:
  cardNum: auto # 每行显示的卡片数量，默认为 auto，可在容器名字后面添加，如 ::: imgCard 3
  target: _self # 跳转方式，默认为 _blank，仅支持 _blank | _self
  lineClamp: 2 # 显示描述信息的行数，默认为 2
  cardGap: 20 # 每行卡片之间的间隔，默认为 20
  imgHeight: 150px # 图片宽度，默认为 auto。仅图文卡片支持该配置项
  objectFit: cover # 设置图片的填充方式，支持 cover | fill | contain | scale-down | none，默认为 cover
  showCode: false # 是否显示代码块，默认为 false

data:
  - img: ./AI绘画提示词.assets/q_style_character_figurine_preview.png
    link: /aigc/painting-prompt#Q版人物角色手办
    name: Q版人物角色手办
    desc: Q版人物角色手办
    
  - img: ./AI绘画提示词.assets/cosplay_compressed.png
    link: /aigc/painting-prompt#漫展COS达人
    name: 漫展COS达人
    desc: 漫展COS达人
    
  - img: ./AI绘画提示词.assets/comic_master_compressed.png
    link: /aigc/painting-prompt#漫画大师
    name: 漫画大师
    desc: 漫画大师
    
  - img: ./AI绘画提示词.assets/nine-grid_multi-angle_shooting_compressed.png
    link: /aigc/painting-prompt#九宫格多角度拍摄
    name: 九宫格多角度拍摄
    desc: 九宫格多角度拍摄
    
  - img: ./AI绘画提示词.assets/gemini-3-pro-image-preview_a_Fashion_Illustration.png
    link: /aigc/painting-prompt#时尚情绪板插画
    name: 时尚情绪板插画
    desc: 时尚情绪板插画

  - img: ./AI绘画提示词.assets/character_concept_designer_preview.png
    link: /aigc/painting-prompt#角色概念设计师
    name: 角色概念设计师
    desc: 角色概念设计师

  - img: ./AI绘画提示词.assets/2d_to_real_person_compressed.png
    link: /aigc/painting-prompt#2D人物转真人
    name: 2D人物转真人
    desc: 2D人物转真人
    
  - img: ./AI绘画提示词.assets/gemini-3-pro-image-preview_a_Create_a_whimsical_qingdao.png
    link: /aigc/painting-prompt#2D人物转真人
    name: 3D城市地貌
    desc: 3D城市地貌

  - img: ./AI绘画提示词.assets/city_scenery_poster_qingdao.png
    link: /aigc/painting-prompt#城市风景海报
    name: 城市风景海报
    desc: 城市风景海报

  - img: ./AI绘画提示词.assets/micro_3d_scene.jfif
    link: /aigc/painting-prompt#微型 3D 场景
    name: 微型 3D 场景
    desc: 微型 3D 场景

  - img: ./AI绘画提示词.assets/cute_sticker_style_emoji_pack.png
    link: /aigc/painting-prompt#可爱贴纸风格表情包
    name: 可爱贴纸风格表情包
    desc: 可爱贴纸风格表情包
```

:::

::: tip 注意

下面的图片都是经过压缩裁剪后的

:::

### Q版人物角色手办

手办指令模板1：

```Markdown
create a 1/7 scale commercialized figurine of thecharacters in the picture, in a realistic style, in a reaenvironment. 
The figurine is placed on a computer desk.
The figurine has a round transparent acrylic base, with no text on the base. 
The content on thecomputer screen is the Zbrush modeling process othis fiqurine.
Next to the computer screen is a BANDAl-style toy packaging box printed with theoriginal artwork.
The packaging features two dimensional flat illustrations.Maintain consistency with the image.
```

手办指令模板2：

```Markdown
Using the nano-banana model, create a 1/7 scale commercialized figurine of the characters in the picture, in a realistic style, in a real environment.
The figurine is placed on a computer desk.
The figurine has a round transparent acrylic base, with no text on the base.
The content on the computer screen is the Zbrush modeling process of this figurine.
Next to the computer screen is a BANDAI-style toy packaging box printed with the original artwork.
The packaging features two-dimensional flat illustrations.
```

效果图

| 原图                                               | 效果图                                                  |
| -------------------------------------------------- | ------------------------------------------------------- |
| ![灶门炭治郎](/assets/q_style_character_figurine_original.DJxtiG86.webp) | ![1769958898423](/assets/q_style_character_figurine_preview.CDo58LIW.png) |

### 漫展COS达人

```Markdown
一张电影感的、4K分辨率的纪实风格照片，画面中一位Coser和一个真人大小的易拉宝展架，在熙熙攘攘的动漫展会大厅里并排站立。
易拉宝展架: 一个高大的（85x200厘米）可伸缩易拉宝展架，其铝合金卷轴底座和顶部夹杆都清晰可见。印刷品是高分辨率的，具有哑光和防眩光效果，并且是无边框的满版印刷。
Coser与匹配度 (关键): Coser穿着一套与展架上角色完美匹配、1:1屏幕还原度的Cosplay服装。Coser的姿势与展架上的姿势完全相同，而不是镜像。每个细节都必须精确匹配：
姿势： 匹配所有的肢体角度、重心分布、头部倾斜、视线方向和手指形状。
服装： 精确匹配发型、剪裁、图案、颜色和配饰。
道具： 所有道具都必须出现，并且握在同一只手中，朝向也与展架上一致。
颜色： 调色板严格锁定为原始角色的设计。
场景与相机:
场地： 艺术家小巷的摊位风格，背景是中等虚化程度的人群。
灯光： 来自展会柔光箱的明亮、均匀的灯光。
机位角度： 平视，略微仰拍。
镜头与设置： 45mm镜头，f/3.2光圈，营造出浅景深效果，主体清晰，背景有漂亮的虚化。无动态模糊。
整体风格: 照片般逼真，具有最高的清晰度和细节。画面中任何地方都绝对不允许出现品牌标志或清晰可读的文字。
负面提示词 (Negative Prompt)
镜像姿势, 不同的姿势, 错误的姿势, 另一套服装, 重新设计, 重新诠释, 风格变体, 品牌标志, 清晰的文字, 签名, 水印, 卷边的展架, 白色边框, 泡沫板, 立牌, 模糊的展架, 模糊的主体, 过度曝光, 多余的肢体, 畸形的手, 缺少道具, 错误的颜色, 太阳镜, 女仆装。
```

| 原图                                                         | 效果图                                                       |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![6974dcf7729e129fefe691ca-ori](/assets/cosplay_original.CLbvkPTE.jpg) | ![cosplay\_compressed](/assets/cosplay_compressed.BONnYUlI.png) |

### 漫画大师

```Markdown
提示词：我要通过AI绘画制作四格漫画，请结合现实改编几个海贼王中的小故事

你是鸟山明亲传弟子，运用你的风格画四格漫画
内容如下：
悟空变身超级赛亚人骑着召唤出来的龙送外卖
直接输出分格漫画图片，图中使用中文表达

你是尾田荣一郎亲传弟子，运用你的风格画四格漫画
内容如下：
路飞变身尼卡形态骑着变身成牛鬼的萨坦圣送外卖
直接输出分格漫画图片，图中使用中文表达


你是尾田荣一郎亲传弟子，运用你的风格画四格漫画

故事：路飞的早餐 “翻车记”（微搞笑・日常向）
核心：路飞复刻山治的煎蛋，自信满满却搞砸，最后被山治无奈投喂，还原吃货的可爱日常
四格分镜
【场景】厨房，路飞系着超大号卡通围裙，踮脚够灶台，手里攥着鸡蛋，眼睛亮晶晶盯着平底锅（山治在旁边抱胸挑眉，一脸 “看好你出丑”）；
【场景】同厨房，鸡蛋直接砸在平底锅边缘，蛋液溅了路飞一脸，头发上还沾了蛋碎，路飞瞪圆眼睛，一脸懵；
【场景】同厨房，山治单手捏着路飞后领，另一只手快速颠勺，金黄的煎蛋瞬间成型，路飞扒着山治胳膊，流着口水盯煎蛋；
【场景】餐桌，路飞捧着超大碗米饭，上面盖着 3 个煎蛋，狼吞虎咽，山治叉着腰站在旁边，嘴角偷偷上扬（桌上摆着牛奶和面包）。

故事：索隆的 “导航式” 晨跑
核心：索隆想绕小镇晨跑打卡，自信拒绝娜美指路，结果跑错方向，最后被娜美拿着地图 “抓回”，经典路痴名场面复刻
四格分镜
【场景】小镇街道口，清晨阳光，索隆背着三把刀，伸胳膊伸腿热身，娜美举着手绘小镇地图递给他，皱着眉提醒 “别跑错”，索隆摆手一脸不屑 “我记路很准”；
【场景】郊外小路，索隆站在三岔路口，挠着头眯眼瞅路牌，背后的刀歪了，脚边画了个大大的问号，周围是小树和野花（明显跑远了）；
【场景】同郊外，娜美叉着腰站在索隆身后，手里的地图拍在索隆后脑勺，娜美气鼓鼓，脸颊鼓成包子，索隆捂着头，一脸委屈不敢反驳；
【场景】小镇海边，索隆跟着娜美走在沙滩上，晨跑变成海边散步，索隆踢着小石子，娜美在前边哼歌，远处海面上有小帆船，画面温柔。
```

效果图

![comic\_master\_compressed](/assets/comic_master_compressed.Zmbgv_Ry.png)

### 九宫格多角度拍摄（9个分镜头）

```Markdown
分析输入图像的整个构图。识别所有存在的关键主体（无论是单人、群体/情侣、车辆还是特定物体）及其空间关系/互动。
生成一个连贯的 3x3 网格“电影印样（Contact Sheet）”，展示在同一环境中完全是这些主体的 9 个不同镜头。
你必须调整标准的电影镜头类型以适应内容（例如，如果是群体，保持群体在一起；如果是物体，构图包含整个物体）：
第 1 行（建立背景）：
1. 大远景 (ELS)： 主体在广阔的环境中显得很小。
2. 全景 (LS)： 完整的主体或群体从上到下可见（从头到脚 / 从车轮到车顶）。
3. 中远景 (美式镜头/四分之三)： 构图从膝盖以上（针对人物）或 3/4 视角（针对物体）。

第 2 行（核心覆盖）：
4. 中景 (MS)： 构图从腰部以上（或物体的中心核心）。聚焦于互动/动作。
5. 中特写 (MCU)： 构图从胸部以上。主要主体的亲密构图。
6. 特写 (CU)： 紧凑构图于脸部或物体的“正面”。

第 3 行（细节与角度）：
7. 大特写 (ECU)： 强烈聚焦于关键特征（眼睛、手、标志、纹理）的微距细节。
8. 低角度镜头 (仰视/虫眼)： 从地面仰望主体（壮观/英雄感）。
9. 高角度镜头 (俯视/鸟瞰)： 从上方俯瞰主体。
确保严格的一致性：所有 9 个面板中是相同的人物/物体、相同的衣服和相同的光照。景深应逼真地变化（特写镜头中的背景虚化）。

一个包含 9 个面板的专业 3x3 电影故事板网格。
该网格以全面的焦距范围展示输入图像中的特定主体/场景。
顶行： 宽广环境镜头，全视图，3/4 剪辑（膝上景）。
中间行： 腰部以上视图，胸部以上视图，脸部/正面特写。
底行： 微距细节，低角度，高角度。
所有帧均具有照片般逼真的纹理，一致的电影级调色，以及针对所分析的主体或物体特定数量的正确构图。
```

| 原图                                                         | 效果图                                                       |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![朱迪·霍普斯Z2\_Judy\_Hopps\_Z2.PNG](/assets/nine-grid_multi-angle_shooting_original.BZpLV8zZ.webp) | ![](/assets/nine-grid_multi-angle_shooting_compressed.CE2TZkf7.png) |

### 时尚情绪板插画

```Markdown
Fashion Illustration Moodboard (时尚插画情绪板)
一张9:16竖屏的高级时尚插画情绪板，模拟平板扫描效果。

背景: 纯手绘的奶油色水彩晕染纸张，带有淡淡的粉色网格。
视觉核心: 数张具有明显白色模切宽边和柔和投影的亮面乙烯基贴纸。

贴纸内容:
- 中央: 用户穿着甜美约会装的照片，光线明亮。
- 左侧: 整齐折叠的外套和精致的高跟鞋。
- 右下角: 关键的隐藏层贴纸：一套折叠整齐的内衣，展现细腻纹理。
- 互动元素: 一只穿着粉色系、与用户服装呼应的 Labubu艺术公仔 正趴在一个手绘对话框上。

装饰细节: 周围装饰着蜡笔质感的 手绘爱心、闪光符号 和潦草的中文书法标注OOTD。
注意: 画面中绝无任何人手、笔或物理桌面背景，纯粹的平面艺术插画。
```

| 原图                                                         | 效果图                                                       |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![gemini-3-pro-image-preview\_a\_Fashion\_Illustration\_original\_resized](/assets/gemini-3-pro-image-preview_a_Fashion_Illustration_original_resized.efaoMaUM.jpg) | ![gemini-3-pro-image-preview\_a\_Fashion\_Illustration](/assets/gemini-3-pro-image-preview_a_Fashion_Illustration.nxku_r6P.png) |

### 角色概念设计师

```markdown
Role (角色设定)
你是一位顶尖的 资深影视角色原画师，擅长制作详尽的角色设定图（Character Sheet）。你具备“像素级拆解”的能力，能够透视角色的穿着层级、捕捉微表情变化，并将与其相关的物品进行具象化还原。你特别擅长通过 女性角色 的私密物品、随身物件和生活细节来侧面丰满人物性格与背景故事。

Task (任务目标)
根据用户上传或描述的主体形象，生成一张“全景式角色深度概念分解图”。该图片必须包含 全身立绘，并在其周围环绕展示该人物的服装分层、不同表情、核心道具、材质特写，以及极具生活气息的私密与随身物品展示。

Visual Guidelines (视觉规范)
1. 构图布局 (Layout):
- 中心位 (Center): 放置角色的 全身立绘，作为视觉锚点。
- 环绕位 (Surroundings): 在中心人物四周空白处，有序排列拆解后的元素。
- 视觉引导 (Connectors): 使用手绘箭头或引导线，将周边的拆解物品与中心人物的对应部位或所属区域连接起来。

2. 拆解内容 (Deconstruction Details):
- 服装分层 (Clothing Layers): 将角色的服装拆分为单品展示
- 私密内着拆解: 独立展示角色的内层衣物，重点突出设计感与材质。例如： 成套的蕾丝内衣裤 （展示细节与剪裁）。
- 表情集 (Expression Sheet): 在角落绘制 3-4 个不同的头部特写，展示不同的情绪，如： 羞涩、躲闪、红晕 。
- 材质特写 (Texture & Zoom): 选取关键部位进行放大特写. 例如： 凌乱感与私处汗渍 ，增加对小物件材质的描绘。
- 动作: 绘制特殊的动作和表情，例如：拉扯领口的诱惑，增加动作的深度刻画。
- 特殊视角: 绘制从某种特殊场景下拍摄的特殊视角，例如：镜子反射的背影

- 关联物品 (Related Items):
 - 随身包袋与内容物: 绘制 日常通勤包或手拿包，并将其“打开”，展示散落在旁的物品。
 - 美妆与护理: 展示 香水小样与护手霜。
 - 私密生活物件: 具象化角色隐藏面的物品。根据角色性格可能包括： 笔记本与糖果，需以一种设计图的客观视角呈现。

3.风格与注释 (Style & Annotations):
- 画风: 写实厚涂风格，线条干净利落。
- 背景: 使用米黄色、羊皮纸或浅灰色纹理背景，营造设计手稿的氛围。
- 文字说明: 在每个拆解元素旁模拟手写注释，简要说明材质或品牌/型号暗示。

Workflow (执行逻辑)
1. 分析主体的核心特征、穿着风格及潜在性格。
2. 提取可拆解的一级元素（外套、鞋子、大表情）。
3. 脑补并设计二级深度元素（她内衣穿什么风格？包里装什么？独处时用什么？）。
4. 生成一张包含所有这些元素的组合图，确保透视准确，光影统一，注释清晰。
5. 使用中文，高清输出。
```

| 原图                                                         | 效果图                                                       |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![character\_concept\_designer\_preview](/assets/character_concept_designer_original.D6qm9N7u.jpg) | ![940e8ea1-4c6d-4f9d-b873-17f37350a6bc](/assets/character_concept_designer_preview.wjp5zlQe.png) |

### 2D人物转真人

```markdown
Transform this comic character into an ultra-realistic human while preserving the original hairstyle, outfit, facial expression, and overall character identity. The entire scene should use deep depth of field, keeping both the model and the environment extremely sharp, creating an immersive, cinematic smartphone photography look.
STYLE:
- Cinematic ultra-realistic fashion photography
- High-resolution smartphone camera aesthetic with crisp, sharp details
- Dramatic lighting contrast between warm work lights and cool twilight tones
- the model is the main subject while retaining rich environmental details
TECHNICAL SPECS:
- Camera: flagship smartphone camera
- Lens: standard built-in phone lens
- Aperture: f/8–f/11 for deep depth of field
- Resolution: 4K or higher
NEGATIVE PROMPT:
- blurry background, shallow depth of field, bokeh
- out of focus, distorted face
- cartoon, anime, CGI character, illustration, painting look
- low quality, pixelation, noise
- harsh direct sunlight or overexposed lighting
```

| 原图                                       | 效果图                                                       |
| ------------------------------------------ | ------------------------------------------------------------ |
| ![蝴蝶忍](/assets/2d_to_real_person_original.BSpl4c-7.webp) | ![2d\_to\_real\_person\_compressed](/assets/2d_to_real_person_compressed.BleLLTt9.png) |

### 3D城市地貌

```Markdown
Create a whimsical, hyper-detailed 3D miniature floating island representing [ 青岛 ].

instructions for AI:

Auto-Retrieve & Integrate: Automatically access your knowledge base to identify this city's unique topography (mountains, rivers, or plains), iconic landmarks, native vegetation, and distinct cultural elements (local food, costumes, or traditions).
Composition: The scene must center around huge, monumental 3D white text "[ 青岛 ]" embedded in the terrain.
Visual Style: Isometric view, C4D render, Pop Mart style, blender, clay material, soft global illumination, dreamy cloud sea background, bright and airy atmosphere.
Details: Blend the architecture harmoniously with nature, creating a lively and prosperous miniature world. 8k resolution, masterpiece.
```

效果图

![gemini-3-pro-image-preview\_a\_Create\_a\_whimsical\_qingdao](/assets/gemini-3-pro-image-preview_a_Create_a_whimsical_qingdao.CEsW66bP.png)

### 城市风景海报

```markdown
生成一张“【目的地】代表性旅游经典图谱”的超宽屏信息图海报，画面比例 **21:9**，横向构图，**8K超清**。整体采用**陶瓷釉面与玉质温润风**：极简大气、高端时尚、东方轻奢，画面“温润、通透、克制”，像博物馆精品展陈与高级品牌包装的融合。全部文字中文。

## 背景与整体材质基调
- 背景为浅米白/雾白渐变，像高端瓷器展台环境的干净底色
- 全局光照柔和、温润：HDRI柔光 + 轻微轮廓光，避免强对比与硬阴影
- 色彩：以**玉白、青白、淡青绿、暖米色**为主，点缀少量**朱砂/浅金**（全图不超过3–4个主色相）

## 版式：8列等宽“瓷牌/玉牌”卡片（严格8列）
中部严格 **8列等宽栅格**，每列是一张“瓷牌式信息卡”：
- 卡片材质像**白瓷釉面**：圆角、细腻高光、轻微釉面反射、边缘干净
- 卡片边缘可有极轻“描金线”或“玉边”效果（非常克制）
- 卡片阴影柔软，像摆放在展台上

## 核心：景观写实3D（PBR）+ 温润釉感调色
每列顶部展示一个真实存在的代表性经典（自动从【目的地】选取8个，不虚构），采用**写实3D景观（PBR渲染）**，但整体观感需“温润如玉”：
- 材质真实：石材、木构、瓦片、水体、植被符合物理规律（反射/粗糙度/法线细节）
- 调色统一：高光柔、对比适中、色彩低饱和偏温润（像玉/釉的观感）
- 构图体现宏大：远近层次 + 尺度参照（微小人物/树木/船只），强调“雄伟壮丽”但不靠强特效
- 水体（若有）：柔和反射与折射，浅滩渐变细腻
- 避免：卡通低模、塑料感、过度锐化、夸张科幻光效

## 细节展示：釉彩“纹样小盘 / 玉佩小窗”
每列右下角用一个小的细节窗口（全局统一一种形态）：
- 选项A：**小圆盘**（像瓷碟），展示关键细节纹理（石刻、壁画、瓦当、水波、沙纹）
- 选项B：**玉佩形小窗**（圆润轮廓），展示局部材质与纹理
- 外观要有釉面/玉质的温润高光，边缘圆润
- 用极细引线连接到主3D景观，并附2–6字短标签

## 每列文字（短、雅、清）
- 景点名（中文4–8字；字体建议：思源宋体/宋体风格，配合东方气质）
- 两行信息：
- `看点：` ≤8字
- `适合：` ≤6字
文字颜色用墨灰/青黛灰，强调色仅用于小点或分隔线。

## 顶部标题区（精品展签风）
- 主标题：`【目的地】代表性旅游经典图谱`（端正、留白大）
- 副标题：一句话定位（≤18字，偏雅致）
- 右上角5枚“釉色点”（青白、粉青、月白、暖米、朱砂点缀）

## 底部信息带（展陈说明牌风）
底部通栏用细线分隔成四段（像展柜说明牌）：
- 目的地速览：1句≤22字
- 游览建议：3条（每条≤12字）
- 文化冷知识：3条（每条≤18字）
- 时间线：3–6节点（朝代/年份+关键词），用极简线性图标串联（线条细、统一）

## 自动选景规则
覆盖至少5类：自然景观、历史古迹、城市地标、博物馆/文化场馆、特色街区/夜景、非遗/民俗体验；不足用稳妥通用项补齐（如“【目的地】博物馆”“老城历史街区”）。景点名称务必真实可靠，不确定则用通用称呼，不编造。

## 输出约束
全中文；极简留白、强对齐；无英文、无logo、无水印；**8K**超清，适配文旅大屏与社媒横版封面。
```

效果图

![city\_scenery\_poster\_qingdao](/assets/city_scenery_poster_qingdao.CCEnae5v.png)

### 微型 3D 场景

```markdown
Present a clear, 45° top-down isometric miniature 3D cartoon scene of the iconic scene [SCENE NAME] from [MOVIE/SHOW], with soft refined textures, realistic PBR materials, and gentle lifelike lighting.
Create a small raised diorama-style base that includes the most recognizable elements of this scene, along with tiny stylized characters if needed (no facial details).
Use a clean solid [BACKGROUND COLOR] background.

At the top-center, display [MOVIE/SHOW] in large bold text, directly beneath it show [SCENE NAME] in medium text, and place the official logo associated with [MOVIE/SHOW] below the subtext.
All text must automatically match the background contrast (white or black).

Composition: perfectly centered layout, square 1080x1080, ultra-clean, high-clarity diorama aesthetic.
```

效果图

![micro\_3d\_scene](AI绘画提示词.assets/micro_3d_scene.jfif)

### 可爱贴纸风格表情包

```markdown
使用附加的参考图像作为基础角色。创建一个包含至少20个可爱贴纸风格插画的单个高分辨率拼贴画，保持她的脸部、肤色、发型和整体外观与参考完全相同。

艺术风格：3D皮克斯风格/迪士尼启发的卡通、柔和电影光线、光滑柔和色彩、大眼睛、圆润可爱的脸部比例、超精致3D渲染。

角色细节：柔和棕色头发松散扎起、大眼睛、白色无袖上衣、可爱轻微的小头身比例。

表情和反应（全部不同）：开心大笑、惊讶、震惊、害羞微笑、生气、困惑、哭泣、困倦、眨眼、和平手势、吹吻、拿手机、思考、扶额、拿咖啡、手捂嘴笑、烦恼、兴奋、爱心反应、可爱中性姿势（20+）。

贴纸设计：每个反应作为单独贴纸、每个贴纸周围有干净白色轮廓、柔和投影、无文字、无水印。

布局：所有贴纸整齐排列在一个拼贴画中、均衡网格布局、柔和米色/柔和背景、Instagram/WhatsApp贴纸包美学。

质量：超详细、高分辨率、光滑3D效果、专业贴纸包外观、可爱且富有表现力。
```

效果图

![cute\_sticker\_style\_emoji\_pack](/assets/cute_sticker_style_emoji_pack.C-FwHNEs.png)
