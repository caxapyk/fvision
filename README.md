# fvision
Usage
-----
This example for Wordpress and Bootstrap theme
```sh
$('.fvision').fvision({
        skip: '#wpadminbar, #wpadminbar *, .glyphicon, .caret',
        hide: '#w0, .bg-header, .carousel-slider',
        templatePath: '/assets/themes/govermentth/includes/resources/fvision/templates/fvision_panel.html',
        onCreate: (function(){
            if ($(window).width() > 767) {
                $('.upperline').css('padding-top', $('.fvision_container').height() + 25);
            } else {
                 $('.upperline').css('padding-top', '20px');
            }
            $('.navbar').css('margin-top', '20px');
            $('.icon-bar').css('color', '#444');
        }),
        onResize: (function(){
            if ($(window).width() > 767) {
                $('.upperline').css('padding-top', $('.fvision_container').height() + 25);
            } else {
                 $('.upperline').css('padding-top', '20px');
            }
        })
    });
```
