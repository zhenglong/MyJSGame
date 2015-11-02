
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

