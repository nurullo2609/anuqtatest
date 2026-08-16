/**
 * A Nuqtasi Testi — Google Sheets yozuvchi webhook (Apps Script).
 *
 * Bu skript Netlify function (netlify/functions/submit.js) dan har bir test
 * yakunlangach POST so'rov qabul qilib, natijani Google Sheet'ga qator qilib yozadi.
 * Telegram va Claude tahlili bilan bog'liq emas — faqat arxiv/jadval vazifasini bajaradi.
 *
 * SOZLASH:
 * 1. https://script.google.com → yangi loyiha → bu faylni Code.gs sifatida joylashtiring.
 * 2. Project Settings > Script Properties bo'limiga qo'shing:
 *      SHEET_ID — Google Sheet havolasi yoki faqat ID (ikkalasi ham ishlaydi)
 * 3. Deploy > New deployment > Web app:
 *      Execute as: Me
 *      Who has access: Anyone
 * 4. Chiqqan /exec havolasini Netlify > Site configuration > Environment variables
 *    bo'limida GSHEETS_WEBHOOK_URL ga qo'ying, so'ng saytni qayta deploy qiling.
 *
 * Mijozlar va hodimlar natijalari alohida varaqqa ("Mijozlar" / "Hodimlar") yoziladi,
 * chunki ikki yo'nalishning sohalari boshqa-boshqa.
 */

function ajratID(s) {
  const m = String(s).match(/\/d\/([a-zA-Z0-9-_]+)/);
  return m ? m[1] : String(s).trim();
}

function doPost(e) {
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonOutput({ ok: false, xato: "Bad payload" });
  }

  const SHEET_ID = ajratID(PropertiesService.getScriptProperties().getProperty("SHEET_ID"));

  try {
    writeToSheet(data, SHEET_ID);
    return jsonOutput({ ok: true });
  } catch (err) {
    Logger.log("Sheets xatosi: " + err);
    return jsonOutput({ ok: false, xato: String(err) });
  }
}

function jsonOutput(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function writeToSheet(d, sheetId) {
  const ss = SpreadsheetApp.openById(sheetId);
  const sheetName = d.track === "hodim" ? "Hodimlar" : "Mijozlar";
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) sheet = ss.insertSheet(sheetName);

  const scores = d.scores || [];
  const sphereNames = scores.map(function (s) { return s.name; });

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(
      ["Sana", "Ism", "Telefon", "Qo'shimcha", "O'rtacha ball", "Xulosa"]
        .concat(sphereNames)
        .concat(["Zaif zonalar", "Kuchli zonalar", "AI tahlil"])
    );
    // Telefon ustuni butunlay matn formatida — "+998..." formula deb
    // qayta talqin qilinib #ERROR! bermasligi uchun
    sheet.getRange("C:C").setNumberFormat("@");
  }

  const lead = d.lead || {};
  const rowIndex = sheet.getLastRow() + 1;
  sheet.getRange(rowIndex, 3).setNumberFormat("@");

  const scoreMap = {};
  scores.forEach(function (s) { scoreMap[s.name] = s.score; });

  const row = [
    new Date(),
    lead.name || "",
    lead.phone || "",
    lead.extra || "",
    d.average != null ? d.average : "",
    d.verdict || "",
  ]
    .concat(sphereNames.map(function (n) { return scoreMap[n] != null ? scoreMap[n] : ""; }))
    .concat([
      (d.weak || []).map(function (s) { return s.name; }).join(", "),
      (d.strong || []).map(function (s) { return s.name; }).join(", "),
      d.analysis || "",
    ]);

  sheet.appendRow(row);
}
