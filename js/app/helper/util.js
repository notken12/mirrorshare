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
    }
});