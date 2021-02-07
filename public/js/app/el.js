define(["jquery"], function ($) {
    return {
        auth: {
            signInStatus: $("#sign-in-status"),
            signInButton: $("#sign-in-button"),
            accountDetails: $("#account-details"),
            signOutButton: $("#sign-out-button"),
            profilePicture: $("#profile-picture"),
            username: $("#username"),
            email: $("#email"),
            container: $("#auth-status-container"),
            loginContainer: $("#login-container")
        },
        submitFile: $("#submit-file"),
        fileInput: $("#file-input"),
        sharedFiles: $("#shared-files"),
        uploadingLoader: $("#uploading-loader"),
        fileDropzone: $("#file-dropzone"),
        fileDropzoneLabel: $("#file-dropzone h1"),
        fileDropzoneContainer: $("#file-dropzone-container"),
        copyingCanvas: document.querySelector("#copy-canvas"),
        dropEventCatcher: $("#drop-event-catcher"),
        createFilePreview: function (name) {
            var preview = document.createElement("a");
            preview.classList.add("shared-file");
            //preview.setAttribute("target", "_blank");
            preview.setAttribute("download", "");

            var fileName = document.createElement('h1');
            fileName.innerText = name;

            var downloadButton = document.createElement('button');
            downloadButton.classList.add("download-button");
            downloadButton.classList.add("material-icons-outlined");
            downloadButton.innerText = "download";

            preview.appendChild(fileName);
            preview.appendChild(downloadButton);

            return preview;
        }
    }
});