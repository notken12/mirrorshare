//use require.js https://requirejs.org/docs/api.html

requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js/lib',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        app: '../app'
    }
});

const firebaseConfig = {
    apiKey: "AIzaSyBJ_KEMc9j-xIjp5upukaC31KH0TbY7J9Q",
    authDomain: "mirror-share.firebaseapp.com",
    projectId: "mirror-share",
    storageBucket: "mirror-share.appspot.com",
    messagingSenderId: "191266679593",
    appId: "1:191266679593:web:87f1573f22ed34551ae538",
    measurementId: "G-XG3R6KJR4X"
};
firebase.initializeApp(firebaseConfig);

// Start the main app logic.
requirejs(['jquery', 'app/helper/util', 'print', 'app/auth', 'app/db', 'app/el', 'app/authui',
    'app/login', 'app/logout', 'app/fetch', 'app/storage', 'app/upload'],
    function ($, util, print, auth, db, el, authui, login, logout, fetch, storage, upload) {
        //jQuery, +other modules are all
        //loaded and can be used here now.

        //main code goes here

        print(util.getSmiley());
        print('"print" module says hi!');
        print(firebase);
        print(auth);
        print(db);

        // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
        let vh = window.innerHeight * 0.01;
        // Then we set the value in the --vh custom property to the root of the document
        document.documentElement.style.setProperty('--vh', `${vh}px`);

        // We listen to the resize event
        window.addEventListener('resize', () => {
            // We execute the same script as before
            let vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        });

        auth.onAuthStateChanged(function (user) {
            if (user) {

                // User is signed in.
                var displayName = user.displayName;
                var email = user.email;
                var emailVerified = user.emailVerified;
                var photoURL = user.photoURL;
                var uid = user.uid;
                var phoneNumber = user.phoneNumber;
                var providerData = user.providerData;

                login.handle();
                fetch();

                el.auth.signOutButton.click(function () {
                    auth.signOut();
                    logout.handle();
                });
            } else {
                // User is signed out.
                el.auth.username.text('Signed out');
                el.auth.signInButton.show();
                el.auth.signOutButton.hide();

                el.auth.signInButton.click(() => {
                    authui.start();
                    el.auth.signInButton.hide();
                    $("#homepage-title").hide();
                    util.fadeInNoFlicker($("#firebaseui-auth-container"));
                });
                el.auth.loginContainer.fadeIn('slow');
            }
        }, function (error) {
            console.log(error);
        });
    });