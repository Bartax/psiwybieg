$(function(){
    $('.searchbox.native').each(function(){
        var searchBox = $(this);
        if (searchBox.data('searchbox')) return; // nie wykonuj jesli wczesniej to zrobiono
        searchBox.data('searchbox', true);
        var input = searchBox.find('input:text');
        var submit = searchBox.find('input:submit');
        var resultsBox = searchBox.find('.searchresults');
        var websiteId = $('#websiteid').val();
        var nozofobia = $('#nozofobia').val();
        var mode = searchBox.find('.mode').val();
        var limit = searchBox.find('.limit').val();
        submit.click(function(){
            $('.searchresults').hide();
            var q = input.val();
            if (q.length >= 3)
            {
                resultsBox.html('').addClass('working').show();
                $('.searchbox .ui-button').removeClass('ui-state-hover');
                //$('.searchbox .ui-button').css('background','url(/images/ajax-loader.gif) no-repeat center center');
                $('.searchbox .ui-button').val('Szukam');
                $.ajax({
                    type: 'post',
                    url: '/userdata/search',
                    data: {
                        format: 'json',
                        website: websiteId,
                        nozofobia: nozofobia,
                        'q': q,
                        'mode': mode,
                        'limit': limit
                    },
                    dataType: 'json',
                    success: function(data){
                        //$('.searchbox .ui-button').css('background','#fff');
                        $('.searchbox .ui-button').val('Szukaj');
                        if (data.status)
                        {
                            if (data.resultsCount)
                            {
                                resultsBox.removeClass('working').html('<ul></ul>');
                                var ul = resultsBox.find('ul');
                                $.each(data.pages, function(i, page){
                                    var item = '<li><a href="' + page.url + '">';
                                    item += '<p class="title">' + page.title + '</p>';
                                    
                                    if (mode)
                                    {
                                        var content = page.content;
                                        var regexhl = new RegExp( '(' + $.trim(q) + ')', 'gi' );
                                        content = content.replace( regexhl, "<span class=\"highlight\">$1<\/span>" );
                                        item += '<p class="content">' + content + '</p>';
                                    }
                                    item += '</a></li>';
                                    ul.append(item);
                                });
                                resultsBox.show();
                            }
                            else
                            {
                                resultsBox.html('<p class="noresult">Brak wyników dla szukanej frazy.</p>');
                            }
                        }
                        else
                        {
                            resultsBox.hide();
                        }
                    }
                });
            }
            else
            {
                resultsBox.hide();
            }
            return false;
        });
        input.keydown(function(){
            resultsBox.hide();
        });
    });
});