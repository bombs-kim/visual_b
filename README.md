# B language Visualizer and Interpreter

About this project
-------------------
This project is based on the Programming Language Theory class COSE212, Fall 2015 by Professor Hakjoo Oh. I implemented a programming language called B with Ocaml in that class. B language is a small subset of C, which is why it was named so. But, it has a bit of Ocaml's tidy tastes, too. You can find the language's formal syntax and semantics in class_project.pdf file.
After taking compiler's class in the previous semester, I decided to recap what I learned in the PL class and complete my understanding of programming language interpretation in a formal and abstract way. In this project, I aim to visualize full execution paths of programs written in B, as well as interpreting(or executing) them.
<br/>
<br/>

Lexer and Parser
-----------------
The lexer and parser for the B language were adopted from the PL class and moderetly modified. Implementation was done by ocamllex and ocamalyacc, which are specialized tools designed for lexing and parsing. Running the program `run` prints parsed tree in valid JSON format to the standard output. This will be the input for the visualizer, later.

### Compilation and printing parsed tree
1. make
2. run examples/test1.b > ast.js
<br/>
<br/>

Visualizer and Interpreter
------------
Visualizer and Interpreter were impleneted in Javscript. Javascript have many good visulization libraries and I chose paperjs. paperjs goes with the least amount of boilerplate code and allows me the maximum customization. I wanted to intermingle the visulizer and the interpreter in one implemtation and paperjs was right fit for me.

The visualizer is embedded in visual.html file. The Interpreter as contained in a separate file named eval.js. To run them, just open visual.html with a browser and choose JSON file generated with the lexer and parser.
</br>
<div style="text-align: center; font-weight:bold">Screen shot
<img src="screenshot.png">
</div>
<br/>
<br/>


More on B language
------------------

### Lexical Specification
Identifiers in B are specified by regular expression [a-zA-Z][a-zA-Z0-9_]*.
Identifiers are case sensitive: z and Z are different.
The reserved words are cannot be used as identifiers: unit, true, false, 
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
  x := e1 ; e2        =>    (x := e1) ; e2   ( := has higher precedence thatn ;)
  while e do e1;e2    =>    (while e do e1);e2 
  if e1 then e2 else e3;e4    =>    (if e1 then e2 else e3); e4
  let x := e1 in e2 ; e3      =>    let x :=e in (e2;e3) 
  x := y := 1    =>   x := (y := 1) 
```
If your test programs are hard to read (hence can be parsed not as you expected) then 
put parentheses around.
