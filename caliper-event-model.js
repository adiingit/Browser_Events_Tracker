window.caliper = window.caliper||{};
window.caliper.createEvent=function(){
   var event = {
  	'@context' : null,
  	'@type' : null,
  	actor : {},
  	action : null,
  	object : {},
  	eventTime : null
 }
 console.log(event);
 return event;
};


