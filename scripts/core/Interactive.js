/***

A very very very very bare bones Scene Manager

***/
window.Interactive = new function() {
  var self = this;

  // Scene
  self.scene = null;
  self.transitionCallback = null;
  self.transitionToScene = null;

  // For deleting neurons & connections
  self.delete_on = false;
  self.forget_on = true; // whether we should forget connections, toggle with publish("/toolbar/show")

  // Animation
  self.smoosh = 1;
  self.smooshVelocity = 0;
  self.smooshSpring = 0.4;
  self.smooshDampening = 0.64;
  self.wobble = 0.8 * Math.PI * 2;
  self.wobbleRadius = 0.3;
  self.wobbleVelocity = 0.95 * 2 - 1;
  self.wobble_x = 0;
  self.wobble_y = 0;
  self.scale = 1;

  // Init, Goto, Update, Render
  self.init = function() {
    subscribe("/update", self.update);
    subscribe("/render", self.render);
  };
  self.goto = function(SceneClass) {
    if (self.scene && self.scene.kill) self.scene.kill(); // kill last scene.
    self.scene = new SceneClass();
    if (self.scene.transitionIn) self.scene.transitionIn();
  };
  self.update = function() {
    canvas.style.cursor = "default";

    // Muzu's animation
    self.smoosh += self.smooshVelocity;
    self.smooshVelocity += (1 - self.smoosh) * self.smooshSpring;
    self.smooshVelocity *= self.smooshDampening;
    if (self.smoosh > 1.5) self.smoosh = 1.5;

    // Muzu's Wobbly Position
    self.wobble += self.wobbleVelocity * 0.05;
    var scale = self.scale * self.smoosh;
    self.wobble_x = Math.cos(self.wobble) * self.wobbleRadius * scale * 20;
    self.wobble_y = Math.sin(self.wobble) * self.wobbleRadius * scale * 20;

    // Is Paused? Do nothing.
    if (!self.PLAYING) {
      self.pause();
      return;
    }

    // No scene? Stahp.
    if (self.scene) self.scene.update();

    // Narrator update
    Narrator.update();

    // If Scene Transition is done, go to that.
    if (self.transitionCallback && self.transitionCallback()) {
      self.goto(self.transitionToScene);
      self.transitionCallback = null;
      self.transitionToScene = null;
    }
  };
  self.render = function() {
    // Is Paused? Do nothing.
    if (!self.PLAYING) return;

    // Then actually draw it.
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Muzu on screen
    ctx.save();
    ctx.scale(1.15, 1.05);
    ctx.drawImage(images.muzu_brain, 100, ctx.canvas.clientHeight - 500, 700, 550);
    ctx.restore();

    // draw Muzu!
    ctx.save();
    ctx.translate(self.wobble_x, self.wobble_y);
    ctx.drawImage(images.muzu, 30, ctx.canvas.clientHeight - 250, 160, 160);
    ctx.drawImage(images.muzu_brain_small, 70, ctx.canvas.clientHeight - 225, 70, 45);
    ctx.restore();

    // Draw scene if exists
    if (self.scene) self.scene.render(ctx);
  };

  // Scene Transitions
  self.transitionTo = function(SceneClass) {
    if (self.scene && self.scene.transitionOut) {
      self.transitionCallback = self.scene.transitionOut();
      self.transitionToScene = SceneClass;
    } else {
      self.goto(SceneClass);
    }
  };

  // Pause & Play
  self.PLAYING = true;
  self.pause = function() {
    self.PLAYING = false;
    Narrator.pause();
  };
  self.play = function() {
    self.PLAYING = true;
    Narrator.play();
  };
}();
