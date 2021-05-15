# 第5章

## 5.2 时间效率

### 面试题29 数组中出现次数超过一半的数字
> 思路: 使用hash，key是数字，value是出现的次数
>
> 注意: 列表的len方法的时间复杂度是O(1)
>

```python
def get_more_half_num(nums):
    hashes = dict()
    length = len(nums)
    for n in nums:
        hashes[n] = hashes[n] + 1 if hashes.get(n) else 1
        if hashes[n] > length / 2:
            return n
```

### 面试题30 最小的k个数
> 要求：求数组中出现次数超过一半的数字
>
> 思路: 使用heapq，该模块是一个最小堆，需要转化成最大堆，只要在入堆的时候把值取反就可以转化成最大堆(仅适用于数字)
>
> 思路二: 数组比较小的时候可以直接使用heapq的nsmallest方法

```python
import heapq


def get_least_k_nums(nums, k):
    # 数组比较小的时候可以直接使用
    return heapq.nsmallest(k, nums)


class MaxHeap(object):
    def __init__(self, k):
        self.k = k
        self.data = []

    def push(self, elem):
        elem = -elem  # 入堆的时候取反，堆顶就是最大值的相反数了
        if len(self.data) < self.k:
            heapq.heappush(self.data, elem)
        else:
            least = self.data[0]
            if elem > least:
                heapq.heapreplace(self.data, elem)

    def get_least_k_nums(self):
        return sorted([-x for x in self.data])
```

### 面试题31 连续子数组的最大和
> 思路: 动态规划问题

```python
def max_sum(nums):
    ret = float("-inf")  # 负无穷
    if not nums:
        return ret
    current = 0
    for i in nums:
        if current <= 0:
            current = i
        else:
            current += i
        ret = max(ret, current)
    return ret
```

### 面试题32 从1到n整数中1出现的次数
> 要求：求从1到n整数的十进制表示中，1出现的次数
>
> 思路: 获取每个位数区间上所有数中包含1的个数，然后分别对高位分析，然后递归的处理低位数
>
> 此题中，作者的描述我没有理解，按照自己的理解写了一下，具体内容请点击[这里](http://www.cnblogs.com/qiaojushuang/p/7780445.html)

```python
def get_digits(n):
    # 求整数n的位数
    ret = 0
    while n:
        ret += 1
        n /= 10
    return ret


def get_1_digits(n):
    """
    获取每个位数之间1的总数
    :param n: 位数
    """
    if n <= 0:
        return 0
    if n == 1:
        return 1
    current = 9 * get_1_digits(n-1) + 10 ** (n-1)
    return get_1_digits(n-1) + current


def get_1_nums(n):
    if n < 10:
        return 1 if n >= 1 else 0
    digit = get_digits(n)  # 位数
    low_nums = get_1_digits(digit-1)  # 最高位之前的1的个数
    high = int(str(n)[0])  # 最高位
    low = n - high * 10 ** (digit-1)  # 低位

    if high == 1:
        high_nums = low + 1  # 最高位上1的个数
        all_nums = high_nums
    else:
        high_nums = 10 ** (digit - 1)
        all_nums = high_nums + low_nums * (high - 1)  # 最高位大于1的话，统计每个多位数后面包含的1
    return low_nums + all_nums + get_1_nums(low)
```

### 面试题33 把数组排成最小的数
> 要求：把数组中的值拼接，找出能产生的最小的数[321,32,3]最小的数是321323
>
> 思路: Python中不需要考虑大整数，需要自己定义一个数组排序规则，直接调用库函数就可以

```python
def cmp(a, b):
    return int(str(a)+str(b)) - int(str(b)+str(a))


def print_mini(nums):
    print int(''.join([str(num) for num in sorted(nums, cmp=cmp)]))
```

## 5.3 时间效率与空间效率的平衡

### 面试题34 丑数 [LeetCode](https://leetcode.com/problems/ugly-number-ii/)
> 要求：只含有2、3、5因子的数是丑数，求第1500个丑数
>
> 思路: 按顺序保存已知的丑数，下一个是已知丑数中某三个数乘以2，3，5中的最小值

```python
class Solution(object):
    def nthUglyNumber(self, n):
        """
        :type n: int
        :rtype: int
        """
        ugly = [1]
        t2 = t3 = t5 = 0
        while len(ugly) < n:
            while ugly[t2] * 2 <= ugly[-1]:
                t2 += 1
            while ugly[t3] * 3 <= ugly[-1]:
                t3 += 1
            while ugly[t5] * 5 <= ugly[-1]:
                t5 += 1
            ugly.append(min(ugly[t2]*2, ugly[t3]*3, ugly[t5]*5))
        return ugly[-1]
```

### 面试题35 第一个只出现一次的字符
> 要求：求字符串中第一个只出现一次的字符
>
> 思路: 使用两个hash，一个记录每个字符穿线的次数，另一个记录每个字符第一次出现的位置

```python
def first_not_repeating_char(string):
    if not string:
        return -1
    count = {}
    loc = {}
    for k, s in enumerate(string):
        count[s] = count[s] + 1 if count.get(s) else 1
        loc[s] = loc[s] if loc.get(s) else k
    ret = float('inf')
    for k in loc.keys():
        if count.get(k) == 1 and loc[k] < ret:
            ret = loc[k]
    return ret
```

### 面试题36 数组中的逆序对
> 要求：在一个数组中，前面的数字比后面的大，就是一个逆序对，求总数
>
> 思路: 归并排序,先把数组依次拆开，然后合并的时候统计逆序对数目，并排序

```python
import copy


def get_inverse_pairs(nums):
    if not nums:
        return 0
    start, end = 0, len(nums) - 1
    tmp = copy.deepcopy(nums)
    return inverse_pairs(tmp, start, end)


def inverse_pairs(tmp, start, end):
    if start == end:  # 递归结束条件
        return 0
    mid = (end - start) / 2  # 分别对左右两边递归求值
    left = inverse_pairs(tmp, start, start+mid)
    right = inverse_pairs(tmp, start+mid+1, end)

    count = 0  # 本次逆序对数目
    l_right, r_right = start + mid, end
    t = []
    while l_right >= start and r_right >= start + mid + 1:
        if tmp[l_right] > tmp[r_right]:
            t.append(tmp[l_right])
            count += (r_right - mid - start)
            l_right -= 1
        else:
            t.append(tmp[r_right])
            r_right -= 1
    while l_right >= start:
        t.append(tmp[l_right])
        l_right -= 1
    while r_right >= start+mid+1:
        t.append(tmp[r_right])
        r_right -= 1
    tmp[start:end+1] = t[::-1]
    return count + left + right
```

### 面试题37 两个链表的第一个公共结点
> 思路: 先获取到两个链表的长度，然后长的链表先走多的几步，之后一起遍历
>
> 文件thirty_seven.py中包含了设置链表公共结点的代码，可以用来测试

```python
def get_first_common_node(link1, link2):
    if not link1 or not link2:
        return None
    length1 = length2 = 0
    move1, move2 = link1, link2
    while move1:  # 获取链表长度
        length1 += 1
        move1 = move1.next
    while move2:
        length2 += 1
        move2 = move2.next
    while length1 > length2:  # 长链表先走多的长度
        length1 -= 1
        link1 = link1.next
    while length2 > length1:
        length2 -= 1
        link2 = link2.next
    while link1:  # 链表一起走
        if link1 == link2:
            return link1
        link1, link2 = link1.next, link2.next
    return None
```