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

const result = document.getElementById("result");

const searchBtn = document.getElementById("searchBtn");
const createBtn = document.getElementById("createBtn");
const loginBtn = document.getElementById("loginBtn");
const showAllBtn = document.getElementById("showAllBtn");

let isAdmin = false;



// PUSH NOTIFICATIONS

async function initNotifications() {

  try {

    // SERVICE WORKER

    const registration =
      await navigator.serviceWorker.register(
        "/Maintix/firebase-messaging-sw.js"
      );



    // ERLAUBNIS

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

      console.log(
        "Push Token:",
        token
      );

      alert(
        "Benachrichtigungen aktiviert"
      );

    } else {

      alert(
        "Benachrichtigungen verweigert"
      );
    }

  } catch(error) {

    console.log(error);

    alert(
      "Push Fehler: " + error
    );
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

    alert("Falsche Login Daten");
  }

});




// ALLE FEHLER ANZEIGEN

showAllBtn.addEventListener("click", async () => {

  if(!isAdmin) {

    alert("Nur für Admins");
    return;
  }

  result.innerHTML =
    "Lade alle Fehler...";

  const querySnapshot =
    await getDocs(
      collection(db, "fehler")
    );

  result.innerHTML = "";

  querySnapshot.forEach((fireDoc) => {

    const data = fireDoc.data();

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

        <button
          class="delete-btn"
          data-id="${fireDoc.id}"
        >
          Fehler löschen
        </button>

      </div>

    `;
  });

  activateDeleteButtons();

});




// DELETE BUTTONS

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

        alert("Fehler gelöscht");

        button.parentElement.remove();

      }
    );

  });

}




// FEHLER SUCHEN

searchBtn.addEventListener("click", async () => {

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

    const data = fireDoc.data();

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

        <h2>
          Keine Treffer gefunden
        </h2>

      </div>

    `;
  }

});




// FEHLER ANLEGEN

createBtn.addEventListener("click", async () => {

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



  // TEST NOTIFICATION

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

});




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

            <h2>
              Keine Fehler gefunden
            </h2>

          </div>

        `;
      }

    }
  );

});
