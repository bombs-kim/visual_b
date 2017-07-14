// [External dependencies]
// focus: visual.html
// printUpdate: visual.html
// decorateFinal: visual.html

mem = {}

var locGenerator = function* () {
    var cur_loc = 10000; // starting memory address
    while(true)
        yield cur_loc++;
}();

function new_loc() {
    return locGenerator.next().value;  }

function get_updated_env(x,v,env){
    obj = {}
    obj[x] = v;
    return Object.assign(obj, env);  }


function getBop(type) {
    switch (type) {
    case "ADD":
        return function (a, b) {return a+b;};
    case "SUB":
        return function (a, b) {return a-b;};
    case "MUL":
        return function (a, b) {return a*b;};
    case "DIV":
        return function (a, b) {return a/b;};
    }  }

function unpack(vsOrNums){
    function cont(c){return c.content;}
    var ret = [];
    for (var i = 0; i < vsOrNums.length; i++){
        ret.push(cont(vsOrNums[i])); }
    return ret;  }

function is_empty_obj(obj){
    return (Object.keys(obj).length === 0 &&
            obj.constructor === Object);  }

function input(msg){
    return Number(prompt(msg));  }


function* evalSubExpHelper(gen, sub_results){
    var next = gen.next();
    var cur = null;
    while (!next.done){
        cur = next;
        console.log(cur.value);
        yield;
    next = gen.next();}
    console.log("cur.val type", typeof cur.value);
    sub_results.push(cur.value);
}

var specialSubExpCases = ["WHILE", "LETV", "LETF", "CALLV", "CALLR"];
var singleFocus = ["NUM", "VAR", "RECORD", "READ"];

function* evalExp(env, node){
    var type = node.type;
    console.log("cur node ", type);
    var children = node.children;
    var vs = unpack(node.content.vs);
    var nums = unpack(node.content.nums);

    if (!singleFocus.includes(type)){
        focus(node, "Not available");
        yield;  }

    var subs = []; //results of sub expressions
    if (!specialSubExpCases.includes(type)){
        for (var i = 0; i < node.children.length; i++){
            var gen = evalSubExpHelper(evalExp(env, children[i]), subs);
            while(!gen.next().done)
                yield;
        }  }

    switch (type){
    case "NUM":
        focus(node, nums[0]);
        yield Number(nums[0]);
        return; // important. finish generator
    case "VAR":
        focus(node, mem[env[vs[0]]]);
        yield mem[env[vs[0]]];
        return;
    case "ADD":
    case "SUB":
    case "MUL":
    case "DIV":
        var bop = getBop(type);
        console.assert(
            typeof subs[0] === "number" && typeof subs[1] === "number");
        var ret = bop(subs[0],subs[1]);
        focus(node, ret);
        yield ret;
        return;
    case "EQUAL":
        var ret = ( (subs[0] === subs[1]) || // n1=n2 or b1=b2
                (is_empty_obj(subs[0]) && is_empty_obj(subs[0])) );
        focus(node, ret);
        yield ret;
        return
    case "LESS":
        console.assert(typeof subs[0] === "number" && typeof subs[1] === "number");
        focus(node);
        var ret = subs[0] < subs[1];
        focus(node, ret);
        yield ret;
        return;
    case "NOT":
        console.assert(typeof subs[0] === "boolean");
        focus(node, !b);
        yield !b;
        return;
    case "SEQ":
        focus(node, subs[1]);
        yield subs[1]; // ignore subs[0]
        return;
    case "IF":
        console.assert(typeof subs[0] === "boolean");
        if (subs[0]) {
            focus(node, subs[1]);
            yield subs[1];  }
        else {
            focus(node, subs[2]);
            yield subs[2];  }
        return;
    case "WHILE":
        var gen = evalSubExpHelper(
            evalExp(env, children[0]), subs);
        while (!gen.next().done)
            yield;
        console.assert(typeof subs[0] === "boolean");
        if (subs[0]) {
            var gen = evalSubExpHelper(
                evalExp(env, children[1]), subs);
            while (!gen.next().done) yield;
            var gen = evalSubExpHelper(
                evalExp(env, node), subs);
            while (!gen.next().done) yield;
            focus(node, subs[2]);
            yield subs[2];  } // always null(unit)
        else {
            focus(node, null);
            yield null;}    // equivalent to unit in B langauge
        return;
    case "LETV":
        var x = vs[0];
        var gen = evalSubExpHelper(
            evalExp(env, children[0]), subs);
        while (!gen.next().done) yield;
        var nl = new_loc();
        mem[nl] = subs[0];
        var gen = evalSubExpHelper(
            evalExp(get_updated_env(x,nl,env), children[1]),
            subs);
        while (!gen.next().done) yield;
        focus(node, subs[1]);
        yield subs[1];
        return;
    case "LETF":
        var fname = vs[0];
        // var argnames = ARGScont(children[0]); // check this out
        var argnames = unpack(children[0].content.vs);
        var e1 = children[1]
        var fbody = [argnames,e1,env];
        var gen = evalSubExpHelper(
                    evalExp(get_updated_env(fname, fbody, env),
                                children[2]),
                    subs);
        while (!gen.next().done) yield;
        focus(node, subs[2]);
        yield subs[2];
        return;
    case "CALLV":
        var fname = vs[0];
        var _args = children[0].content.nts; // before eval
        var args = [];
        var nargs = _args.length;
        var gen = evalSubExpHelper(
                    evalExp(env, _args[i]), subs );
        while (!gen.next().done) yield;
        for (var i = 0; i < nargs; i++){
            args.push(subs[0]);  }
        var [argnames, f_exp, f_env] = env[fname];
        for (var i = 0; i < nargs; i++){
            var nl = new_loc();
            f_env = get_updated_env(argnames[i], nl, f_env);
            mem[nl] = args[i];  }
        f_env = get_updated_env(fname, env[fname], f_env);

        f_returns = [];
        var gen = evalSubExpHelper(
                    evalExp(f_env, f_exp), f_return );
        while (!gen.next().done) yield;
        focus(node, f_returns[0]);
        yield f_returns[0];
        return;
    case "CALLR":
        var fname = vs[0];
        var args = unpack(children[0].content.vs); // ex) ["x", "y", "z"]
        var [argnames, f_exp, f_env] = env[fname];
        for (var i = 0; i < argnames.length; i ++){
            f_env = get_updated_env(argnames[i], env[args[i]], f_env);  }
        f_env = get_updated_env(fname, env[fname], f_env);
        f_returns = [];
        var gen = evalSubExpHelper(
                    evalExp(f_env, f_exp), f_returns );
        while (!gen.next().done) yield;
        focus(node, f_returns[0]);
        yield f_returns[0];
        return;
    // record construction
    case "RECORD":
        var rec = {}
        for (var i = 0; i < vs.length; i++){
            var nl = new_loc();
            rec[vs[i]] = nl;
            mem[nl] = Number(nums[i]);
        }
        focus(node, rec); // need to be checked
        yield rec;
        return;
    case "FIELD":
        var rec = subs[0];
        var x = vs[0];
        focus(node, mem[rec[x]]);
        yield mem[rec[x]];
        return;
    case "ASSIGN":
        var x = vs[0];
        var v = subs[0];
        mem[env[x]] = v;
        focus(node, v);
        yield v;
        return;
    case "ASSIGNF":
        var rec = subs[0];
        var x = vs[0];
        var v = subs[1];
        mem[rec[x]] = v;
        focus(node, v);
        yield v;
        return;
    case "READ":
        var x = vs[0];
        var v = input(
            "Enter value of " + x + "\n(in an integer)");
        mem[env[x]] = v;
        focus(node, v);
        yield v;
        return;
    case "WRITE":
        var n = subs[0];
        printUpdate(n);
        focus(node, n);
        yield n;
        return;
    }
}

function* eval(root){
    var gen = evalExp({}, root);
    while(!gen.next().done) yield;
    decorateFinal();
    yield;
}

window.eval = eval
