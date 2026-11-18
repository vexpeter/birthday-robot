const admin = require("firebase-admin");

// A titkos Firebase kulcs beolvasása
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// A te születésnapi listád
const people = {
  "Apa": "1979-08-26",
  "Anya": "1981-08-23",
  "Tomi": "2012-01-18",
  "Petya": "2014-04-04"
};

async function run() {
  const today = new Date();
  const thisYear = today.getFullYear();
  const todayUTC = Date.UTC(thisYear, today.getMonth(), today.getDate());

  for (const [name, dateStr] of Object.entries(people)) {
    const [birthYear, birthMonth, birthDay] = dateStr.split("-").map(Number);
    
    let birthdayThisYear = Date.UTC(thisYear, birthMonth - 1, birthDay);
    let targetYear = thisYear;

    if (todayUTC > birthdayThisYear) {
      targetYear = thisYear + 1;
      birthdayThisYear = Date.UTC(targetYear, birthMonth - 1, birthDay);
    }

    const daysUntil = Math.round((birthdayThisYear - todayUTC) / (1000 * 60 * 60 * 24));
    const ageNext = targetYear - birthYear;

    if (daysUntil === 10 || daysUntil === 1 || daysUntil === 0) {
      let title = "";
      let body = "";

      if (daysUntil === 10) {
        title = `⏳ 10 nap múlva ${name} születésnapja!`;
        body = `${name} ${ageNext} éves lesz 10 nap múlva. Ideje ajándékon gondolkodni!`;
      } else if (daysUntil === 1) {
        title = `⚠️ Holnap lesz ${name} születésnapja!`;
        body = `Már csak 1 nap, és ${name} betölti a ${ageNext}. életévét!`;
      } else if (daysUntil === 0) {
        title = `🎉 Boldog születésnapot: ${name}!`;
        body = `Ma van ${name} születésnapja! Ma lett ${ageNext} éves.`;
      }

      // Push értesítés küldése minden eszközre (a WebIntoApp az 'all' témára iratkoztat fel)
      const message = {
        notification: { title, body },
        topic: "all"
      };

      await admin.messaging().send(message);
      console.log(`Értesítés elküldve: ${title}`);
    }
  }
}

run();