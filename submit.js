/* ============================================================
   POST /.netlify/functions/submit

   1) Test natijasini oladi
   2) Claude API orqali shaxsiy tahlil yozdiradi
   3) Forma + ballar + javoblar + tahlilni Telegram guruhga yuboradi
   4) Tahlilni foydalanuvchiga qaytaradi

   Environment variables (Netlify → Site configuration → Environment):
     ANTHROPIC_API_KEY    sk-ant-...            (majburiy)
     TELEGRAM_BOT_TOKEN   1234567:AA...         (majburiy)
     TELEGRAM_CHAT_ID     -1001234567890        (majburiy, guruh id)
     ANTHROPIC_MODEL      ixtiyoriy, default: claude-sonnet-5
     TELEGRAM_THREAD_ID   ixtiyoriy, guruh mavzusi (topic) id
   ============================================================ */

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return json(204, {});
  if (event.httpMethod !== "POST")    return json(405, { error: "Faqat POST" });

  let d;
  try { d = JSON.parse(event.body || "{}"); }
  catch { return json(400, { error: "Noto'g'ri JSON" }); }

  if (!d.lead || !Array.isArray(d.scores) || !d.scores.length) {
    return json(400, { error: "Ma'lumot to'liq emas" });
  }

  const lead   = d.lead || {};
  const labels = d.leadLabels || {};

  /* ---------- 1. Claude tahlili ---------- */
  let analysis = null, analysisError = null;
  try {
    analysis = await askClaude(d);
  } catch (e) {
    analysisError = String(e.message || e);
    console.error("Claude error:", analysisError);
  }

  /* ---------- 2. Telegram ---------- */
  try {
    const head =
      `🧭 <b>YANGI TEST NATIJASI</b>\n` +
      `Yo'nalish: <b>${esc(d.trackName || d.track)}</b>\n` +
      `━━━━━━━━━━━━━━━\n` +
      Object.keys(lead).map(k =>
        `${icon(k)} <b>${esc(labels[k] || k)}:</b> ${esc(lead[k] || "—")}`
      ).join("\n") +
      `\n━━━━━━━━━━━━━━━\n` +
      `📊 <b>O'rtacha ball: ${d.average}/10</b>\n<i>${esc(d.verdict || "")}</i>\n\n` +
      d.scores.map(s => `${bar(s.score)} <code>${pad(s.score)}</code>  ${esc(s.name)}`).join("\n") +
      `\n\n⚠️ <b>Zaif:</b> ${(d.weak   || []).map(s => esc(s.name) + " (" + s.score + ")").join(", ")}` +
      `\n💪 <b>Kuchli:</b> ${(d.strong || []).map(s => esc(s.name) + " (" + s.score + ")").join(", ")}` +
      `\n\n🕒 ${new Date().toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" })}`;

    await tg(head);

    if (analysis) {
      await tg(`🤖 <b>TAHLIL</b>\n━━━━━━━━━━━━━━━\n${esc(analysis)}`);
    } else {
      await tg(`🤖 <i>Tahlil tayyorlanmadi: ${esc(analysisError || "noma'lum xato")}</i>`);
    }

    if (Array.isArray(d.answers) && d.answers.length) {
      const txt = buildAnswersFile(d);
      const safe = String(lead.name || "test").replace(/[^\p{L}\p{N}]+/gu, "_").slice(0, 40);
      await tgDoc(txt, `javoblar_${safe}.txt`, `📄 To'liq javoblar — ${esc(lead.name || "")}`);
    }
  } catch (e) {
    console.error("Telegram error:", e);
  }

  return json(200, { ok: true, analysis });
};

/* ---------------- Claude ---------------- */
async function askClaude(d) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY o'rnatilmagan");

  const isClient = d.track === "mijoz";

  const system = isClient
    ? `Sen 15 yillik tajribaga ega biznes-konsultantsan. O'zbek tilida (lotin alifbosida),
sodda, aniq va samimiy yozasan. Umumiy gaplardan qochasan — har bir fikring odamning
aniq raqamlariga tayanadi. Sotuvchi emas, foydali maslahatchisan.
Muhim: past ball — ayb emas, boshlang'ich nuqta. Shu ohangda yoz.`
    : `Sen tajribali HR va xodimlarni rivojlantirish bo'yicha mutaxassissan. O'zbek tilida
(lotin alifbosida), sodda va aniq yozasan. Baholayotgan odamni pastga urmaysan —
kuchli tomonini ko'rsatib, o'sish nuqtasini aniq ko'rsatasan.
Tanqid emas, rivojlantiruvchi ohangda yoz.`;

  const low  = [...(d.answers || [])].sort((a, b) => a.a - b.a).slice(0, 8);
  const high = [...(d.answers || [])].sort((a, b) => b.a - a.a).slice(0, 5);

  const prompt = `MA'LUMOT
Ism: ${d.lead.name || "—"}
${d.lead.extra ? "Qo'shimcha: " + d.lead.extra : ""}
Umumiy ball: ${d.average}/10 — ${d.verdict}

SOHALAR BO'YICHA BALLAR (10 dan):
${d.scores.map(s => `- ${s.name}: ${s.score}`).join("\n")}

ENG PAST BAHO BERILGAN SAVOLLAR:
${low.map(a => `- [${a.sphere}] ${a.q} → ${a.a}/5`).join("\n")}

ENG YUQORI BAHO BERILGAN SAVOLLAR:
${high.map(a => `- [${a.sphere}] ${a.q} → ${a.a}/5`).join("\n")}

VAZIFA — quyidagi tuzilmada yoz (jami 320–420 so'z, muqaddimasiz):

**Umumiy holat**
2–3 gap: bu ball va sohalar taqsimoti nimani anglatadi.

**Kuchli tayanchingiz**
2–3 gap: qaysi soha ustiga qurish mumkin va aynan nega.

**Asosiy to'siq**
3–4 gap: eng past sohalar o'zaro qanday bog'langan, ildiz sabab nima.
Sabab-oqibatni ko'rsat (masalan: X past bo'lgani uchun Y ham o'smayapti).

**Keyingi 30 kun uchun 3 qadam**
1. ...
2. ...
3. ...
Har biri aniq, o'lchanadigan va shu odamning holatiga mos bo'lsin.
Umumiy maslahat berma ("ko'proq harakat qiling" kabi).

**Diqqat qiling**
1–2 gap: hozirgi bosqichda qaysi tipik xatoga yo'l qo'ymaslik kerak.

Faqat shu matnni qaytar, boshqa izoh qo'shma. "Sizga" deb murojaat qil.`;

  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1600,
      system,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!r.ok) throw new Error("Anthropic API " + r.status + ": " + (await r.text()).slice(0, 300));
  const data = await r.json();
  const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n").trim();
  if (!text) throw new Error("Bo'sh javob");
  return text;
}

/* ---------------- Telegram ---------------- */
async function tg(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat  = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) throw new Error("TELEGRAM_BOT_TOKEN yoki TELEGRAM_CHAT_ID yo'q");

  for (const chunk of split(text, 3900)) {
    const body = {
      chat_id: chat,
      text: chunk,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    };
    if (process.env.TELEGRAM_THREAD_ID) body.message_thread_id = Number(process.env.TELEGRAM_THREAD_ID);

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) console.error("TG sendMessage:", await res.text());
  }
}

async function tgDoc(content, filename, caption) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat  = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return;

  const form = new FormData();
  form.append("chat_id", chat);
  form.append("caption", String(caption).slice(0, 900));
  form.append("parse_mode", "HTML");
  if (process.env.TELEGRAM_THREAD_ID) form.append("message_thread_id", process.env.TELEGRAM_THREAD_ID);
  form.append("document", new Blob([content], { type: "text/plain" }), filename);

  const res = await fetch(`https://api.telegram.org/bot${token}/sendDocument`, { method: "POST", body: form });
  if (!res.ok) console.error("TG sendDocument:", await res.text());
}

/* ---------------- yordamchilar ---------------- */
function buildAnswersFile(d) {
  const L = ["", "1 — Umuman yo'q", "2 — Kamdan-kam", "3 — Ba'zan", "4 — Ko'pincha", "5 — Doim/to'liq"];
  let out = `${d.trackName}\n${d.lead.name || ""} · ${d.lead.phone || ""}`;
  if (d.lead.extra) out += ` · ${d.lead.extra}`;
  out += `\nO'rtacha: ${d.average}/10 — ${d.verdict}\n${"=".repeat(48)}\n`;

  let cur = "";
  d.answers.forEach((a, i) => {
    if (a.sphere !== cur) { cur = a.sphere; out += `\n### ${cur}\n`; }
    out += `${i + 1}. ${a.q}\n    → ${L[a.a] || a.a}\n`;
  });
  return out;
}

function split(s, n) {
  const out = [];
  while (s.length > n) {
    let cut = s.lastIndexOf("\n", n);
    if (cut < n * 0.5) cut = n;
    out.push(s.slice(0, cut));
    s = s.slice(cut);
  }
  out.push(s);
  return out;
}

function bar(v) {
  const full = Math.max(0, Math.min(5, Math.round(v / 2)));
  return "▮".repeat(full) + "▯".repeat(5 - full);
}
function pad(v)  { return (v < 10 ? " " : "") + Number(v).toFixed(1); }
function icon(k) { return { name: "👤", phone: "📞", extra: "🏢" }[k] || "•"; }
function esc(s)  { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function json(code, obj) {
  return {
    statusCode: code,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
    body: JSON.stringify(obj),
  };
}
