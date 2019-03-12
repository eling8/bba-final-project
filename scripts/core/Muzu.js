window.Muzu = new function() {
  var self = this;

  self.valid_states = new Set(["angry", "brain", "cheerful", "confused", "math", "sad"]);
  self.curr_state = "brain";

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

  // Return image for current state
  self.get_image = function() {
    switch(self.curr_state) {
      case "angry": 
        return images.muzu_angry;
        break;
      case "brain":
        return images.muzu_brain;
        break;
      case "cheerful": 
        return images.muzu_cheerful;
        break;
      case "confused": 
        return images.muzu_confused;
        break;
      case "math": 
        return images.muzu_math;
        break;
      case "sad": 
        return images.muzu_sad;
        break;
      default:
        return undefined;
    }
  };

  // Update Muzu's state
  self.stateListener = subscribe("/muzu", function(new_state) {
    console.log(new_state);
    if (self.valid_states.has(new_state)) {
      console.log("Muzu update: " + new_state);
      self.curr_state = new_state;
    }
  });

  self.update = function() {
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
  };

  self.render = function(ctx) {
    // Draw brain outline
    ctx.save();
    ctx.scale(1.15, 1.05);
    ctx.drawImage(images.brain_outline, 100, ctx.canvas.clientHeight - 500, 700, 550);
    ctx.restore();

    // draw Muzu!
    ctx.save();
    ctx.translate(self.wobble_x, self.wobble_y);
    if (self.curr_state == "math") {
      var x_adjust = 138 * 260 / 1200;
      var y_adjust = 208 * 260 / 1200;
      ctx.drawImage(self.get_image(), -25 + x_adjust, ctx.canvas.clientHeight - 280 - y_adjust, 260, 260);
    } else {
      ctx.drawImage(self.get_image(), -25, ctx.canvas.clientHeight - 280, 260, 260);
    }
    ctx.drawImage(images.muzu_brain, -25, ctx.canvas.clientHeight - 280, 260, 260);
    ctx.restore();
  };

}();
