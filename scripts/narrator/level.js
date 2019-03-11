Narrator.addNarration({
  file: "silence",
  markers: {
    intro0: ["0:00.0", "0:03.0"], // Hi there! My name is Muzu. And this is my brain!
    intro1: ["0:03.0", "0:07.0"], //In my brain and your brain, there are millions of these things called neurons!
    intro2: ["0:07.0", "0:11.0"], //Neurons are very social. They like to connect with each other.
    intro3: ["0:11.0", "0:13.0"], //and these connections are called synapses.
    intro4: ["0:16.0", "0:20.0"], //Neurons are very social. They like to send signals to each other.
    intro5: ["0:22.0", "0:26.0"], //Go ahead and click on a neuron to fire it.
    intro6: ["0:22.0", "0:25.0"], //Watch as it sends signals to other neurons through its synapses!
    intro7: ["0:16.0", "0:20.0"], //As new synapses form in our brains, that’s when we can learn new things!
    intro8: ["0:22.0", "0:26.0"], //But the neurons only fire, and the synapses can only grow
    intro9: ["0:22.0", "0:25.0"], //when I’m working hard learning something.
    intro10: ["0:25.0", "0:28.0"], //Like this!
    intro11: ["0:25.0", "0:28.0"], // For example, let’s venture into the math portion of my brain.

    level1_0: ["0:00.0", "0:04.0"], //Right now, there are no connections because I haven’t practiced math in a long time.
    level1_1: ["0:00.0", "0:04.0"], //But as I start practicing, new connections can start forming in my brain!
    level1_2: ["0:00.0", "0:03.0"], //Can you help me rewire my brain? Try it out!
    level1_3: ["0:00.0", "0:05.0"], //To make a connection, click on a neuron, then click on the neuron you want it to form a synapse with.
    level1_4: ["0:00.0", "0:03.0"], //"Wow! While I was working, my brain was making new connections!"
    level1_5: ["0:00.0", "0:03.0"], //I just learned how to do my first math problem!
    // level1_6: ["0:00.0", "0:03.0"], //Thanks for helping me rewire my brain!
    level1_7: ["0:00.0", "0:06.0"], //Go ahead and click on the next level

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
    l2p12: ["0:00.0", "0:05.0"], // Whoa! While I was working on math, my brain was making new connections!.
    l2end: ["0:00.0", "0:05.0"], // Thanks for helping me make my brain stronger.

    l3p1: ["0:00.0", "0:03.0"], // Have you ever wondered why you forget how to do things...
    l3p2: ["0:00.0", "0:04.0"], // if you don’t practice them for a while?
    //neurons appear
    l3p3: ["0:00.0", "0:03.0"], // Well, it all has to do with these neurons in your brain!
    l3p4: ["0:00.0", "0:03.0"], // If two neuron’s don’t send signals to each other for a long time...
    //synapses disappear
    l3p5: ["0:00.0", "0:05.0"], // Their synapse disappears!
    l3p6: ["0:00.0", "0:03.0"], // This is called the “use it or lose it” principle
    l3p7: ["0:00.0", "0:04.0"], // And that’s why it’s so important to keep practicing something!
    l3p8: ["0:00.0", "0:04.0"], // So that you can keep those synapses strong!
    l3p9: ["0:00.0", "0:03.0"], // When I’m not practicing math, the synapses in the math portion of my brain...
    l3p10: ["0:00.0", "0:03.0"], // will weaken a little (by getting thinner)...
    l3p11: ["0:00.0", "0:05.0"], // Every time the bar at the top reaches the end.
    //muzu practicing, and neurons fire
    l3p12: ["0:00.0", "0:05.0"], // But if I keep practicing, my neurons will fire,
    l3p13: ["0:00.0", "0:05.0"], //And my synapses will grow and stay strong!
    //level 3 set up
    l3p14: ["0:00.0", "0:03.0"], //"Let's give it a try as I do some math!",
    l3p15: ["0:00.0", "0:03.0"], //"While I'm working, I'll get discouraged sometimes and stop",
    l3p16: ["0:00.0", "0:03.0"],
    //"When that happens, my neurons won't fire, and I'll start forgetting!",
    l3p17: ["0:00.0", "0:03.0"], //"You'll have encourage me to start working again.",
    l3p18: ["0:00.0", "0:03.0"] //"So that I can continue learning!"
  }
});

Narrator.addStates({
  LEVEL_HOME: {
    start: function(state) {
      // hide all toolbar buttons
      publish("/toolbar/show", [false, false, false, false]);
      Narrator.scene("LevelHome");

      state._resetListener = subscribe("/level/reset", function() {
        unsubscribe(state._resetListener);
        Narrator.goto("LEVEL_HOME");
      });
    },
    kill: function(state) {
      unsubscribe(state._resetListener);
    }
  },

  LEVEL_INTRO: {
    start: function(state) {
      // hide all toolbar buttons
      publish("/toolbar/show", [false, false, false, false]);
      Narrator.scene("LevelIntro")
        .talk("intro0")
        .scene("Neurons")
        .talk("intro1")
        .scene("Synapses")
        .talk("intro2", "intro3", "intro4", "intro5");

      state._resetListener = subscribe("/level/reset", function() {
        unsubscribe(state._resetListener);
        Narrator.interrupt().goto("LEVEL_INTRO");
      });
      //wait for them to click on a neuron then: intro7, intro8, intro9, intro10
      state._clickListener = subscribe("/neuron/click", function() {
        unsubscribe(state._clickListener);
        Narrator.interrupt()
          .talk("intro6", "intro7", "intro8", "intro9", "intro10", "intro11")
          .goto("LEVEL_1");
      });
    },
    kill: function(state) {
      unsubscribe(state._clickListener);
      unsubscribe(state._resetListener);
    }
  },

  LEVEL_1: {
    start: function(state) {
      // hide all toolbar buttons
      publish("/toolbar/show", [false, false, false, false]);
      Narrator.scene("Level1")
        .talk("level1_0", "level1_1", "level1_2")
        .message("/scene/addHebb")
        .talk("level1_3");
      state._winListener = subscribe("/level/winLevel", function() {
        unsubscribe(state._winListener);
        // When we win the level!
        Narrator.interrupt().talk(
          "level1_4",
          "level1_5",
          // "level1_6",
          "level1_7"
        );
      });
      state._listener = subscribe("/level/nextLevel", function() {
        unsubscribe(state._listener);
        console.log("Level 1 passed!");
        Narrator.interrupt().goto("LEVEL_2");
      });
      state._resetListener = subscribe("/level/reset", function() {
        unsubscribe(state._resetListener);
        Narrator.interrupt().goto("LEVEL_1");
      });
    },
    kill: function(state) {
      unsubscribe(state._winListener);
      unsubscribe(state._listener);
      unsubscribe(state._resetListener);
    }
  },

  LEVEL_2: {
    start: function(state) {
      // hide all except excitatory
      publish("/toolbar/show", [true, false, false, false]);
      state._loadListener = subscribe("/level/loaded", function() {
        unsubscribe(state._loadListener);
        Narrator.goto("LEVEL_2_LOADED");
      });

      Narrator.interrupt().scene("Level2");
    },
    kill: function(state) {
      unsubscribe(state._loadListener);
    }
  },

  LEVEL_2_LOADED: {
    start: function(state) {
      Narrator.talk("l2p1", "l2p2", "l2p3", "l2p4", "l2p5");
      state.found_connection = false;

      state._addOneNeuronListener = subscribe(
        "/toolbar/excitatory",
        function() {
          unsubscribe(state._addOneNeuronListener);
          // Wait until mouse is released!
          var mouseup_listener = subscribe("/mouse/up", function() {
            unsubscribe(mouseup_listener);
            Narrator.interrupt().talk("l2p6", "l2p7", "l2p8", "l2p9");
          });
        }
      );

      state._winListener = subscribe("/level/winLevel", function() {
        unsubscribe(state._winListener);
        // When we win the level!
        Narrator.interrupt().talk("l2p12", "l2end");
      });
      state._listener = subscribe("/level/nextLevel", function() {
        unsubscribe(state._listener);
        console.log("Level 2 passed!");
        Narrator.interrupt().goto("LEVEL_3");
      });
      state._resetListener = subscribe("/level/reset", function() {
        unsubscribe(state._resetListener);
        Narrator.interrupt().goto("LEVEL_2");
      });
    },
    during: function(state) {
      var connections = Interactive.scene.connections;

      // A new connection was made!
      if (!state.found_connection && connections.length > 0) {
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

  LEVEL_3: {
    start: function(state) {
      // show all buttons
      publish("/toolbar/show", [true, false, true, true]);
      Narrator.scene("Level3");
      state._listener = subscribe("/level/nextLevel", function() {
        unsubscribe(state._listener);
        console.log("Level 3 passed!");
        Narrator.goto("LEVEL_5");
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

  LEVEL_5: {
    start: function(state) {
      // show all buttons
      publish("/toolbar/show", [true, true, true, true]);
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
      // show all buttons
      publish("/toolbar/show", [true, true, true, true]);
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
