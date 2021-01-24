$(function () {
    // USERNAME

    var timeoutUser, userOk;
    var myname = $("#changeNameInput").val();

    $('#changeNameInput').on('keydown',function(){
        if(timeoutUser){ clearTimeout(timeoutUser);}
        timeoutUser = setTimeout(function() {
            if($("#changeNameInput").val().length < 1 ){
                $(".userNameCheck").text('Nome de utilizador muito curto.');
                $(".userNameCheck").css('color','red');
                userOk = false;
            } else if($("#changeNameInput").val() === myname){
                $(".userNameCheck").html('&emsp;');
                userOk = false;
            } else {
                $.ajax({
                    url: '/users/check',
                    type: 'POST',
                    data: {'info': $("#changeNameInput").val()},
                    statusCode: {
                        200: () => {
                            $(".userNameCheck").text('Nome de utilizador disponivel.');
                            $(".userNameCheck").css('color','brown');
                            // $("#resultChangeName").after("<p class='userNameCheck' style='color:brown;'>Nome de utilizador disponivel.</p>")
                            userOk = true;
                        },
                        406: () => {
                            $(".userNameCheck").text('Nome de utilizador nao disponivel.');
                            $(".userNameCheck").css('color','red');
                            // $("#resultChangeName").after("<p class='userNameCheck' style='color:red;'>Nome de utilizador nao disponivel.</p>")
                            userOk = false;
                        }
                    }
                })
            }
        },500);
    })

    $('#ChangeNameForm').on('submit', e=> {
        e.preventDefault()
        if(!userOk)
            return
        $.ajax({
            url: $('#ChangeNameForm').attr("action"),
            type:'POST',
            data: $('#ChangeNameForm').serialize()
        }).done(function(data, textStatus, jqXHR){
            if(Number(jqXHR.status) === 200)
            {
                $(".userNameCheck").text('Nome de utilizador modificado !');
                $(".userNameCheck").css('color','green');
                myname = $("#changeNameInput").val();
                userOk = false;
            }
        })
    })

    // EMAIL

    var timeoutemail, emailOk;
    var myEmail = $("#changeEmaiInput").val();

    $('#changeEmaiInput').on('keydown',function(){
        if(timeoutemail){ clearTimeout(timeoutemail);}
        timeoutemail = setTimeout(function() {
            if(!validateEmail($("#changeEmaiInput").val())){
                $(".userEmailCheck").text('Email nao valido.');
                $(".userEmailCheck").css('color','red');
                emailOk = false;
            } else if($("#changeEmaiInput").val() === myEmail){
                $(".userEmailCheck").html('&emsp;');
                emailOk = false;
            } else {
                $.ajax({
                    url: '/users/check',
                    type: 'POST',
                    data: {'info': $("#changeEmaiInput").val()},
                    statusCode: {
                        200: () => {
                            $(".userEmailCheck").text('Email disponivel.')
                            $(".userEmailCheck").css('color', 'brown')
                            emailOk = true;
                        },
                        406: () => {
                            $(".userEmailCheck").text('Email jà usado.')
                            $(".userEmailCheck").css('color', 'red')
                            emailOk = false;
                        }
                    }
                })
            }
        },500);
    })

    $('#ChangeEmailForm').on('submit', e=> {
        e.preventDefault()
        if(!emailOk)
            return
        $.ajax({
            url: $('#ChangeEmailForm').attr("action"),
            type:'POST',
            data: $('#ChangeEmailForm').serialize()
        }).done(function(data, textStatus, jqXHR){
            if(Number(jqXHR.status) === 200)
            {
                $(".userEmailCheck").text('Email modificado !')
                $(".userEmailCheck").css('color','green');
                myEmail = $("#changeEmaiInput").val();
                emailOk = false;
            }
        })
    })

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/;
        return re.test(String(email).toLowerCase());
    }



    /// password

    var timeoutPassword, passwordOk;

    $('#changePasswordInput').on('keydown',function(){
        if(timeoutPassword){ clearTimeout(timeoutPassword);}
        timeoutPassword = setTimeout(function() {
            if($("#changePasswordInput").val().length === 0){
                $(".userPasswordCheck").html('&emsp;');
                passwordOk = false;
            }
            else if($("#changePasswordInput").val().length < 5){
                $(".userPasswordCheck").text('5 caracters no minimo.');
                $(".userPasswordCheck").css('color','red');
                passwordOk = false;
            } else {
                $(".userPasswordCheck").text('Palavra-passe valida.')
                $(".userPasswordCheck").css('color', 'green')
                passwordOk = true;
            }
        },500);
    })

    $('#ChangePasswordForm').on('submit', e=> {
        e.preventDefault()
        if(!passwordOk)
            return
        $.ajax({
            url: $('#ChangePasswordForm').attr("action"),
            type:'POST',
            data: $('#ChangePasswordForm').serialize()
        }).done(function(data, textStatus, jqXHR){
            if(Number(jqXHR.status) === 200)
            {
                $(".userPasswordCheck").text('Palavra-pase modificada !')
                myEmail = $("#changePasswordInput").val();
                emailOk = false;
            }
        })
    })


    // description

    $('#ChangeDescricao').on('submit', e=> {
        e.preventDefault()
        $.ajax({
            url: $('#ChangeDescricao').attr("action"),
            type:'POST',
            data: $('#ChangeDescricao').serialize()
        }).done(function(data, textStatus, jqXHR){
            if(Number(jqXHR.status) === 200)
                $(".descripcaoCheck").text('Descriçao modificada !')
        })
    })
});



