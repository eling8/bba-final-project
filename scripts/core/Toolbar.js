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
	console.log("New level: Level " + curr_level.toString());
	level_number.innerHTML = "Level " + curr_level.toString();
	curr_level += 1;
});

//////////////////////
//// RESET BUTTON ////
//////////////////////

var reset_button = document.getElementById("toolbar_reset");
reset_button.addEventListener("click", function(event) {
	publish("/level/reset");
	publish("/alert", ["Level reset!", true]);
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