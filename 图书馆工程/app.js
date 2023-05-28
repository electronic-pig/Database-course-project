'use strict';
const session = require('..\\node_modules\\express-session');
const bodyParser = require('..\\node_modules\\body-parser');
const srvstatic = require('..\\node_modules\\serve-static');
const path = require("path");
//:init
const app = require('./WebApp')();
require("./coSqlite3")({ file: 'lib.db' });//连接数据库，要求必须使用这个数据库名字

//:prepare middle ware
app.use(bodyParser.json());//request数据处理中间件(json化数据)
app.use(bodyParser.urlencoded({ extended: false }));//request数据处理中间件(url解码)
//app.use(cookieParser());
app.use(session({ name: 'bbs', secret: 'bbs', cookie: { httpOnly: true, secure: false, maxAge: null } }));//会话管理中间件

//根的重定向拦截器
app.use('/', function (req, res, next) {
	var url = req._path;
	res.writeHead(302, {
		'Location': '/__index.htm'
		//add other headers here...
	});
	res.end();
});

app.use(srvstatic(path.join(__dirname, '/static')));//静态文件服务中间件

//:router at here
app.use(function (req, res, next) {//no-chache head for router and pre check
	res.setHeader('Cache-control', 'no-cache');
	res.setHeader('Pragma', 'no-cache');
	res.setHeader('Content-Type', 'text/html;charset=utf-8');
	next();
});

//请在此处设定路由(可参考bbs例子中的 ./routes/index.js中的代码，路由函数的实现请参考bbs例子中的./routes/txt.js和user.js)
/*示例：
app.route('/guid','get',....);
app.route('/login','post',...);
*/

//:下面是一段使用myModule.js注册'/hello'和'/x/hello'入口路由URL的例子,可以注释掉
const my = require('./myModule.js');
// const func = require('./routes/')/*  */
app.route('/hello', '*', my.Hello);
app.route('/x/hello', '*', my.Hello);
app.route('/init', 'POST', require('./routes/init').init);
app.route('/func1','POST',require('./routes/func1').func1);
app.route('/func2','POST',require('./routes/func2').func2);
app.route('/func3','POST',require('./routes/func3').func3);
app.route('/func4','POST',require('./routes/func4').func4);
app.route('/func5','POST',require('./routes/func5').func5);
app.route('/func6','POST',require('./routes/func6').func6);
app.route('/func7','POST',require('./routes/func7').func7);
app.route('/func8','POST',require('./routes/func8').func8);
app.route('/func9','POST',require('./routes/func9').func9);
app.route('/func10','POST',require('./routes/func10').func10);
app.route('/func11','POST',require('./routes/func11').func11);
app.route('/func12','POST',require('./routes/func12').func12);
app.route('/func13','POST',require('./routes/func13').func13);

app.use(app.router);//use router
//:handler error
app.use(function (err, req, res, next) {
	if (!next)
		return res();//404
	//:log
	if (String == err.constructor)
		err = { no: 500, msg: err };
	if (null == err.no || null == err.msg || res.finished || res._sent)
		return next(err);//未处理的异常或处理了却无法发送的异常
	res.send(err);
});

//:create server
let port = 80;
var server = require('http').createServer(app.OnRequest);
server.on('error', onError);
server.on('listening', onListening);
server.listen(port);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}
	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error('Port ' + port + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error('Port ' + port + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
	var addr = server.address();
	var bind = typeof addr === 'string'
		? 'pipe ' + addr
		: 'port ' + addr.port;
	console.log('Listening on ' + bind);
}

/**
 * 捕获未知异常，防止Node进程在异常时退出
 */
process.on('uncaughtException', function (err) {
	console.log(err);
});