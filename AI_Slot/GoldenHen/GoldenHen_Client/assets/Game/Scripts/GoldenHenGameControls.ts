import {_decorator, Button, Color, Component, Graphics, Label, Node, UITransform} from 'cc';
import {CocosSlotDriver} from '../../scripts/common/cocos/CocosSlotDriver';
import {Snapshot} from '../../scripts/common/model';
import {formatAmount} from '../../scripts/common/money';
import {Scope} from '../../scripts/common/events';

const {ccclass} = _decorator;

/** Minimal local-development controls. Decisions and payouts remain on the Go server. */
@ccclass('GoldenHenGameControls')
export class GoldenHenGameControls extends Component {
  private readonly scope = new Scope();
  private driver: CocosSlotDriver | null = null;
  private overlay: Node | null = null;
  private title: Label | null = null;
  private advance: Button | null = null;
  private bet: Button | null = null;
  private betText: Label | null = null;
  private eggs: Button[] = [];
  private eggLabels: Label[] = [];
  private generated: Node[] = [];

  start(): void {
    this.driver = this.getComponent(CocosSlotDriver);
    const client = this.driver?.client;
    if (!client) throw new Error('GoldenHen controls require an initialized AISlotDriver');
    const bet = this.button(this.node, 'ChangeBet', -365, -255, 240, 34, '切換押注', () => {
      const state = client.snapshot;
      if (!state || !client.input.canChangeBet) return;
      const index = state.bets.findIndex(b => b.lineBet === client.selectedBet?.lineBet);
      const next = state.bets[(index + 1) % state.bets.length];
      if (next) this.driver?.chooseBet(next.lineBet);
    });
    this.bet = bet.button; this.betText = bet.label; this.generated.push(bet.node);
    this.overlay = this.makeNode(this.node, 'DevelopmentSpecialControls', 0, -18, 990, 430);
    this.generated.push(this.overlay);
    const backdrop = this.overlay.addComponent(Graphics);
    backdrop.fillColor = new Color(35, 8, 10, 245); backdrop.roundRect(-495, -215, 990, 430, 18); backdrop.fill();
    this.title = this.text(this.overlay, 'SpecialTitle', 0, 170, 900, 44, '', 28);
    const advance = this.button(this.overlay, 'NextSpecial', 0, -35, 300, 65, '開始', () => { void this.driver?.nextSpecial(null); });
    this.advance = advance.button;
    for (let i = 0; i < 18; i++) {
      const egg = this.button(this.overlay, `Egg_${i}`, (i % 6 - 2.5) * 145, 85 - Math.floor(i / 6) * 100, 125, 78, `金蛋 ${i + 1}`, () => {
        void this.driver?.nextSpecial({'1': i});
      });
      this.eggs.push(egg.button); this.eggLabels.push(egg.label);
    }
    this.overlay.active = false;
    const render = () => this.render(client.snapshot);
    this.scope.add(client.events.on('state', render));
    this.scope.add(client.events.on('settled', render));
    this.scope.add(client.events.on('bet', render));
    this.scope.add(client.events.on('input', render));
    this.scope.add(client.events.on('error', error => {
      const status = this.driver?.statusLabel;
      if (status) status.string = `連線／操作失敗：${error instanceof Error ? error.message : String(error)} · 按連線重試`;
    }));
    render();
  }

  private render(snapshot: Snapshot | null): void {
    const client = this.driver?.client;
    if (!client || !this.overlay || !this.advance || !this.title || !this.bet || !this.betText) return;
    this.bet.interactable = client.input.canChangeBet;
    this.betText.string = client.selectedBet ? `押注 ${formatAmount(client.selectedBet.totalBet)} · 切換` : '等待連線';
    const sg = snapshot?.special;
    this.overlay.active = !!sg;
    if (!sg) return;
    const backdrop = this.overlay.getComponent(Graphics);
    if (backdrop) backdrop.enabled = sg.id === 1;
    this.title.node.setPosition(0, sg.id === 0 ? 220 : 170);
    this.advance.node.setPosition(0, sg.id === 0 ? -237 : -35);
    const actionable = client.input.canSpecialAction;
    this.advance.node.active = sg.id === 0 || sg.stage === 'init';
    this.advance.interactable = actionable;
    const caption = this.advance.node.getChildByName('Text')?.getComponent(Label);
    if (caption) caption.string = sg.stage === 'init' ? '開始特殊遊戲' : '下一次免費旋轉';
    this.title.string = sg.id === 0 ? `免費旋轉 · 剩餘 ${sg.remaining} / ${sg.total}` : '砸金蛋 · 同色集滿 3 個得獎';
    this.eggs.forEach((egg, index) => {
      egg.node.active = sg.id === 1 && sg.stage !== 'init';
      const tier = sg.picks?.[index] ?? -1;
      egg.interactable = actionable && tier === -1;
      const label = this.eggLabels[index];
      if (label) label.string = tier < 0 ? `金蛋 ${index + 1}` : ['GRAND', 'MAJOR', 'MINOR', 'MINI'][tier] ?? '?';
    });
  }

  private makeNode(parent: Node, name: string, x: number, y: number, w: number, h: number): Node {
    const node = new Node(name); node.layer = parent.layer; node.setParent(parent); node.setPosition(x, y);
    node.addComponent(UITransform).setContentSize(w, h); return node;
  }
  private text(parent: Node, name: string, x: number, y: number, w: number, h: number, value: string, size: number): Label {
    const label = this.makeNode(parent, name, x, y, w, h).addComponent(Label);
    label.string = value; label.fontSize = size; label.lineHeight = size + 4;
    label.horizontalAlign = Label.HorizontalAlign.CENTER; label.verticalAlign = Label.VerticalAlign.CENTER;
    label.color = new Color(255, 222, 151); return label;
  }
  private button(parent: Node, name: string, x: number, y: number, w: number, h: number, text: string, onClick: () => void): {node: Node; button: Button; label: Label} {
    const node = this.makeNode(parent, name, x, y, w, h);
    const graphics = node.addComponent(Graphics); graphics.fillColor = new Color(130, 35, 22);
    graphics.roundRect(-w / 2, -h / 2, w, h, 8); graphics.fill();
    const button = node.addComponent(Button); button.transition = Button.Transition.NONE;
    const label = this.text(node, 'Text', 0, 0, w - 8, h, text, h < 40 ? 16 : 20);
    node.on(Button.EventType.CLICK, onClick); return {node, button, label};
  }
  onDestroy(): void { this.scope.dispose(); this.generated.forEach(node => node.destroy()); }
}
