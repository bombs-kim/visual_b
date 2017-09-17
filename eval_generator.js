// [External dependencies]
// focus: visual.js
// updatePrint: visual.html
// finalizeResult: visual.html

// window.mem = {}

var locGenerator = function* () {
    var cur_loc = 10000; // starting memory address
    while(true)
        yield cur_loc++;
}();

function new_loc() {
    return locGenerator.next().value;  }

function get_updated_env(x,v,env){
    obj = {}
    Object.assign(obj, env)
    obj[x] = v;
    return obj;  }

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
        yield;
    next = gen.next();}
    sub_results.push(cur.value);
}

var specialSubExpCases = ["IF", "WHILE", "LETV", "LETF", "CALLV", "CALLR"];
var singleFocus = ["TRUE", "FALSE", "UNIT", "NUM", "VAR", "RECORD", "READ"];

function* evalExp(env, node){
    var type = node.type;
    console.log("eval node: ", type, " env", env);
    var children = node.children;
    var vs = unpack(node.content.vs);
    var nums = unpack(node.content.nums);

    if (!singleFocus.includes(type)){
        focus(node, "Not available", mem, env);
        yield;  }

    var subs = []; //results of sub expressions
    if (!specialSubExpCases.includes(type)){
        for (var i = 0; i < node.children.length; i++){
            var gen = evalSubExpHelper(evalExp(env, children[i]), subs);
            while(!gen.next().done)
                yield;
        }  }

    switch (type){
    case "TRUE":
        focus(node, true, mem, env);
        yield true;
        return;
    case "FALSE":
        focus(node, false, mem, env);
        yield false;
        return;
    case "UNIT":
        focus(node, null, mem, env);
        yield null;
        return;
    case "NUM":
        focus(node, nums[0], mem, env);
        yield Number(nums[0]);
        return; // important. finish generator
    case "VAR":
        focus(node, mem[env[vs[0]]], mem, env);
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
        focus(node, ret, mem, env);
        yield ret;
        return;
    case "EQUAL":
        var ret = ( (subs[0] === subs[1]) || // n1=n2 or b1=b2
                (is_empty_obj(subs[0]) && is_empty_obj(subs[0])) );
        focus(node, ret, mem, env);
        yield ret;
        return
    case "LESS":
        console.assert(typeof subs[0] === "number" && typeof subs[1] === "number");
        var ret = subs[0] < subs[1];
        focus(node, ret, mem, env);
        yield ret;
        return;
    case "NOT":
        console.assert(typeof subs[0] === "boolean");
        focus(node, !subs[0], mem, env);
        yield !subs[0];
        return;
    case "SEQ":
        focus(node, subs[1], mem, env);
        yield subs[1]; // ignore subs[0]
        return;
    case "IF":
        var gen = evalSubExpHelper(evalExp(env, children[0]), subs);
            while(!gen.next().done) yield;
        console.assert(typeof subs[0] === "boolean");
        // When the test is true don't evalute else
        // and vice versa to avoid inifinite loop
        if (subs[0]) {
            var gen = evalSubExpHelper(
                evalExp(env, children[1]), subs);
            while(!gen.next().done) yield;
            focus(node, subs[1], mem, env);
            yield subs[1];  }
        else {
            var gen = evalSubExpHelper(
                evalExp(env, children[2]), subs);
            while(!gen.next().done) yield;
            focus(node, subs[1], mem, env);   // not sub[2] because
            yield subs[1];  }       // true scenario not evaluated
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
            focus(node, subs[2], mem, env);
            yield subs[2];  } // always null(unit)
        else {
            focus(node, null, mem, env);
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
        focus(node, subs[1], mem, env);
        yield subs[1];
        return;
    case "LETF":
        var fname = vs[0];
        var argnames = unpack(children[0].content.vs);
        var e1 = children[1]
        var fbody = [argnames,e1,env];
        var gen = evalSubExpHelper(
            evalExp(get_updated_env(fname, fbody, env),children[2]),
            subs);
        while (!gen.next().done) yield;
        focus(node, subs[2], mem, env);
        yield subs[2];
        return;
    case "CALLV":
        var fname = vs[0];
        var args = children[0].children;
        for (var i = 0; i < args.length; i++){
            var gen = evalSubExpHelper(
                evalExp(env, args[i]), subs);
            while(!gen.next().done)
                yield;  }
        var [argnames, f_exp, f_env] = env[fname];
        for (var i = 0; i < args.length; i++){
            var nl = new_loc();
            f_env = get_updated_env(argnames[i], nl, f_env);
            mem[nl] = subs[i];  }
        var f_env = get_updated_env(fname, env[fname], f_env);

        var f_returns = [];
        var gen = evalSubExpHelper(
                    evalExp(f_env, f_exp), f_returns );
        while (!gen.next().done) yield;
        focus(node, f_returns[0], mem, env);
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
        focus(node, f_returns[0], mem, env);
        yield f_returns[0];
        return;
    // record construction
    case "RECORD":
        var rec = {}
        for (var i = 0; i < vs.length; i++){
            var nl = new_loc();
            rec[vs[i]] = nl;
            mem[nl] = Number(nums[i]);  }
        focus(node, rec, mem, env); // need to be checked
        yield rec;
        return;
    case "FIELD":
        var rec = subs[0];
        var x = vs[0];
        focus(node, mem[rec[x]], mem, env);
        yield mem[rec[x]];
        return;
    case "ASSIGN":
        var x = vs[0];
        var v = subs[0];
        mem[env[x]] = v;
        focus(node, v, mem, env);
        yield v;
        return;
    case "ASSIGNF":
        var rec = subs[0];
        var x = vs[0];
        var v = subs[1];
        mem[rec[x]] = v;
        focus(node, v, mem, env);
        yield v;
        return;
    case "READ":
        var x = vs[0];
        var v = input(
            "Enter the value of " + x + "\n(as an integer)");
        mem[env[x]] = v;
        focus(node, v, mem, env);
        yield v;
        return;
    case "WRITE":
        var n = subs[0];
        updatePrint(n);
        focus(node, n, mem, env);
        yield n;
        return;
    }
}

function* eval(root){
    mem = {};
    var gen = evalExp({}, root);
    while(!gen.next().done) yield;
    finalizeResult();
    yield;
}

window.eval = eval
