/**
 * The Fallen Kingdom - TypeScript Entrypoint
 * Este arquivo serve como núcleo de inicialização do jogo para a migração TypeScript.
 */

import type { GameSettings, SaveDataSchema } from './types/index.js';

export class FallenKingdomEngine {
  public version: string = '2.0.0-ts';
  public isReady: boolean = false;

  constructor() {
    console.log(`[The Fallen Kingdom TS Engine] Preparado. Versão: ${this.version}`);
  }

  public init(): void {
    this.isReady = true;
    console.log('[The Fallen Kingdom] Engine TypeScript inicializada com sucesso.');
  }
}

export * from './types/index.js';

