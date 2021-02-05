define(["jquery", "app/auth", "app/db", "app/storage", "app/el", "app/helper/util"], function ($, auth, db, storage, el, util) {
    // preventing page from redirecting
    $("html").on("dragover", function (e) {
        e.preventDefault();
        e.stopPropagation();
    });

    $("html").on("drop", function (e) { e.preventDefault(); e.stopPropagation(); });

    // Drag enter
    el.fileDropzone.on('dragenter', function (e) {
        e.stopPropagation();
        e.preventDefault();

        util.fadeOutNoFlicker(el.sharedFiles);

        el.fileDropzoneLabel.text("Drop file here");
        el.fileDropzoneLabel.fadeIn('fast');
    });

    // Drag over
    el.fileDropzone.on('dragover', function (e) {
        e.stopPropagation();
        e.preventDefault();

        util.fadeOutNoFlicker(el.sharedFiles);

        el.fileDropzoneLabel.text("Drop file here");
        el.fileDropzoneLabel.fadeIn('fast');
    });

    // Drag leave
    el.fileDropzone.on('dragleave', function (e) {
        e.stopPropagation();
        e.preventDefault();

        util.fadeInNoFlicker(el.sharedFiles);

        el.fileDropzoneLabel.text("Drop files here or click to choose files");
        if (el.sharedFiles.children().length < 1) {
            util.fadeInNoFlicker(el.fileDropzoneLabel);
        }
    });

    // Drop
    el.fileDropzone.on('drop', function (e) {
        e.stopPropagation();
        e.preventDefault();

        var files = e.originalEvent.dataTransfer.files;
        upload(files);
    });

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
        el.fileDropzoneLabel.text("Uploading...");

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

            var id = userDoc.collection("files").doc().id;
            //var fileDoc = userDoc.collection("files").doc(id + "." + extension)

            var fileRef = filesRef.child(id + "." + extension);

            fileRef.put(file).then(function (snapshot) {
                filesDoc.set({
                    files: [
                        {
                            uploadDate: new Date(),
                            extension: extension,
                            name: id + "." + extension
                        }
                    ]
                }).then(() => {
                    el.fileDropzoneLabel.text("Drop files here or click to choose files");
                });
                console.log("uploaded a file!");
            });
        }
    }

    el.submitFile.click(function () {
        upload(el.fileInput.prop("files"));
        el.fileInput.val(null);
    });

    return upload;

});