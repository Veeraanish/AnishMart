(function () {

    window.logout = function () {

        try {

            fetch(
                "/api/users/logout",
                {
                    method: "POST",
                    keepalive: true
                }
            ).catch(() => {});

        } catch (error) {
            // Local storage is still cleared below.
        }

        localStorage.removeItem(
            "anishmartUser"
        );
    };

})();