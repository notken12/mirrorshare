define({
    getSmiley: function () {
        return ":D";
    },
    getFileExtension: function (filename) {
        var a = filename.split(".");
        if (a.length === 1 || (a[0] === "" && a.length === 2)) {
            return "";
        }
        return a.pop();
    },
    fadeInNoFlicker: function (e, speed) {
        if (!e.is(':visible')) {
            e.fadeIn(speed || 'fast');
        }
    },
    fadeOutNoFlicker: function (e, speed) {
        if (e.is(':visible')) {
            e.fadeOut(speed || 'fast');
        }
    },
    selectText: function (element) {
        var doc = document;
        if (doc.body.createTextRange) {
            var range = document.body.createTextRange();
            range.moveToElementText(element);
            range.select();
        } else if (window.getSelection) {
            var selection = window.getSelection();
            var range = document.createRange();
            range.selectNodeContents(element);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }
});