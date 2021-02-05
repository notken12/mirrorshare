define(["app/auth", "app/db", "app/storage", "app/el", "app/helper/util"], function (auth, db, storage, el, util) {
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
                    img.setAttribute("title", "Click to copy");
                    img.setAttribute("crossorigin", "anonymous");
                    img.addEventListener('click', function () {
                        /*var xhr = new XMLHttpRequest();
                        xhr.responseType = 'blob';
                        xhr.onload = (event) => {
                            var blob = xhr.response;
                            var i = {};
                            i["blob.type"] = blob;
                            try {
                                navigator.clipboard.write([
                                    new ClipboardItem(i)
                                ]);
                            } catch (error) {
                                console.error(error);
                            }
                        };
                        xhr.open('GET', url);
                        xhr.send();*/

                        var c = document.createElement('canvas');
                        var ctx = c.getContext('2d');
                        c.width = this.naturalWidth;
                        c.height = this.naturalHeight;
                        ctx.drawImage(this, 0, 0);
                        var imgBlob;
                        c.toBlob((blob)=>{
                            try {
                                navigator.clipboard.write([
                                    new ClipboardItem({"image/png": blob})
                                ]);
                            } catch (error) {
                                console.error(error);
                            }
                        });
                        
                    });

                    imgsToBeAdded.push(img);
                    if (imgsToBeAdded.length == data.files.length) {
                        //all images are loaded
                        //replace shared images
                        el.sharedFiles.empty();
                        for (var img of imgsToBeAdded) {
                            el.sharedFiles.append(img);
                        }
                        util.fadeInNoFlicker(el.sharedFiles);
                        util.fadeOutNoFlicker(el.fileDropzoneLabel);
                    }
                });


            }
        });

    }
    return fetch;
});