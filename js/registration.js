// Constants
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#confirmPsw");
const nameInput = document.querySelector("#name");
const chkInput = document.querySelector("#chk");
const form = document.querySelector("#registrationForm");

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

    let eventObjectStore = db.createObjectStore("events", {
      keyPath: "eventId",
      autoIncrement: true,
    });
    eventObjectStore.createIndex("eventName", "eventName", { unique: false });

    objectStore.createIndex("password", "password", { unique: false });
    objectStore.createIndex("name", "name", { unique: false });
    objectStore.createIndex("email", "email", { unique: false });

    console.log("Database setup complete");
    //  alert("setup done");
  };
  // -------------------- For DB END --------------------

  // Create an onsubmit handler so that when the form is submitted the register() function is run
  form.onsubmit = register;

  // Define the register() function
  function register(e) {
    // prevent default - we don't want the form to submit in the conventional way
    e.preventDefault();
    if (chkInput.checked) {
      if (confirmPasswordInput.value == passwordInput.value) {
        if (validateEmail(emailInput.value)) {
          // grab the values entered into the form fields and store them in an object ready for being inserted into the DB
          let newUser = {
            password: passwordInput.value,
            name: nameInput.value,
            email: emailInput.value,
          };

          // open a read/write db transaction, ready for adding the data
          let transaction = db.transaction(["users"], "readwrite");

          // call an object store that's already been added to the database
          let objectStore = transaction.objectStore("users");

          // Make a request to add our newUser object to the object store
          var request = objectStore.add(newUser);
          request.onsuccess = function () {
            alert("Registration Successful..Redirecting to Login Page !!");

            window.location.href = "login.html";
          };

          // Report on the success of the transaction completing, when everything is done
          transaction.oncomplete = function () {
            console.log(
              "Transaction completed: database modification finished."
            );
          };

          transaction.onerror = function () {
            console.log("Transaction not opened due to error");
          };
        } else {
          alert("Invalid Email");
        }
      } else {
        alert("Password and confirm password doesn't match.");
      }
    } else {
      alert("Kindly confirm the checkbox before proceeding");
    }
  }

  function validateEmail(email) {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  }
};
