// ----------------1、可针对单个图表类型自定义过滤器
// 2、判断series[0]是否为空，或者option.series[0].data.length < 1 判断为无数据
// --------------------- 3、支持事件绑定
// 4、 loading效果
// --------------- 5、支持一次请求同时画多图的情况,暂时可使用data闭包回调的方式实现，具体方法见浏览器-网页-弹窗
// --------------- 6、options可为callback function or object 【 array 】
// --------------- 7、可自定义图表主题theme （theme传递可支持字符串，对象，function）
// ---------------8、data数据支持ajax形式获取数据
// 9、解决弹窗画图问题
// --------------- 10、 全局设置绘图之前和绘图之后的callback


define(function (require, exports, module) {
    var config = require('./config');

    var helper = {
        /**
         * 处理function
         * @param fn
         * @returns {*}
         */
        runFun: function (fn/*, param1, param2...*/) {
            if ($.type(fn) == 'function') {
                var params = [].slice.call(arguments, 1);
                return fn.apply(this, params);
            }
            return fn;
        },
        /**
         * 处理图表dom元素
         * @param element 图表绘制目标DOM 支持'id'、document.getElementById('id')，jQuery对象三种方式
         * @returns {*}
         */
        filterElement: function (element) {
            if (typeof element == 'string') {
                element = document.getElementById(element);
                if (!element) {
                    console.error('不存在id为(' + element + ')的DOM元素!');
                }
            } else if (helper.isDom(element)) {
            } else if (typeof jQuery !== 'undefined' && element instanceof jQuery) {
                element = element[0];
            } else {
                console.error('cwchart function arguments[0](element) is error!');
            }
            return element;
        },
        /**
         * 判断对象是否为dom元素
         * @param obj
         * @returns {*}
         */
        isDom: function (obj) {
            if (typeof HTMLElement === 'object') {
                return obj instanceof HTMLElement;
            } else {
                return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
            }
        }
    };

    /**
     * 直接绘制图表，并返回图表实例
     * @param element
     * @param option
     * @param theme
     * @param extra
     * @returns {*}
     */
    function drawChart(element, option, theme, extra) {
        var _chart = cwchart.init(element, theme, extra);

        _chart.setOption(option);

        return _chart;
    }

    /**
     * 过滤处理每个series的data为ajax获取数据情况
     * @param serie
     * @param index
     * @param option
     * @returns {*}
     */
    function dataAjaxFilter(serie, index, option) {
        var defer = jQuery.Deferred();

        // 处理series.data是否为function
        serie.data = helper.runFun(serie.data, index, option) || [];

        var ajaxOpt = serie.data;
        if (typeof ajaxOpt.url != 'undefined') {
            $.ajax({
                url: ajaxOpt.url,
                type: ajaxOpt.method == 'get' ? 'get' : 'post',
                data: ajaxOpt.data,
                dataType: 'json'
            }).then(function (response) {
                if (typeof ajaxOpt.success == 'function') {
                    //回调success
                    option.series[index].data = ajaxOpt.success(response.data);
                } else {
                    option.series[index].data = response.data;
                }

                // 触发当前类型所有过滤器
                cwchart.triggerFilter(serie.type, [serie, index, option]);

                defer.resolve();
            });
        } else {
            defer.resolve();
        }

        return defer.promise();
    }

    /**
     * 绘制echarts图表入口
     * @param element
     * @param option
     * @param theme
     * @param extra
     * @returns {*}
     */
    function cwchart(element, option, theme, extra) {
        // 执行全局方法
        helper.runFun(cwchart.globalBefore, element, option);

        var defer = jQuery.Deferred();

        // 处理DOM元素
        element = helper.filterElement(element);

        // 处理theme
        theme = helper.runFun(theme, element, option);

        // 处理option function
        option = helper.runFun(option, element) || {};

        // 处理series是否为function
        option.series = helper.runFun(option.series, element, option) || [];

        // 按类型过滤处理series
        var seriesPromise = [];
        for (var i = 0, len = option.series.length; i < len; i++) {
            var serie = option.series[i];

            // 处理data数据为ajax请求方式加载
            var promiseObj = dataAjaxFilter(serie, i, option);
            seriesPromise.push(promiseObj);

            // 处理地图mapType
            if (serie.type == 'map' && serie.mapType && !cwchart.getMap(serie.mapType)) {
                var mapType = serie.mapType;
                // 中国省份为中文时，需要对其转化为拼音
                mapType = config.mapJson[mapType] ? config.mapJson[mapType] : mapType;

                seriesPromise.push($.getJSON(cwchart.cw_map_data + '/mapData/' + mapType + '.json', function (mapJson) {
                    echarts.registerMap(serie.mapType, mapJson);
                }));
            }

        }

        // 数据处理完后开始绘制图表
        var allPromise = $.when.apply($, seriesPromise);
        allPromise.done(function () {
            // 执行全局方法
            helper.runFun(cwchart.globalReady, element, option);

            var instance = drawChart(element, option, theme, extra);
            //
            defer.resolve(instance);

            // 执行全局方法
            helper.runFun(cwchart.globalAfter, instance, element, option);
        });

        return defer.promise();

    }

    // 继承echarts方法及属性
    $.extend(cwchart, echarts);

    // 自定义扩展方法
    $.extend(cwchart, {
        _cw_filters: {},
        /**
         * 按类型注册series过滤器
         * @param type  过滤器类型，比如：pie，map，line......
         * @param handler   过滤方法,必须有返回值
         * @param params    参数
         */
        registerFilter: function (type, handler) {
            this._cw_filters[type] = this._cw_filters[type] || [];
            this._cw_filters[type].push({
                handler: handler,
                params: params
            });
        },
        /**
         * 触发当前类型series过滤器
         * @param type  类型
         * @param params
         * @returns {boolean}
         */
        triggerFilter: function (type, params) {
            var fns = this._cw_filters[type];
            if (!fns) {
                return;
            }
            for (var i = 0, l = fns.length; i < l; i++) {
                var fn = fns[i];
                params = $.type(params) != 'array' ? [params] : params;
                // 返回fasle，停止后面过滤器的操作
                if (fn.handler.apply(this, params) === false) {
                    return false;
                }
            }
        },
        /**
         * 绘制图表前执行方法
         */
        globalBefore: function () {
        },
        //绘制图表后执行方法
        globalAfter: function () {
        },
        //绘制图表前,option准备好之后触发
        globalReady: function () {
        },
        /**
         * 根据cwchart.js在seajs中标记的路径自动查找cwchart所在目录
         */
        cw_map_data: (function () {
            var _path = '';
            for (var path in seajs.cache) {
                var i = path.lastIndexOf('/');
                var file = path.substring(i);

                if (file.indexOf('cwchart.js') > -1) {
                    _path = path.substring(0, i);

                    break;
                }
            }
            return _path;
        }())
    });

    window.cwchart = cwchart;

    $.fn.cwchart = function (options, theme, extra) {

        options = helper.runFun(options);
        if (!options) {
            return;
        }

        return this.each(function (i, dom) {
            var opt = $.type(options) == 'array' ? options[i] : options;
            var instance = cwchart(dom, opt, theme, extra);
            $(this).data('cwchart_instance', instance);
        });
    };

    return cwchart;
});
