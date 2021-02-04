define(["app/auth", "app/db"], function (auth, db) {
    // Get a reference to the storage service, which is used to create references in your storage bucket
    var storage = firebase.storage();



    return storage;
});