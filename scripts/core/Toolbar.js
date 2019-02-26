(function(){

///////////////////
//// PRELOADER ////
///////////////////

var preloadBar = document.getElementById("loading_bar_connection");
subscribe("/load",function(ratio){
	ratio = ratio*ratio*ratio*ratio*ratio; // to make it look like it's accelerating.
	preloadBar.style.left = Math.round(-225*(1-ratio))+"px";
});


//////////////////////
//// PLAY & PAUSE ////
//////////////////////

var add_excitatory = document.getElementById("toolbar_excitatory");

var mouse_is_down = false;

add_excitatory.addEventListener("mousedown", function(event) {
    mouse_is_down = true;
}, false);

add_excitatory.addEventListener("mouseup", function(event) {
    mouse_is_down = false;
    created_new = false;
}, false);

add_excitatory.addEventListener("mousemove", function(event) {
	if (mouse_is_down) {
		publish("/toolbar/excitatory");
		mouse_is_down = false;
	}
}, false);

var add_inhibitory = document.getElementById("toolbar_inhibitory");

add_inhibitory.addEventListener("mousedown", function(event) {
    mouse_is_down = true;
}, false);

add_inhibitory.addEventListener("mouseup", function(event) {
    mouse_is_down = false;
    created_new = false;
}, false);

add_inhibitory.addEventListener("mousemove", function(event) {
	if (mouse_is_down) {
		publish("/toolbar/inhibitory");
		mouse_is_down = false;
	}
}, false);

//////////////////////
/// VOLUME CONTROL ///
//////////////////////

// var volumeIcon = document.getElementById("control_volume");
// var volumeSlider = document.getElementById("control_volume_slider");

// // Icon
// var _lastVolume = 1;
// volumeIcon.onclick = function(){

// 	// Edge Case - muting when already muted
// 	if(!createjs.Sound.muted && createjs.Sound.volume==0){
// 		_lastVolume = 1;
// 		createjs.Sound.volume = volumeSlider.value = 1;
// 		_updateVolumeIcon();
// 		return;
// 	}

// 	// Otherwise, toggle between mute & last volume.
// 	createjs.Sound.muted = !createjs.Sound.muted;
// 	if(createjs.Sound.muted){
// 		_lastVolume = volumeSlider.value;
// 		volumeSlider.value = 0;
// 	}else{
// 		createjs.Sound.volume = volumeSlider.value = _lastVolume;
// 	}
// 	_updateVolumeIcon();

// };
// var _updateVolumeIcon = function(){
// 	var state = 0;
// 	if(createjs.Sound.muted || createjs.Sound.volume==0){
// 		state = 0;
// 	}else{
// 		state = Math.ceil(createjs.Sound.volume*3);
// 	}
// 	state = 3-state;
// 	volumeIcon.style.backgroundPosition = (-state*47)+"px 0px";
// };

// // The slider
// volumeSlider.oninput = function(){
// 	createjs.Sound.muted = false;
// 	createjs.Sound.volume = volumeSlider.value;
// 	_updateVolumeIcon();
// };

})();