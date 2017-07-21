# Hiv
High Vue ->Hiv ,It is cool!
the main demo is `show.html`
With Hiv you can create dom like this:
```js
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

//new Data Object
var mk = new Data(dtt);

//books component
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
            value: mk.write //bind value to mk.write //premise: mk.write is an object
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
            , $ :"this will be writen to innerHTML"
            , data: {
                coosss: "sfsf"
            }
        }
    }
})
```
## this project is developing .at this stage ,there are three globle partner:
```js
class Data ,class Dom,Function For(,)
```

## At future ,your would see more powerful feature of Hiv;
tell you some hints :
such as:function builder
,event builder 
, js.Sp() 
more detail at : my blog
