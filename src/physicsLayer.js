/*
 * physicsLayer.js
 * Copyright (C) 2015 tristan <tristan@tristan-Satellite-L600>
 *
 * Distributed under terms of the MIT license.
 */
var SPRITE_WIDTH = 24;
var SPRITE_HEIGHT = 24;
var DEBUG_NODE_SHOW = true;

var PhysicsScene = cc.Scene.extend({
	ctor: function() {
		this._super();
		this.addChild(new PhysicsLayer());
	}
});

var PhysicsLayer = cc.Layer.extend({
	space: null,
	ctor: function() {
		this._super();
		this.initPhysics();
		this.scheduleUpdate();

	},
	setupDebugNode: function() {
		this._debugNode = new cc.PhysicsDebugNode(this.space);
		this._debugNode.visible = DEBUG_NODE_SHOW;
		this.addChild(this._debugNode);
	},
	onEnter: function() {
		this._super();
		cc.log('onEnter');
		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			onTouchBegan: this.onTouchBegan
		}, this);
	},
	onTouchBegan: function(touch, event) {
		cc.log('onTouchBegan');

		var target = event.getCurrentTarget();

		var location = touch.getLocation();
		var i = 0;
		function loop() {
			setTimeout(function() {
				target.addNewSpriteAtPosition(new cc.p(location.x, location.y));
				i++;
				if (i == 50) return;
				loop();
			}, 60);
		}
		loop();
		return false;
	},
	onExit: function() {
		this._super();
		cc.log('onExit');
		cc.eventManager.removeEventListener(cc.EventListener.TOUCH_ONE_BY_ONE);
	},
	initPhysics: function() {
		var winSize = cc.director.getWinSize();
		this.space = new cp.Space();
		this.setupDebugNode();

		this.space.gravity  = cp.v(0, -500);
		var staticBody = this.space.staticBody;

		var walls = [
			//new cp.SegmentShape(staticBody, cp.v(0, 0),
			//	cp.v(winSize.width, 0), 0),
			//new cp.SegmentShape(staticBody, cp.v(0, winSize.height),
			//		cp.v(winSize.width, winSize.height), 0),
			//new cp.SegmentShape(staticBody, cp.v(0, 0),
			//		cp.v(0, winSize.height), 0),
			//new cp.SegmentShape(staticBody, cp.v(winSize.width, 0),
			//		cp.v(winSize.width, winSize.height), 0)
			];
		for (var i = 0; i < walls.length; i++) {
			var shape = walls[i];
			shape.setElasticity(1);
			shape.setFriction(1);
			this.space.addStaticShape(shape);
		}
	},
	addNewSpriteAtPosition: function(p) {
		cc.log('addNewSpriteAtPosition');

		var body = new cp.Body(1,cp.momentForBox(1, SPRITE_WIDTH, SPRITE_HEIGHT));
		body.setPos(p);
		body.setVel(cp.v((Math.random() > .5 ? -1 : 1) * 200 * Math.random(),
				150 * Math.random()));
		body.setAngVel(Math.PI * Math.random());
		this.space.addBody(body);

		var shape = new cp.CircleShape(body, SPRITE_WIDTH / 2, cp.v(0, 0));
		shape.setElasticity(.5);
		shape.setFriction(.5);
		this.space.addShape(shape);

		var sprite = new cc.PhysicsSprite(res.coin_png);
		sprite.setScale(SPRITE_WIDTH / sprite.getContentSize().width);
		sprite.setBody(body);
		sprite.setPosition(cc.p(p.x, p.y));
		this.addChild(sprite);
	},
	update: function(dt) {
		var timeStep = .03;
		this.space.step(timeStep);
	}
});
