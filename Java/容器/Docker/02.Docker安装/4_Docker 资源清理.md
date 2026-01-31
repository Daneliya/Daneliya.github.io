---
url: /Java/容器/Docker/02.Docker安装/4_Docker 资源清理.md
---

# Docker 资源清理

```Bash
root@ekroot-b760mds3hddr4:~# du -h --max-depth=1 /var/lib/docker/ | sort -hr
43G     /var/lib/docker/
31G     /var/lib/docker/containers
13G     /var/lib/docker/overlay2
435M    /var/lib/docker/volumes
193M    /var/lib/docker/tmp
5.1M    /var/lib/docker/image
112K    /var/lib/docker/network
112K    /var/lib/docker/buildkit
16K     /var/lib/docker/plugins
4.0K    /var/lib/docker/swarm
4.0K    /var/lib/docker/runtimes
```

看到`/var/lib/docker/containers`（31G）和`/var/lib/docker/overlay2`（13G）占用了大量磁盘空间，这是 Docker 运行中常见的存储占用问题 —— 前者主要是容器日志和运行数据，后者是容器镜像的分层存储。

## 一、安全检查（避免误操作）

首先确认哪些容器 / 镜像可以清理，执行以下命令查看当前 Docker 资源使用情况：

```Bash
# 查看Docker磁盘使用概况
docker system df

# 查看运行中的容器（避免删错正在运行的）
docker ps

# 查看所有容器（包括已停止的）
docker ps -a

# 查看所有镜像
docker images
```

## 二、分步清理（按优先级从安全到深度）

1. #### 清理无用资源（最安全，优先执行）

Docker 提供了一键清理命令，只会删除**未被使用**的资源（已停止的容器、悬空镜像、未被挂载的卷、失效的网络），不会影响运行中的容器：

```Bash
# 一键清理（推荐先执行dry-run预览要删的内容）
docker system prune --dry-run

# 确认后执行真正的清理（加-a会删除所有未被使用的镜像，包括未关联容器的）
docker system prune -a
# 执行时会提示确认，输入y回车即可
```

1. #### 清理容器日志（解决 containers 目录过大的核心）

`containers`目录大通常是因为容器日志（`-json.log`文件）无限制增长，先定位大日志文件：

```Bash
# 查找容器日志文件并按大小排序（显示前20个）
find /var/lib/docker/containers/ -name "*.log" -type f -exec du -h {} + | sort -rh | head -20
```

##### 方式 1：临时清理大日志文件（立即释放空间）

```Bash
# 清空单个大日志文件（替换为你的日志路径）
truncate -s 0 /var/lib/docker/containers/[容器ID]/[容器ID]-json.log

# 批量清空所有容器日志（谨慎执行，会清空所有日志）
find /var/lib/docker/containers/ -name "*.log" -type f -exec truncate -s 0 {} \;
```

##### 方式 2：永久限制容器日志大小（避免后续再次占满）

修改 Docker 全局配置，限制所有容器的日志大小：

```Bash
# 编辑Docker配置文件（没有则新建）
vim /etc/docker/daemon.json
```

添加以下内容（限制单容器日志最大 100MB，最多保留 3 个日志文件）：

```JSON
{"log-driver": "json-file","log-opts": {"max-size": "100m","max-file": "3"}}
```

重启 Docker 生效：

```Bash
systemctl daemon-reload
systemctl restart docker
```

> 注意：该配置仅对**新建的容器**生效，已存在的容器需要重启后才会应用（或重新创建）。

1. #### 清理 overlay2 目录（删除无用镜像 / 分层）

`overlay2`是镜像的分层存储目录，大小大说明有大量未被使用的镜像分层：

```Bash
# 1. 删除已停止的容器（先确认这些容器不需要了）
docker rm $(docker ps -aq --filter "status=exited")

# 2. 删除悬空镜像（无标签、未被任何容器使用的镜像）
docker rmi $(docker images -f "dangling=true" -q)

# 3. 删除指定的无用镜像（替换为镜像ID/名称）
docker rmi [镜像ID/镜像名:标签]
```

1. #### 清理未使用的卷（volumes 目录）

如果`volumes`目录也偏大，清理未被挂载的卷（注意：卷可能包含重要数据，确认无用再删）：

```Bash
# 查看未被使用的卷
docker volume ls -qf dangling=true

# 删除未被使用的卷
docker volume rm $(docker volume ls -qf dangling=true)
```

## 三、验证清理结果

清理完成后，再次查看磁盘使用情况，确认空间已释放：

```Bash
# 重新查看Docker各目录大小
du -s -h /var/lib/docker/*

# 查看Docker磁盘使用概况
docker system df
```

## 总结

1. **紧急释放空间**：先执行`docker system prune -a`清理无用资源，再清空超大容器日志（`truncate -s 0`）。
2. **长期预防**：修改`/etc/docker/daemon.json`限制容器日志大小，避免日志无限增长。
3. **核心注意**：清理前务必确认运行中的容器和重要镜像 / 卷，`docker system prune -a`不会删除正在运行的容器关联资源，是相对安全的操作。

如果清理后空间仍不足，可以进一步检查是否有大型镜像未清理，或考虑迁移 Docker 存储目录到更大的磁盘。
