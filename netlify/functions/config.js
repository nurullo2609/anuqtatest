/* ============================================================
   GET /.netlify/functions/config

   Saytning "admin panelsiz" sozlamalari.
   Netlify → Site configuration → Environment variables da
   o'zgartirasiz, kodga tegmasdan sayt yangilanadi.

     BRAND        brend nomi        (default: Top Sales)
     ADMIN_LINK   admin havolasi    (default: https://t.me/Topsalesadmin)
   ============================================================ */

exports.handler = async () => ({
  statusCode: 200,
  headers: {
    "content-type": "application/json",
    "cache-control": "public, max-age=60",
  },
  body: JSON.stringify({
    brand:     process.env.BRAND      || "Ecom Audit",
    adminLink: process.env.ADMIN_LINK || "https://t.me/nurullo2609",
  }),
});
