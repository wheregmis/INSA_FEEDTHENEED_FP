// Constants
const userName = document.querySelector("#userName");
const logoutBtn = document.querySelector("#logout");

// Create an instance of a db object for us to store the open database in
let db;

window.onload = function () {
  // -------------------- For DB --------------------
  // Open our database; it is created if it doesn't already exist
  let request = window.indexedDB.open("feedtheneed", 1);

  // onerror handler signifies that the database didn't open successfully
  request.onerror = function () {
    console.log("Database failed to open");
  };

  // onsuccess handler signifies that the database opened successfully
  request.onsuccess = function () {
    console.log("Database opened succesfully");
    checkLogin();
    mapFav();
    // Store the opened database object in the db variable. This is used a lot below
    db = request.result;
  };

  // Setup the database tables if this has not already been done
  request.onupgradeneeded = function (e) {
    // Grab a reference to the opened database
    let db = e.target.result;

    let objectStore = db.createObjectStore("users", {
      keyPath: "userId",
      autoIncrement: true,
    });

    objectStore.createIndex("password", "password", { unique: false });
    objectStore.createIndex("name", "name", { unique: false });
    objectStore.createIndex("email", "email", { unique: false });

    console.log("Database setup complete");
    //  alert("setup done");
    checkLogin();
    mapFav();
  };
  // -------------------- For DB END --------------------

  function checkLogin() {
    let user = localStorage.getItem("user");
    user = user ? user : sessionStorage.getItem("user");

    const isLoggedIn = user ? true : false;
    console.log(isLoggedIn);

    if (isLoggedIn) {
      document.querySelector("#userName").innerHTML = JSON.parse(user).name;
      document.querySelector("#login-block").style.display = "none";
      document.querySelector("#loggedIn-block").style.display = "inline";
    } else {
      document.querySelector("#login-block").style.display = "inline";
      document.querySelector("#loggedIn-block").style.display = "none";
    }
  }

  function mapFav() {
    const elements = document.querySelectorAll(".event-div");
    Array.from(elements).forEach((element, indexmain) => {
      // conditional logic here.. access element

      if (element.querySelector(".title") == "Food Distribution in Toronto") {
        element.querySelector(".button-team").innerHTML = "Involved";
      }
    });
  }

  logoutBtn.addEventListener("click", (event) => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    alert("Logout successfull.");
    checkLogin();
  });
};
