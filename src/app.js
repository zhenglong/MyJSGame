var Scene1 = cc.Scene.extend({
	ctor: function() {
		this._super();
		var gate = new cc.Sprite(res.gate_bg_png);
		gate.setAnchorPoint(0, 0);
		this.addChild(gate, 2);
		var door = new cc.Sprite(res.door_jpg);
		door.setScale(.6, .3);
		door.setAnchorPoint(-1, -.4);
		this.addChild(door, 1);
		var listener = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: function(touch, event) {
				var target = event.getCurrentTarget();
				var locationInNode = target.convertToNodeSpace(touch.getLocation());

				var s = target.getContentSize();
				var rect = cc.rect(0, 0, s.width, s.height);

				if (cc.rectContainsPoint(rect, locationInNode)) {
					var action = cc.moveBy(.5, cc.p(0, door.getBoundingBox().height));
					var sequence = cc.sequence([action, cc.callFunc(function() {
						cc.director.runScene(new Scene2());
					}, this)]);
					door.runAction(sequence);
					return true;
				}
				return false;
			}
		});
		cc.eventManager.addListener(listener, door);
		cc.log('scene1');
	},
	onEnter: function() {
		this._super();
		cc.log('scene1 enter');
	},
	onExit: function() {
		this._super();
		cc.log('scene1 exit');
	}
});

var Scene2 = cc.Scene.extend({
	ctor: function() {
		this._super();
		this.addChild(new Background2Layer());
		this.addChild(new MascotLayer());
		this.addChild(new ConversationLayer());
		var listener = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: function(touch, event) {
				cc.director.runScene(new Scene3());
				return true;
			}
		});
		cc.eventManager.addListener(listener, this);
		cc.log('scene2');
	},
	onEnter: function() {
		this._super();
		cc.log('scene2 enter');
	},
	onExit: function() {
		this._super();
		cc.log('scene2 exit');
	}
});

var Background2Layer = cc.Layer.extend({
	ctor: function() {
		this._super();
		// TODO: add a background image
	}
});

var MascotLayer = cc.Layer.extend({
	ctor: function() {
		this._super();

		var size = cc.winSize;
		var mascot = new cc.Sprite(res.mascot_png);
		mascot.setScale(.15);
		mascot.setPosition(cc.p(40, size.height - 30));
		this.addChild(mascot);
	}
});

var ConversationLayer = cc.Layer.extend({
	ctor: function() {
		this._super();
		var size = cc.winSize;
		var txt = new cc.DrawNode();
		txt.drawRect(cc.p(40, size.height / 2 - 10), cc.p(size.width - 40, size.height - 60), 
			new cc.Color(0, 0, 0, 255), 2, new cc.Color(255, 255, 255));
		this.addChild(txt);
		var label = new cc.LabelTTF('很久很久以前有一个故事。。。', 'Arial', 20);
		label.fillStyle = new cc.Color(255, 255, 255);
		label.setPosition(cc.p(size.width / 2 + 10, size.height - 90));
		label.boundingWidth = size.width - 80;
		//label.boundingHeight = size.height / 2 - 50;
		this.addChild(label);
	}
});

var SPRITE_WIDTH = 24;
var SPRITE_HEIGHT = 24;
var DEBUG_NODE_SHOW = true;
var Scene3 = cc.Scene.extend({
	space: null,
	layer: null,
	ctor: function() {
		this._super();
		this.initPhysics();
		this.layer = new BoxesLayer();
		this.addChild(this.layer);
		this.scheduleUpdate();
		cc.log('scene3');
	},
	onEnter: function() {
		this._super();
		var animFrames = [];
		var inst = cc.spriteFrameCache;
		var frame = inst.getSpriteFrame(res.box_close_png.substr(res.box_close_png.lastIndexOf('/') + 1));
		animFrames.push(frame);
		frame = inst.getSpriteFrame(res.box_open_full_png.substr(res.box_open_full_png.lastIndexOf('/') + 1));
		animFrames.push(frame);
		var animation = new cc.Animation(animFrames, 0.1);
		var layer = this.layer;
		var startPoint = layer.getStartPoint();
		var target = this;
		var listener = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: function(touch, event) {
				// get touched tile 
				var pos = layer.convertTouchToNodeSpace(touch);
				var tile = layer.getTileAt(Math.floor((pos.x - startPoint.x) / layer.tileWidth), 
					Math.floor((pos.y - startPoint.y) / layer.tileHeight));
				var location = touch.getLocation();
				if (tile) {
					var runningAction = new cc.Repeat(new cc.Animate(animation), 1);
					tile.runAction(runningAction);

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
				}
				return true;
			}
		});
		cc.eventManager.addListener(listener, layer);
	},
	onExit: function() {
		this._super();
		cc.eventManager.removeEventListener(cc.EventListener.TOUCH_ONE_BY_ONE);
	},
	initPhysics: function() {
		var winSize = cc.director.getWinSize();
		this.space = new cp.Space();
		this.space.gravity  = cp.v(0, -500);
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

var BoxesLayer = cc.Layer.extend({
	sprites: [],
	tileWidth: 70*1.2,
	tileHeight: 62*1.2,
	tileSpanX: 3,
	tileSpanY: 3,
	ctor: function() {
		this._super();
		var winSize = cc.winSize;
		var tileWidth = this.tileWidth;
		var tileHeight = this.tileHeight;
		var x = (winSize.width - tileWidth * this.tileSpanX) / 2;
		var y = (winSize.height - tileHeight * this.tileSpanY) / 2;
		var inst = cc.spriteFrameCache;
		inst.addSpriteFrames(res.open_box_empty_plist);
		inst.addSpriteFrames(res.open_box_success_plist);

		for (var i = 0; i < this.tileSpanX; i++) {
			for (var j = 0; j < this.tileSpanY; j++) {
				var sprite = new cc.Sprite(res.box_close_png);
				sprite.setScale(.8);
				sprite.setPosition(x + (i * tileWidth), y + (j * tileHeight));
				this.sprites.push(sprite);
				this.addChild(sprite);
			}
		}
	},
	getTileAt: function(i, j) {
		return this.sprites[i * this.tileSpanX + j];
	},
	getStartPoint: function() {
		var bound = this.sprites[0].getBoundingBox();
		return cc.p(bound.x, bound.y);
	}
});

var BoxesTiledMap = cc.TMXTiledMap.extend({
	ctor: function() {
		this._super();
		this.initWithTMXFile(res.boxes_tmx);
	}
});

var HelloWorldLayer = cc.Layer.extend({
	sprite1: null,
	sprite2: null,
	sprite3: null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

		var size = cc.winSize;

		this.sprite1 = new cc.Sprite(res.cyanSquare_png);
		this.sprite1.x = size.width / 2 - 20;
		this.sprite1.y = size.height / 2 + 20;
		this.addChild(this.sprite1, 10);

		this.sprite2 = new cc.Sprite(res.magentaSquare_png);
		this.sprite2.x = size.width / 2;
		this.sprite2.y = size.height / 2;
		this.addChild(this.sprite2, 20);

		this.sprite3 = new cc.Sprite(res.yellowSquare_png);
		this.sprite3.x = 0;
		this.sprite3.y = 0;
		this.sprite2.addChild(this.sprite3, 1);

		var listener1 = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: function(touch, event) {
				var target = event.getCurrentTarget();
				var locationInNode = target.convertToNodeSpace(touch.getLocation());
				var s = target.getContentSize();
				var rect = cc.rect(0, 0, s.width, s.height);

				if (cc.rectContainsPoint(rect, locationInNode)) {
					cc.log('sprite began ... x= ' + locationInNode.x + ', y = ' + locationInNode.y);
					target.opacity = 180;
					return true;
				}
				return false;
			},
			onTouchMoved: function(touch, event) {
				var target = event.getCurrentTarget();
				var delta = touch.getDelta();
				target.x += delta.x;
				target.y += delta.y;
			},
			onTouchEnded: function(touch, event) {
				var target = event.getCurrentTarget();
				cc.log('sprite onTouchEnded..');
				target.setOpacity(255);
				if (target == this.sprite2) {
					sprite1.setLocalZOrder(100);
				} else if (target == this.sprite1) {
					sprite1.setLocalZOrder(0);
				}
			}
		});
		cc.eventManager.addListener(listener1, this.sprite1);
		cc.eventManager.addListener(listener1.clone(), this.sprite2);
		cc.eventManager.addListener(listener1.clone(), this.sprite3);
        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

