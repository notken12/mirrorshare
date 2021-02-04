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
requirejs(['jquery', 'app/helper/util', 'print', 'app/auth', 'app/db'],
function   ($, util, print, auth, db) {
    //jQuery, +other modules are all
    //loaded and can be used here now.

    //main code goes here

    print(util.getSmiley());
    print('"print" module says hi!');
    print(firebase);
    print(auth);
    print(db);
});