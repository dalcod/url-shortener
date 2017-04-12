$(function(){
    var lang = window.navigator.language;
    var req = $.ajax({
        url: "/" + lang,
        dataType: "json"
    });
    req.done(function(data){
        $(".ip .content").text(data.ip);
        $(".lang .content").text(data.lang);
        $(".os .content").text(data.opSys);
    });
});