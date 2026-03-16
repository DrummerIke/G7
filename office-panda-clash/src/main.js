import { Game } from './systems/game.js';

const root = document.getElementById('app');
if (!root) throw new Error('App root not found');

new Game(root);
