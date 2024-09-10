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

export { HTTPHeader };