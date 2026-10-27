import {_decorator, Button, Component, Label, sys} from 'cc';
import {Scope} from '../events';
import {SlotClient} from '../host';
import {formatAmount} from '../money';
import {CommandClient, FetchTransport} from '../network';
import {AwardController, AwardView, ReelController, ReelView, assertLayoutMatches} from '../presentation';
import {PersistentPendingStore} from '../storage';
import {SpecialGameRouter} from '../special';
import {delay} from '../timing';
import {CocosReelColumn} from './CocosReelColumn';
import {CocosSpecialPanel} from './CocosSpecialPanel';

const {ccclass, property} = _decorator;

/** H5 bridge. Scene references must be bound and validated inside Creator 3.8.8. */
@ccclass('AISlotDriver')
export class CocosSlotDriver extends Component {
  @property endpoint = 'http://127.0.0.1:8080/api/v1/game/command';
  @property playerId = 'local-player';
  @property gameId = 'GoldenHen';
  @property autoConnect = true;
  @property([CocosReelColumn]) columns: CocosReelColumn[] = [];
  @property([CocosSpecialPanel]) specialPanels: CocosSpecialPanel[] = [];
  @property(Button) spinButton: Button | null = null;
  @property(Button) skipButton: Button | null = null;
  @property(Label) balanceLabel: Label | null = null;
  @property(Label) winLabel: Label | null = null;
  @property(Label) statusLabel: Label | null = null;
  client: SlotClient | null = null;
  private readonly scope = new Scope();
  onLoad(): void {
    const view: ReelView = {
      begin: strips => this.columns.forEach((column, index) => column.begin(strips[index] ?? [])),
      stopReel: async (index, symbols, signal) => {
        const column = this.columns[index]; if (!column) throw new Error('Missing reel column');
        await column.stopAt(symbols, signal);
      },
      snap: board => {
        if (board.length !== this.columns.length) throw new Error('Scene reel count differs from server');
        this.columns.forEach((column, index) => column.snap(board[index]!));
      },
      cancel: () => this.columns.forEach(column => column.cancel()),
    };
    const award: AwardView = {
      show: async (snapshot, signal) => {
        if (this.winLabel) this.winLabel.string = formatAmount(snapshot.lastWin);
        this.node.emit('slot-award-start', snapshot);
        await delay(snapshot.winType >= 4 ? 1000 : 650, signal);
      },
      finish: snapshot => {
        if (this.winLabel) this.winLabel.string = formatAmount(snapshot.lastWin);
        this.node.emit('slot-award-finish', snapshot);
      },
    };
    const router = new SpecialGameRouter();
    this.specialPanels.forEach(panel => { panel.node.active = false; router.register(panel); });
    const store = new PersistentPendingStore(sys.localStorage, `slot-pending:${this.gameId}:${this.playerId}`);
    const network = new CommandClient(new FetchTransport(this.endpoint), store, {gameId: this.gameId, playerId: this.playerId});
    this.client = new SlotClient(network, new ReelController(view), new AwardController(award), router);
    this.scope.add(this.client.events.on('input', input => { if (this.spinButton) this.spinButton.interactable = input.canSpin; }));
    this.scope.add(this.client.events.on('state', state => { if (this.statusLabel) this.statusLabel.string = state; }));
    this.scope.add(this.client.events.on('settled', snapshot => {
      assertLayoutMatches(snapshot.layout, this.columns.length, this.columns[0]?.cells.length ?? 0);
      if (this.balanceLabel) this.balanceLabel.string = formatAmount(snapshot.balance);
      this.node.emit('slot-settled', snapshot);
    }));
    this.scope.add(this.client.events.on('error', error => this.node.emit('slot-error', error)));
    if (this.spinButton) {
      this.spinButton.interactable = false;
      this.spinButton.node.on(Button.EventType.CLICK, this.spin, this);
      this.scope.add(() => this.spinButton?.node.off(Button.EventType.CLICK, this.spin, this));
    }
    if (this.skipButton) {
      this.skipButton.node.on(Button.EventType.CLICK, this.skip, this);
      this.scope.add(() => this.skipButton?.node.off(Button.EventType.CLICK, this.skip, this));
    }
  }
  start(): void { if (this.autoConnect) void this.reconnect(); }
  async reconnect(): Promise<void> { try { await this.client?.connect(); } catch (error) { this.node.emit('slot-error', error); } }
  async spin(): Promise<void> { try { await this.client?.spin(); } catch (error) { this.node.emit('slot-error', error); } }
  skip(): void { this.client?.skip(); }
  chooseBet(lineBet: number): void { this.client?.chooseBet(lineBet); }
  async nextSpecial(data: Record<string, unknown> | null = null): Promise<void> {
    try { await this.client?.nextSpecial(data); } catch (error) { this.node.emit('slot-error', error); }
  }
  onDestroy(): void {
    try { this.scope.dispose(); } finally { this.client?.dispose(); this.client = null; }
  }
}
