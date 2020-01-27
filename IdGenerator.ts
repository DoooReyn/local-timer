/**
 * 运行时Id生成器
 */
class __IdGenerator {
  private id: number = 0;
  private category: string = "";

  /**
   * Id生成器构造器
   * @param category 类型
   */
  constructor(category: string) {
    this.category = category || "default";
    this.id = 0 | (Math.random() * 998);
  }

  /**
   * 获取新的id
   */
  next() {
    return this.category + "." + ++this.id;
  }
}

export namespace IdGenerator {
  export let timer = new __IdGenerator("timer");
}
