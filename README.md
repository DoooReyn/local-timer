# local-timer

**[CN]** 基于本地时间的定时器

**[EN]** Timer based on local time


## API

- constructor : 构造器
```javascript
  /**
   * 定时器构造器
   * @summary 构造时使用秒为单位，实际会转换成毫秒
   * @param callback 定时器回调
   * @param call_interval 定时器调用间隔
   * @param stop_after 停止时间
   * @param call_after 延迟时间
   */
  constructor(
    callback: Function,
    call_interval: number,
    stop_after: number,
    call_after?: number,
    stop_callback?: Function
  )
```
- start : 启动定时器
- pause : 暂停定时器
- resume : 恢复定时器
- stop : 停止计时器
- restart : 重启定时器
- elapse : 当前计时
- rest : 剩余计时


## Example
```javascript
import Timer from "./Timer"
new Timer(
  function callback(timer: Timer) {
    console.log(timer.elapse / 1000 + "s");
  },
  1,
  10,
  0,
  function onStop(timer: Timer) {
    timer.restart();
  }
).start();
```
