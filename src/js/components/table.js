var table = $('.table-sort');
table.on('click', 'th', function (e) {
    var parent = $(e.delegateTarget);
    $(this).siblings().find('i').removeClass('blue-color');
    var index = $(this).index() + 1;
    if ($(this).find('.fa-sm').size()) {
        var blue_color = $(this).find('.blue-color');
        if (blue_color.size()) {
            $(this).find('.fa-sm>i').toggleClass('blue-color');
        } else {
            $(this).find('.fa-sm>i:first-child').toggleClass('blue-color');
        }
        var _old_cw_style = parent.data('_cw_style');
        if (_old_cw_style) {
            _old_cw_style.remove();
            parent.removeClass(parent.data('_cw_style_id'));
        }
        var id = 'table_col_' + (new Date).getTime();
        parent.addClass(id);
        var str = '<style>' +
            '.' + id + ' tr td:nth-child(' +
            index +
            '){background-color: #ebf7f7;}' +
            '.' + id + ' tr th:nth-child(' +
            index +
            '){background-color:#d8edf2;}' +
            '</style>';
        var style = $(str).appendTo('body');
        parent.data('_cw_style', style);
        parent.data('_cw_style_id', id);
    } else {
        return false;
    }
});