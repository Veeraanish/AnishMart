(function () {
    const style = document.createElement("style");

    style.textContent = `
        #anishmart-chat-btn {
            position: fixed;
            right: 20px;
            bottom: 20px;
            width: 58px;
            height: 58px;
            border: none;
            border-radius: 50%;
            background: #2563eb;
            color: white;
            font-size: 25px;
            cursor: pointer;
            box-shadow: 0 6px 20px rgba(0,0,0,.25);
            z-index: 9998;
        }

        #anishmart-chat-panel {
            position: fixed;
            right: 20px;
            bottom: 90px;
            width: 330px;
            max-width: calc(100vw - 30px);
            height: 430px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 10px 35px rgba(0,0,0,.25);
            display: none;
            flex-direction: column;
            overflow: hidden;
            z-index: 9999;
            font-family: Arial, sans-serif;
        }

        #anishmart-chat-header {
            background: #2563eb;
            color: white;
            padding: 14px;
            font-weight: bold;
        }

        #anishmart-chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 12px;
            background: #f8fafc;
        }

        .anish-chat-msg {
            margin: 8px 0;
            padding: 9px 11px;
            border-radius: 12px;
            max-width: 85%;
            line-height: 1.4;
            font-size: 14px;
        }

        .anish-chat-user {
            margin-left: auto;
            background: #2563eb;
            color: white;
        }

        .anish-chat-bot {
            margin-right: auto;
            background: #e2e8f0;
            color: #111827;
        }

        #anishmart-chat-input-area {
            display: flex;
            gap: 6px;
            padding: 10px;
            border-top: 1px solid #ddd;
            background: white;
        }

        #anishmart-chat-input {
            flex: 1;
            padding: 10px;
            border: 1px solid #cbd5e1;
            border-radius: 9px;
            outline: none;
        }

        #anishmart-chat-send {
            border: none;
            background: #2563eb;
            color: white;
            padding: 10px 14px;
            border-radius: 9px;
            cursor: pointer;
        }
    `;

    document.head.appendChild(style);

    const button = document.createElement("button");
    button.id = "anishmart-chat-btn";
    button.innerHTML = "💬";
    button.title = "AnishMart Assistant";

    const panel = document.createElement("div");
    panel.id = "anishmart-chat-panel";

    panel.innerHTML = `
        <div id="anishmart-chat-header">
            🤖 AnishMart Assistant
        </div>

        <div id="anishmart-chat-messages">
            <div class="anish-chat-msg anish-chat-bot">
                Hi! Ask me about products, cart, orders, delivery, COD, wishlist or reviews.
            </div>
        </div>

        <div id="anishmart-chat-input-area">
            <input
                id="anishmart-chat-input"
                type="text"
                maxlength="300"
                placeholder="Type your question..."
            >
            <button id="anishmart-chat-send">Send</button>
        </div>
    `;

    document.body.appendChild(panel);
    document.body.appendChild(button);

    const messages =
        document.getElementById("anishmart-chat-messages");

    const input =
        document.getElementById("anishmart-chat-input");

    const send =
        document.getElementById("anishmart-chat-send");

    button.addEventListener("click", () => {
        panel.style.display =
            panel.style.display === "flex"
                ? "none"
                : "flex";

        if (panel.style.display === "flex") {
            input.focus();
        }
    });

    function addMessage(text, type) {
        const div = document.createElement("div");

        div.className =
            "anish-chat-msg " +
            (
                type === "user"
                    ? "anish-chat-user"
                    : "anish-chat-bot"
            );

        div.textContent = text;

        messages.appendChild(div);

        messages.scrollTop =
            messages.scrollHeight;
    }

    async function sendMessage() {
        const message =
            input.value.trim();

        if (!message) {
            return;
        }

        addMessage(
            message,
            "user"
        );

        input.value = "";

        send.disabled = true;

        try {
            const response =
                await fetch(
                    "/api/chat",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body:
                            JSON.stringify({
                                message
                            })
                    }
                );

            const data =
                await response.json();

            addMessage(
                data.reply ||
                "Sorry, I could not answer that question.",
                "bot"
            );

        } catch (error) {
            addMessage(
                "Chat service is temporarily unavailable. Please try again later.",
                "bot"
            );
        }

        send.disabled = false;
        input.focus();
    }

    send.addEventListener(
        "click",
        sendMessage
    );

    input.addEventListener(
        "keydown",
        event => {
            if (
                event.key === "Enter"
            ) {
                sendMessage();
            }
        }
    );
})();