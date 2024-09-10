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
    const httpRequest = http.createHttp();

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

    httpRequest.destroy();

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
    const accessTokenResponse = await this.getAccessToken();
    const access_token = accessTokenResponse.access_token;
    const httpRequest = http.createHttp();

    const base_url = 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/';
    const url = base_url + model + '?access_token=' + access_token;
    const headers: HTTPHeader = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    let chatResponse: ChatResponse | number;

    if (callback === undefined) {
      chat_options.stream = false;
      const response = await httpRequest.request(
        url,
        {
          method: http.RequestMethod.POST,
          header: headers,
          extraData: chat_options,
          expectDataType: http.HttpDataType.OBJECT,
        });
      chatResponse = response.result as ChatResponse;
    } else {
      chat_options.stream = true;
      const decoder = util.TextDecoder.create("utf-8");
      httpRequest.on("dataReceive", (data: ArrayBuffer) => {
        const dataUint8Array = new Uint8Array(data);
        const results = decoder.decodeToString(dataUint8Array);
        const resultsArray = results.split('data: ');
        for (let i = 0; i < resultsArray.length; i++) {
          if (resultsArray[i].length > 0) {
            const response: ChatResponse = JSON.parse(resultsArray[i]);
            callback(response);
          }
        }
      });

      chatResponse = await httpRequest.requestInStream(
        url,
        {
          method: http.RequestMethod.POST,
          header: headers,
          extraData: chat_options,
          expectDataType: http.HttpDataType.OBJECT,
        });
    }

    httpRequest.destroy();
    return chatResponse;
  }
}


export { ERNIE };