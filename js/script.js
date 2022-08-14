
let db;
let transaction;
const request = indexedDB.open("feedtheneedDB", 1);
request.onerror = (event) => {
    console.error("Index DB Access not allowed");
};

request.onsuccess = (event) => {
    // creating object stores
    console.log("Indexed DB Success!");
    db = event.target.result;
    transaction = db.transaction("users", "readwrite");

    transaction.oncomplete = (event) => {
        console.log("Database Transaction Done!");

    };

    transaction.onerror = (event) => {
        // Don't forget to handle errors!
        console.log("Database Transaction Error!");
    };
    register("isharaux", "Ishara Abeykoon", getPasswordHash("pass123"))
    checkUserCredsCorrect('isharaux')

};
request.onupgradeneeded = (event) => {
    let db = event.target.result;

    // create the Contacts object store
    // with auto-increment id
    let userStore = db.createObjectStore('users', {
        autoIncrement: true
    });
    let eventsStore = db.createObjectStore('events', {
        autoIncrement: true
    });


    // create an index on the username property
    let userIndex = userStore.createIndex('userName', 'userName', {
        unique: true
    });
    let eventIndex = userStore.createIndex('eventId', 'eventId', {
        unique: true
    });
};

// TODO: call this with necessary params to register
function register(userName, fullName, password){
    const userData = {
        userName: userName,
        fullName: fullName,
        password: password
    }
    transaction = db.transaction("users", "readwrite");
    const objectStore = transaction.objectStore("users");
    const request = objectStore.add(userData);
    request.onsuccess = (event) => {
        console.log("Adding Success", event)
    };
    request.onerror = (event) => {
        console.error("Adding Error", event)
    };
}


// TODO: add an event here
function addEvent(eventName, eventDescription, eventLocation){
    const eventData = {
        eventId: "",
        eventName: eventName,
        eventDescription: eventDescription,
        eventLocation: eventLocation
    }
    transaction = db.transaction("events", "readwrite");
    const objectStore = transaction.objectStore("events");
    const request = objectStore.add(eventData);
    request.onsuccess = (event) => {
        console.log("Adding Success", event)
    };
    request.onerror = (event) => {
        console.error("Adding Error", event)
    };
}

// TODO: update an event here
function updateEvent(eventName, eventDescription, eventLocation){
    const eventData = {
        eventId: "",
        eventName: eventName,
        eventDescription: eventDescription,
        eventLocation: eventLocation
    }
    transaction = db.transaction("events", "readwrite");
    const objectStore = transaction.objectStore("events");
    const request = objectStore.put(eventData);
    request.onsuccess = (event) => {
        console.log("Adding Success", event)
    };
    request.onerror = (event) => {
        console.error("Adding Error", event)
    };
}



// TODO: delete an event here
function deleteAnEvent(eventId){
    const txn = db.transaction('events', 'readwrite');

    // get the Events object store
    const store = txn.objectStore('events');
    //
    let query = store.delete(eventId);

    // handle the success case
    query.onsuccess = function (event) {
        console.log(event);
    };

    // handle the error case
    query.onerror = function (event) {
        console.log(event.target.errorCode);
    }

    // close the database once the
    // transaction completes
    txn.oncomplete = function () {
        db.close();
    };
}

function getPasswordHash(plainTextPass){
    return CryptoJS.SHA256(plainTextPass).toString();
}


// TODO: call this with necessary params to login
function checkUserCredsCorrect(username, password){

    const txn = db.transaction('users', 'readonly');
    const store = txn.objectStore('users');


    const index = store.index('userName');
    // query by indexes
    let query = index.get(username);

    query.onsuccess = (event) => {
        if (!event.target.result) {
            console.log(`The user with ${username} not found`);
        } else {
            console.table(event.target.result);
            if(event.target.result.password === getPasswordHash(pass)){
                // TODO: add correct password logic Here
            }else{
                // TODO: Add incorrect password logic here
            }
        }
    };

    query.onerror = (event) => {
        console.log(event.target.errorCode);
    }

    txn.oncomplete = function () {
        db.close();
    };
}



