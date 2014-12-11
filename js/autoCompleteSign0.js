(function($){

	$.fn.autoCompleteSign = function(option)
	{
		var defaults = {
			url : "http://job.tianji.com/career/recruiter/search/company",
			length:"",
			max:5,
			maxnum:5,
			name:'sign',
			popWidth:355,
			defaultValue:'多个标签用 "空格" 区分,每个标签长度不超过10个汉字',
			check:'checkbox',
			keyArray : [13,17,18,38,40]//存放功能键
		}

		var autoComplete = $.extend(defaults,option);
		var index = 0;

		var $this = $(this);

		var timer = null;
		//var oldValue = "";		

		$this.on("click",function(){

			$this.find(".ms-txt-component").focus();
			if($this.find(".ms-txt-component").val() == autoComplete.defaultValue){

				$this.find(".ms-txt-component").val("");

			}

		});


		$this.find(".ms_checkInput").attr('name',autoComplete.name);
		$this.find(".ms-txt-component").val(autoComplete.defaultValue);


		$this.find(".ms-txt-component").on("keyup",function(event){
			
			var oVal=encodeURIComponent($(this).val());

			var bKey = false; //判断输入内容是否为功能键

	        for(var i=0;i<autoComplete.keyArray.length;i++)
	        {
	            if(event.keyCode==autoComplete.keyArray[i])
	            {
	                bKey=true;
	            }
	        }

	        /*
	        //判断和上次输入是否相同
	        if(oldValue == $(this).val())
	        {
	        	bKey=true;
	        }
	        oldValue = $(this).val();
	        */

	        if(!bKey && $(this).val()!="")
		    {
		    	if(timer)
		    	{
		    		clearTimeout(timer);
		    	}

		    	timer = setTimeout(function(){


		    		$.ajax({

					    url: autoComplete.url+'?name='+oVal+"&v="+new Date().getTime(),
					    dataType: 'jsonp',
					    jsonp:'callback',
					    success:function(data)
					    {

					    	//console.log(data)
					    	var aResult = [];
							if(data != null)
							{
								data = {"items":[{"logoFileName":"/upload/corps/cp_logo/000/268/710/feed_b5fc160673ade88d4e3ccebd783b81bb.png","staffCount":48,"followerCount":21,"name":"B&Q百安居","id":268710},{"logoFileName":"/images/new_companies/image/photo_2.jpg","staffCount":11,"followerCount":7,"name":"B&Ccompanyhongkong","id":180703},{"logoFileName":"/upload/corps/cp_logo/000/757/066/feed_64ebc4d1a6f27438c1e0abb67da113d0.jpg","staffCount":113,"followerCount":198,"name":"BTV","id":757066},{"logoFileName":"/images/new_companies/image/photo_2.jpg","staffCount":13,"followerCount":8,"name":"BNC","id":868689},{"logoFileName":"/images/new_companies/image/photo_2.jpg","staffCount":8,"followerCount":7,"name":"BDT","id":174972}],"totalItems":86};
								aResult = data.items;	
							}
							
						  	var keyWords = $this.val();

					        var strLi="";//构建li时拼li的字符串。
					        var str="";//存放msok/mserror字符串
					        var $msOk = $(".autoC-ok-component");
					        //var $msError = $(".autoComplete-ms-error"); 
					        
					        var strA = "";

				            $msOk.remove();
				            //$msError.remove();

				            //当过滤出来的数组长度大于0的时候我们创建DOM元素构建li列表，存入str
				            if(aResult.length>0)
				            { 
				                //设置下拉列表最多显示几条数据
				                //if(aResult.length>$this.max) aResult.length = $this.max;

				                for(var i=0;i<aResult.length;i++)
				                {
				                    strLi += "<li code="+aResult[i].id+">"+aResult[i].name+"</li>";
				                }
				                str = "<div class='autoC-ok-component' style='width:"+autoComplete.popWidth+"px'>"+
				                      "<ul class='autoC-list-component'>"+
				                      strLi+
				                      "</ul></div>";
				            }
				            //数组长度为0并且文本框里面有内容的时候创建 ms-error提示信息，并将其存入 str
				            if((aResult.length==0)&&(keyWords!=""))
				            {
				            	return;
				                //str = "<div class='autoComplete-ms-error'>您输入的公司名称不存在，请重新输入</div>"; 
				            }

				            $("body").append($(str));

				            index=0;//每次都要重置索引号。因为列表有按键等操作，不重置，有些时候会选中下面的。
				            $(".autoC-ok-component").find("li").eq(index).addClass("active");
				            msTipPosition()

				            var aLi = $(".autoC-ok-component").find("li");

				            aLi.on("mouseover",function(){
				            	
					            aLi.removeClass("active");
					            $(this).addClass("active");
					            index = $(this).index();

					        });

					        aLi.on("click",function()
				            {
				            	var code = $(this).attr('code');
				            	var name = $(this).html();

					            var strSign = '<span class="ms-selected-item" rel='+code+'><span class="text">'+name+'</span><span class="delete-component">删除</span></span>';
					            $(strSign).insertBefore($this.find(".ms-txt-component"));
					            $this.find('.ms-txt-component').val('');
					            $(".autoC-ok-component").remove();

					            setValue();
				            })

					    }
					})

		    	},300)
				
			}
	        var aLi = $(".autoC-ok-component").find("li");
	        if(event.keyCode==13)
            {            	
            	event.stopPropagation();

            	if(aLi.length==0)
	            {
	                if($.trim($this.find('.ms-txt-component').val()) !="");
	                {
	                	var name = $this.find('.ms-txt-component').val();

	                	if($.trim(name) == ""){ return };
	                	if(addValidate(name)){

	                		//发送ajax请求
	                		setTimeout(function(){

	                			var strSign = '<span class="ms-selected-item" rel='+123+'><span class="text">'+name+'</span><span class="delete-component">删除</span></span>';
			                	$(strSign).insertBefore($this.find(".ms-txt-component"));
			                	$this.find('.ms-txt-component').val("");
			                	setValue();

	                		},500)
		                	
		                }
	                }

	                return;
	            }

	            var name = $(".autoC-ok-component").find("li.active").html();
	            var code = $(".autoC-ok-component").find("li.active").attr("code");

	            if($.trim(name) == ""){ return };
	            if(addValidate(name)){

	            	var strSign = '<span class="ms-selected-item" rel='+code+'><span class="text">'+name+'</span><span class="delete-component">删除</span></span>';

		            $(strSign).insertBefore($this.find(".ms-txt-component"));
		            $this.find('.ms-txt-component').val('');
		            $(".autoC-ok-component").remove();
		            setValue();

	            }
	            
            }
            
            switch(event.keyCode)
	        {
	            case 38:
	                index--;
	                if(index==-1)index=aLi.length-1;
	                //console.log(index)
	                aLi.removeClass("active");
	                aLi.eq(index).addClass("active");
	                break;                
	            case 40:
	                index++;
	                if(index==aLi.length)index=0;
	                //console.log(index)
	                aLi.removeClass("active");
	                aLi.eq(index).addClass("active");
	                break;
	        }


		})

	
		$this.find(".ms-txt-component").on("keydown",function(event){

			var lastA = $this.find(".txt-box-component").find(".ms-selected-item:last");
	        if(event.keyCode==8)
	        {
	            if($(this).val()=="")
	            {
	                if(autoComplete.check=="checkbox")
	                {
		                lastA.remove();

		                setValue();
	                }
	            }
	        }

		})


		$this.find(".txt-box-component").on("click",".delete-component",function(){

			var delEle = $(this).parent()
	    	if(autoComplete.check=="checkbox")
	    	{
	    		delEle.remove();
	    		setValue();
	    	}
	        
	    })


		var setValue = function(){

			var allSpan = $this.find(".txt-box-component").find(".ms-selected-item");
			var txt = $this.find(".ms_checkInput");
			var arr = [];
			allSpan.each(function(){

				var code = $(this).attr('rel');

				arr.push(code);

			})

			txt.val(arr.join(','));

		}

		var addValidate = function(name){

			var allSpan = $this.find(".txt-box-component").find(".ms-selected-item");
			var arr = [];
			allSpan.each(function(){

				var _name = $(this).find('.text').html();
				arr.push(_name);

			})

			if(arr.length>=autoComplete.maxnum)
			{
				$this.find(".ms-txt-component").val('');
				$(".autoC-ok-component").remove();
				return false;
			}

			for(var i=0,len=arr.length;i<len;i++){

				if($.trim(name) == arr[i]){

					$this.find(".ms-txt-component").val('');
					$(".autoC-ok-component").remove();
					return false;
					break;
				}				
			}

			return true;

		}



		$("body").on('click','.signList',function(){

			var name = $(this).html();
			var code = $(this).attr('code');
			var strSign = '<span class="ms-selected-item" rel='+code+'><span class="text">'+name+'</span><span class="delete-component">删除</span></span>';

			if($.trim(name) == ""){ return };
	        
	        if(addValidate(name)){

	        	$(strSign).insertBefore($this.find(".ms-txt-component"));
	        	setValue();
	        }
			
		})


		//计算 ms-ok/提示框的位置。
		var msTipPosition = function()
		{
			var left = $this.offset().left;
            var top = $this.offset().top+$this.height();
            $(".autoC-ok-component").css({"left":left,"top":top});
		};

		$(document).on("click",function(){
			
			$(".autoC-ok-component").remove();
		})

		
	}

})(jQuery)


