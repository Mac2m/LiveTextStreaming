import "./css/main.css";
import * as signalR from "@microsoft/signalr";

const divMessages: HTMLDivElement = document.querySelector("#divMessages");
const tbMessage: HTMLInputElement = document.querySelector("#tbMessage");
const btnSend: HTMLButtonElement = document.querySelector("#btnSend");
let inputZone: HTMLDivElement = document.querySelector("#inputZone");
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

function renderButton() {
    gapi.signin2.render('gSignIn', {
        'scope': 'profile email',
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': onSuccess,
        'onfailure': onFailure
    });
}
  function onSuccess(googleUser) {
    gapi.load('auth2', function() {
        let auth2 = gapi.auth2.init({
          client_id: '388924489486-97a3959qoguq9hadhbb8ff98otum7e8h.apps.googleusercontent.com',
          fetch_basic_profile: false,
          scope: 'profile'
        });
      
        // Sign the user in, and then retrieve their ID.
        auth2.signIn().then(function() {
          console.log(auth2.currentUser.get().getId());
          inputZone.innerHTML = "<label id=\"lblMessage\" for=\"tbMessage\">Message:</label> \
        <input id=\"tbMessage\" class=\"input-zone-input\" type=\"text\" /> \
        <button id=\"btnSend\">Send</button> \
        <a href=\"#\" onclick=\"signOut()\">Sign out</a>";
        });
      });
  }

  function onFailure(error) {
    alert(error);
}
  
  function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        inputZone.innerHTML = '';
        console.log('User signed out.');
    });
  }

  