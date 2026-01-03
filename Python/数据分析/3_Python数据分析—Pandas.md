---
url: /Python/数据分析/3_Python数据分析—Pandas.md
---

# Python数据分析—Pandas

## Pandas

**Pandas优势在于：由于它是构建在NumPy之上的，所以继承了NumPy高性能的数组计算功能，同时它还提供了更多复杂精细的数据处理功能。**

## 一、安装与导入Pandas

安装Pandas，在CMD或终端，输入`pip install pandas`

导入Pandas，`**import** pandas **as** pd`

## 二、Series

Series和NumPy的一维数组很相似。

### 1、创建Series

创建Series对象，用Series类，参数传入一个列表。

Series第一个字母S要大写，说明调用的是Series类的构造函数，会返回给我们一个Series类的对象。

```python
s1 = pd.Series([5, 17, 3, 26, 31])
a1 = np.array([5, 17, 3, 26, 31])
print(s1)
print()
print(a1)
```

运行结果

```python
0     5
1    17
2     3
3    26
4    31
dtype: int64

[ 5 17  3 26 31]
```

**Series和NumPy数组的区别在于：不止展示了有什么元素，元素左边还专门展示对应的index，最后一行的dtype还展示了Series里元素的类型。**

### 2、获得Series的元素和索引

如果想单独获得Series的所有元素值，可以用values属性

```python
s1.values

array([ 5, 17,  3, 26, 31], dtype=int64)
```

如果想单独获得Series的所有索引值，可以用index属性

```python
s1.index

RangeIndex(start=0, stop=5, step=1)
```

这里index属性返回的值表示说，index从0开始，到5结束且不包括5，范围内每个index增加1。

### 3、索引和切片操作

对Series同样可以进行索引、切片操作，这个和Python列表、NumPy一维数组都是非常相似。

索引

```python
s1[2]

3
```

切片

```python
s1[1: 3]

1    17
2     3
dtype: int64
```

## 三、Series的特别之处

数组的索引和Python列表一样，都是表示位置的整数，从0开始逐步加1。

Series的索引，默认也是表示位置的整数，但是也可以自己指定。

创建带标签索引的Series对象，后面跟一个index参数，放入标签索引组成的列表。比如：

```python
s1 = pd.Series([5, 17, 3, 26, 31],
              index=["a", "d", "b", "c", "e"])
s1
```

运行结果

```python
a     5
d    17
b     3
c    26
e    31
dtype: int64
```

元素对应的索引变成了a, d, b, c, e

有了标签索引以后，相当于多了一种索引方法。一般单独说索引，指的是标签索引。

### 1、用两种索引取值

这时对Series元素取值的时候，可以用位置索引，也可以用标签索引。

```python
print(s1[2])
print(s1["b"])

3
3
```

### 2、用两种索引切片

可以用位置索引切片，也可以用标签索引切片

```python
s1[1: 3]

d    17
b     3
dtype: int64
```

**用标签索引切片的时候，结束值是包含的**

```python
s1["d": "c"]

d    17
b     3
c    26
dtype: int64
```

### 3、用索引获得任意元素

要得到多个元素组成的Series，可以在方括号里放一个列表，里面包含想选出的元素的索引，这样顺序就不受限制了。

用位置索引获得任意元素

```python
s1[[2, 3, 1]]

d    17
b     3
dtype: int64
```

用标签索引获得任意元素

```python
s1[["b", "c", "d"]]

b     3
c    26
d    17
dtype: int64
```

### 4、loc和iloc

当用整数作为标签索引时，索引取值时按照标签索引，切片时按照位置索引。

```python
s2 = pd.Series([5, 17, 3, 26 ,31], 
              index=[1, 3, 5, 7, 9])

s2[5]
3

s2[1: 3]
 FutureWarning: The behavior of `series[i:j]` with an integer-dtype index is deprecated. In a future version, this will be treated as *label-based* indexing, consistent with e.g. `series[i]` lookups. To retain the old behavior, use `series.iloc[i:j]`. To get the future behavior, use `series.loc[i:j]`.
  s2[1: 3]
3    17
5     3
dtype: int64
```

***这*****种不一致让人困惑，也很容易造成错误，所以Pandas提供了两个更好的索引取值或切片方法，叫loc和iloc**

**但未来版本，切片时按照标签索引。**

loc表示用**标签索引**去取值或切片

```python
s2.iloc[1: 3]

3    17
5     3
dtype: int64
```

iloc表示用**坐标位置索引**去取值或切片

```python
s2.loc[1: 3]

1     5
3    17
dtype: int64
```

### 5、创建自定义索引Series的另一种方式

除了可以通过index这个可选参数指定标签索引，另一种创建自定义索引Series的方法是：给Series这个构造函数直接传入一个字典。

字典的键，就会自动变成值所对应的标签索引。

```python
s3 = pd.Series({"青菜": 4.1, "白萝卜": 2.2, "西红柿":5.3, "土豆":3.7, "黄瓜": 6.8})
s3

青菜     4.1
白萝卜    2.2
西红柿    5.3
土豆     3.7
黄瓜     6.8
dtype: float64
```

### 6、查看标签是否存在

要想知道某个标签是否在Series里，可以用in,它会返回一个布尔值，来告知我们是否存在

```python
"青菜" in s3

True
```

### 7、修改Series里的值

如果你想更改某个标签对应的值，可以像字典那样，方括号里面放上标签去更新。

**如果标签也是整数，最好不要直接放方括号，因为可能一时区分不出来方括号里的整数指的是标签索引还是位置索引，更好的方法还是用loc和iloc。**

**更好的习惯是，不管标签是不是整数，都用loc和iloc。**

```python
s3.loc["青菜"] = 4.5
s3.iloc[0] = 4.5
```

## 四、根据条件筛选Series元素

```python
s3 > 5

青菜     False
白萝卜    False
西红柿     True
土豆     False
黄瓜      True
dtype: bool
```

### 1、与NumPy数组类似

比如: s3 > 5，会返回一个有标签索引和布尔值组成的Series

通过布尔值数组，可以筛选出符合这个条件的元素所组成的Series

```python
s3[s3 > 5]

西红柿    5.3
黄瓜     6.8
dtype: float64
```

### 2、结合逻辑运算，让筛选逻辑更复杂

要增加筛选条件复杂度，也可以利用&, |, ~这些逻辑符号，实现与、或、非运算

```python
s3[(s3 > 5) | (s3 < 3)]

白萝卜    2.2
西红柿    5.3
黄瓜     6.8
dtype: float64
```

## 五、Series的运算

### 1、Series和Series之间

在Series和Series之间,可以做加减乘除等各种运算，Pandas会自动根据索引去排序并对齐。

如果某个索引只在其中一个Series出现的话，结果就会是NaN，表示not a number，说明无法得到计算值。

也就是说，由于Series之间的计算会自动进行索引对齐，只有当某个索引同时出现在两个Series里时，结果里才会有对应的值。

按照什么进行排序? 数字按照大小，英文按照字母顺序，数字英文中文可以混在一起排序对齐，数字在英文前，英文在中文前。中文排序方式或许是ASCII。

```python
import pandas as pd
s1 = pd.Series([1, 4, 2, 3, 5], index=[1, 3, 5, 7, 9])
s2 = pd.Series([8, 1, 7 ,3 ,9], index=[1, 2, 3, 5, 10])
s1 + s2
```

运行结果

```python
1      9.0
2      NaN
3     11.0
5      5.0
7      NaN
9      NaN
10     NaN
dtype: float64
```

中英文数字

```python
s0 = pd.Series({1: 1, "只": 1, "住": 1, "num": 1, 3: 1})
s0 + s1
```

运行结果

```python
1      2.0
3      5.0
5      NaN
7      NaN
9      NaN
num    NaN
住      NaN
只      NaN
dtype: float64
```

### 2、默认值

如果希望给缺失的值一个默认值的话，可以用方法而不是运算符号进行运算，然后给`fill_value`这个参数传入一个值。

用符号的话我们没法额外传参，但用方法的话就可以。

两个Series相加，给个默认值，等同于s1 + s2，并同时给两边缺失的值一个默认值0

```python
s1.add(s2, fill_value=0)
```

运行结果

```python
1      9.0
2      1.0
3     11.0
5      5.0
7      3.0
9      5.0
10     9.0
dtype: float64
```

两个Series相减，给个默认值

```python
s1.sub(s2, fill_value=0)
```

运行结果

```python
1    -7.0
2    -1.0
3    -3.0
5    -1.0
7     3.0
9     5.0
10   -9.0
dtype: float64
```

两个Series相乘，给个默认值

```python
 s1.mul(s2, fill_value=0)
```

运行结果

```python
1      8.0
2      0.0
3     28.0
5      6.0
7      0.0
9      0.0
10     0.0
dtype: float64
```

两个Series相除，给个默认值

```python
 s1.div(s2, fill_value=0)
```

运行结果

```python
1     0.125000
2     0.000000
3     0.571429
5     0.666667
7          inf
9          inf
10    0.000000
dtype: float64
```

### 3、优势

Series之间的操作会根据索引自动对齐的好处是，由于一般我们会利用标签索引表示不同对象的数据,那即使不同Series里数据顺序不一样，计算时也会根据索引自动对齐

### 4、聚合运算

#### 4.1、统计方法

NumPy数组的统计方法，包括max, min, sum, mean，Pandas的Series对象也有相同名字的方法。

```python
print(s1.max())
print(s1.min())
print(s1.sum())
print(s1.mean())
```

运行结果

```python
5
1
15
3.0
```

#### 4.2、describe方法

describe方法，是Series特有的一个强大的方法，describe方法能直接告诉我们很多这个Series的统计信息，包括：元素个数、平均数、标准差、最小值、四分位数、最大值

```python
 s1.describe()
```

运行结果

```python
count    5.000000
mean     3.000000
std      1.581139
min      1.000000
25%      2.000000
50%      3.000000
75%      4.000000
max      5.000000
dtype: float64
```

### 5、Series和单个数字之间

与NumPy数组的广播机制一样，在Pandas Series里，单个数字和Series之间进行操作的时候，操作会被自动运用到Series里每个元素上

```python
 s1 * 3
```

运行结果

```python
1     3
3    12
5     6
7     9
9    15
dtype: int64
```

## 六、对元素分别执行相同操作

### 1、apply方法接收函数

apply方法，接收函数作为参数，然后调用时把Series里各个元素，分别作为那个函数的参数，返回的Series里的元素，就是那个函数对原始Series里各个元素调用后的结果。

**apply方法不改变原始Series，而是会返回一个新的Series**

**apply相当于是高阶函数注意传入的函数后面不要跟括号，因为不是要把函数调用后的结果，去作为apply的参数，而是把函数本身给applyapply的定义语句里肯定包括：**

1. **让每一个Series里面的元素作为参数，调用函数。**
2. **将每一个元素调用函数得到的结果，组成的新Series。**

***

优势：apply方法大大增加了我们操作Series的灵活性，能定义出来的函数，我们都可以作用在Series的各个元素上，帮我们得到新的Series。

应用场景：当前有5名学生的成绩所组成的Series,索引为学生名字，我们希望能得到每个成绩对应的等级：90及以上是A，80到90是B，70到80是C，70以下是D。我们知道怎么根据分数数字得到对应等级，只需要get\_grade\_from\_score函数即可。现在问题在于，如何对Series里每个元素，都运用这个函数，得到对应结果组成的新Series。新方法，apply方法可以实现这一步。

```python
scores = pd.Series({"小明": 92, "小红": 67, "小杰": 70, "小丽": 88, "小华": 76})
def get_grade_from_score(score):
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    else:
        return "D"


grades = scores.apply(get_grade_from_score)
grades
```

运行结果

```python
小明    A
小红    D
小杰    C
小丽    B
小华    C
dtype: object
```

### 2、apply方法接收匿名函数

除了传入定义好的函数名，在函数逻辑比较简单的时候，匿名函数也可以应用在这里。

```python
half_scores = scores.apply(lambda x: 0.5*x)
half_scores
```

运行结果

```python
小明    46.0
小红    33.5
小杰    35.0
小丽    44.0
小华    38.0
dtype: float64
```

## 七、转换数据类型

astype方法：转换Series的数据类型

```python
scores = scores.astype(str)
scores
```

运行结果

```python
小明    92
小红    67
小杰    70
小丽    88
小华    76
dtype: object
```

## 八、针对字符串Series，保留Series每个元素的某一部分

str.slice方法

str是Series类自带的一个属性，会返回一个包含了很多字符串相关操作方法的,StringMethods类的实例(返回实例才可以调用方法)，对这个StringMethods实例调用slice方法，就会分别保留Series里每个元素选定的部分

第一个参数传入，要保留的起始位置的索引；第二个参数传入，要保留的结束位置的下一索引

```python
 scores.str.slice(0, 1)
```

运行结果

```python
小明    9
小红    6
小杰    7
小丽    8
小华    7
dtype: object
```
