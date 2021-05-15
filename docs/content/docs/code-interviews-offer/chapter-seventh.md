# 第7章

## 7.1 案例一

### 面试题49 把字符串转化成整数
> 要求：把字符串转化成整数
>
> 测试用例：正负数和0，空字符，包含其他字符
>
> 备注：使用raise抛出异常作为非法提示

```python
def str_to_int(string):
    if not string:  # 空字符返回异常
        raise Exception('string cannot be None', string)
    flag = 0  # 用来表示第一个字符是否为+、-
    ret = 0  # 结果
    for k, s in enumerate(string):
        if s.isdigit():  # 数字直接运算
            val = ord(s) - ord('0')
            ret = ret * 10 + val
        else:
            if not flag:
                if s == '+' and k == 0:  # 避免中间出现+、-
                    flag = 1
                elif s == '-' and k == 0:
                    flag = -1
                else:
                    raise Exception('digit is need', string)
            else:
                raise Exception('digit is need', string)
    if flag and len(string) == 1:  # 判断是不是只有+、-
        raise Exception('digit is need', string)
    return ret if flag >= 0 else -ret
```

## 7.2 案例二

### 面试题50 树中两个结点的最低公共祖先
> 要求：求普通二叉树中两个结点的最低公共祖先
>
>方法一：先求出两个结点到根结点的路径，然后从路径中找出最后一个公共结点
>
>备注：文件fifty.py中包含该代码的具体测试数据

```python
class Solution(object):

    def __init__(self, root, node1, node2):
        self.root = root  # 树的根结点
        self.node1 = node1
        self.node2 = node2  # 需要求的两个结点

    @staticmethod
    def get_path(root, node, ret):
        """获取结点的路径"""
        if not root or not node:
            return False
        ret.append(root)
        if root == node:
            return True
        left = Solution.get_path(root.left, node, ret)
        right = Solution.get_path(root.right, node, ret)
        if left or right:
            return True
        ret.pop()

    def get_last_common_node(self):
        """获取公共结点"""
        route1 = []
        route2 = []  # 保存结点路径
        ret1 = Solution.get_path(self.root, self.node1, route1)
        ret2 = Solution.get_path(self.root, self.node2, route2)
        ret = None
        if ret1 and ret2:  # 路径比较
            length = len(route1) if len(route1) <= len(route2) else len(route2)
            index = 0
            while index < length:
                if route1[index] == route2[index]:
                    ret = route1[index]
                index += 1
        return ret
```
