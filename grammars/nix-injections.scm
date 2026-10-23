; Standard Nixpkgs shell-valued bindings. The local binding owns its selector
; and only literal fragments are parsed as shell; Nix interpolation stays out.
((binding
   attrpath: (attrpath (identifier) @_path)
   expression: (indented_string_expression (string_fragment) @injection.content)) @injection.owner
  (#match? @_path "(^\\w*Phase|(pre|post)\\w*|(.*\\.)?\\w*([sS]cript|[hH]ook)|(.*\\.)?startup)$")
  (#set! injection.language "bash"))

((apply_expression
   function: (apply_expression
     function: [(variable_expression) (select_expression)] @_builder)
   argument: (indented_string_expression (string_fragment) @injection.content)) @injection.owner
  (#match? @_builder "(^|\\.)writeShellScript(Bin)?$")
  (#set! injection.language "bash"))

((apply_expression
   function: (apply_expression
     function: (apply_expression
       function: [(variable_expression) (select_expression)] @_builder))
   argument: (indented_string_expression (string_fragment) @injection.content)) @injection.owner
  (#match? @_builder "(^|\\.)runCommand(((No)?(CC))?(Local)?)?$")
  (#set! injection.language "bash"))

((apply_expression
   function: [(variable_expression) (select_expression)] @_builder
   argument: (attrset_expression
     (binding_set
       (binding
         attrpath: (attrpath (identifier) @_path)
         expression: (indented_string_expression (string_fragment) @injection.content))))) @injection.owner
  (#match? @_builder "(^|\\.)writeShellApplication$")
  (#eq? @_path "text")
  (#set! injection.language "bash"))

; Annotation candidates are filtered by the target grammar.
((comment) @injection.owner @injection.content
  (#set! injection.language "hyperlink")
  (#set! injection.language-scope "none")
  (#set! injection.include-children))

((comment) @injection.owner @injection.content
  (#set! injection.language "todo")
  (#set! injection.language-scope "none")
  (#set! injection.include-children))