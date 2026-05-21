import { app } from "./firebase.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const db = getFirestore(app);

const searchBtn = document.getElementById("searchBtn");
const result = document.getElementById("result");

searchBtn.addEventListener("click", async () => {

  const errorCode = document
    .getElementById("errorInput")
    .value;

  if(errorCode === "") {
    alert("Bitte Fehlercode eingeben");
    return;
  }

  result.innerHTML = "Suche läuft...";

  const querySnapshot = await getDocs(
    collection(db, "fehler")
  );

  let found = false;

  querySnapshot.forEach((doc) => {

    const data = doc.data();

    if(data.code === errorCode) {

      found = true;

      result.innerHTML = `
        <div class="card">
          <h2>${data.code}</h2>
          <p><strong>Fehler:</strong> ${data.title}</p>
          <p><strong>Lösung:</strong> ${data.solution}</p>
        </div>
      `;
    }
  });

  if(!found) {

    result.innerHTML = `
      <div class="card">
        <h2>Fehler nicht gefunden</h2>

        <button id="saveBtn">
          Fehler speichern
        </button>
      </div>
    `;

    document
      .getElementById("saveBtn")
      .addEventListener("click", async () => {

        await addDoc(collection(db, "fehler"), {
          code: errorCode,
          title: "Neuer Fehler",
          solution: "Noch keine Lösung vorhanden"
        });

        alert("Fehler gespeichert");
      });
  }

});
