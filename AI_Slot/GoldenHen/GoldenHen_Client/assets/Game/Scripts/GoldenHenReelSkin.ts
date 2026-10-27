import {_decorator, Component, Rect, ResolutionPolicy, SpriteFrame, view} from 'cc';
import {CocosReelColumn} from '../../scripts/common/cocos/CocosReelColumn';

const {ccclass, property, executeInEditMode, executionOrder} = _decorator;

/** Atlas rectangles are Cocos sprite frames; the original AI bitmap is never modified. */
@ccclass('GoldenHenReelSkin')
@executeInEditMode
@executionOrder(-100)
export class GoldenHenReelSkin extends Component {
  @property(SpriteFrame) sheet: SpriteFrame | null = null;
  @property([CocosReelColumn]) columns: CocosReelColumn[] = [];
  private frames: SpriteFrame[] = [];
  onLoad(): void {
    if (!this.sheet?.texture) return;
    view.setDesignResolutionSize(1280, 720, ResolutionPolicy.SHOW_ALL);
    const texture = this.sheet.texture;
    const w = texture.width / 3, h = texture.height / 2;
    if (!Number.isInteger(w) || !Number.isInteger(h)) throw new Error('Symbol sheet must be a 3 by 2 grid');
    this.frames = Array.from({length: 6}, (_, index) => {
      const frame = new SpriteFrame();
      frame.texture = texture;
      // Exclude atlas tile edges where generated neighboring highlights can bleed.
      const inset = 32;
      frame.rect = new Rect((index % 3) * w + inset, Math.floor(index / 3) * h + inset, w - inset * 2, h - inset * 2);
      frame.packable = false;
      return frame;
    });
    const ids = [15, 16, 17, 18, 14, 1, 19, 20, 21, 22, 23, 24, 2, 10, 11, 12, 13];
    const names = ['', '', '', '', '', '', 'A', 'K', 'Q', 'J', '10', '9', 'SCATTER', '金雞(金)', '玉佩(金)', '元寶(金)', '鞭炮(金)'];
    const preview = [[15, 14, 17], [16, 1, 18], [14, 15, 16], [17, 18, 14], [1, 16, 15]];
    this.columns.forEach((column, index) => {
      column.symbolIds = [...ids]; column.symbolNames = [...names]; column.symbolFrames = this.frames;
      column.snap(preview[index] ?? [15, 16, 17]);
    });
  }
  onDestroy(): void {
    this.columns.forEach(column => { column.symbolFrames = []; });
    this.frames.forEach(frame => frame.destroy()); this.frames = [];
  }
}
