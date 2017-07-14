mem = {}
cur_loc = 0;

function new_loc() {
    return cur_loc++;
}

function get_updated_env(x,v,env){
    obj = {}
    obj[x] = v;
    return Object.assign(obj, env);
}

function get_type(e){
    for (var key in e) {return key;}
}

function get_bop(type) {
    switch (type) {
    case "ADD":
        return function (a, b) {return a+b;};
    case "SUB":
        return function (a, b) {return a-b;};
    case "MUL":
        return function (a, b) {return a*b;};
    case "DIV":
        return function (a, b) {return a/b;};
    }
}

function is_empty_obj(obj){
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}

function eval_exp(env, e){
    var type = get_type(e)
    var cont = e[type]
    switch (type){
    case "NUM":
        return cont[0];
    case "VAR":
        return mem[env[cont[0]]];

    case "ADD":
    case "SUB":
    case "MUL":
    case "DIV":
        var bop = get_bop(type);
        var n1 = eval_exp(env, cont[0]);
        var n2 = eval_exp(env, cont[1]);
        console.assert(typeof n1 === "number" && typeof n2 === "number");
        return bop(n1,n2);
    case "EQUAL":
        var v1 = eval_exp(env, cont[0]);
        var v2 = eval_exp(env, cont[1]);
            // n1=n2 or b1=b2
        var eq = (v1 === v2) || (is_empty_obj(v1) && is_empty_obj(v2))
        return  eq
    case "LESS":
        var n1 = eval_exp(env, cont[0]);
        var n2 = eval_exp(env, cont[1]);
        console.assert(typeof n1 === "number" && typeof n2 === "number");
        return  n1 < n2;
    case "NOT":
        var b = eval_exp(env, cont[0]);
        console.assert(typeof b === "boolean");
        return !b;
    case "SEQ":
        var _ = eval_exp(env, cont[0]);
        var v = eval_exp(env, cont[1]);
        return v;
    case "IF":
        var b = eval_exp(env, cont[0]);
        console.assert(typeof b === "boolean");
        if (b) {
            return eval_exp(env, cont[1]);
        } else {
            return eval_exp(env, cont[2]);
        }
    case "WHILE":
        var b = eval_exp(env, cont[0]);
        console.assert(typeof b === "boolean");
        if (b) {
            var v1 = eval_exp(env, cont[1]);
            var v2 = eval_exp(env, e);
            return v2;  // not really meaningfull
        } else {
            return null;
        }

    case "LETV":
        var x = cont[0];
        var v = eval_exp(env, cont[1]);
        // console.log(x, v)
        var nl = new_loc();
        mem[nl] = v;
        return eval_exp(get_updated_env(x,nl,env), cont[2]);

    case "LETF":
        var fname = cont[0];
        var argnames = cont[1]["ARGS"];
        var e1 = cont[2]
        var fbody = [argnames,e1,env];
        return eval_exp(
                    get_updated_env(fname, fbody, env),
                    cont[3]);

    case "CALLV":
        var fname = cont[0];
        var _args = cont[1]["ARGS"]; // before eval
        var args = [];
        var nargs = _args.length;
        for (var i = 0; i < nargs; i++){
            args.push(eval_exp(env, _args[i]));
        }
        var [argnames, f_exp, f_env] = env[fname];
        for (var i = 0; i < nargs; i++){
            var nl = new_loc();
            f_env = get_updated_env(argnames[i], nl, f_env);
            mem[nl] = args[i];
        }
        f_env = get_updated_env(fname, env[fname], f_env);

        return eval_exp(f_env, f_exp);

    case "CALLR":
        var fname = cont[0];
        var args = cont[1]["ARGS"]; // ex) ["x", "y", "z"]
        var [argnames, f_exp, f_env] = env[fname];
        for (var i = 0; i < argnames.length; i ++){
            f_env = get_updated_env(argnames[i], env[args[i]], f_env);
        }
        f_env = get_updated_env(fname, env[fname], f_env);
        return eval_exp(f_env, f_exp);
    // record construction
    case "RECORD":
        var entries = cont;
        var vars = [];
        var vals = [];
        for (var i = 0; i < entries.length; i++){
            var x, e = entries[i];
            var v = eval_exp(env, e);
            vars.push(x);
            vals.push(v);
        }

        var rec = {}
        for (var i = 0; i < entries.length; i++){
            var nl = new_loc();
            rec[vars[i]] = nl;
            mem[nl] = vals[i];
        }

        return rec;
    case "FIELD":
        var rec = eval_exp(env, cont[0]);
        var x = cont[1];
        return mem[rec[x]];

    case "ASSIGN":
        var x = cont[0];
        var v = eval_exp(env, cont[1]);
        mem[env[x]] = v;
        return v;
    case "ASSIGNF":
        var r = eval_exp(env, cont[0]);
        var x = cont[1];
        var v = eval_exp(env, cont[2]);
        mem[r[x]] = v;
        return v;
    case "READ":
        var x = cont[0];
        var v = input("Enter value of " + cont[0] + "\n(in an integer)");
        mem[env[x]] = v;
        return v;
    case "WRITE":
        var n = eval_exp(env, cont[0]);
        // console.log(n);
        printed.push(n);
        return n;
    }
}

var printed;
function eval(e){
    printed = [];
    var ret = eval_exp({}, e);
    return [ret, printed];
}





