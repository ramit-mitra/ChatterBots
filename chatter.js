var socket = io();
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
        console.log('handshake response :: '+data);
        
    });
}