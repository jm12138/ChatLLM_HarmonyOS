/**
 * Access Token 返回接口
 */
interface AccessTokenResponse {
  /**
   * 访问凭证
   */
  access_token: string;

  /**
   * 有效期，Access Token的有效期 说明：单位是秒，有效期30天
   */
  expires_in: number;

  /**
   * 错误码 说明：响应失败时返回该字段，成功时不返回
   */
  error?: string;

  /**
   * 错误描述信息，帮助理解和解决发生的错误 说明：响应失败时返回该字段，成功时不返回
   */
  error_description?: string;

  /**
   * 暂时未使用，可忽略
   */
  session_key?: string;

  /**
   * 暂时未使用，可忽略
   */
  refresh_token?: string;

  /**
   * 暂时未使用，可忽略
   */
  scope?: string;

  /**
   * 暂时未使用，可忽略
   */
  session_secret?: string;
}

/**
 * 消息接口
 */
interface Message {
  /**
   * 当前支持以下： user: 表示用户 assistant: 表示对话助手
   */
  role: 'user' | 'assistant';

  /**
   * 对话内容，不能为空
   */
  content: string;
}


/**
 * 对话选项接口
 */
interface ChatOptions {
  /**
   * 聊天上下文信息。说明：
   *
   * （1）messages成员不能为空，1个成员表示单轮对话，多个成员表示多轮对话
   *
   * （2）最后一个message为当前请求的信息，前面的message为历史对话信息
   *
   * （3）必须为奇数个成员，成员中message的role必须依次为user、assistant
   *
   * （4）message中的content总长度和system字段总内容不能超过24000个字符，且不能超过6144 tokens
   */
  messages: Array<Message>;

  /**
   * 是否以流式接口的形式返回数据，默认false
   */
  stream ?: boolean;

  /**
   * 说明：
   *
   * （1）较高的数值会使输出更加随机，而较低的数值会使其更加集中和确定
   *
   * （2）默认0.95，范围 (0, 1.0]，不能为0
   */
  temperature?: number;

  /**
   * 说明：
   *
   * （1）影响输出文本的多样性，取值越大，生成文本的多样性越强
   *
   * （2）默认0.7，取值范围 [0, 1.0]
   */
  top_p?: number;

  /**
   * 通过对已生成的token增加惩罚，减少重复生成的现象。说明：
   *
   * （1）值越大表示惩罚越大
   *
   * （2）默认1.0，取值范围：[1.0, 2.0]
   */
  penalty_score?: number;

  /**
   * 模型人设，主要用于人设设定，例如：你是xxx公司制作的AI助手，说明：
   *
   * （1）长度限制，message中的content总长度和system字段总内容不能超过24000个字符，且不能超过6144 tokens
   */
  system?: string;

  /**
   * 生成停止标识，当模型生成结果以stop中某个元素结尾时，停止文本生成。说明：
   *
   * （1）每个元素长度不超过20字符 （2）最多4个元素
   */
  stop?: Array<string>;

  /**
   * 指定模型最小输出token数，说明：该参数取值范围[2, 2048]
   */
  min_output_tokens?: number;

  /**
   * 指定模型最大输出token数，说明：
   *
   * （1）如果设置此参数，范围[2, 2048]
   *
   * （2）如果不设置此参数，最大输出token数为1024
   */
  max_output_tokens?: number;

  /**
   * 正值根据迄今为止文本中的现有频率对新token进行惩罚，从而降低模型逐字重复同一行的可能性；说明：默认0.1，取值范围[-2.0, 2.0]
   */
  frequency_penalty?: number;

  /**
   * 正值根据token记目前是否出现在文本中来对其进行惩罚，从而增加模型谈论新主题的可能性；说明：默认0.0，取值范围[-2.0, 2.0]
   */
  presence_penalty?: number;

  /**
   * 表示最终用户的唯一标识符
   */
  user_id?: string;
}

/**
 * token统计信息
 */
interface Usage {
  /**
   * 问题tokens数
   */
  prompt_tokens: number;

  /**
   * 回答tokens数
   */
  completion_tokens: number;

  /**
   * tokens总数
   */
  total_tokens: number;
}


/**
 * 对话返回接口
 */
interface ChatResponse {
  /**
   * 本轮对话的id
   */
  id: string;

  /**
   * 回包类型 chat.completion：多轮对话返回
   */
  object: string;

  /**
   * 时间戳
   */
  created: number;

  /**
   * 表示当前子句的序号。只有在流式接口模式下会返回该字段
   */
  sentence_id: number;

  /**
   * 表示当前子句是否是最后一句。只有在流式接口模式下会返回该字段
   */
  is_end: boolean;

  /**
   * 当前生成的结果是否被截断
   */
  is_truncated: boolean;

  /**
   * 对话返回结果
   */
  result: string;

  /**
   * 表示用户输入是否存在安全风险，是否关闭当前会话，清理历史会话信息。
   *
   * true：是，表示用户输入存在安全风险，建议关闭当前会话，清理历史会话信息。
   *
   * false：否，表示用户输入无安全风险
   */
  need_clear_history: boolean;

  /**
   * 当need_clear_history为true时，此字段会告知第几轮对话有敏感信息，如果是当前问题，ban_round=-1
   */
  ban_round: number;

  /**
   * token统计信息
   */
  usage: Usage;
}


/**
 * HTTP 请求头接口
 */
interface HTTPHeader {
  /**
   * 请求头中的Content-Type字段
   */
  'Content-Type': string;

  /**
   * 请求头中的Accept字段
   */
  'Accept': string;
}

export {
  AccessTokenResponse, ChatOptions, ChatResponse, HTTPHeader, Message, Usage
};