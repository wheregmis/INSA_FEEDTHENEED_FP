// Constants
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const rememberMe = document.querySelector("#remember");

const form = document.querySelector("#loginForm");

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

    console.log("Database setup complete");
    //  alert("setup done");
  };
  // -------------------- For DB END --------------------

  // Create an onsubmit handler so that when the form is submitted the login() function is run
  form.onsubmit = login;

  // Define the login() function
  function login(e) {
    // prevent default - we don't want the form to submit in the conventional way
    e.preventDefault();

    // open a read/write db transaction, ready for adding the data
    let transaction = db.transaction(["users"], "readonly");

    let objectStore = transaction.objectStore("users");
    var request = objectStore.getAll();

    request.onsuccess = function (e) {
      var result = e.target.result;
      console.log("request", result);

      //alert(result);
      if (typeof result == "undefined") {
        alert("Invalid User");
      } else {
        var user = result.find(
          (x) => x.email.toLowerCase() == emailInput.value.toLowerCase()
        );
        if (user) {
          if (user.password == passwordInput.value) {
            console.log("Login successful");
            alert("Login Successful !!");

            sessioninfo({ ...user, rememberMe: rememberMe.checked });
          } else {
            console.log("Invalid Password");
            alert("Invalid Password !!");
          }
        } else {
          alert("User Not Found");
        }
      }
      // console.dir(result);
    };
    request.onerror = function (e) {
      console.log("Invalid ID");
      console.dir(e);
    };
  }
};

function sessioninfo(user) {
  if (user.rememberMe) {
    // store locally
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    // store temporarily in session
    sessionStorage.setItem("user", JSON.stringify(user));
  }
  window.location.href = "index.html";
}
