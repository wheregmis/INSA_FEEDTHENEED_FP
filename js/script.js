let db;
const request = indexedDB.open("feedtheneedDB");
request.onerror = (event) => {
    console.error("Why didn't you allow my web app to use IndexedDB?!");
};
request.onsuccess = (event) => {
    db = event.target.result;
};
const transaction = db.transaction(["users"], "readwrite");

transaction.oncomplete = (event) => {
    console.log("Database Transaction Done!");
};

transaction.onerror = (event) => {
    // Don't forget to handle errors!
    console.log("Database Transaction Error!");
};
function register(userName, fullName, password){
    const userData = {
        userName: userName,
        fullName: fullName,
        password: password
    }
    const objectStore = transaction.objectStore("users");

    // Hash up the password and store in database
}

function getUserByUsername(){
    db.transaction("users").objectStore("users").get("444-44-4444").onsuccess = (event) => {
        console.log(`Name for SSN 444-44-4444 is ${event.target.result.name}`);
    };
}