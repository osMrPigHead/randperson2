# osMrPigHead/randperson2

一个 Electron 写的随机挑人小程序

数据存储在主程序同目录下 [`data/config.json`](data/config.json)，说明如下：

### `config.json`

```json lines
{
  "ssr": {  // SSR 相关信息
    "count": 0,  // SSR 保底计数，由程序记录
    "probability": 0.01,  // SSR 初概率
    "lift": 60,  // 要获得概率提升，需要抽卡次数
    "max": 80,  // 保底次数
    "saveExcluded": false,  // 下次打开程序时不会抽取到本次已抽过的人
    "list": [  // 名单
      "SSR"
    ]
  },
  "list": [  // 名单
    [
      "Badge",  // 徽章
      "Name"  // 名称
    ]
  ],
  "saveExcluded": false
}
```
