
const GAMES = new Map();
function board(b) {
  const s = (i) => b[i] || String(i+1);
  return `${s(0)}|${s(1)}|${s(2)}\n-+-+\n${s(3)}|${s(4)}|${s(5)}\n-+-+\n${s(6)}|${s(7)}|${s(8)}`;
}
function win(b, p) {
  return [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]].some(([a,c,d]) => b[a]===p && b[c]===p && b[d]===p);
}
function botMove(b) {
  const e = b.map((v,i) => v?null:i).filter(v => v!==null);
  for (const i of e) { const t=[...b]; t[i]="O"; if (win(t,"O")) return i; }
  for (const i of e) { const t=[...b]; t[i]="X"; if (win(t,"X")) return i; }
  if (b[4]===null) return 4;
  return e[Math.floor(Math.random()*e.length)];
}
const pluginConfig = {
  name: "tictactoe2", alias: ["ttt2"], category: "games",
  description: "Play Tic-Tac-Toe vs bot", usage: ".tictactoe2 <position>",
  example: ".tictactoe2 5", isOwner: false, isPremium: false, isGroup: false, isPrivate: false,
  cooldown: 3, isEnabled: true,
};
function handler(m) {
  const uid = m.sender;
  const text = m.text.trim();
  if (!GAMES.has(uid)) GAMES.set(uid, { board: Array(9).fill(null) });
  const g = GAMES.get(uid);
  if (text === "") return m.reply(`🎮 *Tic-Tac-Toe*\n\n${board(g.board)}\n\nReply with a number (1-9) to play.`);
  const pos = parseInt(text) - 1;
  if (isNaN(pos) || pos < 0 || pos > 8 || g.board[pos]) return m.reply("Invalid move! Choose an empty cell (1-9).");
  g.board[pos] = "X";
  if (win(g.board, "X")) { GAMES.delete(uid); return m.reply(`🎉 *YOU WIN!*\n\n${board(g.board)}`); }
  if (!g.board.includes(null)) { GAMES.delete(uid); return m.reply(`🤝 *DRAW!*\n\n${board(g.board)}`); }
  const bm = botMove(g.board);
  g.board[bm] = "O";
  if (win(g.board, "O")) { GAMES.delete(uid); return m.reply(`🤖 *BOT WINS!*\n\n${board(g.board)}`); }
  if (!g.board.includes(null)) { GAMES.delete(uid); return m.reply(`🤝 *DRAW!*\n\n${board(g.board)}`); }
  m.reply(`🎮 *Tic-Tac-Toe*\n\n${board(g.board)}\n\nYour turn (X):`);
}
export { pluginConfig as config, handler };
