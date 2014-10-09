$(function () {
	if( window.localStorage.getItem('bestWaiting') === 'moze' )
		return window.location.href = "html/best.html";
	else if( window.localStorage.getItem( 'intro' ) && window.localStorage.getItem( 'registered' ) )
		return window.location.href = "html/menu.html";
	else if( window.localStorage.getItem( 'intro' ) && !window.localStorage.getItem( 'registered' ) )
   		return window.location.href = "html/register.html";
   	else
   		return window.location.href = 'html/intro.html';
});