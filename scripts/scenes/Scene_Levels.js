function Scene_Level1() {
	var self = this;
	LevelScene.call(self);
	
	NEURONS_SERIALIZED = '{"neurons":[[150,295,3,2],[759,274,3,3],[575,350,2,4],[266,187,2,4],[583,232,3,4],[269,425,2,4],[377,447,3,4]],"connections":[[0,3,2],[2,1,2],[4,1,2],[5,6,2]]}'
	Neuron.unserialize(self, NEURONS_SERIALIZED);
}

function Scene_Level2() {
	var self = this;
	LevelScene.call(self);
	
	NEURONS_SERIALIZED = '{"neurons":[[150,295,3,2],[759,274,3,3],[575,350,2,4],[266,187,2,4],[583,232,3,4],[269,425,2,4],[377,447,3,4]],"connections":[[0,3,2],[2,1,2],[4,1,2],[5,6,2]]}'
	Neuron.unserialize(self, NEURONS_SERIALIZED);
}

function LevelScene() {
	var self = this;
	BrainScene.call(self);

	// Camera
	self.setCamera(480, 270, 1);

	// Scene Transitions
	self.transitionIn = function(){
		self.cameraEased.zoom = 0.2;
	};
	self.transitionOut = function(){
		NEURONS_SERIALIZED = Neuron.serialize(self, true);
		self.camera.x = 1600;
		return function(){return (self.cameraEased.x>1600);}; // done when this is
	};
}