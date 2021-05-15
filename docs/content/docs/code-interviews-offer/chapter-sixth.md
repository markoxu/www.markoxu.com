# 第6章

## 6.3 知识迁移能力

### 面试题38 数字在排序数组中出现的次数
> 思路: 使用二分法分别找到数组中第一个和最后一个出现的值的坐标，然后相减

```python
def get_k_counts(nums, k):
    first = get_first_k(nums, k)
    last = get_last_k(nums, k)
    if first < 0 and last < 0:
        return 0
    if first < 0 or last < 0:
        return 1
    return last - first + 1


def get_first_k(nums, k):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) / 2
        if nums[mid] < k:
            if mid + 1 < len(nums) and nums[mid+1] == k:
                return mid + 1
            left = mid + 1
        elif nums[mid] == k:
            if mid - 1 < 0 or (mid - 1 >= 0 and nums[mid-1] < k):
                return mid
            right = mid - 1
        else:
            right = mid - 1
    return -1


def get_last_k(nums, k):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) / 2
        if nums[mid] < k:
            left = mid + 1
        elif nums[mid] == k:
            if mid + 1 == len(nums) or (mid + 1 < len(nums) and nums[mid+1] > k):
                return mid
            left = mid + 1
        else:
            if mid - 1 >= 0 and nums[mid-1] == k:
                return mid - 1
            right = mid - 1
    return -1
```


### 面试题39 二叉树的深度
> 思路: 分别递归的求左右子树的深度

```python
def get_depth(tree):
    if not tree:
        return 0
    if not tree.left and not tree.right:
        return 1
    return 1 + max(get_depth(tree.left), get_depth(tree.right))
```

### 面试题40 数组中只出现一次的数字
> 要求：数组中除了两个只出现一次的数字外，其他数字都出现了两遍
>
> 思路: 按位异或，在得到的值中找到二进制最后一个1，然后把数组按照该位是0还是1分为两组

```python
def get_only_one_number(nums):
    if not nums:
        return None
    tmp_ret = 0
    for n in nums:  # 获取两个值的异或结果
        tmp_ret ^= n
    last_one = get_bin(tmp_ret)
    a_ret, b_ret = 0, 0
    for n in nums:
        if is_one(n, last_one):
            a_ret ^= n
        else:
            b_ret ^= n
    return [a_ret, b_ret]


def get_bin(num):  # 得到第一个1
    ret = 0
    while num & 1 == 0 and ret < 32:
        num = num >> 1
        ret += 1
    return ret


def is_one(num, t):  # 验证t位是不是1
    num = num >> t
    return num & 0x01
```

### 面试题41 和为s的两个数字VS和为s的连续正数序列
### 和为s的两个数字
> 要求：输入一个递增排序的数组和一个数字s，在数组中查找两个数，使其和为s
>
> 思路: 设置头尾两个指针，和大于s，尾指针减小，否砸头指针增加

```python
def sum_to_s(nums, s):
    head, end = 0, len(nums) - 1
    while head < end:
        if nums[head] + nums[end] == s:
            return [nums[head], nums[end]]
        elif nums[head] + nums[end] > s:
            end -= 1
        else:
            head += 1
    return None
```
### 和为s的连续整数序列
> 要求：输入一个正数s， 打印出所有和为s的正整数序列(至少两个数)
>
> 思路: 使用两个指针，和比s小，大指针后移，比s大，小指针后移

```python
def sum_to_s(s):
    a, b = 1, 2
    ret = []
    while a < s / 2 + 1:
        if sum(range(a, b+1)) == s:
            ret.append(range(a, b+1))
            a += 1
        elif sum(range(a, b+1)) < s:
            b += 1
        else:
            a += 1
    return ret
```

### 面试题42 翻转单词顺序与左旋转字符串
### 翻转单词顺序
> 要求：翻转一个英文句子中的单词顺序，标点和普通字符一样处理
>
> 思路: Python中字符串是不可变对象，不能用书中的方法，可以直接转化成列表然后转回去

```python
def reverse_words(sentence):
    tmp = sentence.split()
    return ' '.join(tmp[::-1])  # 使用join效率更好，+每次都会创建新的字符串
```
### 左旋转字符串
> 思路: 把字符串的前面的若干位移到字符串的后面

```python
def rotate_string(s, n):
    if not s:
        return ''
    n %= len(s)
    return s[n:] + s[:n]
```

## 6.4 抽象建模能力

### 面试题43 n个骰子的点数
> 要求：求出n个骰子朝上一面之和s所有可能值出现的概率
>
> 思路：n出现的可能是前面n-1到n-6出现可能的和，设置两个数组，分别保存每一轮

```python
def get_probability(n):
    if n < 1:
        return []
    data1 = [0] + [1] * 6 + [0] * 6 * (n - 1)
    data2 = [0] + [0] * 6 * n   # 开头多一个0，方便按照习惯从1计数
    flag = 0
    for v in range(2, n+1):  # 控制次数
        if flag:
            for k in range(v, 6*v+1):
                data1[k] = sum([data2[k-j] for j in range(1, 7) if k > j])
            flag = 0
        else:
            for k in range(v, 6*v+1):
                data2[k] = sum([data1[k-j] for j in range(1, 7) if k > j])
            flag = 1
    ret = []
    total = 6 ** n
    data = data2[n:] if flag else data1[n:]
    for v in data:
        ret.append(v*1.0/total)
    print data
    return ret
```

### 面试题44 扑克牌的顺子
> 要求：从扑克牌中随机抽取5张牌，判断是不是顺子，大小王可以当任意值
>
> 思路: 使用排序

```python
import random


def is_continus(nums, k):
    data = [random.choice(nums) for _ in range(k)]
    data.sort()
    print data
    zero = data.count(0)
    small, big = zero, zero + 1
    while big < k:
        if data[small] == data[big]:
            return False
        tmp = data[big] - data[small]
        if tmp > 1:
            if tmp - 1 > zero:
                return False
            else:
                zero -= tmp - 1
                small += 1
                big += 1
        else:
            small += 1
            big += 1
    return True
```

### 面试题45 圆圈中最后剩下的数字
> 要求：0到n-1排成一圈，从0开始每次数m个数删除，求最后剩余的数
>
> 思路：当 n > 1 时： f(n,m) = [f(n-1, m)+m]%n,当 n = 1 时： f(n,m)=0，*关键是推导出关系表达式*

```python
def last_num(n, m):
    ret = 0
    if n == 1:
        return 0
    for i in range(2, n+1):
        ret = (m + ret) % i
    return ret
```

## 6.5 发散思维能力

### 面试题46 求1+2...+n
> 要求：不能使用乘除、for、while、if、else等
>
>方法一：使用range和sum
>
>方法二：使用reduce

```python
def get_sum1(n):
    return sum(range(1, n+1))


def get_sum2(n):
    return reduce(lambda x, y: x+y, range(1, n+1))
```

### 面试题47 不用加减乘除做加法
> 要求：不用加减乘除做加法
>
>方法一：使用位运算，Python中大整数会自动处理，因此对carry需要加个判断
>
>方法二：使用sum

```python
def bit_add(n1, n2):
    carry = 1
    while carry:
        s = n1 ^ n2
        carry = 0xFFFFFFFF & ((n1 & n2) << 1)
        carry = -(~(carry - 1) & 0xFFFFFFFF) if carry > 0x7FFFFFFF else carry
        n1 = s
        n2 = carry
    return n1


def add(n1, n2):
    return sum([n1, n2])
```

### 面试题48 不能被继承的类
>Python中不知道怎么实现不能被继承的类。以后补充代码或者原因。
