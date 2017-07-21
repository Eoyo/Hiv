
type toObserver = string | number | boolean | any[]
interface mayWatched {
    __ob__?: Observer
}
interface mySet {
    has(key: string | number): boolean
    add(key: string | number): boolean
    clear()
}
type callBack = (...args: any[]) => any

var arr = {
    remove(ar, item) {
        if (ar.length) {
            var index = ar.indexOf(item);
            if (index > -1) {
                return ar.splice(index, 1)
            }
        }
    }
    , Proto: Array.prototype
    , Methods: []
    , Keys: [""]
    , init() {
        arr.Methods = Object.create(arr.Proto);
        arr.Keys = Object.getOwnPropertyNames(arr.Methods);
        [
            'push',
            'pop',
            'shift',
            'unshift',
            'splice',
            'sort',
            'reverse'
        ]
            .forEach(function (method) {
                // cache original method
                var original = arr.Proto[method];
                js.def(arr.Methods, method, function mutator() {
                    var arguments$1 = arguments;

                    // avoid leaking arguments:
                    // http://jsperf.com/closure-with-arguments
                    var i = arguments.length;
                    var args = new Array(i);
                    while (i--) {
                        args[i] = arguments$1[i];
                    }
                    var result = original.apply(this, args);
                    var ob = this.__ob__;
                    var inserted;
                    switch (method) {
                        case 'push':
                            inserted = args;
                            break
                        case 'unshift':
                            inserted = args;
                            break
                        case 'splice':
                            inserted = args.slice(2);
                            break
                    }
                    if (inserted) { ob.observeArray(inserted); }
                    // notify change
                    ob.dep.notify();
                    return result
                });
            });
    }

    //rewrite the array operation function
    , argument(value: any[]) {
        function protoAugment(target, src) {
            /* eslint-disable no-proto */
            target.__proto__ = src;
            /* eslint-enable no-proto */
        }

        /**
         * Augment an target Object or Array by defining
         * hidden properties.
         */
        /* istanbul ignore next */
        function copyAugment(target, src, keys) {
            for (var i = 0, l = keys.length; i < l; i++) {
                var key = keys[i];
                js.def(target, key, src[key]);
            }
        }
        var augment = test.hasProto
            ? protoAugment
            : copyAugment;
        augment(value, arr.Methods, arr.Keys);
    }
}
var reg = {
    bailRE: /[^\w.$]/
}
var str = {
    parsePath(path: string) {
        if (reg.bailRE.test(path)) {
            return
        }
        var segments = path.split('.');
        return function getByPath(obj: object) {
            for (var i = 0; i < segments.length; i++) {
                if (!obj) { return }
                obj = obj[segments[i]];
            }
            return obj
        }
    }
}
const config = {
    observerState: {
        shouldConvert: true,
        isSettingProps: false
    }
    , noDoSame: true
    , dev_pro: (function () {
        var a = "development"
            , b = "production"
        return a !== b;
    })()
    , MAX_UPDATE_COUNT: 100
    , __VUE_DEVTOOLS_GLOBAL_HOOK__: false
    , init() {
        Object.freeze(config);
    }
}
var proxy = {
    defineReactive(obj, key, val, customSetter?) {
        var dep = new Dep();

        var property = Object.getOwnPropertyDescriptor(obj, key);
        if (property && property.configurable === false) {
            return
        }

        // cater for pre-defined getter/setters
        var getter = property && property.get;
        var setter = property && property.set;

        var childOb = proxy.observe(val);

        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get: function reactiveGetter() {
                var value = getter ? getter.call(obj) : val;
                if (Dep.target) {
                    dep.depend();
                    if (childOb) {
                        childOb.dep.depend();
                    }
                    if (Array.isArray(value)) {
                        proxy.dependArray(value);
                    }
                }
                return value
            },
            set: function reactiveSetter(newVal) {
                var value = getter ? getter.call(obj) : val;
                /* eslint-disable no-self-compare */
                if ((newVal === value && config.noDoSame) || (newVal !== newVal && value !== value)) {
                    return
                }
                /* eslint-enable no-self-compare */
                if (config.dev_pro && customSetter) {
                    customSetter();
                }
                if (setter) {
                    setter.call(obj, newVal);
                } else {
                    val = newVal;
                }
                childOb = proxy.observe(newVal);
                dep.notify();
            }
        });
    }
    , observe(value, asRootData?): Observer | null {
        if (!js.isObject(value)) {
            return null;
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
    , dependArray(value: any[]) {
        for (var e, i = 0, l = value.length; i < l; i++) {
            e = value[i];
            e && e.__ob__ && e.__ob__.dep.depend();

            if (Array.isArray(e)) {
                proxy.dependArray(e);
            }
        }
    }
    , traverse: (function () {
        var seenObjects = new js.Set();
        function traverse(val: mayWatched) {
            seenObjects.clear();
            _traverse(val, seenObjects);
        }

        function _traverse(val: mayWatched, seen: mySet) {
            var i, keys;
            var isA = Array.isArray(val);
            if ((!isA && !js.isObject(val)) || !Object.isExtensible(val)) {
                return
            }

            //has been whatched
            if (val.__ob__) {
                var depId = val.__ob__.dep.id;
                if (seen.has(depId)) {
                    return
                }
                seen.add(depId);
            }

            if (Array.isArray(val)) {
                i = val.length;
                while (i--) { _traverse(val[i], seen); }
            } else {
                keys = Object.keys(val);
                i = keys.length;
                while (i--) { _traverse(val[keys[i]], seen); }
            }
        }
        return traverse;
    })()
    , queue: (function () {
        var queue: Watcher[] = []
            , activatedChildren: Vue[] = []
            , has = {}
            , circular = {}
            , waiting = false
            , flushing = false
            , index = 0
        var func = {
            queueWatcher(watcher: Watcher) {
                var id = watcher.id;
                if (has[id] == null) {
                    has[id] = true;
                    if (!flushing) {
                        queue.push(watcher);
                    } else {
                        // if already flushing, splice the watcher based on its id
                        // if already past its id, it will be run next immediately.
                        var i = queue.length - 1;
                        while (i >= 0 && queue[i].id > watcher.id) {
                            i--;
                        }
                        queue.splice(Math.max(i, index) + 1, 0, watcher);
                    }
                    // queue the flush
                    if (!waiting) {
                        waiting = true;
                        js.nextTick(func.flushSchedulerQueue);
                    }
                }
            }
            , resetSchedulerState() {
                queue.length = activatedChildren.length = 0;
                has = {};
                {
                    circular = {};
                }
                waiting = flushing = false;
            }
            /**
             * Flush both queues and run the watchers.
             */
            , flushSchedulerQueue() {
                flushing = true;
                var watcher, id;

                // Sort queue before flush.
                // This ensures that:
                // 1. Components are updated from parent to child. (because parent is always
                //    created before the child)
                // 2. A component's user watchers are run before its render watcher (because
                //    user watchers are created before the render watcher)
                // 3. If a component is destroyed during a parent component's watcher run,
                //    its watchers can be skipped.
                queue.sort(function (a, b) { return a.id - b.id; });

                // do not cache length because more watchers might be pushed
                // as we run existing watchers
                for (index = 0; index < queue.length; index++) {
                    watcher = queue[index];
                    id = watcher.id;
                    has[id] = null;
                    watcher.run();
                    // in dev build, check and stop circular updates.
                    if (config.dev_pro && has[id] != null) {
                        circular[id] = (circular[id] || 0) + 1;
                        if (circular[id] > config.MAX_UPDATE_COUNT) {
                            test.warn(
                                'You may have an infinite update loop ' + (
                                    watcher.user
                                        ? ("in watcher with expression \"" + (watcher.expression) + "\"")
                                        : "in a component render function."
                                ),
                                watcher.vm
                            );
                            break
                        }
                    }
                }

                // keep copies of post queues before resetting state
                var activatedQueue = activatedChildren.slice();
                var updatedQueue = queue.slice();

                func.resetSchedulerState();

                // call component updated and activated hooks
                func.callActivatedHooks(activatedQueue);
                func.callUpdateHooks(updatedQueue);

                // devtool hook
                /* istanbul ignore if */
                // if (devtools && config.devtools) {
                //     devtools.emit('flush');
                // }
            }
            , callUpdateHooks(queue) {
                var i = queue.length;
                while (i--) {
                    var watcher = queue[i];
                    var vm = watcher.vm;
                    if (vm._watcher === watcher && vm._isMounted) {
                        func.callHook(vm, 'updated');
                    }
                }
            }
            , queueActivatedComponent(vm) {
                // setting _inactive to false here so that a render function can
                // rely on checking whether it's in an inactive tree (e.g. router-view)
                vm._inactive = false;
                activatedChildren.push(vm);
            }
            , callActivatedHooks(queue) {
                for (var i = 0; i < queue.length; i++) {
                    queue[i]._inactive = true;
                    func.activateChildComponent(queue[i], true /* true */);
                }
            }
            , isInInactiveTree(vm) {
                while (vm && (vm = vm.$parent)) {
                    if (vm._inactive) { return true }
                }
                return false
            }
            , activateChildComponent(vm, direct?) {
                if (direct) {
                    vm._directInactive = false;
                    if (func.isInInactiveTree(vm)) {
                        return
                    }
                } else if (vm._directInactive) {
                    return
                }
                if (vm._inactive || vm._inactive === null) {
                    vm._inactive = false;
                    for (var i = 0; i < vm.$children.length; i++) {
                        func.activateChildComponent(vm.$children[i]);
                    }
                    func.callHook(vm, 'activated');
                }
            }

            , deactivateChildComponent(vm, direct?) {
                if (direct) {
                    vm._directInactive = true;
                    if (func.isInInactiveTree(vm)) {
                        return
                    }
                }
                if (!vm._inactive) {
                    vm._inactive = true;
                    for (var i = 0; i < vm.$children.length; i++) {
                        func.deactivateChildComponent(vm.$children[i]);
                    }
                    func.callHook(vm, 'deactivated');
                }
            }

            , callHook(vm, hook) {
                var handlers = vm.$options[hook];
                if (handlers) {
                    for (var i = 0, j = handlers.length; i < j; i++) {
                        try {
                            handlers[i].call(vm);
                        } catch (e) {
                            test.handleError(e, vm, (hook + " hook"));
                        }
                    }
                }
                if (vm._hasHookEvent) {
                    vm.$emit('hook:' + hook);
                }
            }
        }
        return func;
    })()
}


var test = {
    hasProto: '__proto__' in {}
    , br: (function initBrowser() {
        var inBrowser = typeof window !== 'undefined'
        var UA = inBrowser && window.navigator.userAgent.toLowerCase()

        var br = {
            inBrowser,
            devtool: inBrowser && config.__VUE_DEVTOOLS_GLOBAL_HOOK__,
            isIE: UA && /msie|trident/.test(UA),
            isIE9: UA && UA.indexOf('msie 9.0') > 0,
            isEdge: UA && UA.indexOf('edge/') > 0,
            isAndroid: UA && UA.indexOf('android') > 0,
            isIOS: UA && /iphone|ipad|ipod|ios/.test(UA),
            isChrome: false
        }
        br.isChrome = !!(UA && /chrome\/\d+/.test(UA) && !br.isEdge)
        return br;
    })()
    , devtools: ""
    , global: this

    , handleError(...args) {
    }
    , _isServer: undefined as undefined | boolean
    , isServerRendering() {
        if (test._isServer === undefined) {
            /* istanbul ignore if */
            if (!test.br.inBrowser && typeof test.global !== 'undefined') {
                // detect presence of vue-server-renderer and avoid
                // Webpack shimming the process


                // _isServer = global['process'].env.VUE_ENV === 'server';
                test._isServer = true;
            } else {
                test._isServer = false;
            }
        }
        return test._isServer
    }
    , warn(str: string, any) {
        console.log(str);
    }

    //mine addings
    ,wrong(){

    }
    , init() {
        test.isServerRendering();
    }
}

//init the value | object;
arr.init();
// test.init();
// proxy.init();
class Vue {
    try: string
    _isBeingDestroyed: boolean
    _watchers: Watcher[]
    constructor() {
        this.try = "hello"
    }
}
class Deps {
    static target: Watcher | null = null
    static targetStack: any[] = []
    static pushTarget(_target) {
        if (Dep.target) { Dep.targetStack.push(Dep.target); }
        Dep.target = _target;
    }
    static popTarget() {
        Dep.target = Dep.targetStack.pop();
    }

    id: number
    subs: Watcher[] //subscriber
    constructor(forObj) {
        this.id = gr.uid++;
        this.subs = [];
        
    }

    addSub(sub: object) {
        this.subs.push(sub);
    }
    removeSub(sub: Watcher) {
        arr.remove(this.subs, sub);
    }
    depend() {
        if (Dep.target) {
            Dep.target.addDep(this);
        }
    }
    notify() {
        // stabilize the subscriber list first
        var subs = this.subs.slice();
        for (var i = 0, l = subs.length; i < l; i++) {
            subs[i].update();
        }
    }
}
class Watcher {
    deep: boolean
    user: boolean
    lazy: boolean
    sync: boolean
    vm: Vue
    getter: Function

    id = ++gr.uid$2 // uid for batching
    active = true
    dirty = this.lazy // for lazy watchers
    deps: Dep[]
    newDeps: Dep[]
    depIds = new js.Set()
    newDepIds = new js.Set()

    expression
    cb:callBack
    value

    constructor(vm, expOrFn: string | Function, cb:callBack, options?) {
        this.vm = vm;
        vm._watchers.push(this);
        // options
        if (options) {
            this.deep = !!options.deep;
            this.user = !!options.user;
            this.lazy = !!options.lazy;
            this.sync = !!options.sync;
        } else {
            this.deep = this.user = this.lazy = this.sync = false;
        }
        this.cb = cb;

        // parse expression for getter
        if (typeof expOrFn === 'function') {
            this.getter = expOrFn;
        } else {
            /**
             * when expOrFn is path-str
             * tempGetter will get one obj and return the thing by the path in that obj;
             */
            var tempGetter = str.parsePath(expOrFn);

            if (typeof tempGetter == "undefined") {
                this.getter = function () { }

                config.dev_pro && test.warn(
                    "Failed watching path: \"" + expOrFn + "\" " +
                    'Watcher only accepts simple dot-delimited paths. ' +
                    'For full control, use a function instead.',
                    vm
                );
            }
        }
        this.value = this.lazy
            ? undefined
            : this.get();
    }

    /**
     * Evaluate the getter, and re-collect dependencies.
     */
    get() {
        Dep.pushTarget(this);
        var value;
        var vm = this.vm;
        if (this.user) {
            try {
                value = this.getter.call(vm, vm);
            } catch (e) {
                test.handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
            }
        } else {
            value = this.getter.call(vm, vm);
        }
        // "touch" every property so they are all tracked as
        // dependencies for deep watching
        if (this.deep) {
            proxy.traverse(value);
        }
        Dep.popTarget();
        this.cleanupDeps();
        return value
    };

    /**
     * Add a dependency to this directive.
     */
    addDep(dep: Dep) {
        var id = dep.id;
        if (!this.newDepIds.has(id)) {
            this.newDepIds.add(id);

            this.newDeps.push(dep);

            //dep add subscriber
            if (!this.depIds.has(id)) {
                dep.addSub(this);
            }
        }
    };

    /**
     * Clean up for dependency collection.
     */
    cleanupDeps() {
        var this$1 = this;

        var i = this.deps.length;
        while (i--) {
            var dep = this$1.deps[i];
            if (!this$1.newDepIds.has(dep.id)) {
                dep.removeSub(this$1);
            }
        }
        var tmp = this.depIds;
        this.depIds = this.newDepIds;
        this.newDepIds = tmp;
        this.newDepIds.clear();

        var temp = this.deps;
        this.deps = this.newDeps;
        this.newDeps = temp;

        this.newDeps.length = 0;
    };

    /**
     * Subscriber interface.
     * Will be called when a dependency changes.
     */
    update() {
        switch (true){
            case this.lazy:
                this.dirty = true;
            break;

            case this.sync:
                this.run()
            break;

            default :
                proxy.queue.queueWatcher(this);
            break;
        }
    };

    /**
     * Scheduler job interface.
     * Will be called by the scheduler.
     */
    run() {
        if (this.active) {
            var value = this.get();
            if (
                value !== this.value ||
                // Deep watchers and watchers on Object/Arrays should fire even
                // when the value is the same, because the value may
                // have mutated.
                js.isObject(value) ||
                this.deep
            ) {
                // set new value
                var oldValue = this.value;
                this.value = value;
                if (this.user) {
                    try {
                        this.cb.call(this.vm, value, oldValue);
                    } catch (e) {
                        test.handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
                    }
                } else {
                    this.cb.call(this.vm, value, oldValue);
                }
            }
        }
    };

    /**
     * Evaluate the value of the watcher.
     * This only gets called for lazy watchers.
     */
    evaluate() {
        this.value = this.get();
        this.dirty = false;
    };

    /**
     * Depend on all deps collected by this watcher.
     */
    depend() {
        var this$1 = this;

        var i = this.deps.length;
        while (i--) {
            this$1.deps[i].depend();
        }
    };

    /**
     * Remove self from all dependencies' subscriber list.
     */
    teardown() {
        var this$1 = this;

        if (this.active) {
            // remove self from vm's watcher list
            // this is a somewhat expensive operation so we skip it
            // if the vm is being destroyed.
            if (!this.vm._isBeingDestroyed) {
                arr.remove(this.vm._watchers, this);
            }
            var i = this.deps.length;
            while (i--) {
                this$1.deps[i].removeSub(this$1);
            }
            this.active = false;
        }
    };
}
class Observer {
    value: any
    dep: Dep
    vmCount: number
    constructor(value: any) {
        this.value = value;
        this.dep = new Dep();
        this.vmCount = 0;

        js.def(value, '__ob__', this);

        if (Array.isArray(value)) {
            arr.argument(value);
            this.observeArray(value);
        } else {
            this.walk(value);
        }
    }
    walk(obj) {
        for (var key in obj) {
            proxy.defineReactive(obj, key, obj[key]);
        }
    }
    observeArray(items) {
        for (var i = 0, l = items.length; i < l; i++) {
            proxy.observe(items[i])
        }
    }

}

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.