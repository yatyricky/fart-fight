# XX多人博弈游戏

## 游戏流程

游戏可供2-多人进行。

所有玩家在**5秒**之内做出一个**动作**。你做出的动作，此时不对其他玩家可见，其他玩家的动作，也对你不可见。所有游戏动作将在固定时间点（5秒时）统一展现，并根据游戏规则进行结算。

游戏重复上述步骤，直到最终胜利者出现。

## 动作

动作 | 效果
---|---
蓄力 | 蓄力值+1
冲击波 | 有蓄力值时使用，**蓄力值**-1，攻击所有其他玩家；没有进行**格挡**或者**冲击波**的玩家判负出局
格挡 | 防御，抵挡一次**冲击波**的伤害
元气弹 | **蓄力值**-5，攻击所有其他玩家，无视格挡，无视冲击波，可以和其他玩家的**元气弹**相互抵消

最后剩下的玩家胜利。