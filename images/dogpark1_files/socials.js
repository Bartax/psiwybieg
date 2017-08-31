var currentHost = window.location.host;
$(function(){
    $('#fb-like, #g-plusone').attr('data-href', window.location.protocol + '//' + currentHost);
});