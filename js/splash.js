$(document).on('pageinit','#splash',function(){
// the .on() method does require jQuery 1.7 + but this will allow you to have the contained code only run when the #splash page is initialized.
  window.setTimeout(function(){
    $.mobile.changePage("home.html", "fade");
  }, 3000);
});