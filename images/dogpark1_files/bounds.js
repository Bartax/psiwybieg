(function() {
   jQuery.fn['bounds'] = function () {
     var bounds = {left: Number.POSITIVE_INFINITY, top: Number.POSITIVE_INFINITY,
                   right: Number.NEGATIVE_INFINITY, bottom: Number.NEGATIVE_INFINITY};

     this.each(function (i,el) {
                 var elQ = $(el);

                 if (elQ.length == 0)
                   return;

                 var off = elQ.offset();
                 off.right = off.left + $(elQ).width();
                 off.bottom = off.top + $(elQ).height();

                 if (off.left < bounds.left)
                   bounds.left = off.left;

                 if (off.top < bounds.top)
                   bounds.top = off.top;

                 if (off.right > bounds.right)
                   bounds.right = off.right;

                 if (off.bottom > bounds.bottom)
                   bounds.bottom = off.bottom;

               });
     return bounds;
   }
})();