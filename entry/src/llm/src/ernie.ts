import { http } from '@kit.NetworkKit';
import { util } from '@kit.ArkTS';
import { HTTPHeader } from '../types/utils';
import { AccessTokenResponse, ChatOptions, ChatResponse } from '../types/ernie';

/**
 * ERNIEBot 类
 */
class ERNIE {
  /**
   * 客户端ID
   */
  client_id: string;
  /**
   * 客户端密钥
   */
  client_secret: string;

  /**
   * 构造函数
   * @param client_id 客户端ID
   * @param client_secret 客户端密钥
   */
  constructor(client_id: string, client_secret: string) {
    this.client_id = client_id;
    this.client_secret = client_secret;
  }

  /**
   * 获取访问凭证
   * @returns 访问凭证
   */
  async getAccessToken(): Promise<AccessTokenResponse> {
    // 创建 HTTP 请求
    const httpRequest = http.createHttp();

    // 发送请求
    const response = await httpRequest.request(
      "https://aip.baidubce.com/oauth/2.0/token",
      {
        method: http.RequestMethod.GET,
        header: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        extraData: {
          "grant_type": "client_credentials",
          "client_id": this.client_id,
          "client_secret": this.client_secret
        },
        expectDataType: http.HttpDataType.OBJECT,
      });

    // 销毁 HTTP 请求
    httpRequest.destroy();

    // 返回结果
    return response.result as AccessTokenResponse;
  }

  /**
   * 聊天
   * @param model 模型
   * @param chat_options 对话选项
   * @returns 对话返回
   */
  chat(model: string, chat_options: ChatOptions): Promise<ChatResponse>;

  /**
   * 聊天（流式调用）
   * @param model 模型
   * @param chat_options 对话选项
   * @param callback 回调函数
   * @returns 对话返回
   */
  chat(model: string, chat_options: ChatOptions, callback: (response: ChatResponse) => void): Promise<number>;

  async chat(
    model: string,
    chat_options: ChatOptions,
    callback?: (response: ChatResponse) => void
  ): Promise<ChatResponse | number> {
    // 获取访问凭证
    const accessTokenResponse = await this.getAccessToken();
    const access_token = accessTokenResponse.access_token;

    // 创建 HTTP 请求
    const httpRequest = http.createHttp();

    // 请求地址
    const base_url = 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/';
    const url = base_url + model + '?access_token=' + access_token;

    // 请求头
    const headers: HTTPHeader = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    // 初始化返回数据
    let chatResponse: ChatResponse | number;

    // 判断是否为流式调用
    if (callback === undefined) {
      // 非流式调用
      chat_options.stream = false;

      // 发送请求
      const response = await httpRequest.request(
        url,
        {
          method: http.RequestMethod.POST,
          header: headers,
          extraData: chat_options,
          expectDataType: http.HttpDataType.OBJECT,
        });

      // 返回结果
      chatResponse = response.result as ChatResponse;
    } else {
      // 流式调用
      chat_options.stream = true;

      // 文本解码器
      const decoder = util.TextDecoder.create("utf-8");

      // 监听返回数据
      httpRequest.on("dataReceive", (data: ArrayBuffer) => {
        // 解码返回数据
        const dataUint8Array = new Uint8Array(data);
        const results = decoder.decodeToString(dataUint8Array);

        // 分割返回数据
        const resultsArray = results.split('data: ');

        // 遍历返回数据
        for (let i = 0; i < resultsArray.length; i++) {
          // JSON 解析
          const response: ChatResponse = JSON.parse(resultsArray[i]);

          // 调用回调函数
          callback(response);
        }
      });

      // 发送请求
      chatResponse = await httpRequest.requestInStream(
        url,
        {
          method: http.RequestMethod.POST,
          header: headers,
          extraData: chat_options,
          expectDataType: http.HttpDataType.OBJECT,
        });
    }

    // 销毁 HTTP 请求
    httpRequest.destroy();

    // 返回结果
    return chatResponse;
  }
}


export { ERNIE };