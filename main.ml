(*
 * B Interpreter
 *)
open Pp
let main () =
    let src = ref "" in
    let usage = "사용법: run <file> \n" in
    let _ = Arg.parse []
                (fun
                   x ->
                     if Sys.file_exists x then src := x
                     else raise (Arg.Bad (x ^ ": 파일이 없음")))
                usage
    in

	if !src = "" then Arg.usage [] usage
    else
    	let file_channel = open_in !src in
    	let lexbuf = Lexing.from_channel file_channel in
    	let pgm = Parser.program Lexer.start lexbuf in
        B_PP.pp pgm

let _ = main ()
