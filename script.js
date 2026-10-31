// Firebase modülleri
import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Firebase yapılandırması
const firebaseConfig = {
  apiKey: "AIzaSyCTAARKP1spxG1zfo6tyCq2o0zt4VMLIUM",
  authDomain: "kutuphanerezervasyon-ff667.firebaseapp.com",
  projectId: "kutuphanerezervasyon-ff667",
  storageBucket: "kutuphanerezervasyon-ff667.firebasestorage.app",
  messagingSenderId: "856718475446",
  appId: "1:856718475446:web:bf948285bc6db322d1a617"
};

// Firebase ve Firestore başlat
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sayfa yüklenince masaları çek ve sırayla listele
window.addEventListener('DOMContentLoaded', async () => {
  const masaSelect = document.getElementById('masa');
  const masalarRef = collection(db, "masalar");
  const q = query(masalarRef, orderBy("masaNo", "asc"));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    if (data.durum === "boş") {
      const option = document.createElement("option");
      option.value = docSnap.id; // belge ID
      option.textContent = `Masa ${data.masaNo}`;
      option.dataset.masaNo = data.masaNo;
      masaSelect.appendChild(option);
    }
  });
});

// Formu dinle
document.getElementById('reservationForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  const masaSelect = document.getElementById('masa');
  const masaBelgeID = masaSelect.value;
  const masaNo = parseInt(masaSelect.options[masaSelect.selectedIndex].dataset.masaNo);

  if (!masaBelgeID) {
    alert("Lütfen bir masa seçin.");
    return;
  }

  try {
    // 1. Rezervasyonu kaydet
    await addDoc(collection(db, "reservations"), {
      name,
      date,
      time,
      masaNo
    });

    // 2. Masa durumunu güncelle
    const masaRef = doc(db, "masalar", masaBelgeID);
    await updateDoc(masaRef, {
      durum: "dolu"
    });

    alert("Rezervasyon kaydedildi ve masa işaretlendi!");
    location.reload(); // sayfayı yenile, boş masalar tekrar yüklensin
  } catch (error) {
    alert("Hata oluştu: " + error.message);
    console.error("Rezervasyon ekleme hatası:", error);
  }
});
