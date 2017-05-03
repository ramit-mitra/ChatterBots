var socket = io();
var authCode = '';
$(document).ready(function(){
    $('#chooseUsername').keyup(function(){
        if($('#chooseUsername').val().trim().length > 0) {
            $('#submitUsername').fadeIn('slow');
        }
        else {
            $('#submitUsername').fadeOut('fast');
        }
    });
    $('#submitUsername').click(function(){
        username = $('#chooseUsername').val().trim();
        console.log('Desired Username : '+username);
        //check if username is unique
        $.get('/register/'+username, function(data, status){
            if(data == 1){
                //register this client
                socket.emit('storeClientInfo', { customId : username });
                //store to hidden field
                $('#thisUserName').val(username);
                //succesfully registered
                $('#enterUsername').remove();
                //show active users
                showAvailableUsers();
            }
            else {
                $('#chooseUsername').attr('placeholder', 'Choose another name !');
                $('#chooseUsername').css('border-bottom', '2px solid #FF8A80');
                $('#chooseUsername').val('');
                alert('User already exists');
            }
        });
    });
    
    //transmit chats
    //transmit on pressing enter
    $(document).keypress(function(e) {
        if($('#chatbox').is(":visible")) {
            if(e.which == 13) {
                chatUserInput = $('#chatInput').val().trim();
                socket.emit(authCode, chatUserInput);
                console.log('Transmitting new message :: '+chatUserInput, authCode);
                $('#chatInput').val('');
            }
        }
    });
});

function showAvailableUsers()
{
    $('#allActiveUsers').fadeIn('slow');
    //get users
    $.get('/get-active-users', function(data, status){
        console.log('Available Users :: '+data);
        var htmlContent = '<h2 class="text-center">Active Users</h2><hr>';
        for(i = 0; i < data.length; i++) {
            htmlContent += '<kbd style="margin: 5px; color: #FAFAFA;"><a onClick="handshake(\''+data[i].trim()+'\')">'+data[i]+'</a></kbd>';
        }
        htmlContent += '<hr>';
        $('#allActiveUsers').html(htmlContent);
    });
}
function handshake(withUser) 
{
    username = $('#thisUserName').val();
    $.get('/handshake/'+username+'/'+withUser, function(data, status){
        if(data.length){
            //start chat
            startChat(data);
        }
    });
}

function startChat(authCode) {
    //1. Clear userlist
    $('#allActiveUsers').fadeOut('fast');
    //2. Open chatbox
    $('#chatbox').fadeIn('slow');
    this.authCode = authCode;
}