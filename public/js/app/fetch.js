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

            console.log('received image');

            var data = doc.data();
            var imgsToBeAdded = [];

            for (var file of data.files) {
                var filename = file.name;
                var fileRef = filesRef.child('0');

                fileRef.getDownloadURL().then((url) => {
                    console.log("retrieved url");

                    fileRef.getMetadata().then(function (metadata) {
                        var type = metadata.contentType;
                        if (type.startsWith("image")) {
                            var img = document.createElement("img");
                            img.classList.add("shared-image");
                            img.classList.add("not-loaded");
                            img.setAttribute("src", url);
                            img.setAttribute("title", "Double click or long press to copy");
                            img.setAttribute("crossorigin", "anonymous");

                            var newFileTimeout;
                            img.addEventListener('click', function (e) {
                                clearTimeout(newFileTimeout);
                                newFileTimeout = setTimeout(function() {el.fileDropzone.click()}, 750);
                            });

                            var blob;
                            var c = el.copyingCanvas;
                            var ctx = c.getContext('2d');

                            console.log('created img and ctx');

                            img.onload = function () {
                                c.width = img.naturalWidth;
                                c.height = img.naturalHeight;
                                ctx.drawImage(img, 0, 0);

                                console.log('image loaded');
                                c.toBlob((b) => {
                                    blob = b;
                                    img.classList.remove("not-loaded");

                                    console.log('created blob');


                                });

                                imgsToBeAdded.push(this);
                                if (imgsToBeAdded.length == data.files.length) {
                                    //all images are loaded
                                    //replace shared images
                                    el.sharedFiles.empty();
                                    for (var image of imgsToBeAdded) {
                                        el.sharedFiles.append(image);
                                    }
                                    util.fadeInNoFlicker(el.sharedFiles);
                                    util.fadeOutNoFlicker(el.fileDropzoneLabel);

                                }
                            }

                            var timeout;
                            $(img).on('touchstart', function () {
                                timeout = setTimeout(() => {
                                    try {
                                        navigator.clipboard.write([
                                            new ClipboardItem({ "image/png": blob })
                                        ]);
                                        console.log("copied image!");
                                    } catch (error) {
                                        console.error(error);
                                    }
                                }, 750);
                            });
                            $(img).on('touchend', function () {
                                clearTimeout(timeout);
                            });
                            $(img).on('dblclick', function () {
                                try {
                                    navigator.clipboard.write([
                                        new ClipboardItem({ "image/png": blob })
                                    ]);
                                    console.log("copied image!");
                                } catch (error) {
                                    console.error(error);
                                }
                            });
                        } else {
                            //not image, do file preview as normal file with download
                            var preview = el.createFilePreview(filename);
                            preview.classList.add('not-loaded');
                            preview.setAttribute("download", filename);

                            var xhr = new XMLHttpRequest();
                            xhr.responseType = 'blob';
                            xhr.onload = (event) => {
                                var blob = xhr.response;
                                preview.setAttribute('href', URL.createObjectURL(blob));
                                preview.classList.remove('not-loaded');
                            };
                            xhr.open('GET', url);
                            xhr.send();

                            el.sharedFiles.empty();
                            el.sharedFiles.append(preview);

                            util.fadeInNoFlicker(el.sharedFiles);
                            util.fadeOutNoFlicker(el.fileDropzoneLabel);
                        }
                    }).catch(console.error);


                });


            }
        });

    }
    return fetch;
});