define(["app/auth"], function (auth) {
    // FirebaseUI config.
    var uiConfig = {
        callbacks: {
            signInSuccessWithAuthResult: function (authResult, redirectUrl) {
                // User successfully signed in.
                // Return type determines whether we continue the redirect automatically
                // or whether we leave that to developer to handle.
                console.log(authResult);
                return false;
            },
            /*uiShown: function () {
                // The widget is rendered.
                // Hide the loader.
                document.getElementById('loader').style.display = 'none';
            }*/
        },
        signInFlow: 'redirect',
        signInSuccessUrl: 'signedin',
        signInOptions: [
            {
                provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                // Required to enable ID token credentials for this provider.
                // This can be obtained from the Credentials page of the Google APIs
                // console. Use the same OAuth client ID used for the Google provider
                // configured with GCIP or Firebase Auth.
                clientId: '191266679593-uk5qhso27mikug9d64mtkkhor2ferhbg.apps.googleusercontent.com',
                customParameters: {
                    // Forces account selection even when one account
                    // is available.
                    prompt: 'select_account'
                }
            },
            // Leave the lines as is for the providers you want to offer your users.
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
        ],
        // Required to enable one-tap sign-up credential helper.
        credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
        // tosUrl and privacyPolicyUrl accept either url string or a callback
        // function.
        // Terms of service url/callback.
        //tosUrl: () => { },
        // Privacy policy url/callback.
        //privacyPolicyUrl: 'ptib
    };

    // Initialize the FirebaseUI Widget using Firebase.
    var ui = new firebaseui.auth.AuthUI(auth);
    // Is there an email link sign-in?
    if (ui.isPendingRedirect()) {
        ui.start('#firebaseui-auth-container', uiConfig);
    }

    return {
        start: function () {
            // The start method will wait until the DOM is loaded.
            ui.start('#firebaseui-auth-container', uiConfig);
        }
    };
});