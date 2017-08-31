$(document).ready(function(){

    var gallery = $( '.moduleGallery' );
    
    if( gallery.length ) {
        
        $.each( gallery, function( i ) {
            
            if( $( gallery[i] ).find('td.folder').length ) {
                setFolderGrid( $( gallery[i] ), $( gallery[i] ).attr( 'columns' )  );
            } else {
                
            }
            
        } );
        
    }
    
    function lboxUid() {
        var S4 = function() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        return (S4()+S4()+S4()+S4()+S4()+S4());
    }
    
    function setFolderGrid( elem, columns ) {
        
        elem.find( 'td.folder' ).click(function() {
            
            var self = this;
            
            var grid = $( '.' + $( self ).attr( 'for' ) );

            grid.css({
                display: ''
            });
            
            grid.find('.gallopt').click(function(){
                $( self ).parents( 'table' ).css({
                    display: ''
                });
                
                grid.css({
                    display: 'none'
                });
            });
            
            $( self ).parents( 'table' ).css({
                display: 'none'
            });
            
            /*
            var images = $( this ).find( 'a' );
            
            var bounds = elem.bounds();
            
            var elemWidth = bounds.right - bounds.left;
            
            var gridLayer = $( '<div class="gridLayer"></div>' );
            gridLayer.css({
                width: elemWidth + 'px',
                //height: '500px',
                background: '#fff',
                border: '1px solid #000',
                position: 'absolute',
                top: bounds.top + 'px',
                left: bounds.left + 'px',
                padding: '10px'
            });
            
            
            $('body').append( gridLayer );
            
            var inside = drawInside( images, columns );
            gridLayer.append( '<div class="galleryBack">&laquo; Powrót do galerii</div>' );
            gridLayer.append( $( '<table style="width:100%;table-layout:fixed;">' + inside + '</table>' ) );


            gridLayer.find( '.galleryBack' ).click(function(){
                
                gridLayer.remove();
                
            });
            */
        });
        
        
        //console.log( elem.find( 'a' ) );
        
    }
    
    
    function drawInside( images, columns ){
        
        var inside = '';

        var counter = 1;
        var r = '';

        var uuid = lboxUid();

        r += '<tr>';
        $.each(images, function(i) {

            r += '<td style="text-align: center; vertical-align: middle;">';
                r += '<a href="' +  $( images[i] ).attr('href') + '" rel="lightbox[' + uuid + ']"><img src="' + $( images[i] ).find('img').attr('src') + '" style="max-width:100%;" /></a>';
            r += '</td>';
            if(counter % columns == 0) {
                r += '</tr><tr>';
            }
            counter++;

        });
        r += '</tr>';


        inside = r;
  
        return inside;
    }

});