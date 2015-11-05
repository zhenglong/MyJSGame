var res = {
    HelloWorld_png : "res/HelloWorld.png",
	cyanSquare_png: 'res/cyanSquare.png',
	magentaSquare_png: 'res/magentaSquare.png',
	yellowSquare_png: 'res/yellowSquare.png',
	gate_bg_png: 'res/gate_bg_1.png',
	door_jpg: 'res/door.jpg',
	mascot_png: 'res/mascot.png',
	box_close_png: 'res/01-box-close.png',
	box_open_empty_png: 'res/03-box-open-empty.png',
	box_open_full_png: 'res/02-box-open-full.png',
	open_box_empty_png: 'res/open-box-empty.png',
	open_box_success_png: 'res/open-box-success.png',
	open_box_empty_plist: 'res/open-box-empty.plist',
	open_box_success_plist: 'res/open-box-success.plist'
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
