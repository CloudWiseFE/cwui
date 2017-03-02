$(function(){
    $('[data-cw-toggle="cw-collapse"] [data-cw-collapse="cw-collapse"]').click(function(){
        var open = $(this).hasClass('open');
        if(open){
            $(this).removeClass('open');
            $(this).find('.sub-menu').slideUp();
            $(this).find('.arrow').removeClass('open');
        }else{
            $('.arrow').removeClass('open');
            $(this).addClass('open').siblings().removeClass('open');
            $(this).find('.sub-menu').slideDown();
            $(this).find('.arrow').addClass('open');
        }
    });
});
;(function($, window, undefined) {
    // outside the scope of the jQuery plugin to
    // keep track of all dropdowns
    var $allDropdowns = $();
    // if instantlyCloseOthers is true, then it will instantly
    // shut other nav items when a new one is hovered over
    $.fn.dropdownHover = function(options) {

        // the element we really care about
        // is the dropdown-toggle's parent
        $allDropdowns = $allDropdowns.add(this.parent());

        return this.each(function() {
            var $this = $(this).parent(),
                defaults = {
                    delay: 300,
                    instantlyCloseOthers: true
                },
                data = {
                    delay: $(this).data('delay'),
                    instantlyCloseOthers: $(this).data('close-others')
                },
                options = $.extend(true, {}, defaults, options, data),
                timeout;

            $this.hover(function() {
                if(options.instantlyCloseOthers === true)
                    $allDropdowns.removeClass('open');

                window.clearTimeout(timeout);
                $(this).addClass('open');
            }, function() {
                timeout = window.setTimeout(function() {
                    $this.removeClass('open');
                }, options.delay);
            });
        });
    };

    $('[data-hover="dropdown"]').dropdownHover();
})(jQuery, this);
//$(function () {
//    $('.scroller').slimScroll({
//        color:'#888888'
//    })
//});
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
$('.table-sort th:has("span")').trigger('click');