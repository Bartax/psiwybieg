$(function(){
    $('button, input:submit, input:button').button();
});

$(document).ready(function(){
    
    try {
        // blokada zmiany rozmiaru dla contenteditable div
        document.execCommand("enableObjectResizing", false, false);
    }
    catch (e) {
        
    }

    // blokada upuszczania dla contenteditable
    $('.text-input').bind('dragover drop', function(e){
        e.preventDefault();
        return false;
    });
    
    var menu = $( '.menu' );
    var isEventOver = false;
    var rIntv = {};
	
	menu.each(function() {
		var $menu = $(this);
		var moduleContent = $menu.closest('.module-content');
		var bgColor = moduleContent[0].style.backgroundColor;
		if (bgColor) {
			$menu.find('ul li').css('background-color', bgColor);
		}
	});
    
    $('li.root ul').css('display','none');

    $('.menu li').mouseover(function(e){
        var size = $(this).outerHeight(false);
		var listItem = $(this);
        var attr = listItem.attr('attr');
		var parentList = listItem.parent().not('.menu');
		parentList.css({display: 'block',visibility: 'hidden'});
		
        var width = eval(parentList.prop('offsetWidth')-2);
        parentList.css({display: 'none',visibility: ''});

        if($(this).css('float') == 'none'){
            if($(this).css('text-align') == 'right'){
                $('li[attr="'+attr+'"] > ul').stop(true, true).css({'display':'block','right':$(this).width(),'top':0,'left':'auto'});
                listItem.children('ul').not('.root > ul').stop(true, true).css({'display':'block','right':width,'top':0,'left':'auto'});
            }
            else {
                $('li[attr="'+attr+'"] > ul').stop(true, true).css({'display':'block','left':$(this).width(),'top':0});
                listItem.children('ul').not('.root > ul').stop(true, true).css({'display':'block','left':width,'top':0});
            }
        }
        else {
            $('li[attr="'+attr+'"] > ul').stop(true, true).css({'display':'block','left':0,'top':size});
            listItem.children('ul').not('.root > ul').stop(true, true).css({'display':'block','left':width,'top':0});
        }
		
		e.preventDefault();
    }).mouseout(function(e){
        $('li.root ul').css({'display':'none','background-image':'none'});
    });
    if($('.col960').css('z-index') == '123'){
        $('.col960menu').insertBefore('.col960');
    }
    if($('.searchresults').length > 0){
        $(document).click(function() {
            $('.searchresults').hide();
        });
    }
});