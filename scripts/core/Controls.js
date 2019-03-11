(function(){

///////////////////
//// PRELOADER ////
///////////////////

var preloadBar = document.getElementById("loading_bar_connection");
subscribe("/load",function(ratio){
	ratio = ratio*ratio*ratio*ratio*ratio; // to make it look like it's accelerating.
	preloadBar.style.left = Math.round(-225*(1-ratio))+"px";
});

////////////////////////
//// LEVEL CONTROLS ////
////////////////////////

var next_level_button = document.getElementById("next_level");
var level_controls_div = document.getElementById("level_controls");
var level_listener = subscribe("/level/winLevel", function() {
	var neurons = Interactive.scene.neurons;
	for (var i = 0; i < neurons.length; i++) {
		if (neurons[i].neuron_function == NeuronFunction.ENDING) {
			if (neurons[i].win_pulse_count < 3) {
				publish("/alert", ["Make sure to activate all of the ending neurons at once!"]);
				return;
			}
		}
	}
	_showLevel(true);
	console.log("Level passed!");
	publish("/alert", ["Nice job! You passed this level!"]);
});
var level_reset_listener = subscribe("/level/reset", function() {
	_showLevel(false);
});
next_level_button.onclick = function() {
	publish("/level/nextLevel");
	// register this as mouse click
	publish("/mouse/click");
	_showLevel(false);
};
var _showLevel = function(should_show) {
	if (should_show) {
		next_level_button.style.display = "block";
		level_controls_div.style.display = "block";
	} else{
		next_level_button.style.display = "none";
		level_controls_div.style.display = "none";
	}
};

//////////////////////
//// PLAY & PAUSE ////
//////////////////////

var play = document.getElementById("control_play");
subscribe("/pause",function(){
	if(Interactive.PLAYING){
		Interactive.pause();
	}
	_updatePauseUI();
});
play.onclick = function(){
	if(Interactive.PLAYING){
		Interactive.pause();
	}else{
		Interactive.play();
	}
	_updatePauseUI();
};

// Page Visibility
subscribe("/update", function(){
	if(Interactive.PLAYING && document.hidden){
		Interactive.pause();
		_updatePauseUI();
	}
});

var resume_screen = document.getElementById("resume");
var resume_button = document.getElementById("resume_button");
resume_screen.onclick = function(){
	Interactive.play();
	_updatePauseUI();
};
var _updatePauseUI = function(){
	if(Interactive.PLAYING){
		play.setAttribute("playing","true");
		resume.style.display = "none";
	}else{
		play.setAttribute("playing","false");
		resume.style.display = "block";
	}
};

//////////////////////
/// VOLUME CONTROL ///
//////////////////////

var volumeIcon = document.getElementById("control_volume");
var volumeSlider = document.getElementById("control_volume_slider");

// Icon
var _lastVolume = 1;
volumeIcon.onclick = function(){

	// Edge Case - muting when already muted
	if(!createjs.Sound.muted && createjs.Sound.volume==0){
		_lastVolume = 1;
		createjs.Sound.volume = volumeSlider.value = 1;
		_updateVolumeIcon();
		return;
	}

	// Otherwise, toggle between mute & last volume.
	createjs.Sound.muted = !createjs.Sound.muted;
	if(createjs.Sound.muted){
		_lastVolume = volumeSlider.value;
		volumeSlider.value = 0;
	}else{
		createjs.Sound.volume = volumeSlider.value = _lastVolume;
	}
	_updateVolumeIcon();

};
var _updateVolumeIcon = function(){
	var state = 0;
	if(createjs.Sound.muted || createjs.Sound.volume==0){
		state = 0;
	}else{
		state = Math.ceil(createjs.Sound.volume*3);
	}
	state = 3-state;
	volumeIcon.style.backgroundPosition = (-state*47)+"px 0px";
};

// The slider
volumeSlider.oninput = function(){
	createjs.Sound.muted = false;
	createjs.Sound.volume = volumeSlider.value;
	_updateVolumeIcon();
};


//////////////////////
//// CAPTIONS, YO ////
//////////////////////

// Icon
var captionsIcon = document.getElementById("control_captions");
var _lastLanguage = "en";
captionsIcon.onclick = function(){
	if(CAPTION_LANGUAGE==""){
		CAPTION_LANGUAGE = _lastLanguage;
	}else{
		_lastLanguage = CAPTION_LANGUAGE;
		CAPTION_LANGUAGE = "";
	}
	_updateCaptionsUI();
};
var _updateCaptionsUI = function(){
	captionsIcon.style.backgroundPosition = (CAPTION_LANGUAGE=="") ? "47px 0px" : "0px 0px";
	captionsSelect.value = CAPTION_LANGUAGE;
};

// The list
var captionsSelect = document.getElementById("control_captions_select");

// Populate List. Also, the default option.
var languageList = [{
	value: "",
	label: "None"
}];
for(var languageID in window.Captions){
	var language = Captions[languageID];
	languageList.push({
		value: languageID,
		label: language.label
	});
}
var html = "";
for(var i=0;i<languageList.length;i++){
	var language = languageList[i];
	html += '<option '+(language.value==CAPTION_LANGUAGE ? 'selected ' : '')+
					'value="'+language.value+'">'+
					language.label+
					'</option>';
}
captionsSelect.innerHTML = html;

// When the language is changed...
captionsSelect.onchange = function(){
	CAPTION_LANGUAGE = captionsSelect.value;
	_updateCaptionsUI();
};

// IF THERE IS A ?lang=es var, set to THAT.
function getParameterByName(name){
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(window.top.location.search); // TOP.
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
var lang = getParameterByName("lang");
if(lang && window.Captions[lang]){
	captionsSelect.value = lang;
	CAPTION_LANGUAGE = captionsSelect.value;
	_updateCaptionsUI();
}

})();