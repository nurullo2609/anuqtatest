/* ============================================================
   SAVOLLAR BAZASI — "A nuqtasi" diagnostika testi
   2 yo'nalish × 10 soha × 8 savol = 80 savol

   Bu yagona tahrirlanadigan fayl. Soha yoki savol qo'shsangiz,
   qolgan kod avtomatik moslashadi (ballar, g'ildirak, tahlil).

   QOIDA: har bir savol TASDIQ gap bo'lsin — odam u bilan
   rozilik darajasini belgilay olsin.
   ✅ "Muddatlarni buzmayman"     ❌ "Muddatlarni buzasizmi?"
   ============================================================ */

const SCALE = [
  { label: "Umuman yo'q",     short: "1", value: 1 },
  { label: "Kamdan-kam",      short: "2", value: 2 },
  { label: "Ba'zan",          short: "3", value: 3 },
  { label: "Ko'pincha",       short: "4", value: 4 },
  { label: "Doim / to'liq",   short: "5", value: 5 },
];

const TRACKS = {

  /* ==========================================================
     1-YO'NALISH — MIJOZLAR (biznes egalari)
     ========================================================== */
  mijoz: {
    key: "mijoz",
    name: "Mijozlar uchun",
    title: "Biznesingiz A nuqtasi",
    tagline: "Biznesingiz bugun qayerda turganini 10 soha bo'yicha o'lchang va keyingi qadamni ko'ring",
    audience: "biznes egasi / tadbirkor",
    badge: "Biznes diagnostikasi",
    leadFields: [
      { id: "name",  label: "Ism-familiyangiz", type: "text", required: true,  placeholder: "Masalan: Aziz Karimov" },
      { id: "phone", label: "Telefon raqamingiz", type: "tel", required: true, placeholder: "+998 __ ___ __ __" },
      { id: "extra", label: "Biznesingiz sohasi", type: "text", required: false, placeholder: "masalan: kiyim savdosi" },
    ],
    spheres: [
      {
        icon: "💰", name: "Pul va raqamlar",
        questions: [
          "Oylik tushum va sof foydani aniq raqamda bilaman",
          "Har bir xarajat qayerga ketayotgani hisobga olinadi",
          "Shaxsiy pul va biznes puli bir-biridan ajratilgan",
          "Mahsulot tannarxi va marjasi aniq hisoblangan",
          "Kamida 3 oylik xarajatga yetadigan zaxira mablag' bor",
          "Qarz va majburiyatlar nazoratda, muddatida yopiladi",
          "Har oy moliyaviy hisobot ko'rib chiqiladi",
          "Pul haqidagi qarorlar raqamga tayanib qabul qilinadi",
        ],
      },
      {
        icon: "📈", name: "Savdo",
        questions: [
          "Har oy yangi mijozlar barqaror kelib turadi",
          "Savdo bosqichlari va skript yozib qo'yilgan",
          "Kelgan har bir so'rov qayd etiladi va yakuniga yetkaziladi",
          "So'rovdan sotuvgacha bo'lgan konversiya foizini bilaman",
          "Narxni tushirmasdan, qiymat orqali sota olaman",
          "Ko'p uchraydigan e'tirozlarga tayyor javoblarim bor",
          "O'rtacha chek muntazam o'sib boradi",
          "Savdo rejasi bor va u har hafta nazorat qilinadi",
        ],
      },
      {
        icon: "🎯", name: "Marketing va brend",
        questions: [
          "Maqsadli auditoriyamni aniq tasvirlab bera olaman",
          "Raqobatchidan farqim bir gapda tushuntiriladi",
          "Doimiy ishlab turgan kamida bitta reklama kanali bor",
          "Bitta mijozni jalb qilish qanchaga tushishini bilaman",
          "Ijtimoiy tarmoqlarda muntazam kontent chiqadi",
          "Reklamaga sarflangan pul qancha qaytganini o'lchayman",
          "Brendning vizual va matn uslubi yagona",
          "Mijozlarning bir qismi tavsiya orqali keladi",
        ],
      },
      {
        icon: "🤝", name: "Mijoz bilan munosabat",
        questions: [
          "Mijozlar bazasi yuritiladi va u bilan ishlanadi",
          "Mijozlar qayta xarid qilishga qaytadi",
          "Sotuvdan keyin ham aloqa saqlanadi",
          "Shikoyat tizimli tarzda qabul qilinadi va hal etiladi",
          "Mijozlardan fikr-mulohaza muntazam yig'iladi",
          "Doimiy mijozlar uchun alohida shartlar bor",
          "Mijoz nima uchun ketib qolganini bilaman",
          "Ijobiy sharh va keyslar to'planib boriladi",
        ],
      },
      {
        icon: "⚙️", name: "Jarayonlar va tizim",
        questions: [
          "Asosiy jarayonlar yozma reglamentga tushirilgan",
          "Buyurtmadan yetkazishgacha bo'lgan yo'l aniq",
          "CRM yoki hisob yuritish tizimi har kuni ishlatiladi",
          "Sifat nazorati bor — bir xato ikki marta takrorlanmaydi",
          "Ombor yoki resurs qoldig'i nazoratda",
          "Takrorlanuvchi mayda ishlar avtomatlashtirilgan",
          "Har bir jarayonning mas'ul shaxsi aniq",
          "Men bo'lmasam ham biznes bir hafta ishlay oladi",
        ],
      },
      {
        icon: "👥", name: "Jamoa",
        questions: [
          "Har bir hodimning vazifasi yozma belgilangan",
          "Yangi hodimni o'rgatish tizimi bor",
          "Hodimlar natija bo'yicha baholanadi",
          "Ish haqi tizimi tushunarli va adolatli",
          "Kadrlar almashinuvi past, odamlar uzoq ishlaydi",
          "Jamoa bilan muntazam yig'ilish o'tkaziladi",
          "Kerakli mutaxassisni topa olaman va ushlab qola olaman",
          "Jamoada ochiq muloqot bor, muammo yashirilmaydi",
        ],
      },
      {
        icon: "🧭", name: "Strategiya va maqsad",
        questions: [
          "1 yillik aniq raqamli maqsadim bor",
          "Maqsad bosqichlarga bo'lingan va yozib qo'yilgan",
          "Har oy reja va fakt solishtirib chiqiladi",
          "Asosiy ko'rsatkichlar (KPI) belgilangan",
          "3 yildan keyin biznes qanday bo'lishini aniq tasavvur qilaman",
          "Qaysi yo'nalishdan voz kechish kerakligini bilaman",
          "Raqobat muhitini muntazam kuzataman",
          "Qarorlar his-tuyg'uga emas, rejaga tayanadi",
        ],
      },
      {
        icon: "⏱", name: "Vaqt va egasining roli",
        questions: [
          "Kunim reja asosida o'tadi",
          "Asosiy vaqtim rivojlanishga ketadi, muammo o'chirishga emas",
          "Vazifalarni ishonch bilan boshqalarga topshira olaman",
          "Kunlik mayda ishlarga botib qolmayman",
          "Haftada kamida bir kun to'liq dam olaman",
          "Kerak bo'lganda \"yo'q\" deya olaman",
          "Kun boshida eng muhim 3 vazifani belgilayman",
          "Ish va shaxsiy hayotim muvozanatda",
        ],
      },
      {
        icon: "🚀", name: "O'sish va rivojlanish",
        questions: [
          "Oxirgi 12 oyda daromad o'sdi",
          "Yangi mahsulot yoki yo'nalish sinab ko'rildi",
          "O'qish va malaka oshirishga muntazam sarmoya kiritaman",
          "Sohamdagi o'zgarishlarni kuzatib boraman",
          "O'sishga to'sqinlik qilayotgan asosiy sababni bilaman",
          "Ishlagan tajribani takrorlab, kengaytira olaman",
          "O'zimdan kuchli odamlar muhitida bo'laman",
          "Yangi g'oyani sinash uchun tartib bor",
        ],
      },
      {
        icon: "🧠", name: "Ichki holat va qo'rquvlar",
        questions: [
          "Katta maqsad meni qo'rqitmaydi, ilhomlantiradi",
          "Xatoni tan olib, undan xulosa chiqaraman",
          "Boshqalarning fikri qarorimga xalaqit bermaydi",
          "Muvaffaqiyatga loyiqligimga ishonaman",
          "Ko'p pul topishdan uyalmayman",
          "Noaniqlik meni to'xtatib qo'ymaydi",
          "O'zimni charchagan emas, kuchli his qilaman",
          "Nima uchun ishlayotganimni aniq bilaman",
        ],
      },
    ],
  },

  /* ==========================================================
     2-YO'NALISH — HODIMLAR (o'z-o'zini baholash)
     ========================================================== */
  hodim: {
    key: "hodim",
    name: "Hodimlar uchun",
    title: "Hodim potensiali diagnostikasi",
    tagline: "Kuchli tomonlaringiz va o'sish nuqtalaringizni 10 soha bo'yicha aniqlang",
    audience: "kompaniya hodimi",
    badge: "O'z-o'zini baholash",
    leadFields: [
      { id: "name",  label: "Ism-familiyangiz", type: "text", required: true,  placeholder: "Masalan: Aziz Karimov" },
      { id: "phone", label: "Telefon raqamingiz", type: "tel", required: true, placeholder: "+998 __ ___ __ __" },
      { id: "extra", label: "Lavozim / bo'lim", type: "text", required: false, placeholder: "masalan: savdo bo'limi, menejer" },
    ],
    spheres: [
      {
        icon: "🎯", name: "Rol aniqligi",
        questions: [
          "Vazifalarim aniq belgilangan va men ularni bilaman",
          "Mendan kutilayotgan natija raqamda aytilgan",
          "Qaysi masalada kimga murojaat qilishni bilaman",
          "Ustuvorliklarni o'zim to'g'ri belgilay olaman",
          "Ishim kompaniya maqsadiga qanday ta'sir qilishini tushunaman",
          "Vakolatlarim chegarasi menga tushunarli",
          "Kunlik ishimda nima muhimroq ekanini bilaman",
          "Ishim bo'yicha yo'riqnoma yoki reglament bor",
        ],
      },
      {
        icon: "🛠", name: "Kasbiy ko'nikmalar",
        questions: [
          "Ishimni bajarish uchun bilimim yetarli",
          "Yangi vazifani ko'p ko'rsatmasiz o'zlashtiraman",
          "Ishlatadigan dastur va asboblarni yaxshi bilaman",
          "Murakkab holatda mustaqil yechim topa olaman",
          "O'z ishimni boshqalarga o'rgata olaman",
          "Sohamdagi yangiliklardan xabardorman",
          "Ishni tezroq bajarish yo'lini o'zim izlayman",
          "Ishni tekshirib, sifatli holda topshiraman",
        ],
      },
      {
        icon: "📊", name: "Natijadorlik va mas'uliyat",
        questions: [
          "Muddatlarni buzmayman",
          "Xato qilsam, o'zim tan olaman va tuzataman",
          "Ishni oxiriga yetkazaman, yarim tashlab ketmayman",
          "Natijam o'lchanadi va men uni bilaman",
          "Rejadagi ko'rsatkichlarni bajaraman",
          "Bahona qidirmayman, yechim taklif qilaman",
          "Va'da bergan ishimni eslatmasdan bajaraman",
          "Ish sifatim uchun shaxsan javob beraman",
        ],
      },
      {
        icon: "⏱", name: "Vaqt va tartib",
        questions: [
          "Kunimni oldindan rejalashtiraman",
          "Muhim ishni kechga qoldirmayman",
          "Diqqatim chalg'imasdan ishlay olaman",
          "Ish joyim va fayllarim tartibda",
          "Bir vaqtda hammasini emas, ketma-ket bajaraman",
          "Vaqtim qayerga ketayotganini bilaman",
          "Kutilmagan vazifa kunimni butunlay buzib yubormaydi",
          "Ish kunini yakunlab, ertangi rejani belgilab qo'yaman",
        ],
      },
      {
        icon: "🤝", name: "Jamoa va muloqot",
        questions: [
          "Hamkasblar bilan til topisha olaman",
          "Muammoni yashirmay, o'z vaqtida aytaman",
          "Yordam so'rashdan tortinmayman",
          "Nizoli vaziyatni tinch hal qila olaman",
          "Boshqalarga o'z vaqtida yordam beraman",
          "Fikrimni hurmat bilan, ochiq bildiraman",
          "Jamoa natijasi men uchun shaxsiy natijadan kam emas",
          "Kelishilgan qoidalarga rioya qilaman",
        ],
      },
      {
        icon: "⚡", name: "Energiya va muvozanat",
        questions: [
          "Ishga xohish bilan kelaman",
          "Ish kuni oxirida ham kuchim qoladi",
          "Yetarli uxlayman va dam olaman",
          "Sog'ligimga e'tibor beraman",
          "Stressli vaziyatni boshqara olaman",
          "Ishdan tashqari hayotim ham bor",
          "Dam olish kunlarim ish tashvishisiz o'tadi",
          "O'zimni charchagan emas, tetik his qilaman",
        ],
      },
      {
        icon: "🔥", name: "Motivatsiya va maqsad",
        questions: [
          "Qiyin vazifa meni qiziqtiradi, qo'rqitmaydi",
          "Meni nima harakatga keltirishini aniq bilaman",
          "Kasbiy maqsadim bor va u yozib qo'yilgan",
          "Bir yildan keyin qayerda bo'lishni tasavvur qilaman",
          "Natijaga erishganda o'zimni rag'batlantiraman",
          "Motivatsiyam faqat tashqi bosimga bog'liq emas",
          "Ishimda ma'no ko'raman",
          "Ko'proq mas'uliyat olishga tayyorman",
        ],
      },
      {
        icon: "🧠", name: "O'rganish va o'sish",
        questions: [
          "Oxirgi 6 oyda yangi ko'nikma o'rgandim",
          "Tanqidni rivojlanish uchun qabul qilaman",
          "Mustaqil ravishda o'qiyman va o'rganaman",
          "Xatolarimdan xulosa chiqaraman",
          "O'zimdan kuchlilardan o'rganishga harakat qilaman",
          "Yangi bilimni darhol amalda qo'llayman",
          "Shaxsiy rivojlanish rejam bor",
          "Qulay zonadan chiqishdan qo'rqmayman",
        ],
      },
      {
        icon: "🧭", name: "Rahbariyat bilan aloqa",
        questions: [
          "Rahbarimga fikrimni ochiq ayta olaman",
          "Ishim bo'yicha muntazam fikr-mulohaza olaman",
          "Rahbariyat qarorlari menga tushunarli",
          "Kerak bo'lganda tez qo'llab-quvvatlanaman",
          "Taklifim eshitiladi va hisobga olinadi",
          "Rahbarim mendan aynan nima kutayotganini bilaman",
          "Muammo bilan rahbarimga bemalol murojaat qila olaman",
          "Baholash adolatli o'tkaziladi deb hisoblayman",
        ],
      },
      {
        icon: "❤️", name: "Sadoqat va qoniqish",
        questions: [
          "Kompaniyani tanishlarimga tavsiya qila olaman",
          "Bu yerda bir yildan keyin ham ishlashni xohlayman",
          "Mehnatim qadrlanishini his qilaman",
          "Ish sharoiti va shartlari meni qoniqtiradi",
          "Kompaniya qadriyatlari menikiga mos keladi",
          "Kompaniya maqsadiga ishonaman",
          "O'z ishimdan faxrlanaman",
          "Bu yerda o'sish imkoniyati borligini ko'raman",
        ],
      },
    ],
  },
};
