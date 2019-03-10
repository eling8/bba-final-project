//////////////////////////////////
/////// LOAD ASSETS & SUCH ///////
//////////////////////////////////

Preload({
  images: [
    // Neuron images
    { id: "neuron_body", src: "assets/sprites/body_dark.png" },
    { id: "neuron_body_red", src: "assets/sprites/body_red.png" },
    { id: "neuron_body_blue", src: "assets/sprites/body_blue.png" },
    { id: "neuron_hover", src: "assets/sprites/body_hover.png" },
    { id: "neuron_delete", src: "assets/sprites/body_delete.png" },
    { id: "neuron_highlight", src: "assets/sprites/body_highlight.png" },
    { id: "flash", src: "assets/sprites/hebb_flash.png" },

    // Icons
    { id: "icon_anxious", src: "assets/sprites/icon_anxious.png" },
    { id: "icon_calm", src: "assets/sprites/icon_calm.png" },
    { id: "icon_people", src: "assets/sprites/icon_people.png" },
    { id: "icon_failure", src: "assets/sprites/icon_failure.png" },
    { id: "icon_holes", src: "assets/sprites/icon_holes.png" },

    // Instructions
    { id: "hebb", src: "assets/images/hebb.png" },
    { id: "antihebb", src: "assets/images/antihebb.png" },
    { id: "hebb_words", src: "assets/images/hebb_words.png" },
    { id: "antihebb_words", src: "assets/images/antihebb_words.png" },

    // Muzu
    { id: "muzu", src: "assets/images/muzu.png" },

    // Misc Crap
    { id: "introBG", src: "assets/images/intro.png" },
    { id: "outroBG", src: "assets/images/outro.png" },
    { id: "credits", src: "assets/sprites/credits2.png" },
    { id: "thx", src: "assets/sprites/thx.png" }

    // Shade
    //  { id: "shade", src: "assets/sprites/shade.png" }
  ],
  sounds: [
    // Voices
    { id: "0_intro", src: "assets/voices/0_intro.mp3" },
    { id: "1_hebb", src: "assets/voices/1_hebb.mp3" },
    { id: "2_antihebb", src: "assets/voices/2_antihebb.mp3" },
    { id: "3_therapy", src: "assets/voices/3_therapy.mp3" },
    { id: "4_credits", src: "assets/voices/4_credits.mp3" },
    { id: "5_extra", src: "assets/voices/5_extra.mp3" },

    // Sounds & Shtuff
    { id: "sfx_spark", src: "assets/sounds/spark.mp3" },
    { id: "sfx_loop", src: "assets/sounds/Headspace.mp3" }
  ]
});

////////////////
// INITIALIZE //
////////////////

subscribe("/init", function() {
  // Remove Preloader Message
  canvas.setAttribute("loading", "no");

  // Initialize Shtuff
  Interactive.init();
  Narrator.goto("LEVEL_1");
});
