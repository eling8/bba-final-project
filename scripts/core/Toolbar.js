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
delete_button.addEventListener("click", function(event) {
    Interactive.delete_on = !Interactive.delete_on;
    delete_button.setAttribute("deleting", Interactive.delete_on ? "true" : "false");
}, false);

////////////////////////////
//// SAVE CONFIGURATION ////
////////////////////////////

var save_button = document.getElementById("toolbar_save");
save_button.onclick = function(){
	console.log(Neuron.serialize(Interactive.scene, true));
};

})();