import "./css/main.css";
import * as signalR from "@microsoft/signalr";

const divMessages: HTMLDivElement = document.querySelector("#divMessages");
const tbMessage: HTMLInputElement = document.querySelector("#tbMessage");
const btnSend: HTMLButtonElement = document.querySelector("#btnSend");
const inputZone: HTMLDivElement = document.querySelector("#inputZone");
const username = new Date().getTime();

const connection = new signalR.HubConnectionBuilder()
    .withUrl("/hub")
    .build();

connection.on("messageReceived", (username: string, message: string) => {
    let m = document.createElement("div");

    m.innerHTML =
        `<div class="message-author">${username}</div><div>${message}</div>`;

    divMessages.appendChild(m);
    divMessages.scrollTop = divMessages.scrollHeight;
});

connection.start().catch(err => document.write(err));

tbMessage.addEventListener("keyup", (e: KeyboardEvent) => {
    if (e.keyCode === 13) {
        send();
    }
});

btnSend.addEventListener("click", send);

function send() {
    connection.send("newMessage", username, tbMessage.value)
              .then(() => tbMessage.value = "");
}

//google sign-in

  function onSignIn(googleUser) {
        var profile = googleUser.getBasicProfile();
        inputZone.innerHTML = "<label id=\"lblMessage\" for=\"tbMessage\">Message:</label> \
        <input id=\"tbMessage\" class=\"input-zone-input\" type=\"text\" /> \
        <button id=\"btnSend\">Send</button> \
        <a href=\"#\" onclick=\"signOut();\">Sign out</a>";
        console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  }
  
  function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        inputZone.innerHTML = '';
        console.log('User signed out.');
    });
  }

  