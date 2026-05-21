import { app } from "./firebase.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  getMessaging,
  getToken
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";

const db = getFirestore(app);

const messaging = getMessaging(app);

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



// SERVICE WORKER

if("serviceWorker" in navigator) {

  navigator.serviceWorker.register(
    "/Maintix/firebase-messaging-sw.js"
  );

}



// PUSH

async function initNotifications() {

  try {

    const registration =
      await navigator.serviceWorker.register(
        "/Maintix/firebase-messaging-sw.js"
      );



    const permission =
      await Notification.requestPermission();



    if(permission === "granted") {

      const token = await getToken(
        messaging,
        {

          vapidKey:
          "BLiHkBw_lYWpKDjKDRO9WE995PMd5l_mKH77Bo3eRC8QVsMfHTHMuG-K8qwJhouPKidg0BJfqTYi1JkuG5eh_tg",

          serviceWorkerRegistration:
          registration

        }
      );

      console.log(token);

      alert(
        "Benachrichtigungen aktiviert"
      );

    }

  } catch(error) {

    console.log(error);

  }

}

initNotifications();




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

    result.innerHTML += createCard(
      data,
      fireDoc.id
    );

  });

  activateDeleteButtons();

}




// HTML CARD

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

    const plant =
      document
        .getElementById("newPlant")
        .value;

    const code =
      document
        .getElementById("newCode")
        .value;

    const title =
      document
        .getElementById("newTitle")
        .value;

    const solution =
      document
        .getElementById("newSolution")
        .value;



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



    new Notification(
      "Neuer Fehler erstellt",
      {

        body:
        `${plant} - ${code}`

      }
    );



    alert(
      "Fehler erfolgreich gespeichert"
    );

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
