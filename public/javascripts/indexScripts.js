$(()=>{
    var userOk = false;
    var passOK = false;
    var emailOk = false;

    var connected = false;

    $('#registerForm').on('submit', e=> {
        e.preventDefault()
        if(!userOk || !passOK || !emailOk)
            return;
        $.ajax({
            url: $('#registerForm').attr("action"),
            type:'POST',
            data: $('#registerForm').serialize(),
        }).done(function(data, textStatus, jqXHR){
            if( Number(jqXHR.status) === 200 )
                location.href = "/home"
        })
            .fail(function(err){
                console.log(err)
            })
    })

    var timeoutUser;
    $('#registerUsernameForm').on('keydown',function(){
        if(timeoutUser){ clearTimeout(timeoutUser);}
        timeoutUser = setTimeout(function() {
            $(".userNameCheck").remove();
            $("#registerUsernameForm").removeClass("col-12");
            $("#registerUsernameForm").addClass("col-9");
            $("#registerUsernameForm").css("display", "inline");
            if($("#registerUsernameForm").val().length < 1 ){
                $("#registerUsernameForm").after("<img class='userNameCheck left-margin-icon' src='images/notcheck.png'/>")
                userOk = false;
                return;
            }
            $("#registerUsernameForm").after("<div class=\"spinner-border text-light userNameCheck\" role=\"status\">\"</div>")
            $.ajax({
                url: '/users/check',
                type: 'POST',
                data: {'info': $("#registerUsernameForm").val()},
                statusCode: {
                    200: () => {
                        $(".userNameCheck").remove();
                        $("#registerUsernameForm").after("<img class='userNameCheck left-margin-icon' src='images/check.png'/>")
                        userOk = true;
                    },
                    406: () => {
                        $(".userNameCheck").remove();
                        $("#registerUsernameForm").after("<img class='userNameCheck left-margin-icon' src='images/notcheck.png'/>")
                        userOk = false;
                    }
                }
            })
        },500);
    })

    var timeoutEmail;
    $('#registerEmailForm').on('keydown',function(){
        if(timeoutEmail){ clearTimeout(timeoutEmail);}
        timeoutEmail = setTimeout(function() {
            $(".emailCheck").remove();
            $("#registerEmailForm").removeClass("col-12");
            $("#registerEmailForm").addClass("col-9");
            $("#registerEmailForm").css("display", "inline");
            if(!validateEmail($("#registerEmailForm").val())){
                $("#registerEmailForm").after("<img class='emailCheck left-margin-icon' src='images/notcheck.png'/>")
                emailOk = false;
                return;
            }
            $("#registerEmailForm").after("<div class=\"spinner-border text-light emailCheck\" role=\"status\">\"</div>")
            $.ajax({
                url: '/users/check',
                type: 'POST',
                data: {'info': $("#registerEmailForm").val()},
                statusCode: {
                    200: () => {
                        $(".emailCheck").remove();
                        $("#registerEmailForm").after("<img class='emailCheck left-margin-icon' src='images/check.png'/>")
                        emailOk = true;
                    },
                    406: () => {
                        $(".emailCheck").remove();
                        $("#registerEmailForm").after("<img class='emailCheck left-margin-icon' src='images/notcheck.png'/>")
                        emailOk = false;
                    }
                }
            })
        },500);
    })

    var timeoutPass
    $('#passwordForm').on('keydown',function(){
        if(timeoutPass){ clearTimeout(timeoutPass);}
        timeoutPass = setTimeout(function() {
            $(".passwordCheck").remove();
            $("#passwordForm").removeClass("col-12");
            $("#passwordForm").addClass("col-9");
            $("#passwordForm").css("display", "inline");
            if($("#passwordForm").val().length < 4 ){
                $("#passwordForm").after("<img class='passwordCheck left-margin-icon' src='images/notcheck.png'/>")
                passOK = false;
            }
            else{
                $("#passwordForm").after("<img class='passwordCheck left-margin-icon' src='images/check.png'/>")
                passOK = true;
            }

        },500);
    })

})

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/;
    return re.test(String(email).toLowerCase());
}