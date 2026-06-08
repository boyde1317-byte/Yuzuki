/**
 * Typing Trick — Plugin
 * .type <message>  — shows "typing…" for 2s then sends
 * .record <message> — shows "recording audio…" then sends
 */
import { sendWithTyping, sendWithRecording } from "../../lib/msg-types.js";

const pluginConfig = {
  name: "type",
  alias: ["typing", "sendtype", "record", "recording"],
  category: "tools",
  description: "Send a message with a typing or recording indicator effect",
  usage: ".type <message>  /  .record <message>",
  example: ".type Hello! How are you?",
  isOwner: false, isPremium: false, isGroup: false, isPrivate: false,
  cooldown: 8, isEnabled: true,
};

async function handler(m, { sock }) {
  const text = m.text.trim();
  if (!text) return m.reply(`Usage: .${m.command} <message>`);

  try {
    if (m.command === "record" || m.command === "recording") {
      await sendWithRecording(sock, m.from, text, { delay: 2000 });
    } else {
      await sendWithTyping(sock, m.from, text, { delay: 2000 });
    }
  } catch (e) {
    m.reply(`❌ Failed: ${e.message}`);
  }
}

export { pluginConfig as config, handler };
