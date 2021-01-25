$(function () {
    // description

    $('#setask').on('submit', e=> {
        e.preventDefault()
        $.ajax({
            url: $('#setask').attr("action"),
            type:'POST',
            data: $('#setask').serialize()
        }).done(function(data, textStatus, jqXHR){
            if(Number(jqXHR.status) === 200)
                $(".descripcaoCheck").text('Pedido enviado !')
        })
    })
});



