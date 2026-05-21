import { app } from "./firebase.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const db = getFirestore(app);

const searchBtn = document.getElementById("searchBtn");
const createBtn = document.getElementById("createBtn");

const result = document.getElementById("result");



// FEHLER SUCHEN

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
        <div class="result-card">
          <h2>${data.code}</h2>

          <p>
            <strong>Fehler:</strong>
            ${data.title}
          </p>

          <p>
            <strong>Lösung:</strong>
            ${data.solution}
          </p>
        </div>
      `;
    }
  });

  if(!found) {

    result.innerHTML = `
      <div class="result-card">
        <h2>Fehler nicht gefunden</h2>
      </div>
    `;
  }

});



// FEHLER ANLEGEN

createBtn.addEventListener("click", async () => {

  const code = document
    .getElementById("newCode")
    .value;

  const title = document
    .getElementById("newTitle")
    .value;

  const solution = document
    .getElementById("newSolution")
    .value;

  if(
    code === "" ||
    title === "" ||
    solution === ""
  ) {
    alert("Bitte alle Felder ausfüllen");
    return;
  }

  await addDoc(collection(db, "fehler"), {

    code: code,
    title: title,
    solution: solution,
    createdAt: new Date()

  });

  alert("Fehler erfolgreich gespeichert");

});
