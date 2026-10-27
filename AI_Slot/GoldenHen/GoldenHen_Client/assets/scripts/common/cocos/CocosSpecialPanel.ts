import {_decorator, Component, Label} from 'cc';
import {Snapshot, SpecialState} from '../model';
import {SpecialGame} from '../special';

const {ccclass, property} = _decorator;

/** Register one panel per server special ID. Game scripts subscribe to the semantic events. */
@ccclass('AISlotSpecialPanel')
export class CocosSpecialPanel extends Component implements SpecialGame {
  @property id = 0;
  @property(Label) counter: Label | null = null;
  async enter(state: SpecialState, snapshot: Snapshot): Promise<void> {
    this.node.active = true;
    this.render(state);
    this.node.emit('slot-special-enter', state, snapshot);
  }
  async updateState(state: SpecialState, snapshot: Snapshot): Promise<void> {
    this.render(state);
    this.node.emit('slot-special-update', state, snapshot);
  }
  async exit(): Promise<void> { this.node.emit('slot-special-exit'); this.node.active = false; }
  dispose(): void { this.node.active = false; }
  private render(state: SpecialState): void {
    if (this.counter) this.counter.string = state.remaining === null ? '' : `${(state.total ?? 0) - state.remaining}/${state.total}`;
  }
}
