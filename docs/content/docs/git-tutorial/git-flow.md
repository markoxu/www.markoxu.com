# A Successful Git Branching Model

译自：[A successful Git branching model - Vincent Driessen](https://nvie.com/posts/a-successful-git-branching-model/)
 
 本文将展示我一年前在自己的项目中成功运用的开发模型。我一直打算把这些东西写出来，但是总是没有时间来彻底地去完成这件事儿，现在我终于写好啦。这里并不会介绍任何关于项目的细节，而是介绍分支策略和发布管理。
 
<div align=center><img src="../../../assets/images/git-flow-1.png" width="400px"></div> 

## 为什么选择Git？

这个[网页](http://git.or.cz/gitwiki/GitSvnComparsion)里对Git和中心代码控制系统的优势和劣势做了详细的对比和激烈的争论。作为一个开发者，我更喜欢Git超过其它任何现有类似的工具。Git真正地改变了开发者对于合并和分支的认知。在传统的CVS或者SVN中，合并或者分支操作总是让人有点害怕（“特别合并冲突操作，它们会搞死你的”），但是你只是偶尔会进行这样的操作。

但是基于Git来执行这些操作将会变得特别的简便，并且它们也会成为你日常工作流程中的核心部分。比如，在CVS或者SVN的书籍中，分支和合并通常是在后面的章节才开始讨论的知识点（面向高级用户），但是在每一本Git的书中分支和合并通常在第三章就已经讲解了（面向基础用户）。

因为Git的简洁性和可复用性，分支和合并不再是让人害怕的东西。版本控制工具就是用来实现分支和合并操作的。

有关工具的介绍就到这里为止，现在让我们正式进入开发模型这个话题。我准备讲解的模型其实是一个工作流程的集合，而这个工作流程每个团队成员都应该去遵守以实现管理软件开发流程的目的。

## 分散但集中

我们使用的代码仓库设置能够与分支模型配合得很好，并且是一个所谓的“中央”代码仓库。但是，值得注意的是，这个代码仓库只是被看作是一个中央代码仓库。（因为Git是一个分布式版本控制系统，所以从技术层面上看并没有真正的中央代码仓库）。我们通常把这个“中央”代码仓库命名为origin，因为这个名字对所有的Git用户来说都是非常熟悉的。

<div align=center><img src="../../../assets/images/git-flow-2.png" width="400px"></div> 

每个开发者都可以对origin仓库进行pull和push操作。除了集中式的pull-push关系之外，每个开发者也可以从其他开发者那里拉取代码进而形成子团队。比如，这对于两个以上开发者同时开发一个新功能时非常有帮助，这能够避免过早地把正在开发的工作推送到origin仓库中。在上面这个图中，Alice和 Bob、Alice和David、Clai和David就是这样进行工作的子团队。

从技术层面上来说，这无非意味着Alice定义了一个名为bob的Git远程仓库，并且这个仓库指向Bob的仓库，反之亦然。

## 主干分支

<div align=center><img src="../../../assets/images/git-flow-3.png" width="400px"></div> 

在核心部分上，这个开发模型深受现有模型的启发。中央代码仓库拥有两个生命周期较长的主要分支：

- master
- develop

origin仓库中的master分支对于每一个Git用户来说都是非常熟悉的。与master分支平行的，还有另一个分支叫做develop分支。我们通常认为origin/master分支的HEAD总是能处于一个生产就绪的状态。

我们通常认为origin/develop分支的HEAD总是能处于开发就绪但是待发布的状态。有人也把develop分支称为集成分支。通常develop分支代码每个晚上都会自动构建一下。

当develop分支的代码稳定了并且准备发布的时候，develop分支上的所有的变更都需要以某种方式合并回master分支并打上发布版本号。具体的操作方法我们稍后作进一步的讨论。

因此，每次当变更被合并回master分支的时候，它就是被定义好的新发布产品。我们通常会对合并到master分支的操作进行严格的把关，所以当master分支上有新的提交时，我们可以使用Git hook脚本来自动构建并且把软件产品推送到我们的生产环境服务器上。

## 辅助分支

除了master和develop分支外，我们的开发模型还使用了许多辅助分支，目的是实现团队成员并行开发、简化功能的跟踪、为生产环境做准备和快速修复生产环境问题。与主干分支不同，这些辅助分支的生命周期通常是有限的，它们最终都会被移除掉。我们可能使用到不同类型的分支有：

- Feature
- Release
- Hotfix

每一个分支都有特定的目的并且遵循严格的规则来进行分支派生或者分支合并。

从技术角度上看，这些辅助分支并没有什么特别的。它们的类型取决于我们是怎么使用它们的，其本身只是普普通通的Git分支而已。

### Feature分支

<div align=center><img src="../../../assets/images/git-flow-4.png" width="200px"></div> 

- 可能派生自：develop
- 必须合并回：develop
- 分支命名规范：除了master、develop、release-\*，或 hotfix-\*之外的任何名字

Feature分支（有时候也叫topic分支）通常是用来开发近期或远期要发布的新功能。当我们开始开发一个功能的时候，新功能想合并的目标发布版本可能仍是未知的。只要功能还在开发当中，这个Feature分支就会一直存在，并且最终会被合并回develop分支（明确在即将发布的版本中添加这个新功能）或者被丢弃（如果实测结果让人失望）。

Feature分支通常存在于开发者的代码仓库中而不是在origin仓库中。

#### 创建一个feature分支

当创建一个新feature分支的时候，它通常是从develop分支派生出来的。

```
$ git checkout -b myfeature develop
Switched to a new branch "myfeature"
```

#### 合并feature分支回develop分支

已经完成的feature分支需要合并回develop分支并且它们将会按计划被添加到即将发布的版本中。

```
$ git checkout develop
Switched to branch 'develop'
$ git merge --no-ff myfeature
Updating ea1b82a..05e9557
(Summary of changes)
$ git branch -d myfeature
Deleted branch myfeature (was 05e9557).
$ git push origin develop
```
`--no-ff`标志将会使得合并操作总是产生一次新的提交，即使这个合并操作是fast-forward类型的。这么做能够避免丢失feature分支的历史信息，同时也能够把feature分支的提交信息聚合到一起。对比如下：

<div align=center><img src="../../../assets/images/git-flow-5.png" width="400px"></div>

在后者中，我们不可能从历史提交记录中看出来一个功能是通过哪些提交来实现的，这时候你只能手动地读取所有的提交历史来确定是哪些提交来共同实现了这个功能。在后者的情况下，回退整个功能（比如一组提交）是一件让人非常头疼的事情，而如果使用`--no-off`的话这件事情将会变得非常简单。

当然，使用`--no-off`标志进行合并操作可能会创建一些非必要的空提交记录，但是这么做的收益是大于成本的。

### Release分支

可能派生自：develop

必须合并回：develop和master

分支命名规范：release-*

Release分支是用来支持新产品发布做准备的。这些分支允许在最后阶段产生提交和交汇。进一步地，这些分支还允许提交小问题修复和准备元信息（如版本号、构建日期等等）。在release分支上完成这些工作之后，develop分支就可以继续接收为下一次发布准备的新功能提交了。

从develop分支派生出release分支的关键时刻就是当develop分支几乎已经完成了即将新发布版本预期的功能或者状态。至少在这个时候所有为下一次发布待构建的功能都需要已经合并到develop分支中，同时其他针对未来要发布的功能此时都不应该继续合并到develop分支中-这些未来要发布的功能必须等到当前release分支合并回master分支之后才能继续提交到develop分支。

在release分支开始的时候我们需要分配一个新的发布版本号-而不是更早的时候就去做这件事。在release分支创建之前，develop分支反映的都是“下一次发布”的改动，但是这个“下一次发布”并没有明确最终的版本号是0.3还是1.0。确定版本号这件事情是在release分支创建的时候决定的，并且需要遵循项目规范打上准确的版本号。

#### 创建一个release分支

Release分支是从develop分支创建而来的。比如当前生产环境的版本是1.1.5，并且有一个大版本马上就要发布了。Develop分支已经为“下一次发布”做好了准备，并且我们已经决定这次的发布版本号是1.2（而不是1.1.6或者是2.0）。因此，我们需要从develop分支派生出release分支并给该以新的版本号为这个release分支命名：

```
$ git checkout -b release-1.2 develop
Switched to a new branch "release-1.2"
$ ./bump-version.sh 1.2
Files modified successfully, version bumped to 1.2.
$ git commit -a -m "Bumped version number to 1.2"
[release-1.2 74d9424] Bumped version number to 1.2
1 files changed, 1 insertions(+), 1 deletions(-)
```

创建并切换到新的release分支后，我们需要打上版本号。这里，`bump-version.sh`表示一个伪脚本，它用来修改某些文件以反映这是一个新的版本。（当然你也可以通过手动修改某些文件来表明版本发生了更新）。然后，新的版本号需要被提交。

这个release分支将会存在一段时间，直到它被推送出去。这段时间里，release分支肯可能有一些问题需要修复（此时问题不应该在develop上修复）。此时应该严格禁止庞大的新功能合并进release分支，它们应该被合并到develop分支并等待下一次大的发布。

#### 完成一个 release 分支

当release分支已就绪并且将可以正式发布的时候，还有一些事情需要去做。首先，release分支需要被合并到master分支（别忘了，master分支上每个提交都明确代表了一个新的发布）。然后，需要为master上本次的提交打上一个tag作为未来参考的历史版本。最后，release分支上产生的变更需要合并回develop分支，以便后续的发布也能包含这些对问题的修复工作。


前两步在Git上可以这样操作：

```
$ git checkout master
Switched to branch 'master'
$ git merge --no-ff release-1.2
Merge made by recursive.
(Summary of changes)
$ git tag -a 1.2
```

现在发布工作已经完成了，需要打上tag给未来工作作参考。

**补充**：你也可以通过添加`-s`或`-u <key>`标记来打tag并进行加密签名。

不过，为了把这些变更保存在release分支上，我们需要把这些变更都合并回develop分支上。在Git上可以这样操作：

```
$ git checkout develop
Switched to branch 'develop'
$ git merge --no-ff release-1.2
Merge made by recursive.
(Summary of changes)
```

这一步可能会导致合并冲突（因为我们在release分支更改了版本号）。如果出现这种情况，解决冲突并提交就好了。

现在我们真正地完成了发布工作并且可以把release分支删掉了，因为我们已经不需要这个分支了：

```
$ git branch -d release-1.2
Deleted branch release-1.2 (was ff452fe).
```

### Hotfix分支

<div align=center><img src="../../../assets/images/git-flow-6.png" width="400px"></div>

- 可能派生自：master
- 必须合并回：develop 和 master
- 分支命名规范：hotfix-*

Hotfix分支和release分支非常类似，因为它们都是意味着为一个新的产品发布准备的，尽管这个是计划之外的操作。Hotfix分支需要对生产环境出现的意外情况进行快速地处理。当生产版本上的严重问题必须马上解决的时候，我们将会从master分支上与生产环境版本相应的tag派生出hotfix分支。

我们这么做的原因是，团队成员（工作在develop分支上的）可以继续工作，同时另一个成员可以准备快速地修复生产环境的问题。

#### 创建一个hotfix分支

Hotfix分支创建自master分支。比如，当前生产环境运行的发布版本1.2并且由于一个严重问题导致了大麻烦。然而，此时develop分支上的变更还不够稳定。我们可以从master分支上派生出hotfix分支，并且在hotfix分支上修复这个问题：

```
$ git checkout -b hotfix-1.2.1 master
Switched to a new branch "hotfix-1.2.1"
$ ./bump-version.sh 1.2.1
Files modified successfully, version bumped to 1.2.1.
$ git commit -a -m "Bumped version number to 1.2.1"
[hotfix-1.2.1 41e61bb] Bumped version number to 1.2.1
1 files changed, 1 insertions(+), 1 deletions(-)
```

别忘了派生出hotfix分支之后也需要打上版本号!

然后，修复问题和提交修复在一个或者多个提交中都是可以的。

```
$ git commit -m "Fixed severe production problem"
[hotfix-1.2.1 abbe5d6] Fixed severe production problem
5 files changed, 32 insertions(+), 17 deletions(-)
```

#### 完成一个hotfix分支

当完成hotfix分支之后，对问题的修复工作需要合并回master分支，同时也需要合并回develop分支，以保证后续的版本发布已经包含解决问题的代码。这和release分支的完成方式是完全类似的。

首先，更新master分支并且并且为本次发布打上一个tag：

```
$ git checkout master
Switched to branch 'master'
$ git merge --no-ff hotfix-1.2.1
Merge made by recursive.
(Summary of changes)
$ git tag -a 1.2.1
```

当我们完成之后，对 bug 的修复需要合并回 master，同时也需要合并回 develop，以保证接下来的发布也都已经解决了这个 bug。这和 release 分支的完成方式是完全一样的。

首先，更新 master并为本次发布打一个 tag：

```
$ git checkout masterSwitched to branch 'master'
$ git merge --no-ff hotfix-1.2.1Merge made by recursive(Summary of changes)
$ git tag -a 1.2.1
```

**补充**：你也可以通过添加`-s`或`-u <key>`标记来打tag并进行加密签名。

然后，把修复的工作也合并回develop分支：

```
$ git checkout develop
Switched to branch 'develop'
$ git merge --no-ff hotfix-1.2.1
Merge made by recursive.
(Summary of changes)
```

这里有一个例外的规则是，如果当前已经存在一个release分支，那么hotfix分支上的变更需要合并到release分支而不是develop分支。因为当release分支完成之后，合并到release分支的修复工作最终也会合并到develop分支。（如果在develop分支中立刻就需要修复这个问题并且等不及release分支完成工作，那么你也可以安全地把修复工作合并到develop分支。）

最后，删除这个临时的hotfix分支：

```
$ git branch -d hotfix-1.2.1
Deleted branch hotfix-1.2.1 (was abbe5d6).
```

## 总结

虽然这个分支模型并没有让人感到特别新奇的东西，但是文章开头的那个“大图”确实对我们的项目有非常大的帮助。

它形成了一个优雅的思想模型，这个模型易于团队成员去理解，同时可以让团队成员对分支策略和发布流程形成共识。

*Last updated* *on* **2019-06-01** *by* **MarkoXu**
