import { app } from "./firebase.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const db = getFirestore(app);

const result = document.getElementById("result");

const searchBtn = document.getElementById("searchBtn");
const createBtn = document.getElementById("createBtn");
const loadPlantBtn = document.getElementById("loadPlantBtn");



// FEHLER SUCHEN

searchBtn.addEventListener("click", async () => {

  const searchText = document
    .getElementById("errorInput")
    .value
    .toLowerCase();

  result.innerHTML = "Suche läuft...";

  const querySnapshot = await getDocs(
    collection(db, "fehler")
  );

  result.innerHTML = "";

  let found = false;

  querySnapshot.forEach((doc) => {

    const data = doc.data();

    const code = data.code?.toLowerCase() || "";
    const title = data.title?.toLowerCase() || "";
    const solution = data.solution?.toLowerCase() || "";
    const plant = data.plant?.toLowerCase() || "";



    if(

      code.includes(searchText) ||
      title.includes(searchText) ||
      solution.includes(searchText) ||
      plant.includes(searchText)

    ) {

      found = true;

      result.innerHTML += `

        <div class="result-card">

          <h2>${data.code}</h2>

          <p>
            <strong>Anlage:</strong>
            ${data.plant}
          </p>

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

  const plant = document
    .getElementById("newPlant")
    .value;

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

    plant: plant,
    code: code,
    title: title,
    solution: solution,
    createdAt: new Date()

  });

  alert("Fehler erfolgreich gespeichert");

});




// FEHLER NACH ANLAGE

loadPlantBtn.addEventListener("click", async () => {

  const selectedPlant = document
    .getElementById("plantSelect")
    .value;

  result.innerHTML = "Lade Fehler...";

  const querySnapshot = await getDocs(
    collection(db, "fehler")
  );

  result.innerHTML = "";

  let found = false;

  querySnapshot.forEach((doc) => {

    const data = doc.data();

    if(data.plant === selectedPlant) {

      found = true;

      result.innerHTML += `

        <div class="result-card">

          <h2>${data.code}</h2>

          <p>
            <strong>Anlage:</strong>
            ${data.plant}
          </p>

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

        <h2>Keine Fehler gefunden</h2>

      </div>

    `;
  }

});
