const socket = io();


/* Send message button event */
const sendBtn = document.querySelector('#send-btn');
sendBtn.addEventListener('click', () => {
    /* Message text */
    const text = document.querySelector('#inp-msg');
    let msgText = text.value;
    if(msgText == "" || msgText == " ") {
        return;
    }
    /* Username */
    const userName = document.querySelector('#name').value;

    
    socket.emit('send_msg', {
        msg: msgText,   
        user: userName
    });

    /* Setting text value to empty */
    text.value = "";
})

 

socket.on('recieved_msg', (data) => {
    $('#chat').append(`<li><span>${data.user}:</span>  ${data.msg}</li>`)
    $("#chat-box").scrollTop($("#chat-box").outerHeight());
});





/* Login Button */
const loginBtn = document.querySelector('#login-btn');

loginBtn.addEventListener('click', () => {
    const userTag = document.querySelector('#login-inp');
    const user = userTag.value; 

    socket.emit('login', {
        user: user
    })

    userTag.value = "";
})

