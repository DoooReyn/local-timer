import { IdGenerator } from "./IdGenerator";

/**
 * 基于本地时间的定时器
 */
export default class Timer {
  //定时器标识
  public category: string;
  //已经计时
  private time_elapse: number;
  //心跳计时器
  private tick_counter: any;
  //记录开始时间
  private start_at: number;
  //毫秒后调用
  private call_after: number;
  //毫秒后暂停
  private stop_after: number;
  //计时间隔
  private call_interval: number;
  //计时回调
  private callback: Function;
  //计时回调
  private stop_callback: Function;
  //运行状态
  private state: "ready" | "running" | "paused" | "stopped";

  /**
   * 定时器构造器
   * @summary 构造时使用秒为单位，实际会转换成毫秒
   * @param callback 定时器回调
   * @param call_interval 定时器调用间隔(s)
   * @param stop_after 停止时间(s)
   * @param call_after 延迟时间(s)
   */
  constructor(
    callback: Function,
    call_interval: number,
    stop_after: number,
    call_after?: number,
    stop_callback?: Function
  ) {
    this.category = IdGenerator.timer.next();
    this.callback = callback;
    this.call_interval = call_interval * 1000;
    this.stop_after = stop_after * 1000;
    this.call_after = (call_after || 0) * 1000;
    this.stop_callback = stop_callback || idleHandler;
    this.reset();
  }

  /**
   * 重启定时器
   */
  restart() {
    this.stop();
    this.reset();
    this.start();
  }

  /**
   * 启动定时器
   */
  start() {
    if (this.tick_counter !== null) {
      return;
    }
    let time_out_id = setTimeout(() => {
      clearTimeout(time_out_id);
      this.start_at = this.now();
      this.state = "running";
      this.dump();
      this.tick_counter = setInterval(() => {
        if (this.state === "running") {
          this.callback(this);
          if (this.elapse >= this.stop_after) {
            this.stop();
            this.stop_callback(this);
          }
        }
      }, this.call_interval);
    }, this.call_after);
  }

  /**
   * 当前时间
   */
  private now(): number {
    return Date.now().valueOf();
  }

  /**
   * 获得当前计时(ms)
   * @returns number 当前计时(ms)
   */
  get elapse(): number {
    let elapse = 0;
    if (this.state === "running") {
      elapse = this.time_elapse + this.now() - this.start_at;
    } else {
      elapse = this.time_elapse;
    }
    return Math.min(elapse, this.stop_after);
  }

  /**
   * 获得剩余计时(ms)
   * @returns number 剩余计时(ms)
   */
  get rest(): number {
    return this.stop_after - this.elapse;
  }

  /**
   * 重置定时器
   */
  private reset() {
    if (this.tick_counter !== null) {
      clearInterval(this.tick_counter);
    }
    this.state = "ready";
    this.start_at = this.now();
    this.time_elapse = 0;
    this.tick_counter = null;
  }

  /**
   * 暂停定时器
   */
  pause() {
    if (this.state === "running") {
      this.time_elapse += this.now() - this.start_at;
      this.state = "paused";
      this.dump();
    }
  }

  /**
   * 恢复定时器
   */
  resume() {
    if (this.state === "paused") {
      this.start_at = this.now();
      this.state = "running";
      this.dump();
    }
  }

  /**
   * 停止计时器
   */
  stop() {
    if (this.state !== "stopped") {
      clearInterval(this.tick_counter);
      this.tick_counter = null;
      this.time_elapse += this.now() - this.start_at;
      this.time_elapse = Math.min(this.stop_after, this.time_elapse);
      this.start_at = this.now();
      this.state = "stopped";
      this.dump();
    }
  }

  //输出定时器信息
  dump() {
    let data = [
      `状态：${this.state}`,
      `当前计时: ${this.elapse}ms`,
      `剩余计时: ${this.rest}ms`
    ];
    console.group(`@定时器${this.category}信息`)
    console.log(...data);
    console.groupEnd();
  }
}

export { Timer };
