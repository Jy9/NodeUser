const MongoClient = require("mongodb").MongoClient;
const Urls = require("./config").mongoURL;

//add一条数据
const add = function(db, collections, selector, fn) {
    var collection = db.collection(collections);
    collection.insertMany([selector], function(err, result) {
        if (err) {
            console.log("Error" + err)
            fn({err:err})
        } else {
            fn(result);
        };
    });
}
//delete
const remove = function(db, collections, selector, fn) {
    var collection = db.collection(collections);
    collection.remove(selector, function(err, result) {
        if (err) {
            console.log("Error" + err)
            fn({err:err})
        } else {
            fn(result);
        }
    });

};
//find
const find = function(db, collections, selector, fn, sort) {
	if(!sort){sort = {}}
    var collection = db.collection(collections);
    collection.find(selector).sort(sort).toArray(function(err, result) {
        if (err) {
            console.log("Error" + err)
            fn({err:err})
        } else {
            fn(result);
        }
    });

}

//update
const updates = function(db, collections, selector, fn) {
    var collection = db.collection(collections);
    collection.updateOne(selector[0], selector[1], function(err, result) {
        if (err) {
            console.log("Error" + err)
            fn({err:err})
        } else {
            fn(result);
        }
    });

}

//方法都赋值到操作对象上，便于调用
var mongo = {
    find: find,
    add: add,
    update: updates,
    remove: remove
};
//主逻辑
module.exports = function(option) {
    MongoClient.connect(Urls, function(err, db) {
        if (err) {
            console.log("Error" + err)
        } else {
            var dbs = db.db("JiaYue");
			mongo[option.action](dbs, option.collections, option.selector, option.fn, option.sort);
            db.close();
        }
    });

};