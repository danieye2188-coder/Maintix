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
const loadBtn = document.getElementById("loadBtn");

const result = document.getElementById("result");
const errorList = document.getElementById("errorList");



// FEHLER SUCHEN

searchBtn.addEventListener("click", async () => {

  const searchText = document
    .getElementById("errorInput")
    .value
    .toLowerCase();

  if(searchText === "") {

    alert("Bitte Suchbegriff eingeben");
    return;
  }

  result.innerHTML = "Suche läuft...";

  const querySnapshot = await getDocs(
    collection(db, "fehler")
  );

  let found = false;

  result.innerHTML = "";

  querySnapshot.forEach((doc) => {

    const data = doc.data();

    const code = data.code?.toLowerCase() || "";
    const title = data.title?.toLowerCase() || "";
    const solution = data.solution?.toLowerCase() || "";



    // SUCHLOGIK

    if(
      code.includes(searchText) ||
      title.includes(searchText) ||
      solution.includes(searchText)
    ) {

      found = true;

      result.innerHTML += `

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

        <h2>Keine Treffer gefunden</h2>

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



// ALLE FEHLER LADEN

loadBtn.addEventListener("click", async () => {

  errorList.innerHTML = "Lade Fehler...";

  const querySnapshot = await getDocs(
    collection(db, "fehler")
  );

  errorList.innerHTML = "";

  querySnapshot.forEach((doc) => {

    const data = doc.data();

    errorList.innerHTML += `

      <div class="error-item">

        <h3>${data.code}</h3>

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
  });

});
