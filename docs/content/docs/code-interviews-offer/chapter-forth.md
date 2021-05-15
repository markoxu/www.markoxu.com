# 第4章

## 4.2 画图让抽象问题形象化

### 面试题19 二叉树的镜像
> 思路一：可以按层次遍历，每一层从右到左
>
> 思路二：使用递归

```python
def mirror_bfs(root):
    ret = []
    queue = deque([root])
    while queue:
        node = queue.popleft()
        if node:
            ret.append(node.val)
            queue.append(node.right)
            queue.append(node.left)
    return ret


def mirror_pre(root):
    ret = []

    def traversal(root):
        if root:
            ret.append(root.val)
            traversal(root.right)
            traversal(root.left)
    traversal(root)
    return ret
```

### 面试题20 顺时针打印矩阵
> 每一圈的开始位置总是坐上角元素[0, 0], [1, 1]...

```python
def print_matrix(matrix):
    """
    :param matrix: [[]]
    """
    rows = len(matrix)
    cols = len(matrix[0]) if matrix else 0
    start = 0
    ret = []
    while start * 2 < rows and start * 2 < cols:
        print_circle(matrix, start, rows, cols, ret)
        start += 1
    print ret


def print_circle(matrix, start, rows, cols, ret):
    row = rows - start - 1  # 最后一行
    col = cols - start - 1
    # left->right
    for c in range(start, col+1):
        ret.append(matrix[start][c])
    # top->bottom
    if start < row:
        for r in range(start+1, row+1):
            ret.append(matrix[r][col])
    # right->left
    if start < row and start < col:
        for c in range(start, col)[::-1]:
            ret.append(matrix[row][c])
    # bottom->top
    if start < row and start < col:
        for r in range(start+1, row)[::-1]:
            ret.append(matrix[r][start])
```

## 4.3 举例让抽象问题具体化

### 面试题21 包含min函数的栈
> 要求：栈的push，pop，min操作的时间复杂度都是O(1)
>
> 思路：使用一个辅助栈保存最小值

```python
class MyStack(object):

    def __init__(self):
        self.stack = []
        self.min = []

    def push(self, val):
        self.stack.append(val)
        if self.min and self.min[-1] < val:
            self.min.append(self.min[-1])
        else:
            self.min.append(val)

    def pop(self):
        if self.stack:
            self.min.pop()
            return self.stack.pop()
        return None

    def min(self):
        return self.min[-1] if self.min else None
```

### 面试题22 栈的压入弹出序列
> 要求：判断给定的两个序列中，后者是不是前者的弹出序列，给定栈不包含相同值
>
> 思路：使用一个辅助栈, 如果辅助栈栈顶元素不等于出栈元素，则从入栈中找改值，直到入栈为空
>
> 如果最后出栈序列为空，则是入栈的弹出序列值
>

```python
 def pop_order(push_stack, pop_stack):
    if not push_stack or not pop_stack:
        return False
    stack = []
    while pop_stack:
        pop_val = pop_stack[0]
        if stack and stack[-1] == pop_val:
            stack.pop()
            pop_stack.pop(0)
        else:
            while push_stack:
                if push_stack[0] != pop_val:
                    stack.append(push_stack.pop(0))
                else:
                    push_stack.pop(0)
                    pop_stack.pop(0)
                    break
        if not push_stack:
            while stack:
                if stack.pop() != pop_stack.pop(0):
                    return False
    if not pop_stack:
        return True
    return False
```

### 面试题23 从上往下打印二叉树
> 思路：广度优先搜索，按层次遍历
>

```python
 def bfs(tree):
    if not tree:
        return None
    stack = [tree]
    ret = []
    while stack:
        node = stack.pop(0)
        ret.append(node.val)
        if node.left:
            stack.append(node.left)
        if node.right:
            stack.append(node.right)
    return ret
```

### 面试题24 二叉搜索树的后序遍历序列
> 要求：判断给定的整数数组是不是二叉搜索树的后序遍历序列
>
> 整数数组中不包含重复值
>
> 整数序列的最后一个值是根结点，然后比根结点小的值是左子树，剩下的是右子树，递归左右子树
>

```python
 def is_post_order(order):
    length = len(order)
    if length:
        root = order[-1]
        left = 0
        while order[left] < root:
            left += 1
        right = left
        while right < length - 1:
            if order[right] < root:
                return False
            right += 1
        left_ret = True if left == 0 else is_post_order(order[:left])
        right_ret = True if left == right else is_post_order(order[left:right])
        return left_ret and right_ret
    return False
```

### 面试题25 二叉树中和为某一值的路径
> 要求：输入一棵二叉树和一个值，求从根结点到叶结点的和等于该值的路径
>
> 深度优先搜索变形
>

```python
 def find_path(tree, num):
    ret = []
    if not tree:
        return ret
    path = [tree]
    sums = [tree.val]

    def dfs(tree):
        if tree.left:
            path.append(tree.left)
            sums.append(sums[-1]+tree.left.val)
            dfs(tree.left)
        if tree.right:
            path.append(tree.right)
            sums.append(sums[-1] + tree.right.val)
            dfs(tree.right)
        if not tree.left and not tree.right:
            if sums[-1] == num:
                ret.append([p.val for p in path])
        path.pop()
        sums.pop()

    dfs(tree)
    return ret
```

## 4.4 分解让复杂问题简单化

### 面试题26 复杂链表的复制
> 要求：链表中除了指向后一个结点的指针之外，还有一个指针指向任意结点
>
> 分为三步完成：
>
> 一:复制每个结点，并把新结点放在老结点后面，如1->2,复制为1->1->2->2
>
> 二:为每个新结点设置other指针
>
> 三:把复制后的结点链表拆开
>
> 题目设置了复杂链表的实现，测试代码见文件twenth_six.py
>
```python
class Solution(object):

    @staticmethod
    def clone_nodes(head):
        # 结点复制
        move = head
        while move:
            tmp = Node(move.val)
            tmp.next = move.next
            move.next = tmp
            move = tmp.next
        return head

    @staticmethod
    def set_nodes(head):
        # other指针设置
        move = head
        while move:
            m_next = move.next
            if move.other:
                m_next.other = move.other.next
            move = m_next.next
        return head

    @staticmethod
    def reconstruct_nodes(head):
        # 结点拆分
        ret = head.next if head else Node
        move = ret
        while head:
            head = move.next
            if head:
                move.next = head.next
                move = move.next
        return ret

    @staticmethod
    def clone_link(head):
        # 结果
        h = Solution.clone_nodes(head)
        h = Solution.set_nodes(h)
        ret = Solution.reconstruct_nodes(h)
        return ret
```

### 面试题27 二叉搜索树与双向链表
> 要求: 将二叉搜索树转化成一个排序的双向链表，只调整树中结点的指向
>
> 思路: 中序遍历，根结点的left指向左子树的最后一个(最大)值，right指向右子树的(最小)值
>
> 注意: 题目构造了一个普通二叉树用来测试，构造时按照二叉搜索树的顺序输入结点，空结点用None表示，详情见twenty_seven.py
>

```python
class Solution(object):

    @staticmethod
    def convert(tree):
        """结点转换"""
        if not tree:
            return None
        p_last = Solution.convert_nodes(tree, None)
        while p_last and p_last.left:  # 获取链表头结点
            p_last = p_last.left
        return p_last

    @staticmethod
    def convert_nodes(tree, last):
        if not tree:
            return None
        if tree.left:
            last = Solution.convert_nodes(tree.left, last)
        if last:
            last.right = tree
        tree.left = last
        last = tree
        if tree.right:
            last = Solution.convert_nodes(tree.right, last)
        return last
```

### 面试题28 字符串的排列
> 要求：求输入字符串的全排列
>
> 思路：递归完成，也可以直接使用库函数
>

```python
def my_permutation(s):
    str_set = []
    ret = []  # 最后的结果

    def permutation(string):
        for i in string:
            str_tem = string.replace(i, '')
            str_set.append(i)
            if len(str_tem) > 0:
                permutation(str_tem)
            else:
                ret.append(''.join(str_set))
            str_set.pop()

    permutation(s)
    return ret
```
