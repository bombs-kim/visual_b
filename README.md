# B language Visualizer and Interpreter

About this project
-------------------
This project is based on the Programming Language Theory class COSE212, Fall 2015 by Professor Hakjoo Oh. I implemented an interpreter of a programming language called B in that class as the final project. B language is a small subset of C, which is why it was named so. But, it has a bit of Ocaml's tidy tastes, too. You can find the language's formal syntax and semantics in plclass_project_info.pdf file.

After a while since I took the class, I decided to do the project once more so that I don't forget valuable lessons I learned in the class and complete my understanding of programming languages in general. After all, ***a programming language is the most fun thing to program*** like somebody called Paul Graham said.

This time, however, I didn't make an ordinary interpreter. I wrote an interpreter that visualizes executions of programs written in B while interpreting them and I named it Visual B. Because cognitive ability of human beings is limited you may have a hard time understanding what it is like running a program even if you are a fine programmer. Visual B can help you with this by enabling you to see a program ***like the way compilers and interpreters see it***. Visual B is distinguished from a debugger in that it is intended to be used for inspecting a program that is working correctly. It visualizes execution processes within a parse tree, which is a beautiful thing if you understand it. I hope Visual B gives some more insight than a debugger which does mechanical, line by line executions of a program.

I switched to JavaScript from Ocaml when writing Visual B not only to tease myself a bit, but also to utilize some rendering libraries written in JavaScript and make it available for web users.

<br/>
<br/>

Lexer and Parser
-----------------
The lexer and parser for the B language were adopted from the PL class and moderately modified. Implementation was done by ocamllex and ocamalyacc, which are specialized tools designed for lexing and parsing. When you run `run`, which is the result program of `make` command, it will print a <a href="https://en.wikipedia.org/wiki/Abstract_syntax_tree">Abstract Syntax Tree</a> in a valid JSON format to the standard output. This will be the input for the visualizer, later.

### Compiling and printing an AST
```
$ cd [project directory]
$ make
$ run examples/test1.b > ast.js
```

**example output**
```
{"LETV": [
  "x",
  {"NUM": [
    1
  ]},
  {"LETV": [
    "y",
    {"NUM": [
      2
    ]},
    {"WRITE": [
      {"ADD": [
        {"VAR": [
          "x"
        ]},
        {"VAR": [
          "y"
        ]}
      ]}
    ]}
  ]}
]}
```
<br/>
<br/>

Visualizer and Interpreter
------------
Visualizer and Interpreter were impleneted in Javscript. Javascript have many good visulization libraries and I chose paperjs among them. paperjs goes with the least amount of boilerplate code and allows me the maximum customization. I wanted to intermingle the visulizer and the interpreter in one implemtation and paperjs was the right fit for me.

The visualizing logic is in visual.js file. The Interpreting logic is contained in a separate file named eval_generator.js. To run them you need to run a local server. You can do the following for example
```
$ cd [project directory]
$ python3 -m http.server
```
Now open your browser and go to localhost/visual.html and choose any JSON file generated with the lexer and parser. You can find some example ASTs in asts directory of this project.

If you can't follow the instructions, you can simply visit <a href="http://derek-kim.com/static/assets/html/visual.html">my homepage</a>.
</br>

**Screen shot**
<img src="screenshot.png">
<br/>
<br/>

Generators are cool
--------------------
While implementing the visualizer and the interpreter, I encountered an problem. I wanted to show the execution of a program written in B step by step, but I realized that there is no such thing as *pause button* in function executions in javaScript, which frustrated me a bit.

After searching for a solution for a while, I found that generator syntax which was introduced in ECMAScript 6 can rescue me from the misery. It might be neccessary for you to know the concept of <a href="https://en.wikipedia.org/wiki/Lazy_evaluation">lazy evaluation</a> to understand generators in JavaScript. I will show you an example of what can be different with generators.

```javascript
var prev=null;

function traverse1(){
  // first call
  if (!prev){
    var cur = rootNode;
    moveCenterTo(cur);
    prev = cur;
    return;  }
  if (!prev.cTravCnt)
    prev.cTravCnt = 0;  // count how many children traversed
  if (prev.cTravCnt >= prev.children.length){
    var cur = null;
    if (prev.parent){
      cur = prev.parent;
      moveCenterTo(cur);  }
    prev = cur
    prev.cTravCnt = 0;  // reset count in case you want to
                        // traverse this tree more than one time
    return;  }
  else {
    var cur = prev.children[prev.cTravCnt];
    moveCenterTo(cur);
    prev.cTravCnt++;
    prev = cur;  }
}
```

`traverse1` function traverses each node one by one and changes the focus on the canvas every time it is called. This may not be a totally ugly approach, but you needed an extra variable `prev` and an property `cur.cTravCnt` to remember the traverse history. With ultilizing generators, traversing becomes so much easier.

```javascript
function* travMaker(node){
  moveCenterTo(node);
  yield;
  var cLen = node.children.length;
  for (var i = 0; i < cLen; i++){
    var travGenerator = travMaker(node.children[i]);
    var next = travGenerator.next();
    while (!next.done){
      yield;
      next = travGenerator.next();}  }
  if(cLen){
    moveCenterTo(node);
    yield;}
}

var traverse2 = travMaker(rootNode).next;

```
Once `traverse2` is called, the body of `travMaker` executed until it reaches a `yield` statement. If you call `traverse2` one more time, it resumes from the next line of the previously called `yield` statement. A generator can work as an *pause button* , in effect. The code becomes shorter and you don't need extra variables. Traversing is just an simple example of what you can do with generators, and it is much more useful when you make an step-by-step interpreter.


More on B language
------------------

### Lexical Specification
Identifiers in B are specified by regular expression [a-zA-Z][a-zA-Z0-9_]*.
Identifiers are case sensitive: z and Z are different.
The reserved words cannot be used as identifiers: unit, true, false,
  not, if, then, else, let, in proc, while, do, read, write

Numerical integers optionally prefixed with -(for negative integer): -?[0-9]+.

A comment is any character sequence within the comment block (* *).
Comments can be nested.

### Precedence
The precedence of B constructs in decreasing order is as follows:

```
   .      (* right-associative *)
   not    (*right-associative*)
   *, /   (*left-associative*)  
   +, -   (*left-associative*)
   =, <   (*left-associative*)
   write  (*right-associative*)
   :=     (*right-associative*)
   else   
   then
   do
   ;      (*left-associative*)
   in     
```

Examples:
```
  x := e1 ; e2        =>    (x := e1) ; e2   ( := has higher precedence than ;)
  while e do e1;e2    =>    (while e do e1);e2
  if e1 then e2 else e3;e4    =>    (if e1 then e2 else e3); e4
  let x := e1 in e2 ; e3      =>    let x :=e in (e2;e3)
  x := y := 1    =>   x := (y := 1)
```
If your test programs are hard to read (hence might not be parsed as you expected) then
put parentheses around.
