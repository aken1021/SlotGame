import {_decorator, CCInteger, CCString, Component, Label, Sprite, SpriteFrame} from 'cc';
import {ReelMotion} from '../presentation';
import {delay, throwIfAborted} from '../timing';

const {ccclass, property} = _decorator;

/** Label placeholders can be replaced by symbol sprites without changing the common flow. */
@ccclass('AISlotReelColumn')
export class CocosReelColumn extends Component {
  @property([Label]) cells: Label[] = [];
  @property([Sprite]) symbolSprites: Sprite[] = [];
  @property([CCInteger]) symbolIds: number[] = [];
  @property([SpriteFrame]) symbolFrames: SpriteFrame[] = [];
  @property([CCString]) symbolNames: string[] = [];
  @property(Label) bufferCell: Label | null = null;
  @property(Sprite) bufferSprite: Sprite | null = null;
  @property speed = 900;
  @property cellHeight = 120;
  @property stopDuration = 0.1;
  private motion: ReelMotion | null = null;
  private homes: {x: number; y: number; z: number}[] = [];
  private bufferHome: {x: number; y: number; z: number} | null = null;
  begin(strip: readonly number[]): void {
    this.homes = this.cells.map(cell => ({x: cell.node.position.x, y: cell.node.position.y, z: cell.node.position.z}));
    if (this.bufferCell) {
      const p = this.bufferCell.node.position;
      this.bufferHome = {x: p.x, y: p.y, z: p.z};
      this.bufferCell.node.active = true;
    }
    this.motion = new ReelMotion(strip, this.cellHeight, this.speed);
  }
  update(dt: number): void {
    if (!this.motion || !this.cells.length) return;
    const frame = this.motion.tick(dt, this.cells.length);
    this.cells.forEach((cell, index) => {
      this.renderSymbol(cell, this.symbolSprites[index], frame.symbols[this.cells.length - 1 - index]!);
      const home = this.homes[index];
      if (home) cell.node.setPosition(home.x, home.y - frame.offset, home.z);
    });
    if (this.bufferCell && this.bufferHome) {
      this.renderSymbol(this.bufferCell, this.bufferSprite ?? undefined, frame.symbols[this.cells.length]!);
      this.bufferCell.node.setPosition(this.bufferHome.x, this.bufferHome.y - frame.offset, this.bufferHome.z);
    }
  }
  async stopAt(symbols: readonly number[], signal: AbortSignal): Promise<void> {
    await delay(this.stopDuration * 1000, signal);
    throwIfAborted(signal);
    this.snap(symbols);
  }
  snap(symbols: readonly number[]): void {
    this.cancel();
    if (symbols.length !== this.cells.length) throw new Error('Reel visible row count differs from scene labels');
    this.cells.forEach((cell, index) => this.renderSymbol(cell, this.symbolSprites[index], symbols[index]!));
  }
  cancel(): void {
    this.motion = null;
    this.cells.forEach((cell, index) => { const home = this.homes[index]; if (home) cell.node.setPosition(home.x, home.y, home.z); });
    this.homes = [];
    if (this.bufferCell) {
      if (this.bufferHome) this.bufferCell.node.setPosition(this.bufferHome.x, this.bufferHome.y, this.bufferHome.z);
      this.bufferCell.node.active = false;
    }
    this.bufferHome = null;
  }
  private renderSymbol(label: Label, sprite: Sprite | undefined, id: number): void {
    const index = this.symbolIds.indexOf(id);
    const frame = this.symbolFrames[index];
    label.string = this.symbolNames[index] || String(id);
    label.enabled = !sprite || !frame;
    if (sprite) { sprite.enabled = !!frame; if (frame) sprite.spriteFrame = frame; }
  }
  onDestroy(): void { this.cancel(); }
}
