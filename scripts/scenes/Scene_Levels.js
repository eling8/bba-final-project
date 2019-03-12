function Scene_LevelHome() {
  var self = this;
  LevelScene.call(self);

  publish("/level/showLevel", ["REWIRE"]);

  NEURONS_SERIALIZED =
    '{"neurons":[[180,274,3,4],[284,128,3,4],[202,184,2,4],[449,246,2,4],[366,169,3,4],[435,332,3,4],[314,439,2,4],[398,417,3,4],[235,431,3,4],[280,268,2,4],[295,361,3,4]],"connections":[[0,10,5,1],[0,9,5,1],[10,9,5,1],[9,4,5,1],[0,2,5,1],[0,1,5,1],[9,1,5,1],[4,3,3,1],[10,3,5,1],[5,7,3,1],[0,8,5,1],[6,7,5,1],[8,6,5,1],[10,7,5,1],[4,5,2,1]]}';
  Neuron.unserialize(self, NEURONS_SERIALIZED, true);

  self.levels = [
    "Introduction",
    "Level 1",
    "Level 2",
    "Level 3",
    "Level 4",
    "Level 5",
    "Level 6",
    "Create your own"
  ];
  self.curr_level_hover = -1;

  // Get bounding boxes of each level box
  self.getLevelBounds = function() {
    var bounds = {};

    ctx.font = "18px Raleway";
    var halfway = Math.floor(self.levels.length / 2) + 1;
    for (var i = 0; i < halfway; i++) {
      var text_width = ctx.measureText(self.levels[i]).width;
      bounds[self.levels[i]] = [
        530 - 10,
        250 + 40 * i - 25,
        text_width + 20,
        35
      ];
    }
    for (var i = halfway; i < self.levels.length; i++) {
      var text_width = ctx.measureText(self.levels[i]).width;
      bounds[self.levels[i]] = [
        670 - 10,
        250 + 40 * (i - halfway) - 25,
        text_width + 20,
        35
      ];
    }

    return bounds;
  };
  self.level_bounds = self.getLevelBounds();

  // Is mouse hovering over a level box? If so, return level number
  self.isMouseOver = function() {
    for (var i = 0; i < self.levels.length; i++) {
      var bounds = self.level_bounds[self.levels[i]];
      if (
        Mouse.x >= bounds[0] &&
        Mouse.x <= bounds[0] + bounds[2] &&
        Mouse.y >= bounds[1] &&
        Mouse.y <= bounds[1] + bounds[3]
      ) {
        return i;
      }
    }
    return -1;
  };

  var _prevUpdate = self.update;
  self.update = function() {
    _prevUpdate.call(self);

    self.curr_level_hover = self.isMouseOver();
    if (self.curr_level_hover >= 0) {
      canvas.style.cursor = "pointer";
    }
  };

  // If we click on a level, go to that level!
  self.clickListener = subscribe("/mouse/click", function() {
    if (self.curr_level_hover >= 0) {
      unsubscribe(self.clickListener);
      switch (self.curr_level_hover) {
        case 0:
          Narrator.goto("LEVEL_INTRO");
          break;
        case 7:
          Narrator.goto("LEVEL_END");
          break;
        default:
          Narrator.goto("LEVEL_" + self.curr_level_hover.toString());
      }
    }
  });

  var _prevRender = self.render;
  self.render = function(ctx) {
    // Save
    ctx.save();
    _prevRender.call(self, ctx); // Camera

    // Show level
    ctx.font = "50px Raleway";
    ctx.fillText("REWIRE", 430, 140);
    ctx.font = "20px Raleway";
    ctx.fillText("A game about neuroplasticity", 430, 170);

    ctx.font = "18px Raleway";
    for (var i = 0; i < self.levels.length; i++) {
      var bounds = self.level_bounds[self.levels[i]];
      if (self.curr_level_hover == i) {
        ctx.save();
        ctx.fillStyle = "#78BCBC";
        ctx.globalAlpha = 0.5;
        ctx.fillRect(bounds[0], bounds[1], bounds[2], bounds[3]);
        ctx.restore();
      }

      ctx.fillText(self.levels[i], bounds[0] + 10, bounds[1] + 25);
      ctx.strokeRect(bounds[0], bounds[1], bounds[2], bounds[3]);
    }

    // Restore
    ctx.restore();
  };
}

function Scene_LevelIntro() {
  var self = this;
  LevelScene.call(self);

  publish("/level/showLevel", ["Introduction"]);
}

function Scene_Neurons() {
  var self = this;
  LevelScene.call(self);

  publish("/level/showLevel", ["Introduction"]);
  NEURONS_SERIALIZED =
    '{"neurons":[[482,191,3,1],[337,174,3,1],[633,168,3,1],[589,293,3,1],[688,380,3,1],[400,306,3,1],[270,300,3,1],[717,255,3,1],[517,379,3,1],[333,396,3,1]],"connections":[]}';
  Neuron.unserialize(self, NEURONS_SERIALIZED, true);
}

function Scene_Synapses() {
  var self = this;
  LevelScene.call(self);

  publish("/level/showLevel", ["Introduction"]);
  NEURONS_SERIALIZED =
    '{"neurons":[[482,191,3,1],[337,174,3,1],[633,168,3,1],[589,293,3,1],[688,380,3,1],[400,306,3,1],[270,300,3,1],[717,255,3,1],[517,379,3,1],[333,396,3,1]],"connections":[[1,0,1,1],[2,0,1,1],[1,5,1,1],[5,6,1,1],[6,9,1,1],[9,8,1,1],[1,6,1,1],[0,8,1,1],[8,5,1,1],[5,0,1,1],[0,3,1,1],[2,3,1,1],[4,3,1,1],[8,3,1,1],[3,7,1,1],[4,7,1,1],[7,2,1,1],[8,4,1,1]]}';
  Neuron.unserialize(self, NEURONS_SERIALIZED, true);
}

function Scene_Level1() {
  var self = this;
  LevelScene.call(self);

  publish("/level/showLevel", ["Level 1"]);

  NEURONS_SERIALIZED =
    '{"neurons":[[350,261,3,2],[470,261,3,4],[600,262,3,3]],"connections":[]}';
  Neuron.unserialize(self, NEURONS_SERIALIZED, true);

  var _listener2 = subscribe("/scene/addHebb", function() {
    unsubscribe(_listener2);
    //self.sprites.push(new HebbWords("hebb"));
    self.sprites.push(new HebbComic("hebb"));
  });

  function HebbComic(type) {
    var self = this;
    Sprite.call(self, {
      pivotX: 0,
      pivotY: 0,
      spritesheet: type == "hebb" ? images.hebb : images.antihebb,
      frameWidth: 260,
      frameHeight: 400,
      frameTotal: 1
    });

    // Start Off
    self.y = 50;
    if (type == "hebb") {
      self.x = 960;
      self.gotoX = 700;
    }

    // UPDATE
    var _prevUpdate = self.update;
    self.update = function() {
      self.x = self.x * 0.7 + self.gotoX * 0.3;
      _prevUpdate.call(self);
    };
  }
}

function Scene_Level2() {
  var self = this;
  LevelScene.call(self);

  publish("/level/showLevel", ["Level 2"]);

  NEURONS_SERIALIZED =
    '{"neurons":[[180,248,3,2],[820,260,3,3]],"connections":[]}';
  Neuron.unserialize(self, NEURONS_SERIALIZED, true);

  publish("/level/loaded");
}

function Scene_Level3Intro() {
  var self = this;
  LevelScene.call(self);

  publish("/level/showLevel", ["Level 3"]);
}

function Scene_preLevel3() {
  var self = this;
  LevelScene.call(self);

  publish("/level/showLevel", ["Level 3"]);
  NEURONS_SERIALIZED =
    '{"neurons":[[482,191,3,1],[337,174,3,2],[633,168,3,1],[589,293,3,1],[688,380,3,1],[400,306,3,1],[270,300,3,1],[717,255,3,2],[517,379,3,1],[333,396,3,1]],"connections":[[1,0,2,1],[2,0,2,1],[1,5,2,1],[5,6,2,1],[6,9,2,1],[9,8,2,1],[1,6,2,1],[0,8,2,1],[8,5,2,1],[5,0,2,1],[0,3,2,1],[2,3,2,1],[4,3,2,1],[8,3,2,1],[3,7,2,1],[4,7,2,1],[7,2,2,1],[8,4,2,1]]}';
  Neuron.unserialize(self, NEURONS_SERIALIZED, true);
}

function Scene_Level3() {
  var self = this;
  LevelScene.call(self);

  publish("/level/showLevel", ["Level 3"]);

  NEURONS_SERIALIZED =
    '{"neurons":[[266,301,3,2],[753,291,3,3],[460,139,3,4],[470,269,3,4],[474,391,3,4],[609,193,3,4],[614,319,3,4]],"connections":[]}';
  Neuron.unserialize(self, NEURONS_SERIALIZED, true);

  publish("/level/loaded");
}

function Scene_preLevel4() {
  var self = this;
  LevelScene.call(self);

  publish("/level/showLevel", ["Level 4"]);

  NEURONS_SERIALIZED =
    '{"neurons":[[248,282,3,2],[345,292,3,4],[450,281,3,3],[585,281,3,2],[689,282,2,4],[791,287,3,3]],"connections":[[0,1,2,1],[1,2,2,1],[3,4,2,1],[4,5,2,1]]}';
  Neuron.unserialize(self, NEURONS_SERIALIZED, true);

  publish("/level/loaded");
}

function Scene_Level4() {
  var self = this;
  LevelScene.call(self);

  publish("/level/showLevel", ["Level 4"]);

  NEURONS_SERIALIZED =
    '{"neurons":[[277,289,3,2],[748,289,3,3],[635,372,2,4],[628,224,3,4]],"connections":[[2,1,2,2],[3,1,2,2]]}';
  Neuron.unserialize(self, NEURONS_SERIALIZED, true);

  publish("/level/loaded");
}

function Scene_Level5() {
  var self = this;
  LevelScene.call(self);

  publish("/level/showLevel", ["Level 5"]);

  NEURONS_SERIALIZED =
    '{"neurons":[[150,295,3,2],[759,274,3,3],[575,350,2,4],[266,187,2,4],[583,232,3,4],[269,425,2,4],[377,447,3,4]],"connections":[[0,3,2,2],[2,1,2,2],[4,1,2,2],[5,6,2,2]]}';
  Neuron.unserialize(self, NEURONS_SERIALIZED, true);
}

function Scene_Level6() {
  var self = this;
  LevelScene.call(self);

  publish("/level/showLevel", ["Level 6"]);

  NEURONS_SERIALIZED = `{"neurons":[
			[244,292,3,2],
			[653,154,3,3],
			[656,287,3,3],
			[654,419,3,3],
			[376,155,3,1],
			[374,415,3,1],
			[509,221,2,1],
			[512,353,2,1],
			[372,280,3,1]],
			"connections":[[0,4,5,1],
			[0,5,5,1],
			[0,8,5,1],
			[8,7,5,1],
			[8,6,5,1],
			[4,1,5,1],
			[5,3,5,1],
			[6,1,5,1],
			[7,3,5,1],
			[8,2,5,1]]}`;

  Neuron.unserialize(self, NEURONS_SERIALIZED, true);
}

function Scene_LevelEnd() {
  var self = this;
  LevelScene.call(self);

  publish("/level/showLevel", ["Level ???"]);
  publish("/alert", [
    "That's it for now! Feel free to create your own levels here."
  ]);

  NEURONS_SERIALIZED = '{"neurons":[],"connections":[]}';
  Neuron.unserialize(self, NEURONS_SERIALIZED, true);
}

function LevelScene() {
  var self = this;
  BrainScene.call(self);

  // Camera
  self.setCamera(480, 270, 1);

  // Scene Transitions
  self.transitionIn = function() {
    self.cameraEased.zoom = 0.2;
  };
  self.transitionOut = function() {
    NEURONS_SERIALIZED = Neuron.serialize(self, true);
    self.camera.x = 1600;
    return function() {
      return self.cameraEased.x > 1600;
    }; // done when this is
  };
}
