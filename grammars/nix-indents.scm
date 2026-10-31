; Reindent changes code structure, never the contents of multiline literals
; or the alignment a user chose inside a block comment.
([(string_expression) (indented_string_expression) (comment)] @preserve
  (#is? indent.reindent true)
  (#is-not? indent.matchesCurrentRow startPosition)
  (#set! indent.force true))

; Only explicit delimiters change the inherited indentation. Layout,
; operators and unfinished expressions deliberately keep the current level.
; Interpolation has a distinct opener and must not close an outer container.
(interpolation "}" @_IGNORE_ (#set! capture.final true))

; An unfinished string may lose its string_expression wrapper during recovery.
; Its surviving quote still identifies literal delimiters. A delimiter directly
; after ${ is code, and parsed interpolation descendants keep their own hints.
(ERROR ["\"" "''"] ["(" ")" "[" "]" "{" "}"] @_IGNORE_
  (#is-not? test.textAt "previousSibling ${")
  (#set! capture.final true))

["(" "[" "{"] @indent
[")" "]" "}"] @dedent
