"use strict";

(function(){
    var inject_scripts = [
        'https://code.jquery.com/jquery-3.3.1.slim.min.js',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js'
    ];

    document.write('<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">\n' +
        '');

    for (var i = 0; i < inject_scripts.length; i++) {
        var newscript = document.createElement('script');
        newscript.type = 'text/javascript';
        //newscript.async = true;
        newscript.src = inject_scripts[i];
        //(document.getElementsByTagName('head')[0]||document.getElementsByTagName('body')[0]).appendChild(newscript);
        document.write('<script src="'+ inject_scripts[i] +'"></script>');
    }
})();



var __accesstrade_smartwidget = {
    ENDPOINT_URI: "http://api.accesstrade.vn/v1/partner/product/search",

    init: function () {
        console.log("[Smart Widget] Initializing...");


        if (!window.__at_smartwidget) {
            console.log("[Smart Widget] Config not found.");
            return false;
        }

        if (!window.__at_smartwidget.tracking_domain) {
            window.__at_smartwidget.tracking_domain = "go.starsnet.co";

        }
        this.get();
        //this.log();
    },

    insert_css: function () {
        if (document.getElementById("at-smartwidget-style") == undefined) {
            document.body.appendChild('<style id="at-smartwidget-style" type="text/css"></style>');
        }
    },
    get: function () {

        var request_uri = this.ENDPOINT_URI + '?q=' + window.__at_smartwidget.keyword + '&domain=' + window.__at_smartwidget.domain + '&email=' + window.__at_smartwidget.email + ' ';

        var request = new XMLHttpRequest();
        request.open("GET", request_uri, true);
        request.setRequestHeader('Authorization', 'partner zyIO0K8J8WUQ4XVqgzPwXxmmATT4e29mkuRPldRrKFbhNRBZqx');
        // request.setRequestHeader('Access-Control-Allow-Origin', '*');
        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                // Success!
                var resp = request.responseText;
                console.log("[Smart Widget] Get data success.");
                var resp_json = JSON.parse(resp);
                __accesstrade_smartwidget.render(resp_json.data);
                return true;
            } else {
                // We reached our target server, but it returned an error
                console.log("[Smart Widget] Error when get domain list.");
                return false;
            }
        };

        request.onerror = function () {
            // There was a connection error of some sort
            console.log("[Smart Widget] Error when connecting to API endpoint.");
            return false;
        };

        request.send();
    },
    render: function (resp_data) {
        var css = '<style type="text/css">';
        css += '*{\n' +
            '    padding: 0px;\n' +
            '    margin: 0px;\n' +
            '}\n' +
            '#smart_widget{\n' +
            '    width: 300px;\n' +
            '    background-color: #DF0101;\n' +
            '}\n' +
            '#header{\n' +
            '    height: 100px;\n' +
            '    padding: 0px;\n' +
            '    border-radius: ;\n' +
            '}\n' +
            '#content img{\n' +
            '    width: 90px;\n' +
            '    height: 90px;\n' +
            '    position: relative;\n' +
            '    border-radius: 5px;\n' +
            '}\n' +
            '.image{\n' +
            '    text-align: center;\n' +
            '    margin-top: 5px;\n' +
            '    padding-left: 5px!important\n' +
            '}\n' +
            '.sale{\n' +
            '    width: 35%;\n' +
            '    height: 20px;\n' +
            '    background: red;\n' +
            '    position: absolute;\n' +
            '    font-size: 13px;\n' +
            '    top: 2px;\n' +
            '    left: 7px;\n' +
            '    border-radius: ;\n' +
            '    color: white;\n' +
            '    border-radius: 5px;\n' +
            '}\n' +
            '#header img {\n' +
            '    width: 298px;\n' +
            '    height: 100px;\n' +
            '}\n' +
            'img{\n' +
            '\n' +
            '}\n' +
            '.footer img {\n' +
            '    width: 100%!important;\n' +
            '    height: 100px;\n' +
            '    text-align: center;\n' +
            '\n' +
            '}\n' +
            '.footer{\n' +
            '    margin-top: 15px;\n' +
            '}\n' +
            '.background_img{\n' +
            '    width: 105%!important;\n' +
            '}\n' +
            '.carousel-inner{\n' +
            '    width: 110%!important;\n' +
            '    margin-left: -5%!important;\n' +
            '}\n' +
            '\n';
        css += '</style>';
        // mĂ n hĂ¬nh nhá» áº©n atsw-widget-product-price width < 1024
        var html = '<div class="container" id="smart_widget" >\n' +
            '<div class="row">';
            html += this.render_header();

        var count_col = 0;
        var total_items;

            //content
        for (total_items = 0; total_items < resp_data.length; total_items++) {
            var product = resp_data[total_items];
            count_col++;
            console.log(product.keyword);
            var aff_link = product.affiliate_link + '&redirect_302=1';
            aff_link = aff_link.replace("go.starsnet.co", window.__at_smartwidget.tracking_domain);
            html += '<div class="col-md-4 col-4 image">\n' +
                '<a href="' + aff_link + '"><img src="' + product.image + '" alt="" ></a>\n' +
                '<div class="sale">- ' + Math.floor(product.discount_rate * 100) + '% </div>\n' +
                '</div>';
        } // end for loop
            html += '</div>\n' +
                '</div>';
        //footer
        html += this.render_footer_slider_header();

        for (var j = 0; j < window.__at_smartwidget.banner_slider_bottom.length; j++) {
            html += '<div class="carousel-item">\n' +
                '<img class="d-block w-100" src="' + window.__at_smartwidget.banner_slider_bottom[j] + '" alt="Third slide">\n' +
                '</div>';
        }

        html += this.render_footer_slider_footer();



        document.getElementById('at-smartwidget-root').innerHTML = css + html;
    },

    render_header: function() {
        var html = '<div class="col-md-12 col-12" id="header"><img src="' + window.__at_smartwidget.banner_top + '" alt=""></div>\n' +
            '<div class="col-md-12 col-12" id="content">\n' +
            '<div class="row">';
        return html;
    },

    render_footer_slider_header: function() {
       var html = '<div class="footer col-md-12 col-12">\n' +
            '<div id="slider_banner" class="carousel slide" data-ride="carousel">\n' +
            '<div class="carousel-inner">\n' +
            '<div class="carousel-item active">\n' +
            '<img class="d-block w-100" src=" ' + window.__at_smartwidget.banner_top + '" alt="First slide">\n' +
            '</div>';
      return html;
    },

    render_footer_slider_footer: function() {
        var html = '</div>\n' +
            '<a class="carousel-control-prev" href="#slider_banner" role="button" data-slide="prev">\n' +
            '<span class="carousel-control-prev-icon" aria-hidden="true"></span>\n' +
            '<span class="sr-only">Previous</span>\n' +
            '</a>\n' +
            '<a class="carousel-control-next" href="#slider_banner" role="button" data-slide="next">\n' +
            '<span class="carousel-control-next-icon" aria-hidden="true"></span>\n' +
            '<span class="sr-only">Next</span>\n' +
            '</a>\n' +
            '</div>\n' +
            '</div>' +
            '</div>\n' +
            '</div>';
        return html;
    },

    /*
      check url
      Found: using utm_source from url
      Not found: if has config => using config
      */
    getQueryVariable: function (variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
        return "";
    }
};

if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
    __accesstrade_smartwidget.init();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        __accesstrade_smartwidget.init();
    });
}