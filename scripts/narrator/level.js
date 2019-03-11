Narrator.addNarration({
  file: "3_therapy",
  markers: {
    intro0: ["0:00.0", "0:03.0"], // Hi there! My name is Muzu. And this is my brain!
    intro1: ["0:03.0", "0:07.0"], //In my brain and your brain, there are millions of these things called neurons!
    intro2: ["0:07.0", "0:11.0"], //Neurons are very social. They like to connect with each other.
    intro3: ["0:11.0", "0:16.0"], //and these connections are called synapses.
    intro4: ["0:16.0", "0:22.0"], //As new synapses form in our brains, that’s when we can learn new things!
    intro5: ["0:22.0", "0:25.0"] //Let’s venture into the math portion of my brain.
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
        Narrator.goto("LEVEL_END");
      });
      state._resetListener = subscribe("/level/reset", function() {
        Narrator.scene("Level2");
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
