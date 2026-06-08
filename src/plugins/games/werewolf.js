
const GAMES = new Map();
const ROLES = ["🐺 Werewolf", "🧙 Seer", "🛡️ Bodyguard", "👤 Villager"];
const pluginConfig = {
  name: "werewolf", alias: ["ww", "wolf"], category: "games",
  description: "Play a mini werewolf game", usage: ".werewolf [start|join|vote]",
  example: ".werewolf start", isOwner: false, isPremium: false, isGroup: true, isPrivate: false,
  cooldown: 5, isEnabled: true,
};
function handler(m) {
  const gid = m.from;
  const text = m.text.trim().toLowerCase();
  if (text === "start") {
    if (GAMES.has(gid)) return m.reply("A game is already running!");
    GAMES.set(gid, { players: [], phase: "join", day: 1 });
    return m.reply(`🐺 *WEREWOLF GAME STARTED!*\n\nType *.werewolf join* to participate.\nMinimum 4 players required.`);
  }
  if (text === "join") {
    const g = GAMES.get(gid);
    if (!g) return m.reply("No active game. Start with *.werewolf start*");
    if (g.phase !== "join") return m.reply("Game already in progress!");
    if (g.players.find(p => p.jid === m.sender)) return m.reply("You already joined!");
    g.players.push({ jid: m.sender, name: m.pushName, role: null, alive: true });
    return m.reply(`✅ *${m.pushName}* joined! (${g.players.length} players)`);
  }
  if (text === "begin") {
    const g = GAMES.get(gid);
    if (!g) return m.reply("No active game.");
    if (g.players.length < 4) return m.reply(`Need at least 4 players! Current: ${g.players.length}`);
    g.phase = "night";
    const shuffled = [...g.players].sort(() => Math.random() - 0.5);
    for (let i = 0; i < shuffled.length; i++) {
      shuffled[i].role = ROLES[i % ROLES.length];
    }
    const rolesMsg = shuffled.map(p => `  ${p.name}: *${p.role}*`).join("\n");
    GAMES.delete(gid);
    return m.reply(`🌙 *NIGHT FALLS*\n\nRoles assigned secretly!\n\n${rolesMsg}\n\n_The werewolf game would continue with day/night phases in a full implementation._`);
  }
  if (text === "end") {
    GAMES.delete(gid);
    return m.reply("🐺 Game ended.");
  }
  m.reply(`Usage: .werewolf start | .werewolf join | .werewolf begin | .werewolf end`);
}
export { pluginConfig as config, handler };
