

function Service(url) {
	this.SHOWALERT = "<div class='alert alert-danger'><a href='#' class='close' data-dismiss='alert'>&times;</a><strong></strong></div>"
	this.rootUrl = url;
	this.defalut = {
			success:function(){},
			err:function(data,alert){
				$(alert+" .alert strong").html("");
				$(alert+" .alert-list").html("");
				$(alert+" .alert-list").append("<div class='alert alert-danger'><strong></strong></div>");
				$(alert+" .alert strong").html(data.msg);
			},
			loginAgain:function(alert){
				$(alert+" .alert strong").html("");
				$(alert+" .alert-list").html("");
				$(alert+" .alert-list").append("<div class='alert alert-danger'><strong></strong></div>");
				$(alert+" .alert strong").html("登录失效，请重新<a data-toggle=\"modal\" data-target=\"#accountLogin\" style='color:#337ab7'>登录</a>");
				if(alert.indexOf("manager-content") > -1){
					$(".createPro").attr("disabled",true);
				}
			}
	}
	this.errorHandler = function(XMLHttpRequest, textStatus, errorThrown) {
    }
    this.errorAlert = function(jqXHR){
        showAlert(jqXHR.responseJSON.msg);
    }
    this.successCallBack = function(data){
    	//alert(msg);
    }
};
Service.prototype = {
	constructor: Service,
	//get jsonP data
	getJsonP: function (param, callback,alert) {
		var opt = $.extend({},this.defalut,callback);
		$.ajax({
			async: false,
			jsonpCallback: 'jsonCallback',
			cache: false,
			type: 'GET',
			url: this.rootUrl + '?' + $.param(param),
			contentType: "application/json",
			dataType: 'jsonp',
			success: function(data){
				if(data.errorCode == token_invalid_errorCode){
					$(alert).find("strong").html("登录失效，请重新登录");
					return ;
				}
				opt.success();
			},
			error: this.errorHandler
		});
	},
	//find
	getAll: function (param, callback,alert) {
		var opt = $.extend({},this.defalut,callback);
		$.ajax({
			cache: false,
			type: 'GET',
			url: this.rootUrl + '?' + $.param(param),
			dataType: "json",
			success: function(data){
				if(data.errorCode == token_invalid_errorCode){
					opt.loginAgain(alert);
					return ;
				}
				if(data.errorCode != 0 ){
					opt.err(data);
					return ;
				}
				opt.success(data);
			},
			error: this.errorHandler
		});
	},

	getAsyncNotify: function (param, callback,alert) {
		var opt = $.extend({},this.defalut,callback);
		$.ajax({
			cache: false,
			type: 'GET',
			url: this.rootUrl + '?' + $.param(param),
			dataType: "json",
			success: function(data){
				if(data.errorCode == token_invalid_errorCode){
					opt.loginAgain(alert);
					return ;
				}
				if( data.errCode != 0){
					opt.err(data);
					return ;
				}
				opt.success(data);
			},
			error: this.errorHandler
		});
	},
	
	//find
	getAllAsync: function (param, callback) {
		var opt = $.extend({},this.defalut,callback);
		$.ajax({
			cache: false,
			type: 'GET',
			url: this.rootUrl + '?' + $.param(param),
			dataType: "json",
			success: function(data){
				if(data.errorCode != 0){
					alert(data.msg);
					return;
				}
				callback(data);
			},
			async: false,
			error: this.errorHandler
		});
	},

	//find data by id
	getById: function (id, callback,alert) {
		var opt = $.extend({},this.defalut,callback);
		$.ajax({
			cache: false,
			type: 'GET',
			url: this.rootUrl + '/' + id,
			data: null,
			dataType: "json",
			success: function(data){
				if(data.errorCode != 0){
					opt.err(data);
					return ;
				}
				opt.success(data);
			},
            error: this.errorHandler
		});
	},

	//find data by id
	getByIdAync: function (id, callback,alert) {
		var opt = $.extend({},this.defalut,callback);
		$.ajax({
			cache: false,
			type: 'GET',
			url: this.rootUrl + '/' + id,
			data: null,
			async: false,
			dataType: "json",
			success: function(data){
				if(data.errorCode == token_invalid_errorCode){
					opt.loginAgain(alert);
					return ;
				}
				if(data.errorCode != 0){
					opt.err(data);
					return ;
				}
				opt.success(data);
			},
			error: this.errorHandler
		});
	},
	
	getByIdAsync: function (id, data, callback) {
		if (typeof data === "function") {
			callback = data;
			data = null;
		}
		$.ajax({
			cache: false,
			type: 'GET',
			url: this.rootUrl + '/' + id,
			data: data,
			async: false,
			dataType: "json",
			success: callback,
			error: this.errorHandler
		});
	},

	//add
	add: function add(param, callback,alert){
		var opt = $.extend({},this.defalut,callback);
		if(typeof callback == "function"){
			opt.success = callback;
		}
		$.ajax({
			cache: false,
			type: 'POST',
			contentType: 'application/json',
			url: this.rootUrl,
			dataType: "json",
			data: JSON.stringify(param),
			success:  function(data){
				opt.success(data);
			},
			error: this.errorHandler
		});
	},

	//update
	update: function (param, callback) {
		$.ajax({
			cache: false,
			type: 'PUT',
			contentType: 'application/json',
			url: this.rootUrl + '/' + param.id,
			dataType: "json",
			data: JSON.stringify(param),
			success: function(data){
				if(data.errorCode !=0){
					alert(data.msg);
					return;
				}
				callback(data);
			},
			error: this.errorHandler
		});
	},

	//update
	updateEx: function (urlparam, param, callback) {
		$.ajax({
			cache: false,
			type: 'PUT',
			contentType: 'application/json',
			url: this.rootUrl + '/' + urlparam,
			dataType: "json",
			data: JSON.stringify(param),
			success: callback,
			error: this.errorHandler
		});
	},

	//delete
	remove: function (id, callback,alert) {
		var opt = $.extend({},this.defalut,callback);
		console.log('delete');
		$.ajax({
			cache: false,
			type: 'DELETE',
			url: this.rootUrl + '/' + id,
			success:  function(data){
				if(data.errorCode == token_invalid_errorCode){
					opt.loginAgain(alert);
					return ;
				}
				if(data.errorCode != 0){
					opt.err(data);
					return ;
				}
				opt.success(data);
			},
			error: this.errorHandler
		});
	}
};
$.fn.serializeObject = function () {
	var o = {};
	var a = this.serializeArray();
	$.each(a, function () {
		if (o[this.name] !== undefined) {
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
};

(function ($) {
	$.getUrlVars = function () {
		var vars = {},
			hash;
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for (var i = 0; i < hashes.length; i++) {
			hash = hashes[i].split('=');
			vars[hash[0]] = hash[1];
		}
		return vars;
	}
})(jQuery);