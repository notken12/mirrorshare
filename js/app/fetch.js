define(["app/auth", "app/db", "app/storage", "app/el"], function(auth, db, storage, el) {
    function fetch() {
        var user = auth.currentUser;
        var uid = user.uid;

        var storageRef = storage.ref();
        var filesRef = storageRef.child("usercontent").child(uid);
        
        var userDoc = db.collection("users").doc(uid);
        var userFilesDoc = db.collection("usercontent").doc(uid);

        userFilesDoc.onSnapshot((doc) => {
            if (!doc.exists) {
                return;
            }

            var data = doc.data();
            var imgsToBeAdded = [];

            for (var file of data.files) {
                var filename = file.name;
                var fileRef = filesRef.child(filename);

                fileRef.getDownloadURL().then((url) => {
                    var img = document.createElement("img");
                    img.classList.add("shared-image");
                    img.setAttribute("src", url);

                    imgsToBeAdded.push(img);
                    if (imgsToBeAdded.length == data.files.length) {
                        //all images are loaded
                        //replace shared images
                        el.sharedImages.empty();
                        for (var img of imgsToBeAdded) {
                            el.sharedImages.append(img);
                        }
                    }
                });
                
            }
        });

    }
    return fetch;
});