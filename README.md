# A nuqtasi — diagnostika testi

Ikki yo'nalishli test: **Mijozlar uchun** (biznes diagnostikasi) va **Hodimlar uchun**
(o'z-o'zini baholash). Har biri **10 soha × 8 savol = 80 savol**.

Oqim: yo'nalish tanlash → ism/telefon → 80 savol → balans g'ildiragi va ballar →
sun'iy intellekt tahlili ekranda → hammasi Telegram guruhga tushadi.

## Fayllar

```
index.html                    interfeys (barcha ekranlar, dizayn, mantiq)
questions.js                  savollar bazasi — SIZ TAHRIRLAYDIGAN ASOSIY FAYL
netlify/functions/submit.js   Claude tahlili + Telegramga yuborish
netlify/functions/config.js   brend nomi va admin havolasi (env orqali)
netlify.toml                  Netlify sozlamalari
```

---

## 1. Telegram botni tayyorlash

1. Telegramda **@BotFather** ga yozing → `/newbot` → bot nomi va username → **tokenni** oling.
2. Botni guruhga qo'shing va **admin** qiling.
3. Guruh ID sini olish: guruhga bironta xabar yozing, so'ng brauzerda oching:
   `https://api.telegram.org/bot<TOKEN>/getUpdates`
   Javobdagi `"chat":{"id":-1001234567890}` — shu raqam sizning `TELEGRAM_CHAT_ID`.
   (Guruh ID doim manfiy, supergruhda `-100` bilan boshlanadi.)
4. Guruhda mavzular (Topics) yoqilgan bo'lsa, kerakli mavzuning `message_thread_id`
   sini ham o'sha javobdan oling — ixtiyoriy.

## 2. Claude API kaliti

1. https://console.anthropic.com → API Keys → yangi kalit yarating (`sk-ant-...`).
2. Balansni to'ldiring. Bitta tahlil ≈ 2000 token — juda arzon.

⚠️ Kalit **faqat** Netlify function ichida ishlatiladi, brauzerga chiqmaydi.

## 3. Netlify'ga joylash

**Variant A — drag & drop (eng tez):**
`anuqta` papkasini ZIP qiling → https://app.netlify.com/drop ga tashlang.

**Variant B — GitHub orqali (tavsiya etiladi):**
Fayllarni repoga yuklang → Netlify → *Add new site → Import from Git* → repoyni tanlang.
Build command bo'sh, publish directory: `.`

## 4. Environment variables

Netlify → **Site configuration → Environment variables** → qo'shing:

| Nomi | Qiymat | Majburiy |
|---|---|---|
| `ANTHROPIC_API_KEY` | `sk-ant-...` | ✅ |
| `TELEGRAM_BOT_TOKEN` | `1234567:AA...` | ✅ |
| `TELEGRAM_CHAT_ID` | `-1001234567890` | ✅ |
| `BRAND` | brend nomi, masalan `Top Sales` | — |
| `ADMIN_LINK` | `https://t.me/Topsalesadmin` | — |
| `ANTHROPIC_MODEL` | default `claude-sonnet-5` | — |
| `TELEGRAM_THREAD_ID` | guruh mavzusi id | — |

Qo'shgandan keyin **Deploys → Trigger deploy → Clear cache and deploy site**.

---

## 5. Admin panel o'rniga — env variable

Alohida admin panel qurilmadi, chunki uning yagona vazifasi sozlamani o'zgartirish edi.
Buning o'rniga:

- **Admin havolasini o'zgartirish** → Netlify'da `ADMIN_LINK` qiymatini yangilang → *Redeploy*.
  Kodga tegish shart emas, 10 soniyalik ish.
- **Brend nomini o'zgartirish** → `BRAND` qiymatini yangilang.
- **Barcha natijalar** → Telegram guruhda saqlanadi: qidiruv, filtr va arxiv shu yerda.

Agar keyinchalik natijalar ro'yxati, qidiruv va Excel eksporti bilan to'liq panel kerak bo'lsa —
Netlify Blobs asosida qo'shish mumkin (GitHub orqali deploy talab qilinadi).

---

## 6. O'zingizga moslashtirish

**Savollar.** `questions.js` — soha qo'shing, olib tashlang yoki matnni o'zgartiring.
Savollar soni har xil bo'lsa ham ishlaydi, kod avtomatik moslashadi.

Har bir savol **tasdiq gap** bo'lsin — odam u bilan rozilik darajasini belgilaydi:
✅ "Muddatlarni buzmayman"  ❌ "Muddatlarni buzasizmi?"

**Ranglar.** `index.html` boshidagi `:root` blokida — `--accent` asosiy rang.

**Tahlil matni.** `netlify/functions/submit.js` ichidagi `askClaude()` funksiyasida
`system` va `prompt` — mutaxassis ohangi va tahlil tuzilmasi shu yerda belgilangan.
Masalan mijozlarga xizmatingizni taklif qilishni qo'shmoqchi bo'lsangiz, promptga bitta
qator qo'shing.

**Baho shkalasi va xulosa darajalari.** `index.html` ichidagi `verdictOf()` funksiyasi.

---

## 7. Telegramda nima ko'rinadi

Har bir test uchun **3 ta xabar** keladi:

1. 🧭 Forma ma'lumotlari + umumiy ball + 10 soha bo'yicha diagramma + zaif/kuchli zonalar
2. 🤖 To'liq tahlil matni
3. 📄 Barcha 80 savol va javoblar `.txt` fayl sifatida

## 8. Tekshirish

Saytni oching → testni to'ldiring → natija ekranida tahlil chiqishi va guruhga
xabar tushishi kerak.

Chiqmasa: Netlify → **Functions → submit → Logs**. U yerda `Claude error:` yoki
`Telegram error:` yozuvi aniq sababni ko'rsatadi.

Ko'p uchraydigan xatolar:

- `401` — API kalit noto'g'ri yoki balans yo'q
- `404 model` — `ANTHROPIC_MODEL` noto'g'ri yozilgan, o'chirib tashlang (default ishlaydi)
- `chat not found` — bot guruhga qo'shilmagan yoki ID xato (manfiy ekanini tekshiring)
- `Bad Request: message thread not found` — `TELEGRAM_THREAD_ID` noto'g'ri, olib tashlang
