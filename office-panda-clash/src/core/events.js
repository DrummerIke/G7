export const GameEvents = {
  ROUND_STARTED: 'ROUND_STARTED',
  HIT_CONFIRMED: 'HIT_CONFIRMED',
  BLOCKED: 'BLOCKED',
  KNOCKDOWN: 'KNOCKDOWN',
  FINISH_HIM: 'FINISH_HIM',
  BORKALITY_AVAILABLE: 'BORKALITY_AVAILABLE',
  MATCH_FINISHED: 'MATCH_FINISHED'
};

export class EventBus {
  #listeners = new Map();

  on(event, listener) {
    if (!this.#listeners.has(event)) this.#listeners.set(event, new Set());
    this.#listeners.get(event).add(listener);
    return () => this.#listeners.get(event)?.delete(listener);
  }

  emit(event, payload) {
    this.#listeners.get(event)?.forEach((listener) => listener(payload));
  }
}
