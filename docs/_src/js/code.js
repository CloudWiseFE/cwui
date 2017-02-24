seajs.use([], function () {
    for(var i = 0; i<$('.code').length;i++){
        var code_id = $('.code').eq(i).data('target');
        var html = $('#'+code_id).html();
        var readyTemplate =html;
        console.log(readyTemplate);
        codebeautifier({
            element: $('[data-target='+code_id+']')[0],
            type: 'html',
            text: readyTemplate
        });
    }

});