$.fn.textfill = function(options) {
    var fontSize = options.maxFontPixels;
    var ourText = $('span:visible:first', this);
    var maxHeight = $(this).height()/4;
    var maxWidth = $(this).width()/4;
    var textHeight;
    var textWidth;
    do {
            ourText.css('font-size', fontSize);
            textHeight = ourText.height();
            textWidth = ourText.width();
            fontSize = fontSize - 1;
    } while (textHeight > maxHeight && fontSize > 30 || textWidth > maxWidth && fontSize > 30);
    return this;
}

$(document).ready(function() {
    $('.gal-folder').textfill({ maxFontPixels: 500 });
/*    $('form label').each(function() {
        if($(this).parents('div:eq(0)').attr('style').indexOf('text-decoration') > -1) {
            $(this).css({'text-decoration':'underline'});
            $(this).parents('div:eq(0)').css({'text-decoration':'none'});
        }
    });
*/
});

