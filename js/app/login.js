define(["app/auth", "app/db", "app/el"], function (auth, db, el) {
    return {
        handle: function () {
            if (!auth.currentUser)
                return false;
            var user = auth.currentUser;
            var uid = user.uid;
            var userDoc = db.collection("users").doc(uid);
            userDoc.set({
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                emailVerified: user.emailVerified,
                isAnonymous: user.isAnonymous
            });

            el.auth.signInStatus.text('Signed in as ' + user.displayName + " (" + user.email + ")");
            el.auth.signOutButton.show();
            el.auth.signInButton.hide();

        }
    }
});