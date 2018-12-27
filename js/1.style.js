"use strict";

var __accesstrade_smartwidget = {
    ENDPOINT_URI: "http://smartwidget.isvn.dungnt.net/data.php",
    utm_source: '',
    init: function() {
        console.log("[Smart Widget] Initializing...");


        if (!window.__at_smartwidget) {
            console.log("[Smart Widget] Config not found.");
            return false;
        }

        if(!window.__at_smartwidget.row) {
            window.__at_smartwidget.row = 1;
        }

        if(!window.__at_smartwidget.product_size) {
            window.__at_smartwidget.product_size = 4;
        }

        // get data and init, if data not found, console.log and exit
        this.utm_source = this.get_utm_source();
        //this.insert_css();
        //this.render(window.sample_data);
        this.get();
        //this.log();
    },
    log: function() {
        var url =
            "https://track.isvn.dungnt.net/log-widget.php?link=" +
            encodeURIComponent(document.URL) +
            "&type=smartwidget";

        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;

        document.getElementsByTagName("head")[0].appendChild(script);
    },
    insert_css: function() {
        if (document.getElementById("at-smartwidget-style") == undefined) {
            document.body.appendChild('<style id="at-smartwidget-style" type="text/css"></style>');
        }
    },
    get: function() {
        // Cache only 1 hour
        var date_hour = new Date();
        date_hour.setMinutes(0, 0, 0);
        date_hour = +date_hour;

        var request_uri = this.ENDPOINT_URI + "?t=" + date_hour;
        request_uri += "&row=" + window.__at_smartwidget.row;
        request_uri += "&product_size=" + window.__at_smartwidget.product_size;
        request_uri += "&keyword=" + encodeURI(window.__at_smartwidget.keyword);

        var request = new XMLHttpRequest();
        request.open("GET", request_uri, true);
        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                // Success!
                var resp = request.responseText;
                console.log("[Smart Widget] Get data success.");
                __accesstrade_smartwidget.render(JSON.parse(resp));
                return true;
            } else {
                // We reached our target server, but it returned an error
                console.log("[Smart Widget] Error when get domain list.");
                return false;
            }
        };

        request.onerror = function() {
            // There was a connection error of some sort
            console.log("[Smart Widget] Error when connecting to API endpoint.");
            return false;
        };

        request.send();
    },
    render: function(resp_data) {
        var css = '<style type="text/css">';
        css += '.atsw-wrap{width:100%}.atsw-widget{width:calc((100% /'+ window.__at_smartwidget.product_size +') - '+ window.__at_smartwidget.product_size +' * 7px);position:relative;display:inline-table;font-family:Open Sans,Helvetica,Arial,sans-serif;background:#fff;padding:0;opacity:1;transition:opacity .2s ease-in-out;float:left;border:1px solid #d6d6d6;font-size:14.1px;line-height:21.15px;margin:6px}.atsw-widget:hover .atsw-widget-product-buynow{display:inline-block}.atsw-widget-color{color:#fb9678}.atsw-widget-bgcolor{background-color:#fb9678}.atsw-widget-img{margin:auto;position:relative}.atsw-widget-img img{width:100%;height:100%;max-height:200px}.atsw-widget-product-name{text-align:left;margin-top:5px;height:42px;overflow:hidden}.atsw-widget-product-name a{text-decoration:none;color:#000!important}.atsw-widget-product-price{float:left;text-align:left;margin-top:5px;padding:0 4px 4px}.atsw-widget-product-buynow-p{position:absolute;t  ext-align:center;left:0;right:0;top:50%}.atsw-widget-product-buynow{display:none;padding:2px 10px;line-height:29.38px;background:#db2525}.atsw-widget-product-buynow a{text-decoration:none;color:#fff!important;display:block}.atsw-widget-product-buynow a:hover{color:#fff!important}.atsw-widget-product-discount{color:#fff!important;background:#db2525;float:left;margin-top:3px;margin-bottom:4px;padding:0 5px;border-radius:5px}.atsw-widget-product-name{font-weight:700;padding:0 10px}.atsw-widget-merchant-logo{display:inline-block;float:right}.atsw-widget-merchant-logo img{max-width:64px}.atsw-widget-product-price-c{float:right}.atsw-widget-product-location{margin-top:5px;width:calc(100% - 180px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;float:left}.atsw-widget-product-row2{padding:0 10px}.atsw-widget-product-price{font-weight:400;font-size:13.5px;text-decoration:line-through;color:#2d2b2b}.atsw-widget-product-location{max-width:145px;}';
        css += '@media screen and (max-width: 1024px) {.atsw-widget-product-price {display: none;}}';
        css += '@media (max-width: 767.98px) {.atsw-widget{width:calc((100% /2) - 2 * 7px)}}';
        css += '</style>';
        // mÃ n hÃ¬nh nhá» áº©n atsw-widget-product-price width < 1024
        var html = '<div class="atsw-wrap">';
        var product_aff_link = '';
        var count_col = 0;
        var i;
        console.log(resp_data.length);
        for( i = 0; i < resp_data.length; i++ ) {
            var product = resp_data[i];
            count_col++;
            var product_aff_link = this.build_aff_link(product.url);
            html += '<div class="atsw-widget">';

            html += '<div class="atsw-widget-img">';
            html += '<a target="_blank" href="'+ product_aff_link +'">';
            html += '<img src="'+ product.img_url +'">';
            html += '</a>';
            html += '<div class="atsw-widget-product-buynow-p">';
            html += '<div class="atsw-widget-product-buynow">';
            html += '<a target="_blank" href="'+ product_aff_link +'">Xem ngay</a>';
            html += '</div>'; // .atsw-widget-product-buynow
            html += '</div>'; // .atsw-widget-product-buynow-p
            html += '</div>';

            html += '<div class="atsw-widget-product-name">';
            html += '<a target="_blank" href="'+ product_aff_link +'" title="'+ product.title +'">'+ product.title +'</a>';
            html += '</div>';

            html += '<div class="atsw-widget-product-row2">';
            if ( product.address ) {
                html += '<div class="atsw-widget-product-location">&#9971;&nbsp;'+ product.address +'</div>';
            }
            html += '<div class="atsw-widget-product-price-c">';
            if( product.discount && product.discount !== product.price ) {
                html += '<div class="atsw-widget-product-price">'+ product.price +' &#8363;</div>';
                html += '<div class="atsw-widget-product-discount">'+ product.discount +' &#8363;</div>';
            } else {
                html += '<div class="atsw-widget-product-price"></div>';
                html += '<div class="atsw-widget-product-discount">'+ product.price +' &#8363;</div>';
            }
            html += '</div>'; // .atsw-widget-product-price-c
            html += '</div>'; // .atsw-widget-product-row2

            html += '</div>'; // .atsw-widget

            if( count_col === window.__at_smartwidget.product_size ) {
                html += '<div style="clear: both;"></div>';
                count_col = 0;
            }
        } // end for loop
        html += '</div>';

        document.getElementById('at-smartwidget-root').innerHTML = css + html;
    },
    build_aff_link: function(url) {
        var aff_link = 'https://pub.accesstrade.vn/deep_link/' + window.__at_smartwidget.atid;
        aff_link += '?url=';
        aff_link += encodeURIComponent(url);
        aff_link += '&at_source=smartwidget';
        if( this.utm_source !== '' ) {
            aff_link += '&utm_source=' + this.utm_source;
        }
        return aff_link;
    },
    /*
      check url
      Found: using utm_source from url
      Not found: if has config => using config
      */
    get_utm_source: function() {
        var utm_in_url = this.getQueryVariable("utm_source");
        if (utm_in_url !== "") {
            return utm_in_url;
        }

        if (window.__at_smartwidget.utm_source) {
            return window.__at_smartwidget.utm_source;
        }

        return "";
    },
    getQueryVariable: function(variable) {
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
    document.addEventListener('DOMContentLoaded', function(){__accesstrade_smartwidget.init();});
}