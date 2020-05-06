# mini-status

中文 | [English](./README-en_US.md)

微信小程序miniStatus的后端程序

## 介绍

miniStatus是一个美观可定制主题的服务器监控小程序，可实现小程序与服务器的点对点连接，展示服务器基本运行状态，这个项目是其对应的后端程序。

### miniStatus小程序预览

**节点列表界面**

![节点列表界面](https://i.loli.net/2020/05/06/WjAp2KxGivHIk43.jpg)

**自定义主题样式界面**

![自定义主题样式界面](https://i.loli.net/2020/05/06/Bi8PF9hncOMR1y2.jpg)


## 特点

- 直接通过小程序和服务器的点对点连接，数据不经过第三方中转
- 不要求服务器域名备案，可以直接使用域名，甚至局域网地址

## 安装

```
npm install mini-status -g
```

## 使用

### 命令行参数

```
usage: mini-status [-h] [-v] [-u URI] [-a ADDRESS] [-p PASSWORD]

miniStatus backend program

Optional arguments:
  -h, --help            Show this help message and exit.
  -v, --version         Show program's version number and exit.
  -u URI, --uri URI     uri for api, default '/update'
  -a ADDRESS, --address ADDRESS
                        address to listen, default 0.0.0.0:8080
  -p PASSWORD, --password PASSWORD
                        access password, default 1234567890
```

### 配置微信小程序

![配置微信小程序](https://i.loli.net/2020/05/06/h1A4XIS5ytibpnw.jpg)



## 原理

这是一个黑魔法（hhh开玩笑

原理很简单，是巧妙运用了[小程序image组件](https://developers.weixin.qq.com/miniprogram/dev/component/image.html)的bindload接口，当图片加载成功时会返回图片的宽和高。也就是说一个图片能够返回两个数值，前后端约定好请求API后可以动态创建image获取一系列数值。

注意这个接口是不要求图片地址是备案域名，不用在小程序开发信息中报备。但是这种信息传递方式比较低下，只适合传递少量的信息。所以拿来做了这个点对点的服务器监控小程序。

但是直接传递大体积的二进制图片很浪费带宽，解决方案是后端动态生成svg图片。也就是说，动态返回下面这种形式的文字信息：

```
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"></svg>
```

详细的实现可以看[这个文件](./wxImagePing.js)

## FAQ