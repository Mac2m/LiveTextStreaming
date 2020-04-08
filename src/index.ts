import "./css/main.css";
import * as signalR from "@microsoft/signalr";

var divMessages: HTMLDivElement = document.querySelector("#divMessages");
var tbMessage: HTMLInputElement = document.querySelector("#tbMessage");
var inputZone: HTMLDivElement = document.querySelector("#inputZone");
let username: string;
var useravatar;
var isGapiLoaded: boolean = isGapiLoaded;

function renderInput(profile: any) {
    username = profile.getName();
    useravatar = profile.getImageUrl();
      inputZone.innerHTML = "<label id=\"lblMessage\" for=\"tbMessage\">Message:</label> \
      <input id=\"tbMessage\" class=\"input-zone-input\" type=\"text\" /> \
      <button id=\"btnSend\">Send</button> \
      <a href=\"#\" id=\"singoutbtn\">Sign out</a>";
      divMessages = document.querySelector("#divMessages");
      tbMessage = document.querySelector("#tbMessage");
      //(document.querySelector(".g-signin2") as HTMLDivElement).style.display = "none";
      document.addEventListener('click',function(e){
        if((e.target as HTMLButtonElement).id == 'btnSend'){
              send();
         }
      });
      document.addEventListener('click',function(e){
        if((e.target as HTMLButtonElement).id == 'singoutbtn'){
              signOut();
         }
      });
}

(<any>window).renderInput = renderInput;

  function signOut() {
    gapi.auth2.getAuthInstance().signOut()
    .then(function () {
        location.reload();
        console.log('User signed out.');
    });
  }

  //signalr

const connection = new signalR.HubConnectionBuilder()
    .withUrl("/hub")
    .build();

connection.on("messageReceived", (username, message: string) => {
    let m = document.createElement("div");

    m.innerHTML =
        `<div class="message-author">${username}</div><img src="${useravatar}"><div>${message}</div>`;

    divMessages.appendChild(m);
    divMessages.scrollTop = divMessages.scrollHeight;
});

connection.start().catch(err => document.write(err));

inputZone.addEventListener("keyup", (e: KeyboardEvent) => {
    if (e.keyCode === 13) {
        send();
    }
});

function send() {
    console.log("send fired!");
    connection.send("newMessage", username, tbMessage.value)
              .then(() => tbMessage.value = "");
}



  