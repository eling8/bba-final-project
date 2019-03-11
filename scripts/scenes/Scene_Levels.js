function Scene_LevelIntro() {
  var self = this;
  LevelScene.call(self);

  publish("/level/showLevel", [1]);
}

function Scene_Neurons() {
  var self = this;
  LevelScene.call(self);

  publish("/level/showLevel", [1]);
  NEURONS_SERIALIZED =
    '{"neurons":[[482,191,3,1],[337,174,3,1],[633,168,3,1],[589,293,3,1],[688,380,3,1],[400,306,3,1],[270,300,3,1],[717,255,3,1],[517,379,3,1],[333,396,3,1]],"connections":[]}';
  Neuron.unserialize(self, NEURONS_SERIALIZED, true);
}

function Scene_Synapses() {
  var self = this;
  LevelScene.call(self);

  publish("/level/showLevel", [1]);
  NEURONS_SERIALIZED =
    '{"neurons":[[482,191,3,1],[337,174,3,1],[633,168,3,1],[589,293,3,1],[688,380,3,1],[400,306,3,1],[270,300,3,1],[717,255,3,1],[517,379,3,1],[333,396,3,1]],"connections":[[1,0,2,1],[2,0,2,1],[1,5,2,1],[5,6,2,1],[6,9,2,1],[9,8,2,1],[1,6,2,1],[0,8,2,1],[8,5,2,1],[5,0,2,1],[0,3,2,1],[2,3,2,1],[4,3,2,1],[8,3,2,1],[3,7,2,1],[4,7,2,1],[7,2,2,1],[8,4,2,1]]}';
  Neuron.unserialize(self, NEURONS_SERIALIZED, true);
}

function Scene_Level1() {
  var self = this;
  LevelScene.call(self);

  publish("/level/showLevel", [1]);

  NEURONS_SERIALIZED =
    '{"neurons":[[350,261,3,2],[500,262,3,3]],"connections":[]}';
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

  publish("/level/showLevel", [2]);

  NEURONS_SERIALIZED =
    '{"neurons":[[119,248,3,2],[829,249,3,3]],"connections":[]}';
  Neuron.unserialize(self, NEURONS_SERIALIZED, true);
}

function Scene_Level5() {
  var self = this;
  LevelScene.call(self);

  publish("/level/showLevel", [5]);

  NEURONS_SERIALIZED =
    '{"neurons":[[150,295,3,2],[759,274,3,3],[575,350,2,4],[266,187,2,4],[583,232,3,4],[269,425,2,4],[377,447,3,4]],"connections":[[0,3,2,2],[2,1,2,2],[4,1,2,2],[5,6,2,2]]}';
  Neuron.unserialize(self, NEURONS_SERIALIZED, true);
}

function Scene_LevelEnd() {
  var self = this;
  LevelScene.call(self);

  publish("/level/showLevel", [0]);
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
