# ChatLLM_HarmonyOS
## 项目简介
* 一个基于 HarmonyOS Next 平台的类 ChatGPT 应用 Demo，支持接入 ERNIE、ChatGLM、Spark 等多种智能对话 API。

## 应用演示
* 简单的对话演示

    * ![APP演示](https://i-blog.csdnimg.cn/direct/ae48d62182a344f9b3699ca76bdd703d.gif)

## 功能特性
- 接入 ERNIE 文心一言 API 接口

- 接入 OpenAI like APIs，以支持 ChatGPT、ChatGLM、Spark、Deepseek 等 API 接口 [TODO]

## 快速开始
1. 启动 DevEco Studio

2. 从 VCS 获取

3. URL：https://github.com/jm12138/ChatLLM_HarmonyOS

4. 点击克隆 Clone


## 项目配置
* [Index.ets](./entry/src/main/ets/pages/Index.ets) 中配置 ERNIE API 的 client_id 和 client_secret

    ```ts
    client_id = "your_client_id"

    client_secret = "your_client_secret"
    ```

## 运行调试
* 请在虚拟机或真机上运行，预览器无法正确解码网络请求结果。