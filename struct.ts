type attrState = "quote"|"key"|"attrstart"|"value"|"quoteStart"|"quoteEnd"|"equo";
type propState = "start"|"num"|"class"|"id"|"attr"|"targ"|"name";
type attrOnep = {
    key:string
    value:string
}
type ele = HTMLElement
interface Ev extends Event{
    target:ele
}
type SpecailHas ={
    on:any
    ,data:Object
    ,style:Object
    ,attr:Object
    ,$:string
}
type DomRus = {
    docs:HTMLElement[]
    ,has:SpecailHas
}
type HivOp = {
    el:string|HTMLElement
    dom:object
    ,style?:object
    ,data?:Data
    ,methods?:object
    ,computed?:object
    
}
class EventManager {
    arevs:ArgsEvent[]
    constructor( ){
        this.arevs = [];
    }
    addDocNode(doc:HTMLElement,str:string){
        
    }

}interface initFuncOpJson {
    func?:Function
    args?:{
        [key:string]:any
    }
    id?:Function
}
type initFuncName = "troggleSet"
interface Tool {
    initFunc(name:string,args:initFuncOpJson):Function
    extend<T,K>(obj1:T,obj2:K):T&K
}
interface Args{
    dom:HTMLElement
    [key:string]:any
}
var Tool:Tool=Tool;
type SpecailProp = "on"|"data"|"style"|"$"|"attr"


class SpecailFunc{
    domRus:DomRus
    ele : HTMLElement
    constructor(domRus?:DomRus, ele?: HTMLElement){
        if(domRus && ele){
            this.init(ele,domRus);
        }
    }
    init(ele : HTMLElement,domRus:DomRus){
        this.domRus = domRus;
        this.ele = ele;
    }
    do(x:SpecailProp){
        var has = this.domRus.has;
        switch (x){
            case "on":
            var onObj = this.domRus.has[x]
            //添加事件监听
            var rusObj = new ArgsEvent (onObj,has.data,this.ele)
            return rusObj;

            // case "data":
            // break;

            case "style":
            Tool.extend( this.ele.style,this.domRus.has[x] );
            break;

            case '$':
            this.ele.innerHTML += this.domRus.has[x]
            break;
            
            case "attr":
                // for (let i in has.attr){
                //     console.log("setter")
                //     Object.defineProperty(this.ele,i,{
                //         enumerable: true,
                //         configurable: true,
                //         set (v){
                //             console.log("good")
                //             has.attr[i].set(v);
                //         }
                //         ,get(){
                //             console.log("good")
                //             return has.attr[i].get();
                //         }
                //     })
                // }
            break;
        }
    }
}
class Prop{
    id : string
    className :string
    targName :string
    num:number
    cmd:string[]
    name:string
    attr:Array<attrOnep>
    constructor(str:string){
        var arr = str.split(',');
        var sar:string[]
        if( arr.length>0 ){ //有命令时
            sar = arr.pop()!.split('');
        }else{
            sar = str.split('');
        }
        this.cmd = arr;

        //add End to sar
        sar.push('\0');
        var len = sar.length;

        var reg = {
            number:/[0-9]/
            ,word:/[\w\-\_]/
        }
        var state : propState;
        var attrst : attrState;

        var frequency  = 0;
        var now = ""
        state = "start"
        attrst = "attrstart"
        this.attr = [];
        this.className = ""
        this.id = ""
        this.targName = "div"
        this.num = 1;
        var onep : attrOnep;
        onep = {
            key:""
            ,value:""
        }
        for (var x = 0;x<len;x++){

            //if is normal head
            switch (state){
                case "start":
                    if( reg.number.test( sar[x] ) ) {state = "num" ;x--;continue;}
                    if( reg.word.test(sar[x])) {state = "targ";x--;continue;}
                    if( sar[x] == '.' ) {state = "class";continue;}
                    if( sar[x] == '#') {state = "id";continue;}
                    if ( sar[x] == '[') {
                        state = "attr";continue;
                    }
                    if( sar[x] == ':'){frequency = 0; state = "name";continue;}
                break;
                
                case "name":
                    if( sar[x] == ':'){
                        frequency =1;
                        now = "";
                    }else{
                        if(frequency&&reg.word.test( sar[x] )){
                            now += sar[x];
                        }else{

                            //frequncy maybe = 0;
                            if(now){
                                this.name = now;
                                now = "";
                            }
                            state = "start"
                            frequency = 0;
                            x--;
                        }
                    }
                break;

                case "num":
                    if( reg.number.test( sar[x] ) ) {
                        now += sar[x];
                    }
                    else{
                        if(sar[x] == "*"){
                            this.num = Number(now);
                            now = "";
                            state = "start"
                        }
                        else{
                            throw Error("need * after number")
                        }
                    }
                break;

                case "targ":
                    if( reg.word.test(sar[x])) {
                        now += sar[x];
                    }else{
                        this.targName = now;
                        now = ""
                        state = "start"
                        x--;
                    }
                break;

                case "id":
                    if( reg.word.test(sar[x])) {
                        now += sar[x];
                    }else{
                        this.id = now;
                        now = ""
                        state = "start"
                        x--;
                    }
                break;
                
                case "class":
                    if( reg.word.test(sar[x])) {
                        now += sar[x];
                    }else{
                        this.className += this.className ? " "+now:now;
                        now = ""
                        state = "start"
                        x--;
                    }
                break;

                case "attr":
                    if(sar[x] == "]"){
                        state = "start"
                        attrst = "attrstart"
                        now = "";
                        break;
                    }else{
                        switch (attrst){
                            case "attrstart":
                                if( reg.word.test(sar[x])) {
                                    attrst = "key";
                                    x--;
                                    continue;
                                }
                                if( sar[x] == '=' ) {
                                    attrst = "equo";
                                    x--;
                                    continue;
                                }
                                if( sar[x] == "'") {
                                    attrst = "quote" ;
                                    x--;
                                    continue;
                                }
                            break;
                            
                            case "key":
                                if( reg.word.test(sar[x])) {
                                    now += sar[x];
                                }else{
                                    onep = {
                                        key:now
                                        ,value:""
                                    }
                                    attrst = "attrstart";
                                    now = ""
                                    x--;
                                }
                            break;

                            case "equo" :
                                if(onep.key !== ""){
                                    attrst = "quote"
                                }else{
                                    attrst = "attrstart"
                                }
                            break;

                            case "quote":
                                if(sar[x] == "'"){
                                    attrst = "quoteStart"
                                }else{
                                    if( reg.word.test(sar[x])) {
                                        attrst = "key";x--;continue;
                                    }
                                }
                            break;

                            case "quoteStart":
                                if(sar[x] == "'"){
                                    attrst = "quoteEnd";
                                    x--;
                                }else{
                                    now += sar[x]
                                }
                            break;    
                        
                            case "quoteEnd":
                                if(onep.key !=="" ){
                                    onep.value = now
                                    this.attr.push (onep);
                                    now = ""
                                    attrst = "attrstart"
                                }else{
                                    now = ""
                                    attrst = "attrstart"
                                }
                            break;
                        }
                    }
                break;
            }
        }
    }
}
var Hif ={
    creatEle ( prop :Prop ):HTMLElement{
        var doc = document.createElement(prop.targName);
        if ( prop.id ) doc.id = prop.id
        if( prop.className ) doc.className = prop.className;

        //add element attrs
        var len = prop.attr.length;
        for (let x = 0; x < len ; x++){
            var onep = prop.attr[x];
            doc.setAttribute(onep.key, onep.value); 
        }
        return doc;
    }
    ,addDocs (srDoc : HTMLElement ,domRus:DomRus){
        domRus.docs.forEach((x) => {
            srDoc.appendChild(x)
        });
    }

    //js helper
    ,js:{
        getClass(obj:Object):string{
            return Object.getPrototypeOf(obj).constructor.name;
        }
        ,isPrimitive (value:any) {
            return typeof value === 'string' || typeof value === 'number'
        }
        ,isArray (obj){
            var str:string = Object.prototype.toString.call(obj)
            return str === "[object Array]";

            // return obj instanceof Array;

            // return Array.isArray(obj);
        }
        ,getHash(n:number){
            function getRandom (n:number):number{
                return parseInt ( Math.random()*n+"" )
            }
            var str = new Date().valueOf() + ":DATE";
            for (var x =0;x<n;x++){
                str += getRandom(n)
            }
            return str;
        }
        ,getType (v:any){ //get typeof v
            var ty: "string" | "number" | "boolean" | "symbol" | "undefined" | "object" | "function" |"null" | "array" = typeof v;

            if(ty === "object"){
                switch(true){
                    case !v :
                    ty = "null"
                    break;

                    case Array.isArray(v):
                    ty = "array"
                    break;
                }
            }
            return ty;
        }
        ,Map:(function (){
            var ccd = Object.create(null);
            return function MyMap(obj?:object,str?:string){
                if(typeof obj !== "object"){
                    return ccd;
                }
                function has(obj){
                    for (var x in ccd){
                        for ( var y in ccd[x] ){
                            if( ccd[x][y] == obj ){
                                return {
                                    x:x,
                                    y:y
                                }
                            }
                        }
                    }
                    return false;
                }
                var ha = has(obj)
                if(ha){
                    if(str){
                        if( ha.x === str){
                            return ha;
                        }
                        else{
                            return false;
                        }
                    }else{
                        return ha;
                    }
                }else{
                    if(!str) {
                        return false;
                    }
                    ccd[str] = ccd[str]||[]
                    ccd[str].push(obj);
                    return {
                        x:str
                        ,y:(ccd[str].length-1)+""
                    }
                }
            }
        })()
        ,arrayFuncs :[
            'push',
            'pop',
            'shift',
            'unshift',
            'splice',
            'sort',
            'reverse'
        ]
    }
    ,func:{
        id(n:number){
            var id = Hif.js.getHash(n);
            return function getId(){
                return id;
            }
        }
    }
    ,warn(str,substr?){
        console.warn(str)
        throw new Error(str)
    }
    ,doSomething(fr:string,job:string){
        console.log("this is watch for : "+fr+", and will do : Array."+ job);
    }
    ,defineReactive (obj,key,val, dtObject ) {
        var property = Object.getOwnPropertyDescriptor(obj, key);
        if (property && property.configurable === false) {
            return
        }

        // cater for pre-defined getter/setters
        var getter = property && property.get;
        var setter = property && property.set;
        
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get: function reactiveGetter () {
                var value = getter ? getter.call(obj) : val;
                value = dtObject.get()||value;
                return value
            },
            set: function reactiveSetter (newVal) {
                var value = getter ? getter.call(obj) : val;
                dtObject.set(newVal)
                getter.call(obj , newVal)
            }
        });
    }
}

class Hiv{
    dom:any
    constructor(ojs:HivOp){
        var Evm = new EventManager();
        var specailFunc = new SpecailFunc();
        var self = this;
        self.dom = {};
        function getDom(dom:any):DomRus{
            //for specail prop
            //for specails 
            var rus:DomRus = {
                has :{
                    on:null
                    ,data:null
                    ,attr:null
                    ,style:null
                    ,$:null
                }
                ,docs :[]
            }
            function is_specail( str:string ){
                var specail = {
                    on:1
                    ,data:1
                    ,style:1
                    ,attr:1
                    ,$:1
                }
                return !!specail[str] ;
            }
            function initSpecail (ele:HTMLElement,domRus : DomRus){
                specailFunc.init(ele,domRus)
                if(domRus){
                    for (let x in domRus.has){
                        if(domRus.has[x] !== null){
                            specailFunc.do(<SpecailProp>x);
                        }
                    }
                }
            }

            //create docs;
            for (let x in dom){

                if( is_specail(x) ){
                    rus.has[x] = dom [x];
                    continue;
                }
                var prop = new Prop(x)

                /**Prop.name 生成记录当前的 ele 的变量
                 * 
                 * 1.如果有多个,则自动变为数组
                 *  
                 */
                var name = prop.name;

                var domRus : DomRus;
                var dnext = dom[x] 
                switch (typeof dnext){
                    case "object":
                        for (let j =0 ;j < prop.num; j++ ){
                            //create num 个 ele
                            var ele = Hif.creatEle( prop );
                            rus.docs.push(ele);
                            //判断name 是否存在于this.dom上
                            if(name)
                                if( self.dom[name] ){
                                    self.dom[name].push (ele);
                                }else{
                                    self.dom[name] = [ele];
                                }

                            //解析了多遍.
                            // /**
                            //  * 事件内部代理
                            //  * HTML代码的树
                            //  * Dom 树抓取
                            //  */

                            /**
                             * domRus.has 中返回 specials
                             */
                            domRus = getDom (dnext)
                            initSpecail(ele,domRus);
                            Hif.addDocs(ele, domRus)
                        }
                    break;
                }
            }
            return rus;
        }
        if(ojs.el instanceof HTMLElement ) Hif.addDocs(ojs.el,getDom( ojs.dom ));
    }
}
class Data{
    [key:string]:any
    constructor(dt:object,id?:string){
        if(!id){
            id = Hif.js.getHash(6);
        }
        // var mp = Hif.js.Map(this,id);
        this.__data_id__ = id;

        if(Hif.js.isPrimitive(dt)){
            Hif.warn("can't init Data object from a primitive type data")
        }
        for (let x in dt){

            var ty = Hif.js.getType( dt[x] )

            switch (ty){
                case "string":
                case "number":
                case "boolean":
                this[x] = {
                    set(v){
                        dt[x] = v;
                    }
                    ,get(){
                        return dt[x];
                    }
                }
                break;

                case "array":
                (function initArrayData(dt,vm,x,id){
                    //make it to Data for Each one
                    vm[x] = new Data (dt[x],id)

                    //set array function to this[x];
                    for (let arrfunc of Hif.js.arrayFuncs){
                        vm[x][arrfunc] = function (...args){
                            Hif.doSomething("array",arrfunc);
                            dt[x][arrfunc](...args);
                            initArrayData(dt,vm,x,id)
                        }
                    }
                })(dt,this,x,id)
                break;

                case "object":
                this[x] = new Data (dt[x],id)
                break;

                case "function":
                console.log("don,t know how to deal whit this")
                break;
            }
        }
    }
}



var obj = new Prop(".head.good");

class EventFunc{
    constructor(str:String,func:Function){
        function getEvents(str:string){

        }
    }
}
//depart this to attritube args;
class ArgsEvent{
    args :any
    el:HTMLElement
    constructor(obj:object, args:object, el:HTMLElement){
        // var evs = [];
        // for (var x in obj){
        //     evs.push( new EventFunc (x,obj[x]) )
        // }
        this.attachTo(el);
        this.setArgs(args);
        for (var x in obj){
            var func = obj[x];
            Tool.extend ( this.el.dataset , this.args );
            el.addEventListener(x,func);
        }
    }
    setArgs (obj:any){
        if(obj){
            this.args = obj;
        }else{
            this.args = {};
        }
        this.args.dom = this.el;
    }
    attachTo (el){
        this.el = el;
    }
}
var $menu = document.createElement("div");
Hif
/*
var menu = new Hiv ({
    el:$menu
    ,dom:{
        ".head.good":{
            "img[url='..JsKu/fs.img']":{
                on:myE.click.black
                ,args:{
                    color:""
                }
            }
            ,".content":{
                "p.tellname":{
                    $:"fsef"
                },
                "input.des":{
                    $:"<div>fsefe</div>"
                },
                style:"@greater"
            }
            ,"m,.":{ //one 在变量池中
                args :{
                    blue:"#doo"
                }
                ,attr:{
                    class : "str"
                }
                ,style:{
                    color:"$blue"
                }
            }
            ,"3*p":{
                $:"good"
            }
        }
    }
})

*/
var menuFunc ={
    troggleColor:Tool.initFunc("troggleSet",{
        func(e:Ev){
            e.target.style.background = this.color;
        }
        ,args:{
            color:{
                even:"#3cf"
                ,odd:"#3fc"
            }
        }
        ,id(e:Ev){
            return e.target;
        }
    })
    ,setGreen(this:Args){
        this.dom.style.background = this.color;
    }
}
var dt = {
    menu:{
        className:"gray"
    }
    ,good:{
        title:"hehe"
    }
    ,mk:{
        input: '# hello'
        ,par:{
            godd:""
            ,nide :["fsfe","Fsf"]
        }
    }
}
/*
var menu = new Hiv ({
    el:document.getElementById("show")
    ,dom:{
        "5*.good ::good":{
            on:{
                click(this:ele){
                    menuFunc.troggleColor({
                        target:this
                    })
                    console.log(this.dataset.color);
                }
            }
            ,data:{
                color:"#3fc"
            }
            ,style:{
                transition :"background .5s"
            }
            ,$:"你好!"
        }
        ,"namespace , .good ::good":{
            args:{
                title: dt.good.title
                ,class: dt.menu.className
            }
            ,"p":{
                $:"I'm a paragraph"
            }
            ,"p ::goodHere":{
                $:"good I a here, ${hello}"
            }
        }
        ,"table .one":{
            "tr":{
                "if(x),for(x in thead),6*th":{
                    $:"$x"
                }
            }
            ,"6*tr":{
                "6*td ::tdcell":{
                    style:{
                        width:"30px"
                        ,height:"30px"
                        ,padding:"5px"
                    }
                    ,$:"one"
                }
            }
            ,on:{
                click(this:ele,e:Ev){
                    var td = e.target;
                    if(td.tagName ==="TD")
                        td.style.background = "#f3c";
                }
            }
        }
    }
})
var i =0;
var timer = setInterval(function (){
    menu.dom.tdcell[i].style.background = "#3fc";
    i++;
    if(i>30){
        clearInterval(timer)
    }
},1000)
*/

var mk= new Data ({
    write : "green"
    ,arr:[
        "one MK"
        ,"two DC"
    ]
});
var MarkDown = new Hiv({
    el:document.getElementById("show")
    ,data:mk
    ,dom:{
        "textarea .good ::txt":{
            attr:{
                value:mk.write
            }
            ,on:{
                click(e){
                    console.log(this);
                }
            }
            ,data:{
                cool : "lim"
            }
        }
        ,"div":{
            $:mk.write.get()
        }
    }
})
var txt = MarkDown.dom.txt[0]
console.dir(txt)
// menu.dom.goodHere[0].style.background = "#cfc"

/** */

