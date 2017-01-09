$(function(){
    $('[data-cw-toggle="cw-collapse"] [data-cw-collapse="cw-collapse"]').click(function(){
        var open = $(this).hasClass('open');
        if(open){
            $(this).removeClass('open');
            $(this).find('.sub-menu').hide();
            $(this).find('.arrow').removeClass('open');
        }else{
            $('.arrow').removeClass('open');
            $(this).addClass('open').siblings().removeClass('open');
            $(this).find('.sub-menu').show();
            $(this).find('.arrow').addClass('open');
        }
    });
});