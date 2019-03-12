(function(){

//////////////////////////
//// DRAG NEW NEURONS ////
//////////////////////////

var mouse_is_down = false;

var add_excitatory = document.getElementById("toolbar_excitatory");
add_excitatory.addEventListener("mousedown", function(event) {
    mouse_is_down = true;
}, false);

add_excitatory.addEventListener("mouseup", function(event) {
    mouse_is_down = false;
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
}, false);

add_inhibitory.addEventListener("mousemove", function(event) {
	if (mouse_is_down) {
		publish("/toolbar/inhibitory");
		mouse_is_down = false;
	}
}, false);

var forget_bar = document.getElementById("toolbar_forget_bar");
var show_toolbar = subscribe("/toolbar/show", function(show_excite, show_inhibit, show_delete, show_forget) {
	add_excitatory.style.display = show_excite ? "block" : "none";
	add_inhibitory.style.display = show_inhibit ? "block" : "none";
	delete_button.style.display = show_delete ? "block" : "none";
	forget_bar.style.display = show_forget ? "block" : "none";
	Interactive.forget_on = show_forget;
});

////////////////////////
//// DELETE NEURONS ////
////////////////////////

var delete_button = document.getElementById("toolbar_delete");
var toggle_delete = function() {
	Interactive.delete_on = !Interactive.delete_on;
    delete_button.setAttribute("deleting", Interactive.delete_on ? "true" : "false");

    return Interactive.delete_on;
}
delete_button.addEventListener("click", function(event) {
    var is_delete_on = toggle_delete();

    if (is_delete_on) {
    	var delete_once = subscribe("/mouse/click", function() {
    		unsubscribe(delete_once);

    		// Wait 35 ms before toggling Interactive.delete_on to give Neuron time to delete
    		setTimeout(function() {
    			toggle_delete();
    		}, 35);    		
    	});
    }
}, false);

////////////////////////////
//// SAVE CONFIGURATION ////
////////////////////////////

var save_button = document.getElementById("toolbar_save");
save_button.onclick = function(){
	console.log(Neuron.serialize(Interactive.scene, true));
};

//////////////////////
//// LEVEL NUMBER ////
//////////////////////

var level_number = document.getElementById("level_number");
var level_listener = subscribe("/level/showLevel", function(curr_level) {
	console.log("New level: " + curr_level);
	level_number.innerHTML = curr_level;
	curr_level += 1;
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
	publish("/muzu", ["cheerful"]);
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
//// RESET BUTTON ////
//////////////////////

var reset_button = document.getElementById("toolbar_reset");
reset_button.addEventListener("click", function(event) {
	_showLevel(false);
	publish("/level/reset");
	publish("/alert", ["Level reset!", true]);
}, false);

/////////////////////
//// HOME BUTTON ////
/////////////////////

var home_button = document.getElementById("toolbar_home");
home_button.addEventListener("click", function(event) {
	_showLevel(false);
	Narrator.interrupt().goto("LEVEL_HOME");
}, false);

///////////////////
//// ALERT BAR ////
///////////////////

var alertDOM = document.getElementById("alert-ui");
var alertText = document.querySelector("#alert > span");
var alert_listener = subscribe("/alert", function(alert_string, force) {
	// If we don't force this alert, show each alert string once
	if (!force && (alertDOM.textContent.trim() === alert_string.trim())) {
		return;
	}
	alertText.textContent = alert_string;
	alertText.innerText = alert_string;
	alertDOM.style.display = "block";

	// Disappear after clicking
	var click_listener = subscribe("/mouse/click", function() {
		unsubscribe(click_listener);
		alertDOM.style.display = "none";
	});
});

})();