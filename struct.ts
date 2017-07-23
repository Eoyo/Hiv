var menuFunc = {
    troggleColor: Tool.initFunc("troggleSet", {
        func(e: Ev) {
            e.target.style.background = this.color;
        }
        , args: {
            color: {
                even: "#3cf"
                , odd: "#3fc"
            }
        }
        , id(e: Ev) {
            return e.target;
        }
    })
    , setGreen(this: Args) {
        this.dom.style.background = this.color;
    }
}

// declare var Data: DataConstructor;

var dtt = {
    write: "green",
    size: "3px",
    show: false,
    books: [
        {
            name: "gelin"
            , year: [
                156, 16, 65, 65, 65, 65, 6565, 6
            ]
        }
    ]
}
var mk = new Data(dtt);

function IF(...args) { }
// var div = MarkDown.dom.div[0];
var books = For(mk.books, (a, b) => {
    return {
        ".oneBook ::books": {
            ".title": {
                $: a.name
            }
            , ".content": {
                $: mk.write
            }
        }
    }
})
var doa = new Dom({
    "textarea .good ::txt": {
        on: {
            input: Tool.initFunc("delay", {
                func(e) {
                    mk.write.set(e.target.value);
                }
                , time: 60
            })
        },
        data: {
            cool: "lim"
        }
        , args: {
            value: mk.write
        }
    }
    , "div": {
        ".food": {
            "p": {
                $: mk.write
                , style: {
                    color: mk.write
                    , height: "20px"
                    , width: mk.write
                    , transition: "width .5s"
                    , background: "#f3c"
                }
            }
            , ".wrap": books
            , $ :"scale"
            , data: {
                coosss: "sfsf"
            }
        }
    }
})
var show: ele = <ele>document.getElementById("show")
show.appendChild(doa.html)


