$(document).ready(function() { 
    var domModule = $('body');
    
    //pobranie elementow dla wybranego slidera
    function getSliderElement(element) {
        var item = new Array();
        
        item.thisSlide = $(element).closest('.pd');
        item.sliderCont = item.thisSlide.find( '.slide-cont' );
        
        return item;
    }
    
    domModule.find( '.slide-left' ).click(function(){
            
            var slideElem = getSliderElement(this);
            
            var scrollTo = slideElem.sliderCont.scrollLeft() - slideElem.sliderCont.width();

            if( scrollTo < 0 ) {
                scrollTo = 0;
            }

            slideElem.sliderCont.animate({
                scrollLeft : scrollTo
            });
     });
     
     domModule.find( '.slide-right' ).click(function(){
             
            var slideElem = getSliderElement(this);
            
            var scrollTo = slideElem.sliderCont.scrollLeft() + slideElem.sliderCont.width();

            slideElem.sliderCont.animate({
                scrollLeft : scrollTo
            });
        });
        
    domModule.find('.thumbSlide').click(function() {
        var linkImg = $(this).children('img').attr('src');
        var mainPhoto = $(this).closest('.pd').children('.gallery-cont').children('.main-photo').children('a');
        
        mainPhoto.attr('href',linkImg).children('img').attr('src', linkImg);
        //po wywolaniu wyzej
        var widthImg = mainPhoto.width()+"px";
        mainPhoto.closest('.main-photo').css({'width': widthImg});
    });
});


