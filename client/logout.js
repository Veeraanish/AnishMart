window.logout = function () {

    localStorage.removeItem(
        "anishmartUser"
    );

    fetch(
        "/api/users/logout",
        {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/json"
            },
            body: "{}",
            keepalive: true
        }
    ).catch(
        () => {}
    );

    window.location.href =
        "/index.html";
};