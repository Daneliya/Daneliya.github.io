---
url: /Linux/01.Shell命令/3_Centos7扩容根目录.md
---

# Centos7扩容根目录（/dev/mapper/centos-root）

## 方式一：命令行

### 1、查看分区状况

根目录在/dev/mapper/centos-root

```sh
[root@git50 ~]# df -h
文件系统                 容量  已用  可用 已用% 挂载点
/dev/mapper/centos-root   17G  9.9G  7.2G   59% /
devtmpfs                 1.9G     0  1.9G    0% /dev
tmpfs                    1.9G   12K  1.9G    1% /dev/shm
tmpfs                    1.9G   15M  1.9G    1% /run
tmpfs                    1.9G     0  1.9G    0% /sys/fs/cgroup
/dev/sda1               1014M  170M  845M   17% /boot
tmpfs                    378M  4.0K  378M    1% /run/user/42
tmpfs                    378M   36K  378M    1% /run/user/0
[root@git50 ~]# lsblk
NAME            MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
sda               8:0    0  200G  0 disk 
├─sda1            8:1    0    1G  0 part /boot
└─sda2            8:2    0   19G  0 part 
  ├─centos-root 253:0    0   17G  0 lvm  /
  └─centos-swap 253:1    0    2G  0 lvm  [SWAP]
sr0              11:0    1 1024M  0 rom 
```

### 2、新建分区，并将id改为8e

```sh
[root@git50 ~]# fdisk /dev/sda
欢迎使用 fdisk (util-linux 2.23.2)。

更改将停留在内存中，直到您决定将更改写入磁盘。
使用写入命令前请三思。


命令(输入 m 获取帮助)：n
Partition type:
   p   primary (2 primary, 0 extended, 2 free)
   e   extended
Select (default p): p
分区号 (3,4，默认 3)：
起始 扇区 (41943040-419430399，默认为 41943040)：
将使用默认值 41943040
Last 扇区, +扇区 or +size{K,M,G} (41943040-419430399，默认为 419430399)：
将使用默认值 419430399
分区 3 已设置为 Linux 类型，大小设为 180 GiB

命令(输入 m 获取帮助)：p

磁盘 /dev/sda：214.7 GB, 214748364800 字节，419430400 个扇区
Units = 扇区 of 1 * 512 = 512 bytes
扇区大小(逻辑/物理)：512 字节 / 512 字节
I/O 大小(最小/最佳)：512 字节 / 512 字节
磁盘标签类型：dos
磁盘标识符：0x000b4e82

   设备 Boot      Start         End      Blocks   Id  System
/dev/sda1   *        2048     2099199     1048576   83  Linux
/dev/sda2         2099200    41943039    19921920   8e  Linux LVM
/dev/sda3        41943040   419430399   188743680   83  Linux

命令(输入 m 获取帮助)：t
分区号 (1-3，默认 3)：
Hex 代码(输入 L 列出所有代码)：l

 0  空              24  NEC DOS         81  Minix / 旧 Linu bf  Solaris        
 1  FAT12           27  隐藏的 NTFS Win 82  Linux 交换 / So c1  DRDOS/sec (FAT-
 2  XENIX root      39  Plan 9          83  Linux           c4  DRDOS/sec (FAT-
 3  XENIX usr       3c  PartitionMagic  84  OS/2 隐藏的 C:  c6  DRDOS/sec (FAT-
 4  FAT16 <32M      40  Venix 80286     85  Linux 扩展      c7  Syrinx         
 5  扩展            41  PPC PReP Boot   86  NTFS 卷集       da  非文件系统数据 
 6  FAT16           42  SFS             87  NTFS 卷集       db  CP/M / CTOS / .
 7  HPFS/NTFS/exFAT 4d  QNX4.x          88  Linux 纯文本    de  Dell 工具      
 8  AIX             4e  QNX4.x 第2部分  8e  Linux LVM       df  BootIt         
 9  AIX 可启动      4f  QNX4.x 第3部分  93  Amoeba          e1  DOS 访问       
 a  OS/2 启动管理器 50  OnTrack DM      94  Amoeba BBT      e3  DOS R/O        
 b  W95 FAT32       51  OnTrack DM6 Aux 9f  BSD/OS          e4  SpeedStor      
 c  W95 FAT32 (LBA) 52  CP/M            a0  IBM Thinkpad 休 eb  BeOS fs        
 e  W95 FAT16 (LBA) 53  OnTrack DM6 Aux a5  FreeBSD         ee  GPT            
 f  W95 扩展 (LBA)  54  OnTrackDM6      a6  OpenBSD         ef  EFI (FAT-12/16/
10  OPUS            55  EZ-Drive        a7  NeXTSTEP        f0  Linux/PA-RISC  
11  隐藏的 FAT12    56  Golden Bow      a8  Darwin UFS      f1  SpeedStor      
12  Compaq 诊断     5c  Priam Edisk     a9  NetBSD          f4  SpeedStor      
14  隐藏的 FAT16 <3 61  SpeedStor       ab  Darwin 启动     f2  DOS 次要       
16  隐藏的 FAT16    63  GNU HURD or Sys af  HFS / HFS+      fb  VMware VMFS    
17  隐藏的 HPFS/NTF 64  Novell Netware  b7  BSDI fs         fc  VMware VMKCORE 
18  AST 智能睡眠    65  Novell Netware  b8  BSDI swap       fd  Linux raid 自动
1b  隐藏的 W95 FAT3 70  DiskSecure 多启 bb  Boot Wizard 隐  fe  LANstep        
1c  隐藏的 W95 FAT3 75  PC/IX           be  Solaris 启动    ff  BBT            
1e  隐藏的 W95 FAT1 80  旧 Minix       
Hex 代码(输入 L 列出所有代码)：8e
已将分区“Linux”的类型更改为“Linux LVM”

命令(输入 m 获取帮助)：w
The partition table has been altered!

Calling ioctl() to re-read partition table.

WARNING: Re-reading the partition table failed with error 16: 设备或资源忙.
The kernel still uses the old table. The new table will be used at
the next reboot or after you run partprobe(8) or kpartx(8)
正在同步磁盘。
```

### 3、刷新并查看sda3是否存在

```sh
[root@git50 ~]# partprobe
[root@git50 ~]# lsblk
NAME            MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
sda               8:0    0  200G  0 disk 
├─sda1            8:1    0    1G  0 part /boot
├─sda2            8:2    0   19G  0 part 
│ ├─centos-root 253:0    0   17G  0 lvm  /
│ └─centos-swap 253:1    0    2G  0 lvm  [SWAP]
└─sda3            8:3    0  180G  0 part 
sr0              11:0    1 1024M  0 rom
```

### 4、使用lvm命令新建卷/dev/sda3,并将其加载到卷组centos中

```sh
[root@git50 ~]# lvm
lvm> pvcreate /dev/sda3
  Physical volume "/dev/sda3" successfully created.
lvm> pvdisplay
  --- Physical volume ---
  PV Name               /dev/sda2
  VG Name               centos
  PV Size               <19.00 GiB / not usable 3.00 MiB
  Allocatable           yes (but full)
  PE Size               4.00 MiB
  Total PE              4863
  Free PE               0
  Allocated PE          4863
  PV UUID               mxA5P7-4vL0-0cOO-0PPy-1Uq3-HRdn-DHRmNV
   
  "/dev/sda3" is a new physical volume of "180.00 GiB"
  --- NEW Physical volume ---
  PV Name               /dev/sda3
  VG Name               
  PV Size               180.00 GiB
  Allocatable           NO
  PE Size               0   
  Total PE              0
  Free PE               0
  Allocated PE          0
  PV UUID               wor8da-PkXI-ghCq-U8sE-vkfq-ZhJo-di78al
   
lvm> vgdisplay
  --- Volume group ---
  VG Name               centos
  System ID             
  Format                lvm2
  Metadata Areas        1
  Metadata Sequence No  3
  VG Access             read/write
  VG Status             resizable
  MAX LV                0
  Cur LV                2
  Open LV               2
  Max PV                0
  Cur PV                1
  Act PV                1
  VG Size               <19.00 GiB
  PE Size               4.00 MiB
  Total PE              4863
  Alloc PE / Size       4863 / <19.00 GiB
  Free  PE / Size       0 / 0   
  VG UUID               cDss9h-G3Tk-zTb1-4vsa-lKcs-DX8B-8fDpmv
   
lvm> vgextend centos /dev/sda3
  Volume group "centos" successfully extended
lvm> vgdisplay
  --- Volume group ---
  VG Name               centos
  System ID             
  Format                lvm2
  Metadata Areas        2
  Metadata Sequence No  4
  VG Access             read/write
  VG Status             resizable
  MAX LV                0
  Cur LV                2
  Open LV               2
  Max PV                0
  Cur PV                2
  Act PV                2
  VG Size               198.99 GiB
  PE Size               4.00 MiB
  Total PE              50942
  Alloc PE / Size       4863 / <19.00 GiB
  Free  PE / Size       46079 / <180.00 GiB
  VG UUID               cDss9h-G3Tk-zTb1-4vsa-lKcs-DX8B-8fDpmv
   
lvm> lvextend -l +100%FREE /dev/centos/root
  Size of logical volume centos/root changed from <17.00 GiB (4351 extents) to 196.99 GiB (50430 extents).
  Logical volume centos/root successfully resized.
lvm> exit
```

（这里的/dev/centos/root不能随便改成centos-root。LVM逻辑卷管理，根文件系统建立在卷组（VG）centos上的逻辑卷（LV）上，逻辑卷名是root而不是直接建在硬盘分区上）

### 5、之前只是对逻辑卷扩容，还要同步到文件系统，实现对根目录的扩容

```sh
[root@git50 ~]# xfs_growfs /dev/centos/root
meta-data=/dev/mapper/centos-root isize=512    agcount=4, agsize=1113856 blks
         =                       sectsz=512   attr=2, projid32bit=1
         =                       crc=1        finobt=0 spinodes=0
data     =                       bsize=4096   blocks=4455424, imaxpct=25
         =                       sunit=0      swidth=0 blks
naming   =version 2              bsize=4096   ascii-ci=0 ftype=1
log      =internal               bsize=4096   blocks=2560, version=2
         =                       sectsz=512   sunit=0 blks, lazy-count=1
realtime =none                   extsz=4096   blocks=0, rtextents=0
data blocks changed from 4455424 to 51640320
[root@git50 ~]# df -h
文件系统                 容量  已用  可用 已用% 挂载点
/dev/mapper/centos-root  197G  9.9G  188G    6% /
devtmpfs                 1.9G     0  1.9G    0% /dev
tmpfs                    1.9G   12K  1.9G    1% /dev/shm
tmpfs                    1.9G   15M  1.9G    1% /run
tmpfs                    1.9G     0  1.9G    0% /sys/fs/cgroup
/dev/sda1               1014M  170M  845M   17% /boot
tmpfs                    378M  4.0K  378M    1% /run/user/42
tmpfs                    378M   40K  378M    1% /run/user/0
```

### 参考资料

https://blog.csdn.net/yanchenyu365/article/details/131453446

https://blog.csdn.net/weixin\_40436144/article/details/86235432

https://www.cnblogs.com/leiblog/p/13560070.html

https://zhuanlan.zhihu.com/p/450057653

## 方式二：gparted图形界面

参照如下资料步骤

https://www.cnblogs.com/liulianzhen99/p/17467752.html

Gparted的iso镜像，官网地址：https://sourceforge.net/projects/gparted/files/gparted-live-stable/

下载镜像首次进入时，需要设置CD为第一启动项，BOOT选项卡中需要按（-/+）排序，https://www.ezd.cc/zs/380532.html

下面示例图为具体分区操作

![Snipaste\_2025-06-13\_00-21-14](/assets/Snipaste_2025-06-13_00-21-14.DIYh40SR.png)

![Snipaste\_2025-06-13\_00-23-16](/assets/Snipaste_2025-06-13_00-23-16.BiaI9ii4.png)

![Snipaste\_2025-06-13\_00-23-53](/assets/Snipaste_2025-06-13_00-23-53.CXUX1jTc.png)
