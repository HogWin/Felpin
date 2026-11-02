"use strict";
export class FallenKingdomEngine {
  version = "2.0.0-ts";
  isReady = false;
  constructor() {
    console.log(`[The Fallen Kingdom TS Engine] Preparado. Versão: ${this.version}`);
  }
  init() {
    this.isReady = true;
    console.log("[The Fallen Kingdom] Engine TypeScript inicializada com sucesso.");
  }
}
export * from "./types/index.js";
