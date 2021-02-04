define(["jquery"], function ($) {
    return {
        auth: {
            signInStatus: $("#sign-in-status"),
            signInButton: $("#sign-in-button"),
            accountDetails: $("#account-details"),
            signOutButton: $("#sign-out-button")
        },
        submitFile: $("#submit-file"),
        fileInput: $("#file-input"),
        sharedImages: $("#shared-images"),
        uploadingLoader: $("#uploading-loader"),
        fileDropzone: $("#file-dropzone"),
        fileDropzoneLabel: $("#file-dropzone h1")
    }
});