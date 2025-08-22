import { bot, user_ids } from "../consts";

// utils/jwtUtils.ts
export async function sendMessage(text: any) {
  try {

    const msg = `————————————————
      📍 ${text.Location}
      🦺 ${text.Title}
      🗓 ${text.Type}
      🕒 Schedule Count: ${text.Employement_Type}
      reminder to complete the application - darshan solanki
      ————————————————`;

    await Promise.all(
      user_ids.map(user => bot.sendMessage(user, msg))
    );
    console.log("Message sent to all!");
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}
