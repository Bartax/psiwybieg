WkrCookieInfo = function () {
    
    /**
     * CookieInfo
     */
    var CookieInfo = function (content) {
        if($.cookie('cookie_info') == 1) {
            content.remove();
        } else {
            content.show();
        }
        if(typeof isPreview == 'undefined' || isPreview == false) {
            content.find('.cookie-close').on('click', function() {
                $.cookie('cookie_info', 1, { 'expires': 365, 'path': '/' });
            });
        }
        content.find('.cookie-close').on('click', function() {
            content.remove();
        });

        if (content.hasClass('bottom')) {
            // wczytano reklame w stopce
            $(document).on('WKR_EVENT_SELF_AD_LOADED', function(e, contentAd) {
                if (contentAd && contentAd.length && contentAd.filter('.self-ad-bar').length && contentAd.filter('.self-ad-bar').outerHeight(false) > 0) {
                    content.animate({'padding-bottom' : contentAd.filter('.self-ad-bar').outerHeight(false)}, 300);
                }
            });
        }
    }
    
    /**
     * Inicjalizacja
     */
    this.init = function() {
        var cookieInfoCtr = $('.cookie-alert');
        if (cookieInfoCtr.length) {
            new CookieInfo(cookieInfoCtr);
        }
        
        return this;
    }
}

$(document).ready(function(){
    var cookieInfo = new WkrCookieInfo();
    cookieInfo.init();
});