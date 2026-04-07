/**
 * 性能计时工具
 * 
 * 通过环境变量 STEEDOS_PERF_TIMING 控制:
 *   - 'true': 启用性能日志
 *   - 其他值或未设置: 禁用
 * 
 * 用法:
 *   const timer = new PerfTimer('space_users.update');
 *   await doSomething();
 *   timer.mark('beforeTriggers');
 *   await doMore();
 *   timer.mark('afterTriggers');
 *   timer.done(); // 打印汇总日志
 * 
 *   // 单步计时
 *   const elapsed = await PerfTimer.time('space_users.beforeUpdate trigger "xxx"', async () => {
 *     await runTrigger();
 *   });
 */

export function isPerfTimingEnabled(): boolean {
  return process.env.STEEDOS_PERF_TIMING === 'true';
}

export class PerfTimer {
  private label: string;
  private enabled: boolean;
  private marks: Record<string, number> = {};
  private lastTs: number;

  constructor(label: string) {
    this.enabled = isPerfTimingEnabled();
    this.label = label;
    if (this.enabled) {
      this.lastTs = Date.now();
    }
  }

  /** 记录自上次 mark/构造 以来经过的时间 */
  mark(name: string): void {
    if (!this.enabled) return;
    const now = Date.now();
    this.marks[name] = now - this.lastTs;
    this.lastTs = now;
  }

  /** 打印汇总日志并返回所有标记 */
  done(): Record<string, number> | null {
    if (!this.enabled) return null;
    const total = Object.values(this.marks).reduce((a, b) => a + b, 0);
    const detail = Object.entries(this.marks).map(([k, v]) => `${k}=${v}ms`).join(', ');
    console.log(`[Timing] ${this.label} total=${total}ms | ${detail}`);
    return this.marks;
  }

  /** 计时单个异步操作，超过阈值则打印日志。返回操作结果 */
  static async time<T>(label: string, fn: () => Promise<T>, threshold = 50): Promise<T> {
    if (!isPerfTimingEnabled()) {
      return fn();
    }
    const t0 = Date.now();
    const result = await fn();
    const elapsed = Date.now() - t0;
    if (elapsed > threshold) {
      console.log(`[Timing] ${label} took ${elapsed}ms`);
    }
    return result;
  }
}
