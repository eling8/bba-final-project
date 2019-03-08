var NeuronType = {
  REGULAR: 1,
  INHIBITORY: 2,
  EXCITATORY: 3
};

function Neuron(scene, neuron_type) {
  var self = this;

  // Set neuron type -- if undefined, default to REGULAR
  self.neuron_type =
    neuron_type == undefined ? NeuronType.REGULAR : neuron_type;

  // if (Math.random() < 0.7) {
  // 	self.neuron_type = NeuronType.EXCITATORY;
  // } else {
  // 	self.neuron_type = NeuronType.INHIBITORY;
  // }

  // Transform
  self.x = 0;
  self.y = 0;
  self.nx = 0;
  self.ny = 0;
  self.scale = 1;
  self.rotation = Math.random() * Math.PI * 2;
  self.iconRotation = (Math.random() * 2 - 1) * 0.3;

  // Connections & Pulsing
  self.senders = [];
  self.receivers = [];
  self.startingStrength = 4;
  self.highlight = 0;

  // Hebbian
  self.hebbian = 0;
  self.hebbianRadius = 200;

  // Flash
  self.flash = new Flash(self);
  scene.flashes.push(self.flash);

  // Allow dragging
  self.is_dragging = false;
  self.mouse_down = false;
  // self.last_mouse_up = 0;

  // Mouse hover
  self.hoverAlpha = 0;
  self.hebbSignalDuration = 2; // 2 seconds, sorta

  // Highlight
  self.highlightFade = 0.8;

  // Animation
  self.smoosh = 1;
  self.smooshVelocity = 0;
  self.smooshSpring = 0.4;
  self.smooshDampening = 0.64;
  self.wobble = Math.random() * Math.PI * 2;
  self.wobbleRadius = Math.random();
  self.wobbleVelocity = Math.random() * 2 - 1;
  self.ticker = 0;
  self.update_counter = 0;
  self.forget_time = document.getElementById("current_forget");

  // Draw
  self.body_image = images.neuron_body;

  // Highlight
  self.highlightRadius = 25;
  self.highlightFill = "#fff";
  self.highlightBaseAlpha = 0.5;

  // Change settings for different neuron types
  if (self.neuron_type != NeuronType.REGULAR) {
    self.highlightRadius = 70;
    self.highlightFade = 0.93;
    self.highlightBaseAlpha = 0.7;

    if (self.neuron_type == NeuronType.EXCITATORY) {
      self.body_image = images.neuron_body_blue;
      self.connectionStrokeStyle = "#78BCBC";
      self.highlightFill = "#A2FFFF";
      self.icon = images.icon_calm;
    }
    if (self.neuron_type == NeuronType.INHIBITORY) {
      self.body_image = images.neuron_body_red;
      self.connectionStrokeStyle = "#804444";
      self.highlightFill = "#CC4F4F";
      self.icon = images.icon_anxious;
    }
  }

  // To prevent weakening the connections you JUST made.
  self.strengthenedConnections = [];
  self.strengthenHebb = function() {
    // Hebbian highlight!
    self.hebbian = 1;
    self.flash.pulse();

    // Find NOT-THIS-ONE neurons with hebbians, strengthen the connection from them to this.
    // There MUST be a connection initialized before.
    var neurons = scene.neurons;
    for (var i = 0; i < neurons.length; i++) {
      var neuron = neurons[i];

      // Is actually hebb-activated and is NOT self.
      if (neuron.hebbian > 0 && neuron != self) {
        // And is close enough
        var dx = neuron.x - self.x;
        var dy = neuron.y - self.y;
        var radius = self.hebbianRadius;
        if (dx * dx + dy * dy < radius * radius) {
          // Good! This neuron is accepting hebbian connections.
          // Find a connection FROM that TO this.
          var foundConnection = false;
          var connections = scene.connections;
          for (var j = 0; j < connections.length; j++) {
            var connection = connections[j];
            if (connection.from == neuron && connection.to == self) {
              connection.strengthen();
              neuron.strengthenedConnections.push(connection);
              foundConnection = true;
            }
          }

          // If no such connection, MAKE one.
          if (!foundConnection) {
            // var connection = new Connection();
            // connection.connect(neuron,self);
            var connection = Connection.add(neuron, self, scene);
            if (connection) {
              neuron.strengthenedConnections.push(connection);
            }
          }
        }
      }
    }
  };

  self.weakenHebb = function(amount) {
    // Get all sender connections that AREN'T the ones we just strengthened
    var weakenThese = self.senders;
    // 	self.senders.filter(function(sender){
    // 	for (var i = 0; i < self.strengthenedConnections.length; i++) {
    // 		if (sender == self.strengthenedConnections[i]) {
    // 			return false;
    // 		}
    // 	}
    // 	return true;
    // });

    // Weaken them all
    for (var i = 0; i < weakenThese.length; i++) {
      weakenThese[i].weaken(amount);
    }

    // Reset Strengthened Connections
    self.strengthenedConnections = [];
  };

  self.pulse = function(signal, FAKE) {
    // It should lose strength in the neuron
    // If there's no passed-on signal, create a brand new one.
    if (signal) {
      signal.strength--;
    } else {
      signal = {
        strength: self.startingStrength,
        signal_type: self.neuron_type
      };
      if (!FAKE) {
        self.strengthenHebb();
      }
    }

    if (signal.signal_type == NeuronType.INHIBITORY) {
    } else {
    }

    // Sound Effect!
    if (!FAKE) {
      var volume = (signal.strength + 1) / (self.startingStrength + 1); // so it's not zero
      createjs.Sound.play("sfx_spark", { volume: volume * 0.6 });
    }

    // Smoosh
    self.smooshVelocity += 0.05 * (signal.strength + 1);

    // Highlight!
    self.highlight = 1;

    // If there's still strength in the neuron, pass it down immediately.
    if (signal.strength > 0) {
      for (var i = 0; i < self.senders.length; i++) {
        var sender = self.senders[i];
        sender.pulse({
          strength: signal.strength,
          signal_type: signal.signal_type
        });

        // Strengthen connection because we've used it!
        sender.strengthen(signal.strength / self.startingStrength);
      }
    }
  };

  self.update = function() {
    // Highlight!
    self.highlight *= self.highlightFade;
    if (self.highlight < 0.01) {
      self.highlight = 0;
    }

    // Weakens all connections by 0.5 strength every 5 seconds
    var width = 1;
    if (self.update_counter === 300) {
      self.weakenHebb(0.5);
      self.update_counter = 0;
      width = 0;
    } else {
      width = (self.update_counter / 300) * 100;
    }
    self.forget_time.style.width = width + "%";
    self.update_counter += 1;

    // Hebbian update
    if (self.hebbian > 0) {
      self.hebbian -= 1 / (30 * self.hebbSignalDuration);
      // if(self.hebbian < 0){
      // 	publish("/neuron/weakenHebb",[self]); // too slow!
      // 	self.weakenHebb();
      // }
    } else {
      self.hebbian = 0;
    }

    // For mouse dragging -- to prevent down from being called immediately after
    // TODO(emily): v hacky help
    // if (self.last_mouse_up > 0) {
    // 	self.last_mouse_up -= 1;
    // }

    // Animation
    self.smoosh += self.smooshVelocity;
    self.smooshVelocity += (1 - self.smoosh) * self.smooshSpring;
    self.smooshVelocity *= self.smooshDampening;
    if (self.smoosh > 1.5) self.smoosh = 1.5;

    // Neuron's Wobbly Position
    self.wobble += self.wobbleVelocity * 0.05;
    var scale = self.scale * self.smoosh;
    self.nx = self.x + Math.cos(self.wobble) * self.wobbleRadius * scale * 20;
    self.ny = self.y + Math.sin(self.wobble) * self.wobbleRadius * scale * 20;

    // Mouse
    var gotoHoverAlpha = 0;
    if (self.isMouseOver()) {
      canvas.style.cursor = "pointer";
      if (self.mouse_down) {
        gotoHoverAlpha = 1;
      } else {
        gotoHoverAlpha = 0.5;
      }
    } else {
      gotoHoverAlpha = 0;
    }

    self.hoverAlpha = self.hoverAlpha * 0.5 + gotoHoverAlpha * 0.5;
  };

  // CLICK & HOVER
  self.isMouseOver = function() {
    // Refractory period!
    if (self.hebbian > 0) return;
    // if (self.last_mouse_up > 0) return;

    // If so, is it within that circle?
    var dx = Mouse.x - self.x;
    var dy = Mouse.y - self.y;
    var r = 60 * self.scale;
    return dx * dx + dy * dy < r * r;
  };

  // Click and drag neurons
  self.down_listener = subscribe("/mouse/down", function() {
    // If you click on a neuron
    if (self.isMouseOver()) {
      self.mouse_down = true;
      self.is_dragging = false;
    }
  });

  self.drag_listener = subscribe("/mouse/move", function() {
    // If mouse is down for the current neuron, make it move around
    if (self.mouse_down) {
      self.is_dragging = true;
      self.x = Mouse.x;
      self.y = Mouse.y;
    }
  });

  self.up_listener = subscribe("/mouse/up", function() {
    if (self.isMouseOver()) {
      // If mouse was never dragged, then pulse
      if (!self.is_dragging) {
        self.pulse();
        publish("/neuron/click", [self]);
      }
      self.mouse_down = false;
      self.is_dragging = false;

      // For some reason, without this, down_listener gets called immediately after
      // self.last_mouse_up = 1;
    }
  });

  self.kill = function() {
    unsubscribe(self.down_listener);
    unsubscribe(self.up_listener);
    unsubscribe(self.drag_listener);
    unsubscribe(self.add_excitatory_listener);
  };

  self.draw = function(ctx) {
    // save
    ctx.save();

    // translate
    ctx.translate(self.nx, self.ny);

    // Draw NEURON
    var scale = self.scale * self.smoosh;
    ctx.save();
    ctx.scale(scale, scale);
    if (self.hebbian > 0) {
      self.ticker++;
      var wobbledScale = 1 - Math.sin(self.ticker) * 0.05;
      ctx.scale(wobbledScale, wobbledScale);
    }

    // Body, hover, highlight.
    ctx.save();
    ctx.rotate(self.rotation);
    ctx.globalAlpha = self.hoverAlpha;
    ctx.drawImage(images.neuron_hover, -60, -60);
    ctx.globalAlpha = 1;
    ctx.drawImage(self.body_image, -50, -50);
    ctx.globalAlpha = self.highlight;
    ctx.drawImage(images.neuron_highlight, -50, -50);
    ctx.restore();

    // Icon, with its own rotation
    if (self.icon) {
      ctx.rotate(self.iconRotation);
      ctx.drawImage(self.icon, -50, -50);
    }

    ctx.restore();

    // highlight circle!
    if (self.highlight >= 0.01) {
      ctx.globalAlpha = self.highlight * self.highlightBaseAlpha;
      ctx.fillStyle = self.highlightFill;
      ctx.beginPath();
      var radius = 25 + (1 - self.highlight) * self.highlightRadius;
      ctx.arc(0, 0, radius, 0, 2 * Math.PI, false);
      ctx.fill();
    }

    // restore
    ctx.restore();
  };
}

Neuron.add = function(x, y, neuron_type, scene) {
  scene = scene || Interactive.scene;

  // Create the neuron
  var neuron = new Neuron(scene, neuron_type);
  neuron.x = x;
  neuron.y = y;
  neuron.scale = 0.5;
  neuron.clickable = true;

  // Push it
  var neurons = scene.neurons;
  neurons.push(neuron);

  // For serialization: ID
  neuron.id = neurons.length - 1;

  // Return that neuron
  return neuron;
};

Neuron.serialize = function(scene, detailed) {
  scene = scene || Interactive.scene;

  // Prepare output
  var output = {
    neurons: [], // [x,y], [x,y], [x,y]...
    connections: [] // [from,to], [from,to], [from,to]...
    //  or... [from,to,strength]...
  };

  // Get positions of all neurons
  var neurons = scene.neurons;
  for (var i = 0; i < neurons.length; i++) {
    var neuron = neurons[i];
    output.neurons.push([
      Math.round(neuron.x),
      Math.round(neuron.y),
      neuron.neuron_type
    ]);
  }

  // Get all connections, and the IDs of the neurons they're connected to.
  var connections = scene.connections;
  for (var i = 0; i < connections.length; i++) {
    var connection = connections[i];
    if (detailed) {
      output.connections.push([
        connection.from.id,
        connection.to.id,
        connection.strength
      ]);
    } else {
      output.connections.push([connection.from.id, connection.to.id]);
    }
  }

  // Return the string.
  return JSON.stringify(output);
};

Neuron.unserialize = function(scene, string, detailed) {
  // Prepare input
  var input = JSON.parse(string);

  // Create neurons
  for (var i = 0; i < input.neurons.length; i++) {
    var neuron = input.neurons[i];
    Neuron.add(neuron[0], neuron[1], neuron[2], scene);
  }

  // Create connections
  var neurons = scene.neurons;
  for (var i = 0; i < input.connections.length; i++) {
    var connection = input.connections[i];
    var newConnection = Connection.add(
      neurons[connection[0]],
      neurons[connection[1]],
      scene
    );
    if (detailed) {
      newConnection.strength = connection[2];
    }
  }
};

var add_excitatory_listener = subscribe("/toolbar/excitatory", function() {
  var neuron = Neuron.add(Mouse.x, Mouse.y, NeuronType.EXCITATORY);
  neuron.mouse_down = true;
  neuron.is_dragging = true;
});

var add_excitatory_listener = subscribe("/toolbar/inhibitory", function() {
  var neuron = Neuron.add(Mouse.x, Mouse.y, NeuronType.INHIBITORY);
  neuron.mouse_down = true;
  neuron.is_dragging = true;
});
