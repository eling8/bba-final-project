// var NEURONS_SERIALIZED = '{"neurons":[[-92,-72],[-24,75],[-57,199],[-77,304],[-76,405],[-65,538],[-81,696],[45,-72],[56,84],[27,205],[35,321],[91,433],[32,521],[89,659],[208,-35],[153,57],[186,214],[152,269],[174,384],[149,558],[193,675],[266,-90],[273,85],[276,158],[300,324],[288,424],[330,573],[284,687],[452,-28],[431,87],[412,206],[452,287],[387,387],[395,539],[401,628],[518,-80],[570,65],[542,146],[558,318],[522,447],[513,527],[505,637],[661,-83],[656,54],[678,213],[654,294],[660,430],[676,541],[648,669],[780,-81],[752,64],[808,201],[799,330],[746,420],[808,522],[779,657],[892,-81],[881,75],[874,171],[907,319],[883,455],[920,514],[889,682],[1009,-76],[992,94],[997,201],[1008,325],[1046,387],[1016,565],[1018,635]],"connections":[[0,1],[1,0],[2,3],[8,2],[2,9],[10,2],[4,3],[10,4],[4,11],[11,4],[5,6],[12,5],[7,1],[8,7],[7,14],[15,7],[13,6],[12,13],[13,20],[16,9],[15,16],[16,18],[22,16],[16,22],[16,23],[24,16],[17,9],[9,17],[10,17],[17,18],[24,17],[19,11],[12,19],[19,13],[18,19],[19,20],[21,14],[22,21],[25,18],[24,25],[25,26],[33,25],[25,33],[27,20],[28,35],[36,28],[29,22],[22,29],[23,29],[29,23],[29,28],[31,24],[31,37],[38,31],[31,39],[34,26],[27,34],[34,33],[40,34],[34,41],[42,35],[36,42],[42,43],[49,42],[44,37],[38,44],[44,43],[45,44],[44,50],[50,44],[52,44],[46,38],[40,46],[46,45],[47,46],[46,52],[53,46],[46,53],[46,54],[54,46],[48,47],[55,48],[51,44],[44,51],[50,51],[51,52],[52,51],[57,51],[51,57],[51,58],[59,51],[56,57],[63,56],[60,53],[54,60],[60,59],[59,60],[66,60],[60,67],[68,60],[61,54],[54,61],[62,61],[61,67],[68,61],[61,69],[64,57],[58,64],[64,63],[65,64],[32,39],[37,30],[8,15],[37,36],[36,43],[25,32],[30,24],[30,23],[39,46],[43,36]]}';
var NEURONS_SERIALIZED = '{"neurons":[[-92,-72,3],[-24,75,2],[-57,199,3],[-77,304,3],[-76,405,3],[-65,538,3],[-81,696,3],[45,-72,2],[56,84,2],[27,205,3],[35,321,2],[91,433,3],[32,521,3],[89,659,3],[208,-35,2],[153,57,3],[186,214,3],[152,269,2],[174,384,2],[149,558,3],[193,675,2],[266,-90,2],[273,85,2],[276,158,3],[300,324,3],[288,424,3],[330,573,3],[284,687,3],[452,-28,3],[431,87,3],[412,206,3],[452,287,2],[387,387,3],[395,539,3],[401,628,3],[518,-80,3],[570,65,3],[542,146,3],[558,318,3],[522,447,3],[513,527,2],[505,637,2],[661,-83,2],[656,54,3],[678,213,3],[654,294,2],[660,430,3],[676,541,3],[648,669,2],[780,-81,3],[752,64,3],[808,201,2],[799,330,3],[746,420,2],[808,522,3],[779,657,3],[892,-81,3],[881,75,2],[874,171,3],[907,319,3],[883,455,2],[920,514,2],[889,682,2],[1009,-76,3],[992,94,3],[997,201,2],[1008,325,2],[1046,387,2],[1016,565,3],[1018,635,2]],"connections":[[0,1,2],[1,0,2],[2,3,2],[8,2,2],[2,9,2],[10,2,2],[4,3,2],[10,4,2],[4,11,2],[11,4,2],[5,6,2],[12,5,2],[7,1,2],[8,7,2],[7,14,2],[15,7,2],[13,6,2],[12,13,2],[13,20,2],[16,9,2],[15,16,2],[16,18,2],[22,16,2],[16,22,2],[16,23,2],[24,16,2],[17,9,2],[9,17,2],[10,17,2],[17,18,2],[24,17,2],[19,11,2],[12,19,2],[19,13,2],[18,19,2],[19,20,2],[21,14,2],[22,21,2],[25,18,2],[24,25,2],[25,26,2],[33,25,2],[25,33,2],[27,20,2],[28,35,2],[36,28,2],[29,22,2],[22,29,2],[23,29,2],[29,23,2],[29,28,2],[31,24,2],[31,37,2],[38,31,2],[31,39,2],[34,26,2],[27,34,2],[34,33,2],[40,34,2],[34,41,2],[42,35,2],[36,42,2],[42,43,2],[49,42,2],[44,37,2],[38,44,2],[44,43,2],[45,44,2],[44,50,2],[50,44,2],[52,44,2],[46,38,2],[40,46,2],[46,45,2],[47,46,2],[46,52,2],[53,46,2],[46,53,2],[46,54,2],[54,46,2],[48,47,2],[55,48,2],[51,44,2],[44,51,2],[50,51,2],[51,52,2],[52,51,2],[57,51,2],[51,57,2],[51,58,2],[59,51,2],[56,57,2],[63,56,2],[60,53,2],[54,60,2],[60,59,2],[59,60,2],[66,60,2],[60,67,2],[68,60,2],[61,54,2],[54,61,2],[62,61,2],[61,67,2],[68,61,2],[61,69,2],[64,57,2],[58,64,2],[64,63,2],[65,64,2],[32,39,2],[37,30,2],[8,15,2],[37,36,2],[36,43,2],[25,32,2],[30,24,2],[30,23,2],[39,46,2],[43,36,2]]}'

function Scene_Hebbian(){

	var self = this;
	BrainScene.call(self);

	// Camera
	self.setCamera(480, 270, 1);
	
	// Whee! One that looks nice & uniform and no "boring" neurons
	Neuron.unserialize(self,NEURONS_SERIALIZED,true);

	// Modify all connections: already done
	for(var i=0;i<self.connections.length;i++){
		var c = self.connections[i];
		c.strengthEased = 1;
	}

	// Scene Messages
	var _listener1 = subscribe("/scene/removeConnections",function(){
		unsubscribe(_listener1);
		for(var i=0;i<self.connections.length;i++){
			self.connections[i].strength = 0;
		}
	});
	var _listener2 = subscribe("/scene/addHebb",function(){
		unsubscribe(_listener2);
		self.sprites.push(new HebbWords("hebb"));
		self.sprites.push(new HebbComic("hebb"));
	});
	var _listener3 = subscribe("/scene/addAntiHebb",function(){
		unsubscribe(_listener3);
		self.sprites.push(new HebbWords("antihebb"));
		self.sprites.push(new HebbComic("antihebb"));
	});

	// Scene Transitions
	self.transitionIn = function(){
		self.cameraEased.x = 1600;
	};
	self.transitionOut = function(){
		self.camera.x = 1600;
		return function(){return (self.cameraEased.x>1600);}; // done when this is
	};

	//////////////////////////////////
	// SPRITES AND ANIMATIONS STUFF //
	//////////////////////////////////

	function HebbComic(type){

		var self = this;
		Sprite.call(self,{
			pivotX:0, pivotY:0,
			spritesheet: (type=="hebb") ? images.hebb : images.antihebb,
			frameWidth:260, frameHeight:400,
			frameTotal:1
		});

		// Start Off
		self.y = 50;
		if(type=="hebb"){
			self.x = -260;
			self.gotoX = 0;
		}else{
			self.x = 960;
			self.gotoX = 700;
		}
		
		// UPDATE
		var _prevUpdate = self.update;
		self.update = function(){
			self.x = self.x*0.7 + self.gotoX*0.3;
			_prevUpdate.call(self);
		};

	}

	function HebbWords(type){
		var self = this;
		Sprite.call(self,{
			pivotX:0, pivotY:0,
			spritesheet: (type=="hebb") ? images.hebb_words : images.antihebb_words,
			frameWidth:440, frameHeight:240,
			frameTotal:1
		});

		// Start Off
		self.y = 130;
		if(type=="hebb"){
			self.x = -440;
			self.gotoX = 260;
		}else{
			self.x = 960;
			self.gotoX = 260;
		}
		
		// UPDATE
		self.timer = 3.7 * 30; // A bit over three seconds.
		var _prevUpdate = self.update;
		self.update = function(){
			self.x = self.x*0.7 + self.gotoX*0.3;
			if(self.timer--<0){
				self.alpha -= 0.1;
				if(self.alpha<0){
					self.alpha=0;
					self.dead = true;
				}
			}
			_prevUpdate.call(self);
		};

	}

}

function Scene_Propagation(){
	var self = this;
	BrainScene.call(self);

	// Camera
	self.setCamera(480, 270, 1);
	
	// Whee! One that looks nice & uniform and no "boring" neurons
	Neuron.unserialize(self, NEURONS_SERIALIZED);
	// console.log(Neuron.serialize(self, true));

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