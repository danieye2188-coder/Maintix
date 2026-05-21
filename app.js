import { app } from "./firebase.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const db = getFirestore(app);

const result =
  document.getElementById("result");

const searchBtn =
  document.getElementById("searchBtn");

const createBtn =
  document.getElementById("createBtn");

const loginBtn =
  document.getElementById("loginBtn");

const showAllBtn =
  document.getElementById("showAllBtn");

let isAdmin = false;

let knownErrors = [];




// LIVE SYSTEM

onSnapshot(
  collection(db, "fehler"),
  (snapshot) => {

    const currentErrors = [];

    snapshot.forEach((doc) => {

      currentErrors.push(doc.id);

    });



    // NEUER FEHLER

    if(
      knownErrors.length > 0 &&
      currentErrors.length >
      knownErrors.length
    ) {

      showLiveNotification();

    }



    knownErrors = currentErrors;

  }
);




// LIVE POPUP

function showLiveNotification() {

  const popup =
    document.createElement("div");

  popup.className =
    "live-popup";

  popup.innerHTML = `

    🔴 Neuer Fehler erstellt

  `;

  document.body.appendChild(popup);



  // SOUND

  const audio =
    new Audio(
      "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
    );

  audio.play();



  // VIBRATION HANDY

  if(navigator.vibrate) {

    navigator.vibrate(300);

  }



  setTimeout(() => {

    popup.remove();

  }, 4000);

}




// ADMIN LOGIN

loginBtn.addEventListener("click", () => {

  const user =
    document.getElementById("adminUser").value;

  const pass =
    document.getElementById("adminPass").value;

  if(
    user === "admin" &&
    pass === "1234"
  ) {

    isAdmin = true;

    document.getElementById(
      "loginStatus"
    ).innerText =
      "Admin erfolgreich eingeloggt";

  } else {

    alert(
      "Falsche Login Daten"
    );
  }

});




// FEHLER KARTE

function createCard(data, id="") {

  return `

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

      ${isAdmin ? `

      <button
        class="delete-btn"
        data-id="${id}"
      >
        Fehler löschen
      </button>

      ` : ""}

    </div>

  `;
}




// DELETE

function activateDeleteButtons() {

  const deleteButtons =
    document.querySelectorAll(".delete-btn");

  deleteButtons.forEach((button) => {

    button.addEventListener(
      "click",
      async () => {

        const id =
          button.dataset.id;

        await deleteDoc(
          doc(db, "fehler", id)
        );

        alert(
          "Fehler gelöscht"
        );

        loadAllErrors();

      }
    );

  });

}




// ALLE FEHLER

showAllBtn.addEventListener(
  "click",
  async () => {

    if(!isAdmin) {

      alert("Nur für Admins");
      return;
    }

    loadAllErrors();

  }
);




// FEHLER LADEN

async function loadAllErrors() {

  result.innerHTML =
    "Lade Fehler...";

  const querySnapshot =
    await getDocs(
      collection(db, "fehler")
    );

  result.innerHTML = "";

  querySnapshot.forEach((fireDoc) => {

    const data =
      fireDoc.data();

    result.innerHTML +=
      createCard(
        data,
        fireDoc.id
      );

  });

  activateDeleteButtons();

}




// SUCHE

searchBtn.addEventListener(
  "click",
  async () => {

    const searchText =
      document
        .getElementById("errorInput")
        .value
        .toLowerCase();

    result.innerHTML =
      "Suche läuft...";

    const querySnapshot =
      await getDocs(
        collection(db, "fehler")
      );

    result.innerHTML = "";

    let found = false;

    querySnapshot.forEach((fireDoc) => {

      const data =
        fireDoc.data();

      const code =
        data.code?.toLowerCase() || "";

      const title =
        data.title?.toLowerCase() || "";

      const solution =
        data.solution?.toLowerCase() || "";

      const plant =
        data.plant?.toLowerCase() || "";



      if(

        code.includes(searchText) ||
        title.includes(searchText) ||
        solution.includes(searchText) ||
        plant.includes(searchText)

      ) {

        found = true;

        result.innerHTML +=
          createCard(
            data,
            fireDoc.id
          );
      }

    });

    if(!found) {

      result.innerHTML = `

        <div class="result-card">

          <h2>
            Keine Treffer gefunden
          </h2>

        </div>

      `;
    }

    activateDeleteButtons();

  }
);




// FEHLER ANLEGEN

createBtn.addEventListener(
  "click",
  async () => {

    try {

      const plant =
        document
          .getElementById("newPlant")
          .value
          .trim();

      const code =
        document
          .getElementById("newCode")
          .value
          .trim();

      const title =
        document
          .getElementById("newTitle")
          .value
          .trim();

      const solution =
        document
          .getElementById("newSolution")
          .value
          .trim();



      if(
        plant === "" ||
        code === "" ||
        title === "" ||
        solution === ""
      ) {

        alert(
          "Bitte alle Felder ausfüllen"
        );

        return;
      }



      createBtn.disabled = true;

      createBtn.innerText =
        "Speichert...";



      await addDoc(
        collection(db, "fehler"),
        {

          plant: plant,
          code: code,
          title: title,
          solution: solution,
          createdAt: new Date()

        }
      );



      alert(
        "Fehler erfolgreich gespeichert"
      );



      document
        .getElementById("newPlant")
        .value = "";

      document
        .getElementById("newCode")
        .value = "";

      document
        .getElementById("newTitle")
        .value = "";

      document
        .getElementById("newSolution")
        .value = "";



    } catch(error) {

      console.log(error);

      alert(
        "Fehler: " + error
      );

    }



    createBtn.disabled = false;

    createBtn.innerText =
      "Fehler anlegen";

  }
);




// ANLAGEN BUTTONS

const plantButtons =
  document.querySelectorAll(".plant-btn");

plantButtons.forEach((button) => {

  button.addEventListener(
    "click",
    async () => {

      const selectedPlant =
        button.innerText;

      result.innerHTML =
        "Lade Fehler...";

      const querySnapshot =
        await getDocs(
          collection(db, "fehler")
        );

      result.innerHTML = "";

      let found = false;

      querySnapshot.forEach((fireDoc) => {

        const data =
          fireDoc.data();

        if(
          data.plant ===
          selectedPlant
        ) {

          found = true;

          result.innerHTML +=
            createCard(
              data,
              fireDoc.id
            );
        }

      });

      if(!found) {

        result.innerHTML = `

          <div class="result-card">

            <h2>
              Keine Fehler gefunden
            </h2>

          </div>

        `;
      }

      activateDeleteButtons();

    }
  );

});
