seajs.use([], function () {
    var readyTemplate =
        `<!DOCTYPE html>
            <html lang="zh-CN">
            <head>
                <meta charset="utf-8">
                <!-- 文档兼容模式的定义 -->
                <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
                <!-- 优先使用webkit内核渲染页面 -->
                <meta name="renderer" content="webkit">
                <!-- 设置可视区域宽度与设备屏幕缩放比例为1.0 -->
                <meta name="viewport" content="width=device-width, initial-scale=1">

                <title>cwui</title>
                <meta name="keywords" content="cwui,bootstrap,css,javascript,cloudwise"/>
                <meta name="description" content="In the bootstrap based on the development of a UI component library.">
                <meta name="author" content="cloudwise front-end team">

                <!-- Bootstrap -->
                <link rel="stylesheet" href="vender/bootstrap-3.3.7/css/bootstrap.min.css"/>
                <!-- 公共图标库，如果需要的话 -->
                <link rel="stylesheet" href="vender/fontawesome-4.7.0/css/font-awesome.min.css"/>
                <!-- cwui -->
                <link rel="stylesheet" href="css/cw.min.css"/>

                <!-- html5shiv.js和respond.js 让IE8支持HTML5元素和媒体查询器 -->
                <!-- 注意: 如果通过file://的本地目录查看页面respond.js不起作用  -->
                <!--[if lt IE 9]>
            <script src="vender/html5shiv-3.3.7/html5shiv.min.js"></script>
            <script src="vender/respond-1.4.2/respond.min.js"></script>
         <![endif]-->
                </head>
                <body>
                <h1>你好，云智慧！</h1>


                <!-- jquery -->
                <script src="vender/jquery-1.12.4/jquery.min.js"></script>
                <!-- Bootstrap -->
                <script src="vender/bootstrap-3.3.7/js/bootstrap.min.js"></script>
                <!-- cwui -->
                <script src="js/cw.min.js"></script>
            </body>
            </html>`;

    codebeautifier({
        element: document.getElementById('js_ready_template'),
        type: 'html',
        text: readyTemplate
    });
});