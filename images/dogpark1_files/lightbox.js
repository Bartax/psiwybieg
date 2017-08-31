
/*
Lightbox v2.51
by Lokesh Dhakar - http://www.lokeshdhakar.com

For more information, visit:
http://lokeshdhakar.com/projects/lightbox2/

Licensed under the Creative Commons Attribution 2.5 License - http://creativecommons.org/licenses/by/2.5/
- free for use in both personal and commercial projects
- attribution requires leaving author name, author link, and the license info intact
  
Thanks
- Scott Upton(uptonic.com), Peter-Paul Koch(quirksmode.com), and Thomas Fuchs(mir.aculo.us) for ideas, libs, and snippets.
- Artemy Tregubenko (arty.name) for cleanup and help in updating to latest proto-aculous in v2.05.


Table of Contents
=================
LightboxOptions

Lightbox
- constructor
- init
- enable
- build
- start
- changeImage
- sizeContainer
- showImage
- updateNav
- updateDetails
- preloadNeigbhoringImages
- enableKeyboardNav
- disableKeyboardNav
- keyboardAction
- end

options = new LightboxOptions
lightbox = new Lightbox options
*/

(function() {
  var $, Lightbox, LightboxOptions;

  $ = jQuery;

  LightboxOptions = (function() {

    function LightboxOptions() {
      this.fileLoadingImage = '/lib/images/loading.gif';
      this.fileCloseImage = '/lib/images/close.png';
      this.resizeDuration = 700;
      this.fadeDuration = 500;
      this.labelImage = "Zdjęcie";
      this.labelOf = "z";
    }

    return LightboxOptions;

  })();

  Lightbox = (function() {

    function Lightbox(options) {
      this.options = options;

      if("object" == typeof lightbox_options){
        this.options.extended   = true;
        this.options.extension  = lightbox_options;
      }

      this.album = [];
      this.currentImageIndex = void 0;
      this.init();
    }

    Lightbox.prototype.init = function() {
      this.enable();
      return this.build();
    };

    Lightbox.prototype.enable = function() {
      var _this = this;
      return $('body').on('click', 'a[rel^=lightbox], area[rel^=lightbox]', function(e) {
        _this.start($(e.currentTarget));
        return false;
      });
    };

    Lightbox.prototype.build = function() {
      var $lightbox,
        _this = this;
      $("<div>", {
        id: 'lightbox-extension'
      }).appendTo($('body'));
      $("<div>", {
        id: 'lightboxOverlay'
      }).appendTo($('#lightbox-extension'));
      $('<div/>', {
        id: 'lightbox'
      }).append($('<div/>', {
        "class": 'lb-outerContainer'
      }).append($('<div/>', {
        "class": 'lb-container'
      }).append($('<img/>', {
        "class": 'lb-image'
      }), $('<div/>', {
        "class": 'lb-nav'
      }).append($('<a/>', {
        "class": 'lb-prev'
      }), $('<a/>', {
        "class": 'lb-next'
      })), $('<div/>', {
        "class": 'lb-loader'
      }).append($('<a/>', {
        "class": 'lb-cancel'
      }).append($('<img/>', {
        src: this.options.fileLoadingImage
      }))))), $('<div/>', {
        "class": 'lb-dataContainer'
      }).append($('<div/>', {
        "class": 'lb-data'
      }).append($('<div/>', {
        "class": 'lb-details'
      }).append($('<span/>', {
        "class": 'lb-caption'
      }), $('<span/>', {
        "class": 'lb-number'
      })), $('<div/>', {
        "class": 'lb-closeContainer'
      }).append($('<a/>', {
        "class": 'lb-close'
      }).append($('<img/>', {
        src: this.options.fileCloseImage
      })))))).appendTo($('#lightbox-extension'));

      $('#lightbox').wrapInner($('<div/>', { id : 'lb-extension'}));

      $('#lightboxOverlay, #lightbox-extension').hide().on('click', function(e) {
        _this.end();
        return false;
      });
      $lightbox = $('#lightbox');
      $lightbox.hide().on('click', function(e) {
        if ($(e.target).attr('id') === 'lightbox') _this.end();
        return false;
      });
      $lightbox.find('.lb-outerContainer').on('click', function(e) {
        if ($(e.target).attr('id') === 'lightbox') _this.end();
        return false;
      });
      $lightbox.find('.lb-prev').on('click', function(e) {
        _this.changeImage(_this.currentImageIndex - 1, true);
        return false;
      });
      $lightbox.find('.lb-next').on('click', function(e) {
        _this.changeImage(_this.currentImageIndex + 1);
        return false;
      });
      $lightbox.find('.lb-loader, .lb-close').on('click', function(e) {
        _this.end();
        return false;
      });
    };

    Lightbox.prototype.start = function($link) {
      var customTransition;
      switch(parseInt($link.attr('effect'))){
        case 2:
          customTransition = "fadeLeft";
          break;
        case 3:
          customTransition = "fadeRight";
          break;
        case 4:
          customTransition = "fadeTop";
          break;
        case 5:
          customTransition = "fadeBottom";
          break;
        case 1:
        default:
          customTransition = false;
      }

      if(customTransition){
        this.options.extended   = true;
        this.options.extension  = { 'transition' : customTransition };
        $('#lb-extension').css({'position' : 'absolute', 'margin-left' : 0 });
      }else{
        this.options.extended   = false;
        $('#lb-extension').css({'position' : 'static', 'margin-left' : 0 });
      }

      var $lightbox, $window, a, i, imageNumber, left, top, _len, _ref;
      $(window).on("resize", this.sizeOverlay);
      $('select, object, embed').css({
        visibility: "hidden"
      });
      $('#lightboxOverlay, #lightbox-extension').width($(document).width()).height($(document).height()).fadeIn(this.options.fadeDuration);
      this.album = [];
      imageNumber = 0;
      if ($link.attr('rel') === 'lightbox') {
        this.album.push({
          link: $link.attr('href'),
          title: $link.attr('title'),
          pid: $link.attr('pid'),
          avote: $link.attr('avote')
        });
      } else {
        _ref = $($link.prop("tagName") + '[rel="' + $link.attr('rel') + '"]');
        for (i = 0, _len = _ref.length; i < _len; i++) {
          a = _ref[i];
          this.album.push({
            link: $(a).attr('href'),
            title: $(a).attr('title'),
            pid: $link.attr('pid'),
          avote: $link.attr('avote')
          });
          if ($(a).attr('href') === $link.attr('href')) imageNumber = i;
        }
      }
      $window = $(window);
      top = $window.scrollTop() + $window.height() / 12;
      left = $window.scrollLeft();
      $lightbox = $('#lightbox');
      
      $lightbox.css({
        top: top + 'px',
        left: left + 'px'
      });

      this.extendedTransition($lightbox);

      this.changeImage(imageNumber);
    };


    /* lightbox extension */
    Lightbox.prototype.extendedTransition = function($lightbox, invertTransition) {
      if(this.options.extended){
        switch(this.options.extension.transition){
          case 'fadeLeft': 
            this.options.extension.direction = 'horizontal';

            if(undefined != invertTransition && true == invertTransition){
              $('#lb-extension').css('left', '-100%');
            }else{
              $('#lb-extension').css('left', '100%');
            }
            
            $lightbox.show();
            this.options.resizeDuration = 0;
            this.options.extension.wait = true;
            break;
          
          case 'fadeRight':
            this.options.extension.direction = 'horizontal';
            
            if(undefined != invertTransition && true == invertTransition){
              $('#lb-extension').css('left', '100%');
            }else{
              $('#lb-extension').css('left', '-100%');
            }

            $lightbox.show();
            this.options.resizeDuration = 0;
            this.options.extension.wait = true;
            break;

          case 'fadeTop':
            this.options.extension.direction = 'vertical';
            
            if(undefined != invertTransition && true == invertTransition){
              $('#lb-extension').css('top', -parseInt($(window).height()));
            }else{
              $('#lb-extension').css('top', parseInt($(window).height()));
            }

            $lightbox.show();
            this.options.resizeDuration = 0;
            this.options.extension.wait = true;
            break;

          case 'fadeBottom':
            this.options.extension.direction = 'vertical';
            
            if(undefined != invertTransition && true == invertTransition){
              $('#lb-extension').css('top', parseInt($(window).height()));
            }else{
              $('#lb-extension').css('top', -parseInt($(window).height()));
            }

            $lightbox.show();
            this.options.resizeDuration = 0;
            this.options.extension.wait = true;
            break;

          default:
            $lightbox.fadeIn(this.options.fadeDuration);
        }
      }else{
        $lightbox.fadeIn(this.options.fadeDuration);
      }

    }

    Lightbox.prototype.changeImage = function(imageNumber, invertTransition) {
      
      var $image, $lightbox, preloader,
        _this = this;
      this.disableKeyboardNav();
      $lightbox = $('#lightbox');
      $image = $lightbox.find('.lb-image');
      this.sizeOverlay();
      $('#lightboxOverlay, #lightbox-extension').fadeIn(this.options.fadeDuration);
      $('.loader').fadeIn('slow');
      $lightbox.find('.lb-image, .lb-nav, .lb-prev, .lb-next, .lb-dataContainer, .lb-numbers, .lb-caption').hide();
      $lightbox.find('.lb-outerContainer').addClass('animating');
      preloader = new Image;
      preloader.onload = function() {
        $image.attr('src', _this.album[imageNumber].link);
        /**
         * Autoscale image
         *
         * add to your lightbox.css file: 
         *  .lb-container > img {
         *    width: 100% !important;
         *  }
         *
         * @author: Bartłomiej Pietrzyk <pietrzyk.bartlomiej@gmail.com>
         */
        var windowRatio = $(window).width()/$(window).height();
        var imageRatio  = preloader.width/preloader.height;

        if(preloader.width > $(window).width()
        || preloader.height > $(window).height()){

          if(imageRatio < windowRatio){
            preloader.height = $(window).height() * 0.8;
            preloader.width  = preloader.height * imageRatio;
          }else{
            preloader.width  = $(window).width() * 0.8;
            preloader.height = preloader.width / imageRatio;
          }

        }

        $image.width  = preloader.width;
        $image.height = preloader.height;
        return _this.sizeContainer(preloader.width, preloader.height);

      };
      preloader.src = this.album[imageNumber].link;
      this.currentImageIndex = imageNumber;

      this.extendedTransition($lightbox, invertTransition);
    };

    Lightbox.prototype.sizeOverlay = function() {
      return $('#lightboxOverlay').width($(document).width()).height($(document).height());
    };

    Lightbox.prototype.sizeContainer = function(imageWidth, imageHeight) {
      var $container, $lightbox, $outerContainer, containerBottomPadding, containerLeftPadding, containerRightPadding, containerTopPadding, newHeight, newWidth, oldHeight, oldWidth,
        _this = this;
      $lightbox = $('#lightbox');
      $outerContainer = $lightbox.find('.lb-outerContainer');
      oldWidth = $outerContainer.outerWidth();
      oldHeight = $outerContainer.outerHeight();
      $container = $lightbox.find('.lb-container');
      containerTopPadding = parseInt($container.css('padding-top'), 10);
      containerRightPadding = parseInt($container.css('padding-right'), 10);
      containerBottomPadding = parseInt($container.css('padding-bottom'), 10);
      containerLeftPadding = parseInt($container.css('padding-left'), 10);
      newWidth = imageWidth + containerLeftPadding + containerRightPadding;
      newHeight = imageHeight + containerTopPadding + containerBottomPadding;
      if (newWidth !== oldWidth && newHeight !== oldHeight) {
        $outerContainer.animate({
          width: newWidth,
          height: newHeight
        }, this.options.resizeDuration, 'swing');
      } else if (newWidth !== oldWidth) {
        $outerContainer.animate({
          width: newWidth
        }, this.options.resizeDuration, 'swing');
      } else if (newHeight !== oldHeight) {
        $outerContainer.animate({
          height: newHeight
        }, this.options.resizeDuration, 'swing');
      }
      setTimeout(function() {
        $lightbox.find('.lb-dataContainer').width(newWidth);
        $lightbox.find('.lb-prevLink').height(newHeight);
        $lightbox.find('.lb-nextLink').height(newHeight);
        _this.showImage();
      }, this.options.resizeDuration);
    };

    Lightbox.prototype.showImage = function() {
      var $lightbox;
      $lightbox = $('#lightbox');
      $lightbox.find('.lb-loader').hide();
      $lightbox.find('.lb-image').fadeIn('slow');

      /* lightbox extension */
      if(this.options.extended && this.options.extension.wait){
        $('#lb-extension').css({'margin-left' : -parseInt(0.5 * $('.lb-outerContainer').outerWidth())});
        
        if('vertical' == this.options.extension.direction){
          $('#lb-extension').stop().animate({ 'top' : 0 }, this.options.fadeDuration);
        }else{
          $('#lb-extension').stop().animate({ 'left' : "50%" }, this.options.fadeDuration);
        }
      }

      this.updateNav();
      this.updateDetails();
      this.preloadNeighboringImages();
      this.enableKeyboardNav();
    };

    Lightbox.prototype.updateNav = function() {
      var $lightbox;
      $lightbox = $('#lightbox');
      $lightbox.find('.lb-nav').show();
      if (this.currentImageIndex > 0) $lightbox.find('.lb-prev').show();
      if (this.currentImageIndex < this.album.length - 1) {
        $lightbox.find('.lb-next').show();
      }
    };

    Lightbox.prototype.updateDetails = function() {
      var $lightbox,
        _this = this;
      $lightbox = $('#lightbox');
      
        var rate = $lightbox.find('.lb-details').find('.rate');
        if( rate.length ) {
            rate.remove();
        }

      if( this.album[this.currentImageIndex].avote > 0 ) {
       

        var vote = parseInt( globalRate[this.album[this.currentImageIndex].pid] );
        rate = $( '<div class="rate">'+
                      '<div class="rate_info" style="float: left;width:50px;">ocena:</div>'+
                      '<div class="rate_st" style="float: left;width:120px;padding-top:3px;">'+

                          '<input title="1" name="star' + this.album[this.currentImageIndex].pid + 'lb" type="radio" class="star123" ' + ( vote == 1 ? 'checked="checked"' : '' ) + '/>' +
                          '<input title="2" name="star' + this.album[this.currentImageIndex].pid+ 'lb" type="radio" class="star123" ' + ( vote == 2 ? 'checked="checked"' : '' ) + '/>' +
                          '<input title="3" name="star' + this.album[this.currentImageIndex].pid + 'lb" type="radio" class="star123" ' + ( vote == 3 ? 'checked="checked"' : '' ) + '/>' +
                          '<input title="4" name="star' + this.album[this.currentImageIndex].pid + 'lb" type="radio" class="star123" ' + ( vote == 4 ? 'checked="checked"' : '' ) + '/>' +
                          '<input title="5" name="star' + this.album[this.currentImageIndex].pid + 'lb" type="radio" class="star123" ' + ( vote == 5 ? 'checked="checked"' : '' ) + '/>' +

                      '</div>'+
                  '</div>' );
        $lightbox.find('.lb-details').append( rate );
        var self = this;
        window.setTimeout(function(){
          rate.find('.star123').rating({
              callback: function(value, link){

                  $.post('/userdata/', 'type=rate&trustr='+trustr+'&pid='+self.album[self.currentImageIndex].pid+'&value='+$( this ).attr( 'title' ),function(){

                  });

                  $(this).rating('disable');

              },
              required: true
          });
        },200);
      
      }

      if (typeof this.album[this.currentImageIndex].title !== 'undefined' && this.album[this.currentImageIndex].title !== "") {
        $lightbox.find('.lb-caption').html(this.album[this.currentImageIndex].title).fadeIn('fast');
      }
      if (this.album.length > 1) {
        $lightbox.find('.lb-number').html(this.options.labelImage + ' ' + (this.currentImageIndex + 1) + ' ' + this.options.labelOf + '  ' + this.album.length).fadeIn('fast');
      } else {
        $lightbox.find('.lb-number').hide();
      }
      $lightbox.find('.lb-outerContainer').removeClass('animating');
      $lightbox.find('.lb-dataContainer').fadeIn(this.resizeDuration, function() {
        return _this.sizeOverlay();
      });
    };

    Lightbox.prototype.preloadNeighboringImages = function() {
      var preloadNext, preloadPrev;
      if (this.album.length > this.currentImageIndex + 1) {
        preloadNext = new Image;
        preloadNext.src = this.album[this.currentImageIndex + 1].link;
      }
      if (this.currentImageIndex > 0) {
        preloadPrev = new Image;
        preloadPrev.src = this.album[this.currentImageIndex - 1].link;
      }
    };

    Lightbox.prototype.enableKeyboardNav = function() {
      $(document).on('keyup.keyboard', $.proxy(this.keyboardAction, this));
    };

    Lightbox.prototype.disableKeyboardNav = function() {
      $(document).off('.keyboard');
    };

    Lightbox.prototype.keyboardAction = function(event) {
      var KEYCODE_ESC, KEYCODE_LEFTARROW, KEYCODE_RIGHTARROW, key, keycode;
      KEYCODE_ESC = 27;
      KEYCODE_LEFTARROW = 37;
      KEYCODE_RIGHTARROW = 39;
      keycode = event.keyCode;
      key = String.fromCharCode(keycode).toLowerCase();
      if (keycode === KEYCODE_ESC || key.match(/x|o|c/)) {
        this.end();
      } else if (key === 'p' || keycode === KEYCODE_LEFTARROW) {
        if (this.currentImageIndex !== 0) {
          this.changeImage(this.currentImageIndex - 1, true);
        }
      } else if (key === 'n' || keycode === KEYCODE_RIGHTARROW) {
        if (this.currentImageIndex !== this.album.length - 1) {
          this.changeImage(this.currentImageIndex + 1);
        }
      }
    };

    Lightbox.prototype.end = function() {
      this.disableKeyboardNav();
      $(window).off("resize", this.sizeOverlay);
      $('#lightbox').fadeOut(this.options.fadeDuration);
      $('#lightboxOverlay, #lightbox-extension').fadeOut(this.options.fadeDuration);
      return $('select, object, embed').css({
        visibility: "visible"
      });
    };

    return Lightbox;

  })();

  $(function() {
    var lightbox, options;
    options = new LightboxOptions;
    return lightbox = new Lightbox(options);
  });

}).call(this);