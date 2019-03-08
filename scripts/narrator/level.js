Narrator.addStates({
	INTRO: {
		start: function(state) {
			// Narrator.scene("Intro").talk("intro0","intro1","intro2")
			// 		.scene("Propagation")
			// 		.music("sfx_loop",{volume:0.05,loop:-1})
			// 		.talk("intro3")
			// 		.goto("PROP_INTERRUPTABLE");
		}
	},

	LEVEL_1: {
		start :function(state) {
			Narrator.scene("Level1");
			state._listener = subscribe("/level/nextLevel", function() {
				unsubscribe(state._listener);
				console.log("Level 1 passed!");
				Narrator.goto("LEVEL_2");
			});
			state._resetListener = subscribe("/level/reset", function() {
				Narrator.scene("Level1");
			});
		},
		kill: function(state) {
			unsubscribe(state._listener);
			unsubscribe(state._resetListener);
		}
	},

	LEVEL_2: {
		start: function(state) {
			Narrator.scene("Level2");
			state._listener = subscribe("/level/nextLevel", function() {
				unsubscribe(state._listener);
				console.log("Level 2 passed!");
			});
			state._resetListener = subscribe("/level/reset", function() {
				Narrator.scene("Level2");
			});
		},
		kill: function(state) {
			unsubscribe(state._listener);
			unsubscribe(Neuron.add_excitatory_listener);
			unsubscribe(Neuron.add_inhibitory_listener);
		}
	},
});