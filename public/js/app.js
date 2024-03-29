// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation({
  	orbit: {
		animation: 'fade', // Sets the type of animation used for transitioning between slides, can also be 'fade'
		timer_speed: 5000, // Sets the amount of time in milliseconds before transitioning a slide
		pause_on_hover: false, // Pauses on the current slide while hovering
		resume_on_mouseout: false, // If pause on hover is set to true, this setting resumes playback after mousing out of slide
		animation_speed: 500, // Sets the amount of time in milliseconds the transition between slides will last
		slide_number: false,
		navigation_arrows: true,
		swipe: true
  	}
});


// Scroll

function scrollToDiv(element,navheight){
	var offset = element.offset();
  	var offsetTop = offset.top;
  	var totalScroll = offsetTop-navheight;
  	$('body, html').animate({scrollTop: totalScroll}, 800);
}

$('#menu a, #scroll').click(function(e) { 
	e.preventDefault(); 
  	var el = $(this).attr('href');
  	var elWrapped = $(el);
  	scrollToDiv(elWrapped,0);    
});

// Menu On Small Screen

$('#menu a').click(function() { 
    $('#top-bar').removeClass('expanded'); 
});
