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
      document.querySelector("#loggedIn-block").style.display = "block";
    } else {
      document.querySelector("#login-block").style.display = "block";
      document.querySelector("#loggedIn-block").style.display = "none";
    }
  }

  function mapFav() {
    const currentUser = {
      email: "ishara@gmail.com",
      name: "ishara",
      password: "ishara123",
      userId: 1
    }

    const events = [
      {
        eventName: "Event 1",
        eventSubtitle: "Event 1 subtitle",
        eventDescription: "Some Event Description",
        eventInvolvedUsers: [1]
      },
      {
        eventName: "Event 2",
        eventSubtitle: "Event 2 subtitle",
        eventDescription: "Some Event Description",
        eventInvolvedUsers: []
      },
      {
        eventName: "Event 3",
        eventSubtitle: "Event 3 subtitle",
        eventDescription: "Some Event Description",
        eventInvolvedUsers: [1]
      },
      {
        eventName: "Event 4",
        eventSubtitle: "Event 4 subtitle",
        eventDescription: "Some Event Description",
        eventInvolvedUsers: []
      },
      {
        eventName: "Event 5",
        eventSubtitle: "Event 5 subtitle",
        eventDescription: "Some Event Description",
        eventInvolvedUsers: []
      },
    ]
    const elements = document.querySelectorAll(".event-div");

    events.forEach((eventCard) => {
      let $div = $("<div>", {class: "row"});
      let checkInvolvement = eventCard.eventInvolvedUsers.includes(currentUser.userId);

      let eventCardItem = `
      <div class="column">
      <div class="card">
        <img src="/w3images/team1.jpg" alt="Jane" style="width: 100%" />
        <div class="container event-div">
          <h2>${eventCard.eventName}</h2>
          <p class="title">${eventCard.eventSubtitle}</p>
          <p>${eventCard.eventDescription}</p>
          <p><button class="button-team" ${checkInvolvement? 'disabled': ''}>${checkInvolvement ? "Involved" : "Involve"}</button></p>
        </div>
      </div>
    </div>
      `


      $(".row").append(eventCardItem)
     
    })
    
  }

  logoutBtn.addEventListener("click", (event) => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    alert("Logout successfull.");
    checkLogin();
  });
};
