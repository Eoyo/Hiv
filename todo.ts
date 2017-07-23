
var srData = {
    title: ""
    , newTodo: ""
    , allDone: false
    , list: [
        {
            things: "&nbsp;"
            , isEditing: false
            , completed: false
        }
    ]
    , remaining: 0
}
var todo = new Data(srData);
Hif.target = todo;
var doa = new Dom({
    "section .todoapp": {
        "header .header": {
            "h1": {
                $: "todos"
            }
            , "input .new-todo  ::addToDo": {
                args: {
                    placeholder: "add todos here"
                    , autofocus: "on"
                    , model: todo.newTodo
                }
            }
        }
        , "section .main": {
            "input .toggle-all [type = 'checkbox']": {
                args: {
                    value: todo.allDone
                }
            }
            , "ul.todo-list": For(todo.list, (onedo) => {
                return {
                    "li": {
                        args: {
                            class: {
                                todo :true
                                , completed: onedo.completed
                                , editing: onedo.isEditing
                            }
                        },
                        "div.view": {
                            "input .toggle [type =  'checkbox']": {
                                args: {
                                    model: onedo.completed
                                }
                            }
                            , "label": {
                                $: onedo.things
                                , on: {
                                    dblclick() {
                                        onedo.isEditing.set(true)
                                    }
                                }
                            }
                            , "button .destroy": {
                                on: {
                                    click() {
                                        console.log(onedo.nodeName)
                                        todo.list.splice(onedo.nodeName, 1)
                                    }
                                }
                            }
                        }
                        , "inpue .edit": {
                            args: {
                                value: onedo.things
                            }
                            , on: {
                                "blur"() { func.doneEdit(onedo) }
                                , "keyup": {
                                    enter() { func.doneEdit(onedo) }
                                    , esc() { func.cancelEdit(onedo) }
                                }
                            }
                        }
                    }
                }
            })
        }
        , "footer .footer": {
            args: {
                show: true
            }
            , "span .todo-count": {

            }

            , "ul .filters": {
                "3*li > a":{
                    args:{
                        href:["#/all","#/active","#/completed"]
                    }
                    ,$:[
                        "All","Active","Completed"
                    ]
                    , on :{
                        click:Tool.initFunc("change",{
                            func(e){
                                e.target.className = "selected"
                                this.getLastOne().className = ""
                            }
                            ,id(e){
                                return e.target;
                            }
                        })
                    }
                }
            }
            , "button .clear-completed": {
                on: {
                    click() {

                    }
                }
                , args: {
                    show() {
                        return todo.list.length > todo.remaining
                    }
                }
                , $: "Clear completed"
            }
        }
    }
})

var func = {
    doneEdit(onedo) {

    }
    , cancelEdit(onedo) {

    }
}
// For(doa, {
//     addToDo() {
//         this.addEventListener("keyup", (e) => {
//             if (e.keyCode == 13) {
//                 todo.list.push({
//                     things: this.value
//                 });
//                 todo.newTodo.set("");
//             }
//         })
//     }
// })
doa.args.addToDo[0].addEventListener("keyup", (e) => {
    if (e.keyCode == 13) {
        if(!e.target.value){
            return;
        }
        todo.list.unshift({
            things: e.target.value
            , completed: false
            , isEditing :false
        });
        todo.list.sort(function(a,b){
            if( a.things.get() > b.things.get() ){
                return 1;
            }else{
                return -1
            }
        })
        todo.newTodo.set("");
    }
});


var show: ele = <ele>document.getElementById("show")
Hif.setChildren(show, doa.html)