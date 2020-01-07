/**
 * @author Alexander Sakharuk
 * @version 1.0.0
 */
(function ($) {
    "use strict";

    /** Default settings */
    var _defaults = {
        templatePath: null,
        container: '.fvision_container',
        controlClass: '.fvision-control',
        activeClass: 'fvision-active',
        grayscaleClass: 'fvision-img-grayscale',
        elements: null,
        skip: null,
        hide: null,
        minFontScale: 0,
        maxFontScale: 5,
        increment:2,
        onCreate: null,
        onResize: null,
        colorizeBgImages:false,
        scheme: {
            fontscale: 0,
            colorscheme: 'white',
            imgcolor: 'grayscale',
            imgvisible: 'invisible',
            interval: 'normal',
            fonttype: 'normal'
        },
        fontSize: {
            normal: 0,
            medium: 2,
            large: 3
        },
        interval: {
            normal: 0,
            medium: 1,
            large: 2
        },
        imgVisible: {
            visible: true,
            invisible: false
        },
        imgColor: {
            grayscale: true,
            colorized: false
        },
        fontType: {
            serif: '"Times New Roman", Times, serif',
            noserif: '"Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif'
        },
        colorScheme: {
            white: 'fvision-color-white',
            black: 'fvision-color-black',
            blue: 'fvision-color-blue'
        }
    };
    
    /** Properties */
    var _properties = {
        cookies: {
            expire: 7, //days
            path: '/',
            enabled: 'fvision_enabled',
            fontscale: 'fvision_fontscale',
            colorscheme: 'fvision_colorscheme',
            imgcolor: 'fvision_imgcolor',
            imgvisible: 'fvision_imgvisible',
            interval: 'fvision_interval',
            fonttype: 'fvision_fonttype'
        },  
    };
    
    /** Vars */
    var 
    target, //Link with fvision attached
    skip,
    container,
    control,
    elements,
    fontSize,
    method,
    val,
    images,
    colorScheme,
    bgImgs;
    
    var pub = {
         init: function (_this) {
            target = $(_this);
            skip = _defaults.skip;
            container = _defaults.container + ', ' + _defaults.container + ' *';
            images = $("img");
            elements = _defaults.elements === null ? 
                $('*').not(skip).not(container) : $(_defaults.elements).not(skip).not(container);
            bgImgs = elements.filter(function() { 
                return $(this).css("background").indexOf('url') >= 0 || $(this).css("background-image").indexOf('url') >= 0;
            });
            target.unbind('click').bind('click', function () {
                pub.load(); 
            });
            //on if fvision is enabled in cookie
            if ($.cookie(_properties.cookies.enabled) == 1) 
                pub.load();
        },
        load: function() {
            $(_defaults.container).load(_defaults.templatePath, function() {
               pub.afterLoad(); 
            });
        },
        afterLoad: function() {
            control = $(_defaults.controlClass);
            pub.on();
        },
        on: function () {
                //Bind controls
                control.unbind('click').bind('click', function () {
                    method = $(this).data('target');
                    val = $(this).data('value');
                    if ($('[data-target='+ method +']').length > 1) {
                        $('[data-target='+ method +']').removeClass(_defaults.activeClass);
                        $(this).addClass(_defaults.activeClass);
                    }
                    
                    _actions[method].apply(this, [val]);
                });
                
                //Hide elements
                target.hide();
                $(_defaults.hide).hide();
                //Show panel
                $(_defaults.container).show();
                
                this.loadCookies();
                this.loadSheme();

                // call the callbacks
                if(typeof _defaults.onCreate === 'function'){ //check if b is a function
                    _defaults.onCreate(); //invoke
                }
                if(typeof _defaults.onResize === 'function'){ //check if b is a function
                    $( window ).resize(function() {
                        _defaults.onResize(); //invoke
                    });
                }
                setCookie(_properties.cookies.enabled, 1);
        },

        loadCookies: function () {
            //Set defaults if cookies not exist
            if ($.cookie(_properties.cookies.fontscale) === undefined)
                setCookie(_properties.cookies.fontscale, _defaults.scheme.fontscale);
            if ($.cookie(_properties.cookies.colorscheme) === undefined)
                setCookie(_properties.cookies.colorscheme, _defaults.scheme.colorscheme);
            if ($.cookie(_properties.cookies.imgcolor) === undefined)
                setCookie(_properties.cookies.imgcolor, _defaults.scheme.imgcolor);
            if ($.cookie(_properties.cookies.imgvisible) === undefined)
                setCookie(_properties.cookies.imgvisible, _defaults.scheme.visible);
            if ($.cookie(_properties.cookies.interval) === undefined)
                setCookie(_properties.cookies.interval, _defaults.scheme.interval);
            if ($.cookie(_properties.cookies.fonttype) === undefined)
                setCookie(_properties.cookies.fonttype, _defaults.scheme.fonttype);
        },
        loadSheme: function() {
            _actions.changeFontSize($.cookie(_properties.cookies.fontscale));
            _actions.setColorScheme($.cookie(_properties.cookies.colorscheme));
            _actions.setImgVisible($.cookie(_properties.cookies.imgvisible));
            _actions.setImgColor($.cookie(_properties.cookies.imgcolor));
            _actions.setFontInterval($.cookie(_properties.cookies.interval));
            _actions.setFontType($.cookie(_properties.cookies.fonttype));
        }
    };
    
    /** Actions */
    var _actions = {
     
        exit: function() {
            setCookie(_properties.cookies.enabled, 0);
            location.reload();
        },
        
        fontReduce: function () {
            if (getFontScale() > _defaults.minFontScale) {
                _actions.changeFontSize(-1);
                setCookie(_properties.cookies.fontscale, getFontScale() - 1);
            }
        },
        
        fontIncrease: function () {
            if (getFontScale() < _defaults.maxFontScale) {
                _actions.changeFontSize(1);
                setCookie(_properties.cookies.fontscale, getFontScale() + 1);
            }
        },
        
        setFontSize: function (val) {
            _actions.changeFontSize(_defaults.fontSize[val]-getFontScale());
            setCookie(_properties.cookies.fontscale, _defaults.fontSize[val]);
        },
        
        changeFontSize: function (val) {
            elements.each(function() {
                fontSize = parseInt($(this).css('font-size')) + _defaults.increment * val ;
                $(this).animate({fontSize: fontSize  + 'px'}, 100);
            });
        },
        
        setImgVisible: function (val) {
            _defaults.imgVisible[val] ? images.show() : images.hide();
            setCookie(_properties.cookies.imgvisible, val);
        }, 
        
        setImgColor: function (val) {
            _defaults.imgColor[val] ? images.addClass(_defaults.grayscaleClass) : images.removeClass(_defaults.grayscaleClass);
            (val == 'colorized' && _defaults.colorizeBgImages) ? 
            bgImgs.removeClass(_defaults.grayscaleClass) : bgImgs.addClass(_defaults.grayscaleClass);
            setCookie(_properties.cookies.imgcolor, val);
        }, 
        
        setColorScheme: function (val) {
            if (colorScheme !== undefined) elements.removeClass(colorScheme);
            colorScheme = _defaults.colorScheme[val] !== undefined ? _defaults.colorScheme[val] : val;
            
            elements.not(bgImgs)
            .addClass(colorScheme);
            setCookie(_properties.cookies.colorscheme, colorScheme);
        },
        
        setFontInterval: function (val) {
            elements.css('letter-spacing', _defaults.interval[val]);
            setCookie(_properties.cookies.interval, val);
        }, 
        
        setFontType: function (val) {
            elements.css('font-family', _defaults.fontType[val]);
            setCookie(_properties.cookies.fonttype, val);
        }
    };
    
    /** Helpers */
    function getFontScale() {
        return parseInt($.cookie(_properties.cookies.fontscale)) || 0;
    }
        
    function setCookie (cookie, value) {
        $.cookie(cookie, value, {expires: _properties.cookies.expire, path: _properties.cookies.path});
    }

    $.fn.fvision = function (options) {
        /** Get options*/
        $.extend(_defaults, options);
        /** Init*/
        pub.init(this);
    };
})(jQuery);