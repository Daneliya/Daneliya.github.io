---
url: /Java/JVM性能调优/01.JVM概念/5_GC垃圾回收.md
---

# GC垃圾回收

## 垃圾回收的区域

![img](/assets/kuangstudyea734fba-0acf-411a-9145-b09bf0f8c0fa.D3v2Enlg.jpg)

## GC之引用计数法

![img](/assets/kuangstudyba7e21f0-b594-4d03-a045-f0bc7999d1b9.TXZtGFyU.jpg)

## GC之复制算法

![img](/assets/kuangstudyfcf0c24d-0c57-444f-a3e7-75bf360afaa6.Bt345Vew.jpg)
![img](/assets/kuangstudye7037e48-3068-4698-beea-ab5bd6c93f89.r2G0lF_p.jpg)

* 好处：没有内存的碎片。
* 坏处：浪费了内存空间（多了一半空间to永远是空）。假设对象100%存活（极端情况），不适合使用复制算法。

### 使用场景

复制算法最佳使用场景：对象存活度较低的时候（新生区）

## GC之标记清除压缩算法

### 标记清除

![img](/assets/kuangstudy917c317f-d10a-4a63-adcc-1d9f569ca63e.C-X93vOr.jpg)

* 优点：不需要额外的空间。
* 缺点：两次扫描，严重浪费时间，会产生内存碎片。

### 标记清除压缩

![img](/assets/kuangstudy47e8d6fc-3f99-4296-b75e-608518e1403f.DPYPruTy.jpg)

### 标记清除压缩（改进）

可以进行多次标记清除，再进行一次压缩。

## GC算法总结

内存效率：复制算法>标记清除算法>标记压缩算法（时间复杂度）
内存整齐度：复制算法=标记压缩算法>标记清除算法
内存利用率：标记压缩算法=标记清除算法>复制算法

思考一个问题：难道没有最优算法吗？
答案：没有，没有最好的算法，只有最合适的算法——》GC：分代收集算法

年轻代：

* 存活率低
* 复制算法

老年代：

* 区域大：存活率高
* 标记清除（内存碎片不是太多）+标记压缩混合实现
