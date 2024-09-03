import { ERNIEBot, ChatOptions, ChatResponse, Message } from './ernie';

@Entry
@Component
struct Index {
  /**
   * 消息
   */
  @State message: string = '';
  /**
   * 消息列表
   */
  @State messages: Message[] = []
  /**
   * 模型名称，默认为 ernie_speed
   */
  @State model: string = 'ernie_speed'
  /**
   * 模型列表
   */
  model_list = ["ernie_speed", "ernie-speed-128k", "ernie-lite-8k", "ernie-tiny-8k"];
  /**
   * 模型选项
   */
  model_options = this.model_list.map(item => ({ value: item } as SelectOption));
  /**
   * 客户端 ID
   */
  client_id = "";
  /**
   * 客户端密钥
   */
  client_secret = "";
  /**
   * ERNIE Bot 实例
   */
  bot = new ERNIEBot(this.client_id, this.client_secret);
  /**
   * 聊天回调函数（异步）
   */
  ChatCallback = async () => {
    if (this.message === '') {
      return;
    }
    this.messages.push(
      {
        role: 'user',
        content: this.message
      },
      {
        role: 'assistant',
        content: ''
      });
    const index = this.messages.length - 1;
    this.message = '';
    const chat_options: ChatOptions = {
      messages: this.messages.slice(0, index)
    };
    await this.bot.chat(this.model, chat_options,
      (response: ChatResponse) => {
        this.messages[index] = {
          role: 'assistant',
          content: this.messages[index].content + response.result
        }
      });
  }

  /**
   * 组件构建函数
   */
  build() {
    /**
     * 垂直方向布局
     */
    Column() {

      /**
       * 下拉选择框，用于选择模型
       */
      Select(this.model_options)
        .value($$this.model)
        .selected(0)
        .height(50)

      /**
       * 消息列表，用于展示聊天记录
       */
      List() {
        ForEach(this.messages, (message: Message) => {
          ListItem() {
            if (message.role === 'user') {
              Row() {
                Text(message.content)
                  .backgroundColor('green')
                  .border(
                    {
                      radius: 10
                    }
                  )
                  .padding('2%')
                  .margin('1%')
              }
              .justifyContent(FlexAlign.End)
              .width('100%')
            } else {
              Text(message.content)
                .backgroundColor('gray')
                .border(
                  {
                    radius: 10
                  }
                )
                .padding('2%')
                .margin('1%')
            }
          }
        })
      }.height('calc(98% - 100vp)')

      Blank()

      /**
       * 输入框和发送按钮
       */
      Row() {
        TextInput({
          text: $$this.message,

        })
          .onSubmit(this.ChatCallback)
          .height(48)
          .margin({
            right: '2%',
          }).width('90%')
        Image($r('app.media.send'))
          .width("8%")
          .onClick(this.ChatCallback)

      }
      .height(50)
      .width('100%')
    }.height('100%')
    .padding('2%')
  }
}