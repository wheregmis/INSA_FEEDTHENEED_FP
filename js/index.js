// Constants
const userName = document.querySelector("#userName");
const logoutBtn = document.querySelector("#logout");

const involvedButton = document.querySelector(".button-team");

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
    involvedButton.addEventListener("click", addToFav);
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

    let objectStore2 = db.createObjectStore("involvedEvents", {
      keyPath: "usereventId",
      autoIncrement: true,
    });

    objectStore2.createIndex("userId", "userId", { unique: false });
    objectStore2.createIndex("eventTitle", "eventTitle", { unique: false });

    console.log("Database setup complete");
    //  alert("setup done");
    checkLogin();
    mapFav();
    involvedButton.addEventListener("click", addToFav);
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

  function addToFav() {
    // grab the values entered into the form fields and store them in an object ready for being inserted into the DB
    let user = localStorage.getItem("user");
    user = user ? user : sessionStorage.getItem("user");
    let newFav = {
      userId: user.userId,
      eventTitle: "Food Distribution in Toronto",
    };

    // open a read/write db transaction, ready for adding the data
    let transaction = db.transaction(["involvedEvents"], "readwrite");

    // call an object store that's already been added to the database
    let objectStore = transaction.objectStore("involvedEvents");

    // Make a request to add our newUser object to the object store
    var request = objectStore.add(newFav);
    request.onsuccess = function () {
      alert("Successfully added to your involved events list");
    };

    // Report on the success of the transaction completing, when everything is done
    transaction.oncomplete = function () {
      console.log("Transaction completed: database modification finished.");
    };

    transaction.onerror = function () {
      console.log("Transaction not opened due to error");
    };
  }

  function mapFav() {
    const elements = document.querySelectorAll(".event-div");
    Array.from(elements).forEach((element, indexmain) => {
      // conditional logic here.. access element
      console.log(element.querySelector(".title").innerHTML);
      if (
        element.querySelector(".title").innerHTML ==
        "Food Distribution in Toronto"
      ) {
        element.querySelector(".button-team").innerHTML = "Involved";
        console.log(element.querySelector(".button-team").innerHTML);
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
