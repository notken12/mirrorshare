define(["jquery", "app/auth", "app/db", "app/storage", "app/el", "app/helper/util"], function ($, auth, db, storage, el, util) {
    // preventing page from redirecting
    $("html").on("dragover", function (e) {
        e.preventDefault();
        e.stopPropagation();

        el.dropEventCatcher.addClass("active");
    });

    $("html").on("drop", function (e) { e.preventDefault(); e.stopPropagation(); el.dropEventCatcher.removeClass("active");});

    function dragEnterOver(e) {
        e.stopPropagation();
        e.preventDefault();

        util.fadeOutNoFlicker(el.sharedFiles);

        el.fileDropzoneLabel.text("Drop file here");
        el.fileDropzone.addClass("highlight");
        util.fadeInNoFlicker(el.fileDropzoneLabel);
    }

    function dragLeave(e) {
        e.stopPropagation();
        e.preventDefault();

        util.fadeInNoFlicker(el.sharedFiles);
        el.fileDropzone.removeClass("highlight");

        el.fileDropzoneLabel.text("Drop files here or click to choose files");
        if (el.sharedFiles.children().length < 1) {
            util.fadeInNoFlicker(el.fileDropzoneLabel);
        }

        el.dropEventCatcher.removeClass("active");
    }

    function drop(e) {
        e.stopPropagation();
        e.preventDefault();

        var files = e.originalEvent.dataTransfer.files;
        upload(files);
        el.fileDropzoneLabel.text("Drop files here or click to choose files");
        el.fileDropzone.removeClass("highlight");
        el.sharedFiles.show();

        el.dropEventCatcher.removeClass("active");
    }

    // Drag enter
    el.dropEventCatcher.on('dragenter', dragEnterOver);

    // Drag over
    el.dropEventCatcher.on('dragover', dragEnterOver);

    // Drag leave
    el.dropEventCatcher.on('dragleave', dragLeave);

    // Drop
    el.dropEventCatcher.on('drop', drop);

    // Open file selector on div click
    el.fileDropzone.click(function(){
        el.fileInput.click();
    });

    // file selected
    el.fileInput.change(function(){
        var files = el.fileInput[0].files;

        upload(files);
    });

    // Create a storage reference from our storage service
    var storageRef = storage.ref();
    function upload(files) {
        if (files.length < 1) {
            //no file
            return;
        }

        
        util.fadeInNoFlicker(el.fileDropzoneLabel);
        el.fileDropzoneLabel.hide();

        var user = auth.currentUser;
        var uid = user.uid;

        var filesRef = storageRef.child("usercontent").child(uid);

        var userDoc = db.collection("users").doc(uid);
        var filesDoc = db.collection("usercontent").doc(uid);
        //TODO: move stuff to usercontent

        filesRef.listAll().then((res) => {
            res.items.forEach((itemRef) => {
                itemRef.delete();
            });
        });

        for (file of files) {
            var extension = util.getFileExtension(file.name);

            var id = /*userDoc.collection("files").doc().id*/ file.name;
            //var fileDoc = userDoc.collection("files").doc(id + "." + extension)

            var fileRef = filesRef.child('0');

            var type = file.type;
            if (type.startsWith("image")) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var image = document.createElement('img');
                    //result image data
                    image.src = e.target.result;
                    image.classList.add("shared-image");
                    image.classList.add("not-loaded");
                    el.sharedFiles.empty();
                    el.sharedFiles.append(image);
    
                    console.log('attached image');
                }
                reader.readAsDataURL(file);
            } else {
                var preview = el.createFilePreview(id);

                el.sharedFiles.empty();
                el.sharedFiles.append(preview);
                util.fadeInNoFlicker(el.sharedFiles);
            }

            

            fileRef.put(file).then(function (snapshot) {
                filesDoc.set({
                    files: [
                        {
                            uploadDate: new Date(),
                            extension: extension,
                            name: id
                        }
                    ]
                }).then(() => {
                    console.log('file uploaded!')
                });
            });
        }
    }

    el.submitFile.click(function () {
        upload(el.fileInput.prop("files"));
        el.fileInput.val(null);
    });

    return upload;

});