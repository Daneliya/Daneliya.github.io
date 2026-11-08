---
url: /daily/开源项目/使用教程/WeiboAlbumDownloader.md
---

# WeiboAlbumDownloader 使用教程

## 一、设置

获取微博用户uid以及web版微博Cookie，点击设置里面扫码获取即可。

![image-20260125171730416](WeiboAlbumDownloader.assets/image-20260125171730416.png)

如果想要在下载完发送push+通知，请填写PushPlusToken字段。不填就不发送。

如果想要开启定时任务，即在某个时间自动触发批量下载任务，那么需要填写EnableCrontab和Crontab字段。

## 二、获取需要下载微博用户信息

PC打开[weibo.com](https://weibo.com/)，点击某一用户头像，进入主页。uid就是地址栏中的最后一串数字，比如https://weibo.com/u/1000000000。

下载开始

![Snipaste\_2026-01-25\_17-02-47](WeiboAlbumDownloader.assets/Snipaste_2026-01-25_17-02-47.png)

下载中

![Snipaste\_2026-01-25\_14-39-58](WeiboAlbumDownloader.assets/Snipaste_2026-01-25_14-39-58.png)

放止反爬虫限制

![Snipaste\_2026-01-25\_14-39-48](WeiboAlbumDownloader.assets/Snipaste_2026-01-25_14-39-48.png)

下载完成

![Snipaste\_2026-01-25\_16-57-14](WeiboAlbumDownloader.assets/Snipaste_2026-01-25_16-57-14.png)

下载目录

![image-20260125172320822](WeiboAlbumDownloader.assets/image-20260125172320822.png)
