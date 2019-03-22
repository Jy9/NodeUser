const https = require("https"),
	express = require('express'),
	app = express(),
	fs = require('fs'),
	bodyParser = require('body-parser'),
	mongod = require("./mongod"),
	config = require('./config.json');

//设置跨域访问
/* app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By", ' 3.2.1');
	next();
});
 */

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

//判断是post还是get并获取参数
function getOption(req){
	return JSON.stringify(req.body) !== "{}" ? req.body : req.query;
}
//返回数据模板
function getReturnOption(){
	return {
		status:true,
		data:{},
		msg:""
	}
}

console.log(new getReturnOption())

//登录
app.use("/login",function(req,res){
	let option = getOption(req);
	let returnOption = new getReturnOption();
	let mongoOption = {
		action:"find",
		collections:"user",
		selector:{"userID":option.userID},
		fn:function(user){
			if(user.length != 0){
				if(user[0].password === option.password){
					returnOption.status = true;
					returnOption.data = user[0];
				}else{
					returnOption.status = false;
					returnOption.msg = "密码错误";
				}
			}else{
				returnOption.status = false;
				returnOption.msg = "未查询到该用户";
			}
			res.send(returnOption)
		}
	}
	mongod(mongoOption)
})

//注册
app.use("/register",function(req,res){
	let option = getOption(req);
	let returnOption = new getReturnOption();
	if(!option.userID || !option.password){
		returnOption.status = false;
		returnOption.msg = "请补全信息";
		res.send(returnOption)
	}
	//判断当前用户名是否注册
	let mongoOption1 = {
		action:"find",
		collections:"user",
		selector:{"userID":option.userID},
		fn:function(user){
			if(user.length !== 0){
				returnOption.status = false;
				returnOption.msg = "当前账号已存在";
				res.send(returnOption)
			}else{
				let userOption = {
					"userID":option.userID,
					"password":option.password,
					"nickname":option.nickname || ""
				}
				let mongoOption = {
					action:"add",
					collections:"user",
					selector:userOption,
					fn:function(user){
						returnOption.data = user.ops[0];
						res.send(returnOption)
					}
				}
				mongod(mongoOption)
			}
		}
	}
	mongod(mongoOption1)
})

var options = {
	key:fs.readFileSync('./key.key'),
	cert:fs.readFileSync('./crt.crt')
};
 
https.createServer(options, app).listen(config.POST,function(){
	console.log(config.POST+"端口已启动！")
});