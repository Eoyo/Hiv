type DepEv = {
    data: any
    from: any
}
type getsetRus = {
    get: () => any
    , set: (any) => void
}
type getsetExt = {
    getBinder: () => ele
}
declare var Data: DataConstructor;
type attrState = "quote" | "key" | "attrstart" | "value" | "quoteStart" | "quoteEnd" | "equo";
type propState = "start" | "num" | "class" | "id" | "attr" | "targ" | "name";
type attrOnep = {
    key: string
    value: string
}
type ele = HTMLElement
interface Ev extends Event {
    target: ele
}
type SpecailHas = {
    on: any | null
    , data: Object | null
    , style: Object | null
    , args: Object | null
    , $: string | null
}
type DomRus = {
    docs: HTMLElement[]
    , has: SpecailHas
}
type HivOp = {
    el: string | HTMLElement | null
    dom: object
    , style?: object
    , data?: any
    , methods?: object
    , computed?: object

}
class EventManager {
    arevs: ArgsEvent[]
    constructor() {
        this.arevs = [];
    }
    addDocNode(doc: HTMLElement, str: string) {

    }

} interface initFuncOpJson {
    func?: Function
    args?: {
        [key: string]: any
    }
    id?: Function
}
type initFuncName = "troggleSet"
interface Tool {
    initFunc(name: string, args: initFuncOpJson): Function
    extend<T, K>(obj1: T, obj2: K): T & K
}
interface Args {
    dom: HTMLElement
    [key: string]: any
}
type Pick2<T, K extends keyof T> = {
    [P in K]: T[P];
}
type getset = {
    get: () => string;
    set: (any) => void;
}
type setData<T, K extends keyof T> = {
    [P in K]: setData<T[P], keyof T[P]> & getset | any
}
type DataProp<T> = {
    srData: T;
    __data_id__: string;
}
interface DataConstructor {
    new <D>(Data: D, id?): setData<D, keyof D> & DataProp<D>;
};
type SpecailProp = "on" | "data" | "style" | "$" | "args"


var js = {
    toString: Object.prototype.toString
    , isObject(obj) {
        return obj !== null && typeof obj === 'object'
    }
    , isPlainObject(obj) {
        return js.toString.call(obj) === '[object Object]'
    }
    , isNative(Ctor) {
        return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
    }
    , getType(v: any) { //get typeof v
        var ty: "string" | "number" | "boolean" | "symbol" | "undefined" | "object" | "function" | "null" | "array" = typeof v;

        if (ty === "object") {
            switch (true) {
                case !v:
                    ty = "null"
                    break;

                case Array.isArray(v):
                    ty = "array"
                    break;
            }
        }
        return ty;
    }
    , isNotSimple(v) {
        var ty = js.getType(v);
        if (!ty) {
            return false;
        }
        if (ty === "string" || ty === "number" || ty === "boolean") {
            return false;
        } else {
            return true;
        }
    }
    , isPrimitive(value: any) {
        return typeof value === 'string' || typeof value === 'number'
    }
    , hasOwn(obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key)
    }

    //set ebumerable to false by defalut;
    , def(obj, key, val?, enumerable?) {
        if (val === undefined) val = obj[key];
        Object.defineProperty(obj, key, {
            value: val,
            enumerable: !!enumerable,
            writable: true,
            configurable: true
        });
    }
    , defineGetValue(obj, key, val) {
        Object.defineProperty(obj, key, {
            enumerable: false,
            configurable: true
            , get() {
                return val;
            }
            , set(v) {
                val = v;
            }
        });
    }
    , getFirstProp(obj) {
        for (var x in obj) {
            return x;
        }
        return null;
    }
    , extend<T, U>(first: T, second: U): T & U {
        for (let id in second) {
            if (!first.hasOwnProperty(id)) {
                (<any>first)[id] = (<any>second)[id];
            }
        }
        return <T & U>first;
    }
    , Set: class _Set implements mySet {
        public set = Object.create(null)

        constructor() {
            var Set = Set || null;
            if (Set) {
                return new Set();
            }
            else {
                this.set = Object.create(null);
            }
        }

        has(key: string | number): boolean {
            return this.set[key] === true
        }
        add(key: string | number) {
            return this.set[key] = true;
        }
        clear() {
            this.set = Object.create(null);
        }
    }
    , nextTick(cb: callBack, ctx?): Promise<Function> | undefined { return }
    , noop() {
        return
    }
    , set: (function valueSetter() {
        function getValue(obj) {

        }
        function setFunc(obj, k, value?) {
            obj[k] = value;
        }
        return setFunc
    })()
    , Sp: (function () {
        var mmp = new Map();
        var targetObj;
        var targetKey = "";
        var curDep: Dep;
        function getDep(fromObj) {
            var oneDep: Dep;
            if (mmp.has(fromObj)) {
                oneDep = mmp.get(fromObj);
            } else {
                oneDep = new Dep(fromObj);
                mmp.set(fromObj, oneDep);
            }
            return oneDep;
        }
        // function setValue(data) {
        //     if (targetKey) {
        //         targetObj[targetKey] = data;
        //     }
        //     else {
        //         targetObj.set(data);
        //     }
        // }
        var func = {
            listenTo(gsObj, evType) {
                var gsDep = getDep(gsObj)
                var tKey = targetKey;
                var tObj = targetObj;
                gsDep.addEvent(evType, function (e) {
                    try {
                        tObj[tKey] = e.data
                    } catch (e) {
                        console.error("Can't set " + tKey + " at ", tObj);
                        throw new Error("Can't set value");
                    }
                })
            }
            , bindTo(gsObj) {
                // var ob = Hif.observe(gsObj);
                // //this listener func:
                // func.on("set", function (data) {
                //     gsObj.set(data)
                // })
            }
            , on(eventType: string, cd: (e: DepEv) => any) {
                curDep.addEvent(eventType, cd);
            }
            , notify(type, ev?) {
                curDep.emit(type, ev);
            }
            , addEvents(jsEv) {

            }
        }
        return function Superinit(srObj, srKey?) {
            targetKey = srKey;
            targetObj = srObj;
            curDep = getDep(srObj);
            return func;
        }
    })()
    , Cacher: class Cacher {
        max
        num = 0
        set = {}
        first = 0;
        constructor(max: number) {
            this.max = max;
        }
        cache(key: string, obj) {
            while (this.num - this.first > this.max) {
                var deletstr = js.getFirstProp(this.set)
                if (deletstr) delete this.set[deletstr]

                this.first++;
            }
            if (this.num - this.first == this.max) {
                return;
            }
            this.set[key] = obj;
            this.num++;
        }
        find(key: string) {
            return this.set[key];
        }
        do(key, creator) {
            var find = this.find(key);
            if (find) {
                return find;
            } else {
                find = new creator(key)
                this.cache(key, find)
                return find;
            }
        }
    }
    , init() {
        js.nextTick = (function () {
            var callbacks = [] as Function[];
            var pending = false;
            var timerFunc;

            function nextTickHandler() {
                pending = false;
                var copies = callbacks.slice(0);
                callbacks.length = 0;
                for (var i = 0; i < copies.length; i++) {
                    copies[i]();
                }
            }

            // the nextTick behavior leverages the microtask queue, which can be accessed
            // via either native Promise.then or MutationObserver.
            // MutationObserver has wider support, however it is seriously bugged in
            // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
            // completely stops working after triggering a few times... so, if native
            // Promise is available, we will use it:
            /* istanbul ignore if */
            var Promise = Promise || null;
            if (typeof Promise !== 'undefined' && js.isNative(Promise)) {
                var p = Promise.resolve();
                var logError = function (err) { console.error(err); };
                timerFunc = function () {
                    p.then(nextTickHandler).catch(logError);
                    // in problematic UIWebViews, Promise.then doesn't completely break, but
                    // it can get stuck in a weird state where callbacks are pushed into the
                    // microtask queue but the queue isn't being flushed, until the browser
                    // needs to do some other work, e.g. handle a timer. Therefore we can
                    // "force" the microtask queue to be flushed by adding an empty timer.
                    if (test.br.isIOS) { setTimeout(js.noop); }
                };
            } else if (typeof MutationObserver !== 'undefined' && (
                js.isNative(MutationObserver) ||
                // PhantomJS and iOS 7.x
                MutationObserver.toString() === '[object MutationObserverConstructor]'
            )) {
                // use MutationObserver where native Promise is not available,
                // e.g. PhantomJS IE11, iOS7, Android 4.4
                var counter = 1;
                var observer = new MutationObserver(nextTickHandler);
                var textNode = document.createTextNode(String(counter));
                observer.observe(textNode, {
                    characterData: true
                });
                timerFunc = function () {
                    counter = (counter + 1) % 2;
                    textNode.data = String(counter);
                };
            } else {
                // fallback to setTimeout
                /* istanbul ignore next */
                timerFunc = function () {
                    setTimeout(nextTickHandler, 0);
                };
            }

            return function queueNextTick(cb: callBack, ctx): Promise<Function> | undefined {
                var _resolve;
                callbacks.push(function () {
                    if (cb) {
                        try {
                            cb.call(ctx);
                        } catch (e) {
                            test.handleError(e, ctx, 'nextTick');
                        }
                    } else if (_resolve) {
                        _resolve(ctx);
                    }
                });
                if (!pending) {
                    pending = true;
                    timerFunc();
                }
                if (!cb && typeof Promise !== 'undefined') {
                    return new Promise(function (resolve, reject) {
                        _resolve = resolve;
                    })
                }
            }
        })()
    }
}

var el = {
    lm: document.createElement("div")
    , refine(type: string, str: string) {
        switch (type) {
            case "style":

        }
        return str;
    }
    , set() {

    }
}
var ts = {
    error(str: string) {
        try {
            console.error(ts.translate(str));
            var er = new Error(str);
            var at = 0;
            var sta = er.stack;
            var i = 3;
            var erStr = ""
            while (sta && i > 0) {
                at = sta.indexOf("at")
                --i;
                if (i <= 0) {
                    erStr = "at" + sta.slice(0, at)
                }
                sta = sta.slice(at + 2);
            }
            console.error(er.stack);
            throw er;
        } catch (e) {
            if (ts.args.stopAtFirstWrong) {
                // alert("something wrong!")!
                throw e;
            }
        }
    }
    , translate(str) {
        switch (str) {
            case "ArrayType":
                return "you shouldn'y set raw array to jsDom"
        }
        return str;
    }
    , args: {
        stopAtFirstWrong: true
    }
}
js.init();
// class SpecailFunc {
//     domRus: DomRus
//     ele: HTMLElement
//     constructor(domRus?: DomRus, ele?: HTMLElement) {
//         if (domRus && ele) {
//             this.init(ele, domRus);
//         }
//     }
//     init(ele: HTMLElement, domRus: DomRus) {
//         this.domRus = domRus;
//         this.ele = ele;
//     }
//     do(x: SpecailProp) {
//         var has = this.domRus.has;
//         var hasx = has[x];
//         switch (x) {
//             case "on":
//                 var onObj = this.domRus.has[x]
//                 //添加事件监听
//                 var rusObj = new ArgsEvent(onObj, <object>has.data, this.ele)
//                 return rusObj;

//             // case "data":
//             // break;

//             case "style":
//                 Tool.extend(this.ele.style, this.domRus.has[x]);
//                 break;

//             case '$':
//                 this.ele.innerHTML += this.domRus.has[x]
//                 break;

//             case "args":
//                 // for (let i in has.attr){
//                 //     console.log("setter")
//                 //     Object.defineProperty(this.ele,i,{
//                 //         enumerable: true,
//                 //         configurable: true,
//                 //         set (v){
//                 //             console.log("good")
//                 //             has.attr[i].set(v);
//                 //         }
//                 //         ,get(){
//                 //             console.log("good")
//                 //             return has.attr[i].get();
//                 //         }
//                 //     })
//                 // }
//                 break;
//         }
//     }
// }
class Prop {
    id: string
    className: string
    targName: string
    num: number
    cmd: string[]
    name: string
    attr: Array<attrOnep>
    Children: Prop
    constructor(str: string) {
        var arr = str.split(',');
        var sar: string[]
        if (arr.length > 0) { //有命令时
            sar = arr.pop()!.split('');
        } else {
            sar = str.split('');
        }
        this.cmd = arr;

        //add End to sar
        sar.push('\0');
        var len = sar.length;

        var reg = {
            number: /[0-9]/
            , word: /[\w\-\_]/
        }
        var state: propState;
        var attrst: attrState;

        var frequency = 0;
        var now = ""
        state = "start"
        attrst = "attrstart"
        this.attr = [];
        this.className = ""
        this.id = ""
        this.targName = "div"
        this.num = 1;
        var onep: attrOnep;
        onep = {
            key: ""
            , value: ""
        }
        for (var x = 0; x < len; x++) {

            //if is normal head
            switch (state) {
                case "start":
                    if (reg.number.test(sar[x])) { state = "num"; x--; continue; }
                    if (reg.word.test(sar[x])) { state = "targ"; x--; continue; }
                    if (sar[x] == '.') { state = "class"; continue; }
                    if (sar[x] == '#') { state = "id"; continue; }
                    if (sar[x] == '[') {
                        state = "attr"; continue;
                    }
                    if (sar[x] == ':') { frequency = 0; state = "name"; continue; }
                    if (sar[x] == ">") {
                        var childrenStr = sar.slice(x + 1).join("");
                        if (childrenStr) {
                            this.Children = new Prop(childrenStr)
                        }
                        return this;
                    }
                    break;

                case "name":
                    if (sar[x] == ':') {
                        frequency = 1;
                        now = "";
                    } else {
                        if (frequency && reg.word.test(sar[x])) {
                            now += sar[x];
                        } else {

                            //frequncy maybe = 0;
                            if (now) {
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
                    if (reg.number.test(sar[x])) {
                        now += sar[x];
                    }
                    else {
                        if (sar[x] == "*") {
                            this.num = Number(now);
                            now = "";
                            state = "start"
                        }
                        else {
                            throw Error("need * after number")
                        }
                    }
                    break;

                case "targ":
                    if (reg.word.test(sar[x])) {
                        now += sar[x];
                    } else {
                        this.targName = now;
                        now = ""
                        state = "start"
                        x--;
                    }
                    break;

                case "id":
                    if (reg.word.test(sar[x])) {
                        now += sar[x];
                    } else {
                        this.id = now;
                        now = ""
                        state = "start"
                        x--;
                    }
                    break;

                case "class":
                    if (reg.word.test(sar[x])) {
                        now += sar[x];
                    } else {
                        this.className += this.className ? " " + now : now;
                        now = ""
                        state = "start"
                        x--;
                    }
                    break;

                case "attr":
                    if (sar[x] == "]") {
                        state = "start"
                        attrst = "attrstart"
                        now = "";
                        break;
                    } else {
                        switch (attrst) {
                            case "attrstart":
                                if (reg.word.test(sar[x])) {
                                    attrst = "key";
                                    x--;
                                    continue;
                                }
                                if (sar[x] == '=') {
                                    attrst = "equo";
                                    x--;
                                    continue;
                                }
                                if (sar[x] == "'") {
                                    attrst = "quote";
                                    x--;
                                    continue;
                                }
                                break;

                            case "key":
                                if (reg.word.test(sar[x])) {
                                    now += sar[x];
                                } else {
                                    onep = {
                                        key: now
                                        , value: ""
                                    }
                                    attrst = "attrstart";
                                    now = ""
                                    x--;
                                }
                                break;

                            case "equo":
                                if (onep.key !== "") {
                                    attrst = "quote"
                                } else {
                                    attrst = "attrstart"
                                }
                                break;

                            case "quote":
                                if (sar[x] == "'") {
                                    attrst = "quoteStart"
                                } else {
                                    if (reg.word.test(sar[x])) {
                                        attrst = "key"; x--; continue;
                                    }
                                }
                                break;

                            case "quoteStart":
                                if (sar[x] == "'") {
                                    attrst = "quoteEnd";
                                    x--;
                                } else {
                                    now += sar[x]
                                }
                                break;

                            case "quoteEnd":
                                if (onep.key !== "") {
                                    onep.value = now
                                    this.attr.push(onep);
                                    now = ""
                                    attrst = "attrstart"
                                } else {
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
var Hif = {
    creatEle(prop: Prop): HTMLElement {
        var doc = document.createElement(prop.targName);
        if (prop.id) doc.id = prop.id
        if (prop.className) doc.className = prop.className;

        //add element attrs
        var len = prop.attr.length;
        for (let x = 0; x < len; x++) {
            var onep = prop.attr[x];
            doc.setAttribute(onep.key, onep.value);
        }
        return doc;
    }
    , addDocs(srDoc: HTMLElement, domRus: DomRus) {
        domRus.docs.forEach((x) => {
            srDoc.appendChild(x)
        });
    }
    //js helper
    , js: {
        getClass(obj: Object): string {
            return Object.getPrototypeOf(obj).constructor.name;
        }
        , isPrimitive(value: any) {
            return typeof value === 'string' || typeof value === 'number'
        }
        , isArray(obj) {
            var str: string = Object.prototype.toString.call(obj)
            return str === "[object Array]";

            // return obj instanceof Array;

            // return Array.isArray(obj);
        }
        , getHash(n: number) {
            function getRandom(n: number): number {
                return parseInt(Math.random() * n + "")
            }
            var str = new Date().valueOf() + ":DATE";
            for (var x = 0; x < n; x++) {
                str += getRandom(n)
            }
            return str;
        }
        , Map: (function () {
            var ccd = Object.create(null);
            return function MyMap(obj?: object, str?: string) {
                if (typeof obj !== "object") {
                    return ccd;
                }
                function has(obj) {
                    for (var x in ccd) {
                        for (var y in ccd[x]) {
                            if (ccd[x][y] == obj) {
                                return {
                                    x: x,
                                    y: y
                                }
                            }
                        }
                    }
                    return false;
                }
                var ha = has(obj)
                if (ha) {
                    if (str) {
                        if (ha.x === str) {
                            return ha;
                        }
                        else {
                            return false;
                        }
                    } else {
                        return ha;
                    }
                } else {
                    if (!str) {
                        return false;
                    }
                    ccd[str] = ccd[str] || []
                    ccd[str].push(obj);
                    return {
                        x: str
                        , y: (ccd[str].length - 1) + ""
                    }
                }
            }
        })()
        , arrayFuncs: [
            'push',
            'pop',
            'shift',
            'unshift',
            'splice',
            'sort',
            'reverse'
        ]
    }
    , func: {
        id(n: number) {
            var id = Hif.js.getHash(n);
            return function getId() {
                return id;
            }
        }
    }
    , warn(str, substr?) {
        console.warn(str)
        throw new Error(str)
    }
    , doSomething(fr, job) {
        // switch(type){
        //     case "push":
        //     case "unshift":

        //     break;
        // }

        console.log("this is watch for : ", fr, "and will do : Array." + job);
    }
    , Binder: {
        initVerge(srObj: object, srkey: string) {
            return;
        }
    }
    , initObserve(value, asRootData?): Observer {
        if (!js.isObject(value)) {
            test.wrong();
        }

        var ob;
        if (js.hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
            ob = value.__ob__;
        } else if (
            config.observerState.shouldConvert &&
            !test._isServer &&
            (Array.isArray(value) || js.isPlainObject(value)) &&
            Object.isExtensible(value) &&
            !value._isVue
        ) {
            ob = new Observer(value);
        }

        if (asRootData && ob) {
            ob.vmCount++;
        }
        return ob
    }
    , createWatcher(obj, key) {
    }
    , createFollower(obj, key) {

    }
    , getClass(classObj) {
        var str = ""
        for (var oneclass in classObj) {
            str += classObj[oneclass] ? oneclass + " " : ""
        }
        return str;
    }
    , target: <any>null
    , Spf: (function initSpecaiFunc() {
        var domRus, srcel: ele
        function init(srcele: HTMLElement, srcdomRus: DomRus) {
            domRus = srcdomRus;
            srcel = srcele;
            return func;
        }
        function check() {

        }
        var func = {
            do(x: SpecailProp ,index) {
                var has = domRus.has;
                var hasx = has[x];
                var ele = srcel;
                Hif.setValIndex = index;
                switch (x) {
                    case "on":
                        var onObj = domRus.has[x]
                        //添加事件监听
                        var rusObj = new ArgsEvent(onObj, <object>has.data, ele)
                        return rusObj;

                    // case "data":
                    // break;

                    case "style":
                        for (var name in hasx) {
                            var aiName = el.refine("style", name)
                            Hif.setVal(ele.style, aiName, hasx[name])
                        }
                        break;

                    case '$':
                        Hif.setVal(ele, "innerHTML", hasx)
                        break;

                    case "args":
                        //argsset$$
                        for (var name in hasx) {
                            var aiName = el.refine("args", name)
                            switch (aiName) {
                                case "model":
                                    Hif.bindinVoker(<HTMLInputElement>ele, hasx.model)
                                    // console.log(ele)
                                    continue;
                                case "show":
                                    switch (typeof hasx[name]) {
                                        case "function":
                                            js.Sp(Hif.target).on("somethingChange", function () {
                                                var res = hasx[name]()
                                                if (res) {
                                                    ele.style.visibility = "visible"
                                                } else {
                                                    ele.style.visibility = "hidden"
                                                }
                                            })
                                            break;

                                        default:
                                            var res = hasx[name]
                                            if (res) {
                                                ele.style.visibility = "visible"
                                            } else {
                                                ele.style.visibility = "hidden"
                                            }
                                            break;
                                    }
                                    continue;
                                case "focus":
                                    switch (typeof hasx[name]) {
                                        case "function":
                                            js.Sp(Hif.target).on("somethingChange", function () {
                                                var res = hasx[name]()
                                                if (res) {
                                                    ele.focus();
                                                }
                                            })
                                            break;

                                        default:
                                            var res = hasx[name]
                                            console.log("it is better to make focus prop as a function")
                                            if (res) {
                                                ele.focus();
                                            }
                                            break;
                                    }
                                    continue;
                                case "class":
                                    if (typeof hasx[name] == "object") {

                                        var classObjhere = hasx.class
                                        var classCopy = {};
                                        for (var some in classObjhere) {
                                            if (typeof classObjhere[some] === "function") {
                                                js.Sp(Hif.target).on("somethingChange", function () {
                                                    classCopy[some] = classObjhere[some].bind(ele)()
                                                })
                                            } else {
                                                Hif.setVal(classCopy, some, classObjhere[some]);
                                            }
                                        }
                                        // js.Sp(classCopy).on("change",function (){
                                        //     ele.className = Hif.getClass(classCopy);
                                        // })


                                        js.Sp(Hif.target).on("somethingChange", function () {
                                            ele.className = Hif.getClass(classCopy);
                                        })
                                        continue;
                                    }

                                    //else to normal Hif.setVal
                            }
                            Hif.setVal(ele, aiName, hasx[name])
                        }
                        break;
                }
                Hif.setValIndex = ""
            }
        }
        return init;
    })()
    , Cac: new js.Cacher(100)
    , checkEleValue(ele) {
        var targN = ele.tagName;
        if (targN == "INPUT" || targN == "TEXTAREA") {
            return true;
        } else {
            return false;
        }
    }
    , bindinVoker(ele: HTMLInputElement, model) {
        switch (ele.type) {
            case "checkbox":
                Hif.setVal(ele, "checked", model)
                ele.addEventListener("click", function (e: any) {
                    model.set(e.target.checked)
                })
                break;
            case "text":
                Hif.setVal(ele, "value", model)
                ele.addEventListener("input", function (e: any) {
                    model.set(e.target.value)
                })
                break;
        }
    }
    , setBubble(srcObj, parent) {
        js.Sp(srcObj).on("bubble", function (e) {
            js.Sp(Hif.target).notify("somethingChange")
        })
    }
    , viewDom(ele: Element, padding) {
        var len = ele.children.length;
        var str = "\n"
        padding = padding || "  ";
        for (var i = 0; i < len; i++) {
            str += padding + Hif.viewDom(ele.children[i], padding + "  ") + "\n"
        }
        if (str != '\n') {
            str = '\n' + ele.tagName.toLowerCase() + str;
            return str;
        }
        return ele.tagName.toLowerCase();
    }
    , setValIndex : ""
    , setVal(ele: Element | any, key, value) {
        if (value instanceof DataLeaf) {
            js.Sp(ele, key).listenTo(value, "set");
            //all listen to gsObj;
            //but listener should be updated nextTick;
            ele[key] = value.get();
            return;
        } else {
            if (value instanceof ArrayData) {
                function setArrayDom() {
                    ele.innerHTML = ""
                    if (value.__map_domList__ == undefined) {
                        ts.error("ArrayType")
                    } else {
                        value.__map_domList__.forEach(function (a) {
                            var len = a.html.length
                            for (var i = 0; i < len; i++) {
                                ele.appendChild(a.html[i])
                            }
                        })
                    }
                }
                js.Sp(value).on("domCreated", setArrayDom);
                setArrayDom();
                return;
            }
        }
        if(value instanceof Array){
            var i = Hif.setValIndex;
            if(i!==""){
                ele[key] = value[i];
            }
            return ;
        } 

        //the simplest state
        ele[key] = value;
    }
    , setChildren(ele: ele, array) {
        var len = array.length
        for (var i = 0; i < len; i++) {
            ele.appendChild(array[i])
        }
    }

}

class EventFunc {
    constructor(str: String, func: Function) {
        function getEvents(str: string) {

        }
    }
}
//depart this to attritube args;
class ArgsEvent {
    args: any
    el: HTMLElement
    constructor(obj: object, args: object, el: HTMLElement) {
        // var evs = [];
        // for (var x in obj){
        //     evs.push( new EventFunc (x,obj[x]) )
        // }
        this.attachTo(el);
        this.setArgs(args);
        for (var x in obj) {
            var func = obj[x];
            Tool.extend(this.el.dataset, this.args);
            el.addEventListener(x, func);
        }
    }
    setArgs(obj: any) {
        if (obj) {
            this.args = obj;
        } else {
            this.args = {};
        }
        // this.args.dom = this.el;
    }
    attachTo(el) {
        this.el = el;
    }
}
class DataLeaf {
    srData?
    root?
    parent
    __data_id__
    nodeName: string
    get: () => any
    set: (v) => void
    constructor(gt, id?, parent?, x?) {
        if (!id) {
            id = Hif.js.getHash(6);
            this.root = id;
            js.def(this, "root", id);
            parent = this;
        }
        else {
            js.def(this, "parent", parent);
            js.def(this, "nodeName", x);
        }
        js.def(this, "set", gt.set);
        js.def(this, "get", gt.get);
        // js.def(this, "srData", dt);
        // var mp = Hif.js.Map(this,id);
        js.defineGetValue(this, "__data_id__", id);
        // js.Sp(this).on("bubble", function (e) {
        //     if (parent.root !== id) {
        //         js.Sp(parent).notify("bubble", e);
        //     }
        //     js.Sp(parent).notify("somethingChange", e);
        // })
        Hif.setBubble(this, parent);
    }
}


class Data {
    // [key: string]: any
    // good :string
    __data_id__: string
    __map_dom__?: Dom;
    srData
    root?
    parent
    nodeName: string
    constructor(dt, id?: string, parent?, x?) {
        if (!id) {
            id = Hif.js.getHash(6);
            dt = JSON.parse(JSON.stringify(dt));//clone to avoid dirty data; 
            this.root = id;
            js.def(this, "nodeName", "root");
            js.def(this, "root", id);
            parent = this;
            Hif.target = this;
        }
        else {
            js.def(this, "parent", parent);
            js.def(this, "nodeName", x);
        }
        js.def(this, "srData", dt);
        // var mp = Hif.js.Map(this,id);
        js.defineGetValue(this, "__data_id__", id);

        // js.Sp(this).on("bubble", function (e) {
        //     if (parent.root !== id) {
        //         js.Sp(parent).notify("bubble", e);
        //     }
        //     js.Sp(parent).notify("somethingChange", e);
        // })
        Hif.setBubble(this, parent);

        if (Hif.js.isPrimitive(dt)) {
            Hif.warn("can't init Data object from a primitive type data")
        }
        for (let x in dt) {
            let backgroundValue = dt[x];
            let normalgt = {
                set(v) {
                    if (js.isNotSimple(v)) {
                        // Data.setNewNode(this,v,id);
                        console.log("not a good simplify value");
                        return;
                    }
                    backgroundValue = v;
                    js.Sp(this).notify("set")
                }
                , get() {
                    return backgroundValue;
                }
            }


            let ty = js.getType(dt[x])

            switch (ty) {
                case "string":
                case "number":
                case "boolean":
                    let gt = new DataLeaf(normalgt, id, this, x);
                    this[x] = gt;
                    dt[x] = gt;
                    break;

                case "array":
                    Data.initArrayData(dt, this, x, id)
                    // js.def(this[x], "set", normalgt.set)
                    js.def(this[x], "get", normalgt.get)
                    js.def(dt[x], "__map_data__", this[x])
                    break;

                case "object":
                    this[x] = new Data(dt[x], id, this, x)
                    // js.def(this[x], "set", normalgt.set)
                    // js.def(this[x], "get", normalgt.get)
                    js.def(dt[x], "__map_data__", this[x])
                    dt[x] = this[x]
                    break;

                case "function":
                    console.log("don,t know how to deal whit this")
                    break;
            }
        }
        // Object.freeze(this)
    }
    static initArrayData(dt, vm, x, id) {
        //make it to Data for Each one
        vm[x] = new ArrayData(dt[x], id, vm, x)

        js.Sp(vm[x]).on("reArray", function () {
            Data.reReadArray(dt, vm, x, id)
        })

        //set array function to this[x];
        for (let arrfunc of Hif.js.arrayFuncs) {
            vm[x][arrfunc] = function (...args) {
                // Hif.doSomething(vm[x],arrfunc);
                dt[x][arrfunc](...args);
                if (arrfunc == "push" || arrfunc == "unshift") {
                    Data.reReadArray(dt, vm, x, id)
                }
                else {
                    js.Sp(vm[x]).notify("reArray");
                }
            }
        }
        return vm[x]
    }
    static reReadArray(dt, vm, x, id) {
        var len = dt[x].length;
        var dtx = dt[x];
        for (var i = 0; i < len; i++) {
            if (dtx[i].__data_id__) {
                if (dtx[i].__data_id__ !== id) {
                    ts.error("it is not good to set Data with Data")
                    return;
                }
                vm[x][i] = dtx[i];
            } else {
                vm[x][i] = new Data(dtx[i], id, vm[x], i)
                js.def(dtx[i], "__map_data__", vm[x][i])
                dtx[i] = vm[x][i];
            }
            dtx[i].nodeName = i;
        }
        js.Sp(vm[x]).notify("reArrayDone");
    }
    static setNewNode(vm, v, id) {
        var newNode = new Data(v, id, vm.parent, vm.nodeName);
        vm.parent[vm.nodeName] = newNode;
    }
    static coheren(data) {
        if (data.set) {
            return data.get();
        } else {
            if (js.isPrimitive(data)) return data;
        }
        var rus = {}
        for (var x in data) {
            var srD = data[x].srData;
            if (js.isNotSimple(srD)) {
                if (Array.isArray(srD)) {
                    rus[x] = [];
                    for (var j = 0; j < srD.length; j++) {
                        rus[x].push(Data.coheren(srD[j]));
                    }
                } else {
                    rus[x] = Data.coheren(data[x])
                }
            } else {
                rus[x] = data[x].get();
            }
        }
        return rus;
    }
}

class ArrayData extends Data {
    __map_domList__: Dom[]
    constructor(dt, id?: string, parent?, x?) {
        super(dt, id, parent, x);
    }
}
var gr = {
    uid: 0
    , uid$2: 0
}
class Dep {

    id: number
    forObj
    doingEv: string;

    evPool = {};
    jobs = {
        "set": false
        , "change": false
        , "bubble": false
    }
    constructor(forObj) {
        this.id = gr.uid++;
        this.forObj = forObj;
    }

    addEvent(evType, cb: (e: DepEv) => any) {
        if (!this.evPool[evType]) {
            this.evPool[evType] = [];
        }
        this.evPool[evType].push(cb);
    }
    removeEvent(evType, cb: callBack) {
        this.evPool[evType] = [];
    }
    emit(type: string, customerEv?) {
        this.doingEv = type
        if (this.jobs[type]) {
            return;
        }
        if (this.jobs[type] === undefined) {
            this.jobs[type] = false;
        }
        var ev = customerEv || {
            data: (this.forObj.get && this.forObj.get()) || ""
            , from: this.forObj
        }
        // switch (type) {
        //     case "set":
        //     case "change":
        //     case "bubble":
        //     case "array":
        //     break;
        // }
        this.do(ev);
        if (!Dep.isToIgnore(type)) {
            this.emit("bubble", ev)
        }
    }
    do(ev: DepEv) {
        var evty = this.doingEv
        var jobs = this.jobs;
        function workList() {
            var callBacks = this.evPool[evty];
            for (var i in callBacks) {
                if (callBacks[i] instanceof Function) {
                    callBacks[i](ev);
                }
                jobs[evty] = false;
            }
        }
        if (!this.jobs[evty]) {
            jobs[evty] = true;
            js.nextTick(workList, this);
        }
    }
    static toIgnore = {
        bubble: true
        , reArray: true
        , reArrayDone: true
    }
    static isToIgnore(type) {
        if (Dep.toIgnore[type]) {
            return true;
        }
        return false;
    }
}

class Dom {
    html: ele | ele[]
    domRus: DomRus
    args: {
        [key: string]: ele[]
    } = {}
    constructor(jsDom: any) {
        // var Evm = new EventManager();
        var self = this;
        function getDom(dom: any): DomRus {
            //for specail prop
            //for specails 
            var rus: DomRus = {
                has: {
                    on: null
                    , data: null
                    , args: null
                    , style: null
                    , $: null
                }
                , docs: []
            }
            //create docs;
            for (let x in dom) {
                if (Dom.is_specail(x)) {
                    rus.has[x] = dom[x];
                    continue;
                }
                //avoid duplitly analizing
                var prop: Prop = Hif.Cac.do(x, Prop)

                /**Prop.name 生成记录当前的 ele 的变量
                 * it is an ele[]
                 */
                var domRus: DomRus;
                var dnext = dom[x]
                //判断name 是否存在于this.dom上
                function addValueName(name, oneEle) {
                    if (name) {
                        if (self.args[name]) {
                            self.args[name].push(oneEle);
                        } else {
                            self.args[name] = [oneEle];
                        }
                    }
                }
                function workForChildren(chilProp: Prop, parent: ele, index) {
                    for (let i = 0; i < chilProp.num; i++) {
                        let oneEle = Hif.creatEle(chilProp);

                        addValueName(chilProp.name, oneEle);

                        parent.appendChild(oneEle);

                        if (chilProp.Children) {
                            workForChildren(chilProp.Children, oneEle, index*chilProp.num + i)
                        } else {
                            workForFinalEle(chilProp, oneEle, index*chilProp.num + i)
                        }
                    }
                }
                function workForFinalEle(fprop, fEle, index) {
                    switch (true) {
                        case js.isPrimitive(dnext):
                            var tmpele = Hif.creatEle(fprop);
                            Hif.setVal(tmpele, "innerHTML", dnext)
                            rus.docs.push(tmpele);
                            break;
                        case dnext instanceof ArrayData:
                            var tmpele = Hif.creatEle(fprop);
                            Hif.setVal(tmpele, "", dnext)
                            rus.docs.push(tmpele);
                            break;
                        case typeof dnext == "object":
                            domRus = getDom(dnext)
                            Dom.initSpecail(fEle, domRus,index);
                            Hif.addDocs(fEle, domRus)
                            break;
                    }
                }

                //analy prop
                for (let j = 0; j < prop.num; j++) {
                    let oneEle = Hif.creatEle(prop);
                    //want to return docs
                    rus.docs.push(oneEle);

                    addValueName(prop.name, oneEle)

                    if (prop.Children) {
                        workForChildren(prop.Children, oneEle, j)
                    } else {
                        //every times create new dom node
                        workForFinalEle(prop, oneEle, j)
                    }
                }
            }
            return rus;
        }
        this.domRus = getDom(jsDom)
        this.html = this.domRus.docs;
    }

    //index use to get one from array value 
    static initSpecail(ele: HTMLElement, domRus: DomRus,index) {
        var to = Hif.Spf(ele, domRus)
        if (domRus) {
            for (let x in domRus.has) {
                if (domRus.has[x] !== null) {
                    to.do(<SpecailProp>x , index);
                }
            }
        }
    }
    static is_specail(str: string) {
        var specail = {
            on: 1
            , data: 1
            , style: 1
            , args: 1
            , $: 1
        }
        return !!specail[str];
    }
}

class Hiv {
    constructor(jsHiv) {
        Hif.target = jsHiv.data;

        var dom = new Dom(jsHiv.dom)



        //deal with for {}
    }
}

type domFunc = {
    [key: string]: (this: ele) => void
}
function For<T>(from: T, cb: callBack | domFunc): setData<T, keyof T> {
    switch (true) {
        case Array.isArray(from):
            from.forEach()
            break;

        case (from instanceof ArrayData):
            var dataList = from.srData;
            function update() {
                var domList: any[] = [];
                dataList.forEach(function (a, b, c) {
                    var jsDom = cb.call(this, a, b, c);
                    var newDom;
                    newDom = a.__map_dom__;
                    if (newDom) {
                        domList.push(newDom);
                    } else {
                        newDom = new Dom(jsDom);
                        a.__map_dom__ = newDom;
                        domList.push(newDom);
                    }
                });
                from.__map_domList__ = domList;
                js.Sp(from).notify("domCreated")
            }
            js.Sp(from).on("reArrayDone", update)

            update();
    }
    return from;
}