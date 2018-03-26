window.Logger = {
    i: function (obj) {
        console.log(obj);
        if (window.GM != null) {
            window.GM.emit("logi", {
                data: obj
            });
        }
    },
    e: function (obj) {
        console.error(obj);
        if (window.GM != null) {
            window.GM.emit("loge", {
                data: obj
            });
        }
    }
}