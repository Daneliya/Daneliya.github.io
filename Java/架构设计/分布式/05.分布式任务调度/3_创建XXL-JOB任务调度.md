---
url: /Java/架构设计/分布式/05.分布式任务调度/3_创建XXL-JOB任务调度.md
---

# 创建XXL-JOB任务调度

## 在任务管理中创建任务

![image-20250820101509244](/assets/image-20250820101509244.D2eBh8Uj.png)

## 在SpringBoot中创建定时任务

`myJobHandler`是刚才在可视化界面中，`JobHandler`我们自定义的名字

```java
import com.xxl.job.core.context.XxlJobHelper;
import com.xxl.job.core.handler.annotation.XxlJob;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class MyXxlJob {

    @XxlJob("myJobHandler")
    public void myJobHandler() throws Exception {
        XxlJobHelper.log("XXL-JOB, 这是我的第一个定时任务，开始执行了");
        log.info("XXL-JOB, 这是我的第一个定时任务，开始执行了");
    }

}
```

### 启动任务调度

![image-20250820101602288](/assets/image-20250820101602288.BaoKnaXa.png)

### 调度日志

点击左侧“调度日志”菜单，查看调度日志，此时我们停止项目运行，会线上调度失败。

![image-20250820101619016](/assets/image-20250820101619016.B8K3-Sn7.png)
