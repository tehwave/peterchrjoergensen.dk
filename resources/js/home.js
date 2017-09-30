jQuery(document).ready(function($) {
    $.get("https://blog.peterchrjoergensen.dk/wp-json/wp/v2/posts?per_page=3", function( data ) {
        $('#wp-posts-loading').remove();
        $.each(data, function(i, post) {
            $( "#wp-posts").append(
                '<article class="col-12 col-md-6 col-lg-4">' +
                    '<h1 class="h4">' +
                        '<a href="' + post.link + '">' +
                            post.title.rendered +
                        '</a>' +
                    '</h1>' +
                    '<p>' +
                        post.excerpt.rendered +
                    '</p>' +
                '</article>'
            );
        });
        jQuery(window).trigger('resize').trigger('scroll');
    });
});
