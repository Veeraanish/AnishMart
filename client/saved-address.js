// ==========================================
// ANISHMART SAVED DELIVERY ADDRESS
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const userText =
        localStorage.getItem("anishmartUser");

    if (!userText) {
        return;
    }

    let user;

    try {
        user = JSON.parse(userText);
    } catch {
        return;
    }

    if (!user || user.role !== "buyer") {
        return;
    }

    const buyerId = user.id;

    const orderForm =
        document.getElementById("orderForm");

    if (!orderForm) {
        return;
    }


    // ======================================
    // CREATE SAVED ADDRESS UI
    // ======================================

    const formGrid =
        orderForm.querySelector(".form-grid");

    if (formGrid) {

        const savedBox =
            document.createElement("div");

        savedBox.style.gridColumn = "1 / -1";
        savedBox.style.background = "#f3f4ff";
        savedBox.style.border = "1px solid #dfe2ff";
        savedBox.style.borderRadius = "10px";
        savedBox.style.padding = "15px";
        savedBox.style.marginTop = "5px";

        savedBox.innerHTML = `

            <label
                style="
                    display:flex;
                    gap:10px;
                    align-items:center;
                    cursor:pointer;
                    font-weight:bold;
                "
            >

                <input
                    type="checkbox"
                    id="saveDeliveryAddress"
                    checked
                    style="
                        width:18px;
                        height:18px;
                    "
                >

                ðŸ“ Save this delivery address

            </label>

            <div
                id="savedAddressStatus"
                style="
                    margin-top:8px;
                    font-size:13px;
                    color:#667eea;
                "
            >
                Checking saved address...
            </div>

            <button
                type="button"
                id="deleteSavedAddressBtn"
                style="
                    display:none;
                    margin-top:10px;
                    border:none;
                    padding:8px 12px;
                    border-radius:7px;
                    background:#ffe5e5;
                    color:#d93025;
                    font-weight:bold;
                    cursor:pointer;
                "
            >
                ðŸ—‘ï¸ Delete Saved Address
            </button>

        `;

        formGrid.appendChild(savedBox);
    }


    const status =
        document.getElementById(
            "savedAddressStatus"
        );

    const deleteButton =
        document.getElementById(
            "deleteSavedAddressBtn"
        );


    // ======================================
    // LOAD SAVED ADDRESS
    // ======================================

    async function loadSavedAddress() {

        try {

            const response =
                await fetch(
                    `/api/users/${buyerId}/address`
                );

            const data =
                await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message ||
                    "Unable to load address"
                );
            }


            if (
                !data.hasAddress ||
                !data.address
            ) {

                status.textContent =
                    "No saved address yet.";

                deleteButton.style.display =
                    "none";

                return;
            }


            const address =
                data.address;


            setValue(
                "customerName",
                address.customer_name
            );

            setValue(
                "phone",
                address.phone
            );

            setValue(
                "address",
                address.address
            );

            setValue(
                "city",
                address.city
            );

            setValue(
                "state",
                address.state
            );

            setValue(
                "pincode",
                address.pincode
            );


            status.textContent =
                "âœ… Saved address loaded automatically.";

            deleteButton.style.display =
                "inline-block";


        } catch (error) {

            console.error(
                "LOAD SAVED ADDRESS ERROR:",
                error
            );

            status.textContent =
                "Unable to load saved address.";
        }
    }


    // ======================================
    // SAVE ADDRESS
    // ======================================

    async function saveCurrentAddress() {

        const checkbox =
            document.getElementById(
                "saveDeliveryAddress"
            );


        if (
            !checkbox ||
            !checkbox.checked
        ) {
            return true;
        }


        const deliveryAddress = {

            customer_name:
                getValue("customerName"),

            phone:
                getValue("phone"),

            address:
                getValue("address"),

            city:
                getValue("city"),

            state:
                getValue("state"),

            pincode:
                getValue("pincode")
        };


        if (
            !deliveryAddress.customer_name ||
            !deliveryAddress.phone ||
            !deliveryAddress.address ||
            !deliveryAddress.city ||
            !deliveryAddress.state ||
            !deliveryAddress.pincode
        ) {
            return false;
        }


        try {

            const response =
                await fetch(
                    `/api/users/${buyerId}/address`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                deliveryAddress
                            )
                    }
                );


            const data =
                await response.json();


            if (
                !response.ok ||
                !data.success
            ) {

                throw new Error(
                    data.message ||
                    "Unable to save address"
                );
            }


            status.textContent =
                "âœ… Delivery address saved.";

            deleteButton.style.display =
                "inline-block";

            return true;


        } catch (error) {

            console.error(
                "SAVE ADDRESS ERROR:",
                error
            );

            status.textContent =
                "âŒ Address could not be saved.";

            return false;
        }
    }


    // ======================================
    // SAVE BEFORE ORDER SUBMISSION
    // ======================================

    orderForm.addEventListener(
        "submit",
        async () => {

            await saveCurrentAddress();

        },
        true
    );


    // ======================================
    // DELETE SAVED ADDRESS
    // ======================================

    deleteButton.addEventListener(
        "click",
        async () => {

            const confirmed =
                confirm(
                    "Delete your saved delivery address?"
                );

            if (!confirmed) {
                return;
            }


            try {

                const response =
                    await fetch(
                        `/api/users/${buyerId}/address`,
                        {
                            method: "DELETE"
                        }
                    );


                const data =
                    await response.json();


                if (
                    !response.ok ||
                    !data.success
                ) {

                    throw new Error(
                        data.message ||
                        "Unable to delete address"
                    );
                }


                status.textContent =
                    "Saved address deleted.";

                deleteButton.style.display =
                    "none";


            } catch (error) {

                console.error(
                    "DELETE ADDRESS ERROR:",
                    error
                );

                status.textContent =
                    "âŒ Unable to delete saved address.";
            }

        }
    );


    // ======================================
    // HELPERS
    // ======================================

    function setValue(id, value) {

        const element =
            document.getElementById(id);

        if (element && value != null) {
            element.value = value;
        }
    }


    function getValue(id) {

        const element =
            document.getElementById(id);

        return element
            ? element.value.trim()
            : "";
    }


    // INITIAL LOAD

    loadSavedAddress();

});
