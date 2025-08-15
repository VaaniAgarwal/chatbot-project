const icon = document.getElementById("chat-icon")
const chatbox = document.getElementById("chat-box")
const close = document.getElementById("close")
const message = document.getElementById("messages")

let flow = {};
let current = "start";

icon.addEventListener("click", () => {
    chatbox.style.display = "flex";
    show(current);
});

close.addEventListener("click", () => {
    chatbox.style.display = "none";
    message.innerHTML = "";
    current = "start";
});

function append(user, user_text, nextStep=null){
    if (user === "user"){
        const userDiv = document.createElement("div");
        userDiv.classList.add("user-container");
        const msg = document.createElement("div");
        msg.classList.add("user-msg");
        msg.textContent = user_text;
        const tail = document.createElement("div");
        tail.classList.add("user-tail");
        tail.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24">
        <path d="M24,0 Q24,24 0,24 L24,24 Z" fill="url(#userGradient)" />
        <defs>
            <linearGradient id="userGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#02BCDD" />
                <stop offset="22.14%" stop-color="#06D1E5" />
                <stop offset="52.07%" stop-color="#64EDA8" />
                <stop offset="100%" stop-color="#D0F88D" />
            </linearGradient>
        </defs>
        </svg>
        `;
        userDiv.appendChild(msg);
        userDiv.appendChild(tail);
        message.appendChild(userDiv);
    }
    else{
        const bot_div = document.createElement("div");
        bot_div.classList.add("bot-msg");
        const img = document.createElement("img");
        img.src = "typing-mr-doit.gif";
        img.alt = "Bot";
        img.classList.add("bot-img");
        const wrapTail = document.createElement("div");
        wrapTail.classList.add("bot-wrap-container");
        const msgWrap = document.createElement("div");
        msgWrap.classList.add("bot-wrap");
        msgWrap.innerHTML = user_text;
        const svgTail = document.createElement("div");
        svgTail.classList.add("bot-tail");
        svgTail.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M0,0 Q0,24 24,24 L0,24 Z" fill="rgba(0, 48, 80, 1)" />
        </svg>
        `;
        const links = msgWrap.querySelectorAll("a.chat-link");
        if (links.length > 0) {
            links.forEach(link => {
                link.addEventListener("click", function (e) {
                    e.preventDefault();
                    const url = this.href;
                    append("user", url);
                    window.open(url, "_blank");
                    if (nextStep) {
                        setTimeout(() => show(nextStep), 400);
                    }
                });
            });
        } 
        else if (nextStep) {
            setTimeout(() => show(nextStep), 400);
        }
        wrapTail.appendChild(msgWrap);
        wrapTail.appendChild(svgTail);
        bot_div.appendChild(img);
        bot_div.appendChild(wrapTail);
        message.appendChild(bot_div);
    }
    setTimeout(() => {
        message.scrollTo({ top: message.scrollHeight, behavior: "smooth" });
    }, 50);
}

function render(options, layout){
    clear();
    if (layout === "inline"){
        const row = document.createElement("div");
        row.classList.add("option-row");
        options.forEach(option => {
            const btn = document.createElement("button");
            btn.classList.add("option-btn");
            btn.textContent = option.text;
            btn.onclick = () => {
                append("user", option.text);
                clear();
                show(option.next);
            };
            row.appendChild(btn);
        });
        message.appendChild(row);
    } 
    else{
        options.forEach(option => {
            const btn = document.createElement("button");
            btn.classList.add("option-btn");
            btn.textContent = option.text;
            btn.onclick = () => {
                append("user", option.text);
                clear();
                show(option.next);
            };
            message.appendChild(btn);
        });
    }
}

function renderInput(nextStep){
    clear();
    const inputBox = document.createElement("div");
    inputBox.classList.add("input-box");
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Type your message...";
    input.classList.add("user-input");
    const send = document.createElement("button");
    send.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24">
    <defs>
        <linearGradient id="hoverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#02BCDD"/>
            <stop offset="22.14%" stop-color="#06D1E5"/>
            <stop offset="52.07%" stop-color="#64EDA8"/>
            <stop offset="100%" stop-color="#D0F88D"/>
        </linearGradient>
    </defs>
    <path d="M2 21l21-9L2 3v7l15 2-15 2z" fill="white"/>
    </svg>
    `;
    send.classList.add("send-btn");
    send.onclick = () => {
        const user_msg = input.value.trim();
        if(user_msg !== ""){
            append("user", user_msg);
            inputBox.remove();
            show(nextStep);
        }
    };
    inputBox.appendChild(input);
    inputBox.appendChild(send);
    message.appendChild(inputBox);
    input.focus();
}

function clear(){
    const b = document.querySelectorAll(".option-btn, .input-box, .option-row");
    b.forEach(btn => btn.remove());
}

function show(id){
    const step = flow[id];
    if(!step)
        return;
    if(step.expectInput){
        setTimeout(() => {
            append("bot", step.question);
            renderInput(step.next);
        }, 400);    
    } 
    else{
        setTimeout(() => {
            append("bot", step.question, step.next);
            if(step.options && step.options.length > 0){
                render(step.options, step.layout);
            }
        }, 400);
    }
}

fetch("script.json")
    .then(res => res.json())
    .then(data => {
        flow = data;
    })
