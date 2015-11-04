var res = {
    HelloWorld_png : "res/HelloWorld.png",
	cyanSquare_png: 'res/cyanSquare.png',
	magentaSquare_png: 'res/magentaSquare.png',
	yellowSquare_png: 'res/yellowSquare.png',
	gate_bg_png: 'res/gate_bg_1.png',
	door_jpg: 'res/door.jpg',
	mascot_png: 'res/mascot.png',
	box_close_png: 'res/box-close.png',
	box_open_empty_png: 'res/box-open-empty.png',
	box_open_full_png: 'res/box-open-full.png',
	boxes_tmx: 'res/boxes.tmx'
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
