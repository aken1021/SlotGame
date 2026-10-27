export type Unsubscribe = () => void;
/** Scoped subscriptions; observer exceptions never change a settled game action. */
export class EventBus<Events extends object> {
  private readonly listeners = new Map<keyof Events, Set<(value: never) => void>>();
  on<K extends keyof Events>(key: K, listener: (value: Events[K]) => void): Unsubscribe {
    let group = this.listeners.get(key);
    if (!group) { group = new Set(); this.listeners.set(key, group); }
    const entry = listener as (value: never) => void;
    group.add(entry);
    let subscribed = true;
    return () => {
      if (!subscribed) return;
      subscribed = false; group.delete(entry);
      if (!group.size && this.listeners.get(key) === group) this.listeners.delete(key);
    };
  }
  once<K extends keyof Events>(key: K, listener: (value: Events[K]) => void): Unsubscribe {
    const off = this.on(key, value => { off(); listener(value); });
    return off;
  }
  emit<K extends keyof Events>(key: K, value: Events[K]): readonly unknown[] {
    const errors: unknown[] = [];
    for (const listener of [...(this.listeners.get(key) ?? [])]) {
      try { listener(value as never); } catch (error) { errors.push(error); }
    }
    return errors;
  }
  clear(): void { this.listeners.clear(); }
}
export class Scope {
  private callbacks: Unsubscribe[] = [];
  private closed = false;
  add(dispose: Unsubscribe): void { if (this.closed) dispose(); else this.callbacks.push(dispose); }
  dispose(): void {
    if (this.closed) return;
    this.closed = true;
    const errors: unknown[] = [];
    for (const callback of this.callbacks.splice(0).reverse()) {
      try { callback(); } catch (error) { errors.push(error); }
    }
    if (errors.length) throw new Error(`Scope cleanup failed (${errors.length})`);
  }
}
