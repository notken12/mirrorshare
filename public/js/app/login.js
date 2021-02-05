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

            el.fileDropzoneContainer.fadeIn("fast");

            el.auth.loginContainer.hide();

            el.auth.username.text(user.displayName);
            el.auth.email.text(user.email);
            el.auth.signOutButton.show();
            el.auth.signInButton.hide();
            el.auth.profilePicture.attr("src", user.photoURL);
            el.auth.profilePicture.show();
            

            el.auth.container.fadeIn('fast');
        }
    }
});