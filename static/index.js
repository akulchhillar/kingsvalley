let socket = io.connect(window.origin)



let button = document.getElementById("game-button")

button.addEventListener("click",()=>{

socket.emit("roomid")
button.innerText = "Create another game"


})

socket.on("roomid",(data)=>{

 document.getElementById("seek-link").href= window.origin +"/white/" + data,
document.getElementById("hide-link").href= window.origin +"/black/" +data,
document.getElementById("seek-link").innerText= window.origin +"/white/" + data,
document.getElementById("hide-link").innerText= window.origin +"/black/" +data

    document.getElementById("seek-line").style.display="block"
    document.getElementById("hide-line").style.display="block"




})