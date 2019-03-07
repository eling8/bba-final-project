var ConnectionType = {
  REGULAR: 1,
  FIXED: 2, // connections that can't be weakened
};

function Connection(scene){
	var self = this;

	self.connection_type = ConnectionType.REGULAR;

	// Connection properties
	self.from = null;
	self.to = null;
	self.speed = 3.5;

	// Strength
	self.strength = 2;
	self.strengthEased = 0;

	// Pulses
	self.pulses = [];
	self.pulse = function(signal){
		// Only send down the signal if the strength is actually good!
		if(self.isConnected()){
			signal.distance = 0; // reset signal's distance!
			self.pulses.push(signal);
		}

	};

	// Connect
	self.connect = function(from,to){
		self.from = from;
		self.to = to;
		from.senders.push(self);
		to.receivers.push(self);

		// For special-colored neurons
		if(from.connectionStrokeStyle){
			self.strokeStyle = from.connectionStrokeStyle;
		}

	};

	// Disconnect
	self.disconnect = function(){
		self.dead = true;
		self.from.senders.splice(self.from.senders.indexOf(self),1);
		self.to.receivers.splice(self.to.receivers.indexOf(self),1);
	};

	// Strengthen
	self.strengthen = function(amount) {
		self.strength += (amount == undefined ? 1 : amount);
		// if (self.strength > 1) self.strength = 1;
		if (self.strength > self.fullLineWidth) self.strength = self.fullLineWidth;
	};

	// Weaken
	self.weaken = function(amount) {
		if (self.connection_type == ConnectionType.FIXED) return;
		self.strength -= (amount == undefined ? 1 : amount);
		// self.strength -= 1;
		if(!self.isConnected()) self.strength = 0;
	};

	// Am I Connected?
	self.isConnected = function(){
		// return(self.strength >= 0.94);
		return(self.strength >= 0.89);
	};

	// UPDATE
	self.update = function(){
		// Pythagorean Distance
		var dx = self.from.nx-self.to.nx;
		var dy = self.from.ny-self.to.ny;
		var distance = Math.sqrt(dx*dx+dy*dy);

		// Have all signals go down the wire
		// at a constant "actual length" rate
		for(var i = 0; i < self.pulses.length; i++) {
			var pulse = self.pulses[i];
			// pulse.distance += self.speed;

			// Speed proportional to strength
			pulse.distance += 2 + self.strength / 1.5;

			// Oh, you've reached the end?
			if(pulse.distance >= distance){
				
				// Tell the TO neuron to pulse
				self.to.pulse(pulse);

				// Remove this pulse from the wire
				self.pulses.splice(i,1);
				i--;

			}
		}

		// Animation
		self.lineWidth = Math.min(self.strength, self.fullLineWidth) * 1.3;
		// self.lineWidth = (self.strength < 1) ? self.fullLineWidth/2 : self.fullLineWidth;
		self.strengthEased = self.strengthEased * 0.9 + Math.min(self.strength, 1) * 0.1;
		self.easedLineWidth = self.easedLineWidth * 0.9 + self.lineWidth * 0.1;

		// ACTUALLY REMOVE THIS ONE?
		if(self.strength < 0.1 && self.strengthEased < 0.1) {
			self.disconnect();
		}

	};

	self.strokeStyle = "#555555";
	self.fullLineWidth = 5;
	self.lineWidth = self.fullLineWidth;
	self.easedLineWidth = self.lineWidth;
	self.pulseRadius = 8;
	self.endDistance = 35;

	self.draw = function(ctx){
		// save
		ctx.save();

		// translate & rotate so it's from LEFT TO RIGHT
		var from = self.from;
		var to = self.to;
		var dx = from.nx-to.nx;
		var dy = from.ny-to.ny;
		var distance = Math.sqrt(dx*dx+dy*dy);
		var angle = Math.atan2(dy,dx);
		ctx.translate(from.nx,from.ny);
		ctx.rotate(angle+Math.PI);

		// Draw connection at all?!
		var endX = (distance * self.strengthEased) - self.endDistance;
		if (endX > 0){
			// draw a line
			var offsetY = 7;
			ctx.strokeStyle = self.strokeStyle;
			ctx.lineWidth = self.easedLineWidth;
			ctx.lineCap = 'butt';
			ctx.beginPath();
			ctx.moveTo(0, offsetY);
			ctx.lineTo(endX, offsetY);
			ctx.lineTo(endX + self.pulseRadius, offsetY - self.pulseRadius);
			ctx.moveTo(endX, offsetY);
			ctx.lineTo(endX + self.pulseRadius, offsetY + self.pulseRadius);
			ctx.stroke();

		}

		// for black outline around dots that makes them easier to see
		ctx.strokeStyle = "#000000";
		ctx.lineWidth = 1.5;	

		// draw all pulses
		for(var i = 0; i < self.pulses.length; i++){
			var pulse = self.pulses[i];
			ctx.fillStyle = "#fff";
			
			if (from.neuron_type == NeuronType.INHIBITORY) {
				ctx.fillStyle = "#d19898";
			}
			if (from.neuron_type == NeuronType.EXCITATORY) {
				ctx.fillStyle = "#c9eaea";
			}

			ctx.beginPath();
			ctx.arc(pulse.distance, offsetY, self.pulseRadius - 4 + pulse.strength * 1.4, 0, 2*Math.PI, false);
			ctx.fill();
			ctx.stroke();
		}

		// restore
		ctx.restore();

	};

};

Connection.add = function(from, to, scene) {
	scene = scene || Interactive.scene;

	// If connection exists for to -> from, don't add
	for (var i = 0; i < to.senders.length; i++) {
		if (to.senders[i].to == from) {
			return null;
		}
	}

	// Create the connection
	var connection = new Connection();
	connection.connect(from,to);

	// Add it
	var connections = scene.connections;
	connections.push(connection);

	// Return
	return connection;

};