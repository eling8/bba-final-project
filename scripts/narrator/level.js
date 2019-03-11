Narrator.addNarration({
  file: "3_therapy",
  markers: {
    intro0: ["0:00.0", "0:03.0"], // Hi there! My name is Muzu. And this is my brain!
    intro1: ["0:03.0", "0:07.0"], //In my brain and your brain, there are millions of these things called neurons!
    intro2: ["0:07.0", "0:11.0"], //Neurons are very social. They like to connect with each other.
    intro3: ["0:11.0", "0:16.0"], //and these connections are called synapses.
    intro4: ["0:16.0", "0:22.0"], //As new synapses form in our brains, that’s when we can learn new things!
    intro5: ["0:22.0", "0:25.0"], //Let’s venture into the math portion of my brain.

    l2p1: ["0:00.0", "0:03.0"], // Oh no! It looks like these neurons are too far apart!
    l2p2: ["0:00.0", "0:04.0"], // We have to make a path between these two neurons so that I can learn math.
    l2p3: ["0:00.0", "0:03.0"], // Hmm... what should we do?
    l2p4: ["0:00.0", "0:03.0"], // Maybe we can add some new neurons!
    l2p5: ["0:00.0", "0:05.0"], // Try clicking and dragging a blue neuron from the toolbar on top into my brain.
		// wait until user clicks and drags excitatory neuron
		l2p6: ["0:00.0", "0:03.0"], // Way to go! You just added a new neuron!
		l2p7: ["0:00.0", "0:04.0"], // Now, remember how we learned to create new neural connections last time?
		l2p8: ["0:00.0", "0:04.0"], // Go ahead and connect this new neuron to the starting neuron on the left!
		l2p9: ["0:00.0", "0:03.0"], // I'll be here doing some math problems.
		// wait until user adds a connection
		l2p10: ["0:00.0", "0:03.0"], // Wow! My brain just created a new connection while I was learning! 
		l2p11: ["0:00.0", "0:05.0"], // Now, can you help me create a path all the way from start to finish?
		l2end: ["0:00.0", "0:05.0"], // Whoa! I learned something new! Thanks for helping me make my brain stronger.
  }
});

Narrator.addStates({
  LEVEL_INTRO: {
    start: function(state) {
      Narrator.scene("LevelIntro")
        .talk("intro0")
        .scene("Neurons")
        .talk("intro1")
        .scene("Synapses")
        .talk("intro2", "intro3", "intro4", "intro5")
        .goto("LEVEL_1");
    }
  },

  LEVEL_1: {
    start: function(state) {
      Narrator.scene("Level1").talk("intro0", "intro1");
      state._listener = subscribe("/level/nextLevel", function() {
        unsubscribe(state._listener);
        console.log("Level 1 passed!");
        Narrator.goto("LEVEL_2");
      });
      state._resetListener = subscribe("/level/reset", function() {
        unsubscribe(state._resetListener);
      	Narrator.interrupt();
        Narrator.goto("LEVEL_2");
      });
    },
    kill: function(state) {
      unsubscribe(state._listener);
      unsubscribe(state._resetListener);
    }
  },

  LEVEL_2: {
    start: function(state) {
      Narrator.interrupt().scene("Level2").talk("l2p1", "l2p2", "l2p3", "l2p4", "l2p5");
      state.found_connection = false;
      state.ready_for_connection = false;

      state._addOneNeuronListener = subscribe("/toolbar/excitatory", function () {
      	unsubscribe(state._addOneNeuronListener);
      	// Wait until mouse is released!
      	var mouseup_listener = subscribe("/mouse/up", function() {
      		unsubscribe(mouseup_listener);
      		Narrator.interrupt().talk("l2p6", "l2p7", "l2p8", "l2p9");
        });
      });

      state._winListener = subscribe("/level/winLevel", function() {
      	unsubscribe(state._winListener);
      	// When we win the level!
      	Narrator.interrupt().talk("l2end");
      });
      state._listener = subscribe("/level/nextLevel", function() {
        unsubscribe(state._listener);
        console.log("Level 2 passed!");
        Narrator.interrupt().goto("LEVEL_5");
      });
      state._resetListener = subscribe("/level/reset", function() {
      	unsubscribe(state._resetListener);
      	Narrator.interrupt();
        Narrator.goto("LEVEL_2");
      });
    },
    during: function(state) {
			var connections = Interactive.scene.connections;

			// Make sure that the state resets before we look for new connections
			if (connections.length == 0) {
				state.ready_for_connection = true;
			}

			// A new connection was made!
			if(state.ready_for_connection && !state.found_connection && connections.length > 0) {
				state.found_connection = true;
				Narrator.interrupt().talk("l2p10", "l2p11");
			}
		},
    kill: function(state) {
    	unsubscribe(state._winListener);
      unsubscribe(state._listener);
      unsubscribe(state._resetListener);
    }
  },

  LEVEL_5: {
    start: function(state) {
      Narrator.scene("Level5");
      state._listener = subscribe("/level/nextLevel", function() {
        unsubscribe(state._listener);
        console.log("Level 5 passed!");
        Narrator.goto("LEVEL_END");
      });
      state._resetListener = subscribe("/level/reset", function() {
        Narrator.scene("Level5");
      });
    },
    kill: function(state) {
      unsubscribe(state._listener);
      unsubscribe(state._resetListener);
    }
  },

  LEVEL_END: {
    start: function(state) {
      Narrator.scene("LevelEnd");
      state._resetListener = subscribe("/level/reset", function() {
        Narrator.scene("LevelEnd");
      });
    },
    kill: function(state) {
      unsubscribe(state._resetListener);
      unsubscribe(Neuron.add_excitatory_listener);
      unsubscribe(Neuron.add_inhibitory_listener);
    }
  }
});
