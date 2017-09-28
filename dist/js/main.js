/*
* @Author: SongH
* @Date:   2017-09-28 10:56:28
* @Last Modified by:   SongH
* @Last Modified time: 2017-09-28 11:12:27
*/
 if (!Detector.webgl) Detector.addGetWebGLMessage();//判断是否支持webgl
   var g_container = document.getElementById('container');
   var g_fixedLabel = new labellist();//存放固定标签的链表
   var g_userLabel = new labellist();//存放用户定义标签的链表
   var g_camera,//相机
       g_controls, //控制器
       g_scene, //场景一
       g_scene2, //场景二
       g_renderer, //webgl渲染器
       g_css3drender, //css3d渲染器
       g_fov = 15;//
   var g_initMash;
   var g_newDirection;
   init('./dist/image/1.JPG');//java可直接设置参数来传递图片路径
    initcss3d();
   initcontrols();
   render();
   addLabel(40, -222, 360, 'lable_1','./dist/image/2.jpg');
   addLabel(300, -62, -163, 'lable_2','./dist/image/3.jpg');   //ulabel();
   addLabel(456, -200, 35, 'lable_3','./dist/image/4.jpg');   //ulabel();
   // g_newDirection = direction(true, 90, 200);//
   //addLabel('hello',new THREE.Vector3( 100, -70, 300) ,180);
   animate();

   // remove when using next line for animation loop (requestAnimationFrame)
   //animate();
   resize();
   function initcontrols() {//控制器初始
       g_controls = new THREE.OrbitControls(g_camera);
       //g_controls.addEventListener('change', render); // remove when using animation loop
       // enable animation loop when using damping or autorotation
       g_controls.enableDamping = true;
       g_controls.dampingFactor = 0.25;
       g_controls.enableZoom = false;//禁用缩放(这个缩放不好用)
       g_controls.enablePan = false;//禁止鼠标右键按下之后拖动场景
       g_controls.rotateSpeed = -0.1;//旋转速度，负值表示旋转方向和箭头滑动方向相反
       //g_controls.max./distance =100;
       //g_controls.max./distance = 1.5;
       // world
   }
   function init(url) {//初始化场景
       this.url = url !== undefined ? url:'./dist/image/1.JPG';//设置初始化背景
       g_scene = new THREE.Scene();//创建场景
       //g_scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

       g_renderer = new THREE.WebGLRenderer();//创建渲染器
       //g_renderer.setClearColor( scene.fog.color );
       //g_renderer.setPixelRatio( window.devicePixelRatio );
       g_renderer.setSize(window.innerWidth, window.innerHeight);//设置渲染器大小
       g_container.appendChild(g_renderer.domElement);
       g_camera = new THREE.PerspectiveCamera(g_fov, window.innerWidth / window.innerHeight, 1, 1000);//创建透视相机
       g_camera.setFocalLength(15);//设置相机视场，即视角
       g_camera.position.z = 100;//设置照相机位置为(0,0,100)
       g_camera.target = new THREE.Vector3(0, 0, 0);
       var geometry = new THREE.SphereGeometry(500, 70, 70);//创建球体,半径为500，横纵分割面的数量均为70(数值越大球体越圆滑)
       geometry.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
       var material = new THREE.MeshBasicMaterial({
           map: THREE.ImageUtils.loadTexture(url)//以全景图为背景的自发光的材料
       });
       g_initMash = new THREE.Mesh(geometry, material);//初始化球体
       g_scene.add(g_initMash);//将球体加入场景scene
       window.addEventListener('resize', onWindowResize, false);//窗口大小自适应
   }
   function initcss3d() {//css3场景、渲染器初始化，用于渲染添加的div盒子（添加的所有标签均为div盒子，方向箭头除外）
       g_scene2 = new THREE.Scene();
       g_css3drender = new THREE.CSS3DRenderer();
       g_css3drender.setSize(window.innerWidth, window.innerHeight);
       g_css3drender.domElement.style.position = 'absolute';//设置被cssrender渲染的div的位置属性,如果不设置将看不到
       g_css3drender.domElement.style.top = 0;
       //g_container = document.getElementById('container');
       document.getElementById('container').appendChild(g_css3drender.domElement);//将渲染过的div盒子加到container下

   }
   function change(url, dropdirection, isnorth, rotate, long) {//更新图片。dropdirection是要删除的direction实例化后的名字(默认是ns)如var we = direction(false, 180);的we
       g_scene.remove(g_initMash); //先将初始化的球体删去              //  newdirection是方向的名字,后三个选项和direction对的名字相同;
       removeallllable();//删除固定标签
       g_userLabel.removelabel();//删除用户自定义标签
       var geometry = new THREE.SphereGeometry(500, 70, 70);//新建球体
       geometry.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
       var material = new THREE.MeshBasicMaterial({
           map: THREE.ImageUtils.loadTexture(url)//从url中加载图片。可以是路径也可以是图片特殊的编码
       });
       this.dropdriection = dropdirection !== undefined ? dropdirection : g_newDirection;//设置传入参数的默认值
       this.isnorth = isnorth !== undefined ? isnorth : true;//设置传入参数的默认值
       this.rotate = rotate !== undefined ? rotate : 0;//设置传入参数的默认值
       this.long = long !== undefined ? long : 300;//设置传入参数的默认值
       g_initMash = new THREE.Mesh(geometry, material);//将初始球体更换成新的球体
       g_scene.add(g_initMash);//场景加入球体
       // removedirection(this.dropdriection);//删除原场景中的方向标
       // g_newDirection = direction(this.isnorth, this.rotate, this.long);//新建方向标
       $('#direction').text('关闭方向');//改变控制台中的显示
       render();//刷新渲染器
      if(url =='./dist/image/2.jpg'){
        addLabel(475, -154, -5, 'lable_2','./dist/image/1.JPG');
      }else if(url =='./dist/image/1.JPG'){
           addLabel(40, -222, 360, 'lable_1','./dist/image/2.jpg');
           addLabel(300, -62, -163, 'lable_2','./dist/image/3.jpg');
            addLabel(456, -200, 35, 'lable_3','./dist/image/4.jpg');  
      }else if (url=='./dist/image/3.jpg') {
        addLabel(150, -68, 331, 'lable_2','./dist/image/1.JPG');
      }else if (url=='./dist/image/4.jpg') {
        addLabel(402, -255, 149, 'lable_2','./dist/image/1.JPG');
      }

   }
   function resize() {//场景大小缩放
       var big = document.getElementById('big');
       var small = document.getElementById('small');
       var spots = [], touches, timer;
       var startPosition1, endPosition1, startPosition2, endPosition2, startlong, endlong, notdoubel;
       notdoubel = true;
       var el = document.getElementById('container');
       el.addEventListener('mousewheel', onDocumentMouseWheel, false);
       el.addEventListener('DOMMouseScroll', onDocumentMouseWheel, false);
      
   }
   function direction(isnorth, rotate, long) { //添加方向箭头，isnorth如果为true则为南北、false则为东西,rotate表示北或者西方向对于x轴的旋转角度,long表示距离0点的距离默认300（可选）
       var url = 'pointer';
       var geometry = new THREE.PlaneGeometry(150, 150);//新建平面
       var i = 0;
       var twodirectionnumber = 0;
       var endnumber = 2;
       this.twodirection = [];//为了方便操作两个方向标，新建数组来存放
       this.long = long !== undefined ? long : 300;
       if (isnorth == false) {
           i = i + 2;
           endnumber += 2;
       }
       for (i; i < endnumber; i++) {//利用for循环来加入两个方向，当isnorth为true的时候i的初始值为0，根据四个方向的名字来看会加入pointer0和pointer1两个方向标；若false则为东西两个方，加入pointer2和pointer3两个方向标
           var material = new THREE.MeshBasicMaterial({//新建材料
               map: THREE.ImageUtils.loadTexture((url + i) + '.png'),
               transparent: true//设置背景透明，若不设置则背景是黑色
           });
           // var  mesh = new THREE.Mesh(geometry, material);
           var plane = new THREE.Mesh(geometry, material);
           plane.position.x = (Math.pow(-1, i + 1)) * this.long * Math.cos(THREE.Math.degToRad(rotate) + Math.pow(-1, i) * Math.PI);
           plane.position.y = -300;
           plane.position.z = (Math.pow(-1, i)) * this.long * Math.sin(THREE.Math.degToRad(rotate) + Math.pow(-1, i) * Math.PI);
           plane.rotateX(-Math.PI / 2);
           plane.rotateZ(Math.pow(-1, i + 1) * ((Math.PI / 2) + Math.pow(-1, i + 1) * THREE.Math.degToRad(rotate)));
           g_scene.add(plane);
           this.twodirection[twodirectionnumber] = plane;//分别写入两个方向标
           twodirectionnumber++;
       }
       return this.twodirection;//返回值为存放两个方向标的数组
   }
   //下面是存放标签链表的定义
   function labelnode(element) {//链表节点,正确应为labelnode(element,context)，为了程序正确运行还未添加
       this.element = element;
       this.next = null;
       this.context = null;//此处正确应该是this.context = context;
   }
   function labellist() {//链表构造
       this.head = new labelnode("head");//头结点
       this.inserthead = inserthead;//头部插入新结点
       this.removehead = removehead;//头删除结点
       this.traversal = traversal;//遍历链表;
       this.hidelabel = hidelabel;//隐藏所有标签(原理是遍历链表)
       this.showlabel = showlabel;//显示所有标签
       this.removelabel = removelabel;//删除所有标签
       this.empty = empty;//判断链表是否为空
   }
   function empty() {//判空
       return this.head.next == null;
   }
   function inserthead(element) {//头部插入新结点
       var head = this.head;
       var newlabel = new labelnode(element);
       newlabel.next = head.next;
       head.next = newlabel;
   }
   function removehead() {//头删除结点
       var head = this.head;
       head.next = head.next.next;
   }
   function traversal() {//遍历链表
       var p = this.head;
       var length = 0;
       while (p.next != null) {
           p = p.next;
           length++;
       }
       return length;
   }
   function hidelabel() {//隐藏所有标签(原理是遍历链表)
       var p = this.head;
       while (p.next != null) {
           p.element.visible = false;
           p = head.next;
       }
   }
   function showlabel() {//显示所有标签
       var p = this.head;
       while (p.next != null) {
           p.element.visible = true;
           p = p.next;
       }
   }
   function removelabel() {//删除所有标签
       var head = this.head;
       while (head.next != null) {
           g_scene2.remove(head.next.element);
           this.removehead();
       }
   }
   function addLabel(x, y, z, lable_1,url) {//添加固定标签,一般为指向箭头。x,y,z是标签的三维坐标,url是点击后跳转的页面
       var element = document.createElement('div');
       //g_container.appendChild(element);
       element.setAttribute('id', 'llabel'+lable_1);
       element.setAttribute('class', 'intoroom');
       // element.style.background = new THREE.Color(Math.random() * 0xffffff).getStyle();
       //element.innerHTML='66666666666666666666666666666666';
       element.addEventListener('click', function () {//设置监听事件，点击后执行change方法跳转到另一个界面,这个监听不全面，还没实现加载第二张图片之后显示标签的功能
           change(url);
       });
       element.addEventListener('touchstart', function () {//设置监听事件，点击后执行change方法跳转到另一个界面，这个监听不全面，还没实现加载第二张图片之后显示标签的功能
           change(url);
       });
       var object = new THREE.CSS3DObject(element);//新建css3d对象
       object.position.x = x;
       object.position.y = y;
       object.position.z = z;
       g_scene2.add(object);
       render();
       g_fixedLabel.inserthead(object);
   }
   function hidellabel() {//隐藏固定标签
       g_fixedLabel.hidelabel();
   }
   function showllabel() {//显示固定标签
       g_fixedLabel.showlabel();
   }
   function removeallllable() {//删除固定标签
       g_fixedLabel.removelabel();
   }

//窗口自适应
   function onWindowResize() {

       g_camera.aspect = window.innerWidth / window.innerHeight;//设置画面宽高比
       g_camera.updateProjectionMatrix();//更新相机矩阵
       g_renderer.setSize(window.innerWidth, window.innerHeight);//更新webgl渲染器大小，如果没有的话图像将会错位
       g_css3drender.setSize(window.innerWidth, window.innerHeight);//更新css3d渲染器大小，如果没有的话图像将会错位
       render();//更新渲染器
   }
//将会循环执行来刷新场景
   function animate() {

       requestAnimationFrame(animate);//循环animate()方法

       //g_controls.update(); // required if g_controls.enableDamping = true, or if g_controls.autoRotate = true
       render();

   }
//更新渲染器
   function render() {

       g_renderer.render(g_scene, g_camera);
       g_css3drender.render(g_scene2, g_camera);
   }
   //鼠标滚轮缩放
   function onDocumentMouseWheel(event) {

       // WebKit

       if (event.wheelDeltaY) {

           g_fov = g_fov - event.wheelDeltaY * 0.01;

           // Opera / Explorer 9

       } else if (event.wheelDelta) {

           g_fov -= event.wheelDelta * 0.05;

           // Firefox

       } else if (event.detail) {

           g_fov += event.detail * 0.05;

       }
       g_camera.setFocalLength(g_fov);//更新相机视场
       render();
   }
   var raycasterCubeMesh;//触摸点显示
   var raycaster = new THREE.Raycaster();//定义射线
   var mouseVector = new THREE.Vector3();//定义向量

   document.getElementById('container').addEventListener("touchstart", ontouchstart, false);//配置触摸位置跟踪事件（一个小红圈）
   document.getElementById('container').addEventListener("touchmove", ontouchmove, false);
   // document.getElementById('container').addEventListener("touchend", ontouchout, false);//触摸松开以后不显示小红圈
   render();//刷新渲染器

   var activePoint;
   var intersects;
   var text = document.getElementsByClassName('vrshow_comment')[0];//获取文本框输入内容

   function ontouchstart(event) {//获取点击位置
       var touch = event.touches[0];
       mouseVector.x = 2 * (touch.clientX / window.innerWidth) - 1;//设置触摸点对应的x
       mouseVector.y = -2 * (touch.clientY / window.innerHeight) + 1;//设置触摸点对应的y
       raycaster.setFromCamera(mouseVector.clone(), g_camera);
       intersects = raycaster.intersectObjects([g_initMash]);//获取从相机摆放点射出射线和球体相交的位置（后面称为交点），也就是触摸点位置所对应的3维坐标的位置
       // if (raycasterCubeMesh) {
       //     g_scene.remove(raycasterCubeMesh);
       // }
       activePoint = null;//初始化活跃点
       if (intersects.length > 0) {
           var mat = new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.5});
           var sphereGeometry = new THREE.SphereGeometry(10);
           raycasterCubeMesh = new THREE.Mesh(sphereGeometry, mat);
           raycasterCubeMesh.position.copy(intersects[0].point);
           // g_scene.add(raycasterCubeMesh);
           activePoint = intersects[0].point;
       }

   }
   function ontouchmove(event) {//获移动位置
       var touch = event.touches[0];
       mouseVector.x = 2 * (touch.clientX / window.innerWidth) - 1;
       mouseVector.y = -2 * (touch.clientY / window.innerHeight) + 1;
       raycaster.setFromCamera(mouseVector.clone(), g_camera);
       intersects = raycaster.intersectObjects([g_initMash]);//获取从相机摆放点射出射线和球体相交的位置（后面称为交点），也就是鼠标位置所对应的3维坐标的位置
       // raycasterCubeMesh.position.copy(intersects[0].point);//将小红圈的位置设置到交点
       activePoint = intersects[0].point;//将交点赋给活跃点
   }
   function ontouchend() {//触摸结束，写标注内容
       text.style.display = 'block';
       var textarea = document.getElementById('usercomm');//获取文本框
       textarea.focus();//获取文本框焦点
       textarea.select();
   }
   function cancel_comment() {//不进行标记，删除文本框内容
       var textarea = document.getElementById('usercomm');
       textarea.value = "";
       text.style.display = 'none';
   }
  // g_userLabel.inserthead(object);//在用户自定义标签链表中插入新节点
   // }
   function onMouseMove(event) {//获取鼠标位置，在下面的
       mouseVector.x = 2 * (event.clientX / window.innerWidth) - 1;
       mouseVector.y = -2 * (event.clientY / window.innerHeight) + 1;
       raycaster.setFromCamera(mouseVector.clone(), g_camera);
       intersects = raycaster.intersectObjects([g_initMash]);
       if (raycasterCubeMesh) {
           g_scene.remove(raycasterCubeMesh);
       }
       activePoint = null;
       if (intersects.length > 0) {
           var points = [];
           points.push(new THREE.Vector3(0, 0, 0));
           points.push(intersects[0].point);
           var mat = new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.5});
           var sphereGeometry = new THREE.SphereGeometry(10);
           raycasterCubeMesh = new THREE.Mesh(sphereGeometry, mat);
           raycasterCubeMesh.position.copy(intersects[0].point);
           g_scene.add(raycasterCubeMesh);
           activePoint = intersects[0].point;
       }
   }
   // function onaddlabel() {//点击之后切换标记状态
   //     if (g_controls.enabled === true) {
   //         g_controls.enabled = false;//禁用控制器，让场景不能旋转
   //         // document.getElementById('container').addEventListener("mousemove", onMouseMove, false);配置标记点的鼠标事件
   //         //document.getElementById('container').addEventListener("mousedown", addulabel, false);
   //         document.getElementById('container').addEventListener("touchend", ontouchend, false);//配置触摸松开以后添加标签的事件
   //         document.getElementById('container').removeEventListener("touchend", ontouchout, false);//在进行标注界面的时候可以显示手指离开的点，方便用户选点
   //         $('#addtag').text('退出标记');
   //     } else {
   //         g_controls.enabled = true;//启动控制器，场景可以旋转
   //         //document.getElementById('container').removeEventListener("mousemove", onMouseMove, false);删除监听
   //         //document.getElementById('container').removeEventListener("mousedown", addulabel, false);
   //         document.getElementById('container').removeEventListener("touchend", ontouchend, false);
   //         document.getElementById('container').addEventListener("touchend", ontouchout, false);//重新配置触摸结束后红点的消失
   //         g_scene.remove(raycasterCubeMesh);//为了看起来违和，在启动控制器的时候删除红点
   //         $('#addtag').text('开始标记');
   //     }

   // }