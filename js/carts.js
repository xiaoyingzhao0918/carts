//用cookie实现购物车的存储

//变量区域
var list=[];  //渲染数据的列表(用于存放蘑菇街list数组中的数据)

//加载数据
$.ajax("https://list.mogujie.com/search",{
	dataType:"jsonp"
})
.then(render)

function render(res){
	list=res.result.wall.list;
	var html=template("box-item",{list:list});
	$(".box-container").html(html);
}

//当有一个商品点击加入购物车时，我把商品的数据存入到cookie之中，这个时候我们也就算是成功加入了购物车
//利用事件委托给父级绑定一个事件，当子级按钮（加入购物车）触发事件时，我们分辨谁是当前点击的元素
$(".box-container").on("click","button",addCart);
function addCart(evt){
	var e=evt || window.event;
	var target=e.target || e.srcElement;
	var index=$(target).attr("data-index");  //获取当前点击元素的data-index属性(当前元素的索引号)；
	//console.log(index,list[index]);  //利用商品下标获取到了对应的商品数据=>list[index]
	var iid=list[index].iid;
	//把商品的iid放入cookie之中，
	//1.判定当前页面是否存在carts cookie中；
	if($.cookie("carts")){ //如果当前页面存在carts cookie中
		//将cookie中数据转换成数组操作
		var cartsList=JSON.parse($.cookie("carts")); //解析$.cookie("carts")并放入数组cartsList中；
		//console.log(cartsList);
		//判定当前的iid是否已经存在于cartList中；如果已经存在那么我就让num属性自增就可以；若不存在我再去创建一个新的结构
		var hasSameId=cartsList.some(function(item,index){
			if(item.id===iid){  //如果id相同，num自增
				item.num++;
			};
			return item.id===iid;
		})
		if(!hasSameId){     //如果id不相同，创建新数据
			var item={   //设置初始item
				"id":iid,
				"num":1    
			}
			cartsList.push(item);  //将初始item放入数组cartsList中
		}		
		$.cookie("carts",JSON.stringify(cartsList));//把商品的iid放入cookie之中
	}else{   //如果当前页面不存在carts cookie中		
		var cartsList=[//建立商品数据在cookie中的初始结构
			{
				"id":iid,
				"num":1
			}		
		]
		$.cookie("carts",JSON.stringify(cartsList)); //把商品的cartsList放入cookie之中，（即name为carts，value为cartsList的字符串形式）
	}
	console.log($.cookie("carts"));  //输出cookie中的carts；
	
	$("#showNum").html(getCartsNum());  //调用getCartsNum()函数，获取购物车中的商品数量，并使其在页面#showNum中显示
}

//获取购物车中商品的数量
function getCartsNum(){   
	if(!$.cookie("carts")){return 0;}
	var cartsList=JSON.parse($.cookie("carts"));
	var count=0;
	for(var i=0;i<cartsList.length;i++){
		count+=Number(cartsList[i].num);
	}
	return count;
}
console.log(getCartsNum());

//当点击购物车图标时清空购物车
$(".show").on("click",clearCarts);
function clearCarts(){
	var bool=confirm("是否清空购物车");
	if(bool){
		$.cookie("carts","");
		$("#showNum").html(getCartsNum());
	}
}

//当点击结算按钮时，跳转到showCart结算页面
$(".jiesuan").on("click",tiaozhuan);
function tiaozhuan(){
	location.href="showCart结算.html";
}
