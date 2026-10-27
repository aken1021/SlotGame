import {ClientError} from './model';

/** Shared loads, explicit ownership, failed loads retryable; late assets released after dispose. */
export class ResourceCache<T> {
  private readonly entries = new Map<string, Promise<T>>();
  private disposed = false;
  constructor(private readonly loadAsset: (key: string) => Promise<T>, private readonly releaseAsset: (asset: T) => void) {}
  async get(key: string): Promise<T> {
    if (this.disposed) throw new ClientError('Resource cache disposed', 'DISPOSED');
    let entry = this.entries.get(key);
    if (!entry) {
      entry = Promise.resolve().then(() => this.loadAsset(key));
      this.entries.set(key, entry);
      entry.catch(() => { if (this.entries.get(key) === entry) this.entries.delete(key); });
    }
    const value = await entry;
    if (this.disposed) throw new ClientError('Resource cache disposed while loading', 'DISPOSED');
    return value;
  }
  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    for (const entry of this.entries.values()) void entry.then(value => this.releaseAsset(value), () => {});
    this.entries.clear();
  }
}
export interface AudioPort {
  music(key: string, loop: boolean): void;
  effect(key: string): void;
  stopMusic(): void;
  setMuted(muted: boolean): void;
}
export class AudioController {
  private current: string | null = null;
  private muted = false;
  constructor(private readonly port: AudioPort) {}
  playMusic(key: string): void { if (key === this.current) return; this.current = key; this.port.music(key, true); }
  playEffect(key: string): void { if (!this.muted) this.port.effect(key); }
  setMuted(value: boolean): void { this.muted = value; this.port.setMuted(value); }
  dispose(): void { this.current = null; this.port.stopMusic(); }
}
