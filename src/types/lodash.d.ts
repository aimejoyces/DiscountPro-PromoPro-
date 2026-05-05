declare module 'lodash' {
  export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait?: number,
    options?: any
  ): T & { cancel: () => void; flush: () => void };
  export function throttle<T extends (...args: any[]) => any>(
    func: T,
    wait?: number,
    options?: any
  ): T;
  export function cloneDeep<T>(value: T): T;
  export function merge<T>(object: T, ...otherArgs: any[]): T;
  export function pick<T, K extends keyof T>(object: T, ...paths: K[]): Pick<T, K>;
  export function omit<T, K extends keyof T>(object: T, ...paths: K[]): Omit<T, K>;
}
