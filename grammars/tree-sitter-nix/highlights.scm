(comment) @comment.line.nix

[
  "if"
  "then"
  "else"
  "let"
  "inherit"
  "in"
  "rec"
  "with"
  "assert"
  "or"
] @keyword.control.nix

((identifier) @variable.language.nix
 (#match? @variable.language.nix "^(__currentSystem|__currentTime|__langVersion|__nixPath|__nixVersion|__storeDir|builtins|false|null|true)$")
 )

((identifier) @support.function.builtin.nix
 (#match? @support.function.builtin.nix "^(__add|__addErrorContext|__all|__any|__appendContext|__attrNames|__attrValues|__bitAnd|__bitOr|__bitXor|__catAttrs|__ceil|__compareVersions|__concatLists|__concatMap|__concatStringsSep|__deepSeq|__div|__elem|__elemAt|__fetchurl|__filter|__filterSource|__findFile|__flakeRefToString|__floor|__foldl'|__fromJSON|__functionArgs|__genList|__genericClosure|__getAttr|__getContext|__getEnv|__getFlake|__groupBy|__hasAttr|__hasContext|__hashFile|__hashString|__head|__intersectAttrs|__isAttrs|__isBool|__isFloat|__isFunction|__isInt|__isList|__isPath|__isString|__length|__lessThan|__listToAttrs|__mapAttrs|__match|__mul|__parseDrvName|__parseFlakeRef|__partition|__path|__pathExists|__readDir|__readFile|__readFileType|__replaceStrings|__seq|__sort|__split|__splitVersion|__storePath|__stringLength|__sub|__substring|__tail|__toFile|__toJSON|__toPath|__toXML|__trace|__traceVerbose|__tryEval|__typeOf|__unsafeDiscardOutputDependency|__unsafeDiscardStringContext|__unsafeGetAttrPos|__zipAttrsWith|abort|baseNameOf|break|derivation|derivationStrict|dirOf|fetchGit|fetchMercurial|fetchTarball|fetchTree|fromTOML|import|isNull|map|placeholder|removeAttrs|scopedImport|throw|toString)$")
 )

[
  (integer_expression)
  (float_expression)
] @constant.numeric.nix

(escape_sequence) @constant.character.escape.nix
(dollar_escape) @constant.character.escape.nix

(function_expression
  universal: (identifier) @variable.parameter.nix
)

(formal
  name: (identifier) @variable.parameter.nix
  "?"? @punctuation.separator.parameter.default.nix)

(select_expression
  attrpath: (attrpath (identifier)) @variable.other.member.nix)

(apply_expression
  function: [
    (variable_expression (identifier)) @entity.name.function.nix
    (select_expression
      attrpath: (attrpath
        attr: (identifier) @entity.name.function.nix .))])

(unary_expression
  operator: _ @keyword.operator.nix)

(binary_expression
  operator: _ @keyword.operator.nix)

(variable_expression (identifier) @variable.other.nix)

(binding
  attrpath: (attrpath (identifier)) @variable.other.member.nix)

(identifier) @variable.other.member.nix

(inherit_from attrs: (inherited_attrs attr: (identifier) @variable.other.member.nix) )

";" @punctuation.terminator.statement.nix
"." @punctuation.separator.property.nix
"," @punctuation.separator.comma.nix
"=" @punctuation.separator.key-value.nix

"(" @punctuation.definition.expression.begin.bracket.round.nix
")" @punctuation.definition.expression.end.bracket.round.nix
"[" @punctuation.definition.list.begin.bracket.square.nix
"]" @punctuation.definition.list.end.bracket.square.nix
"{" @punctuation.definition.attrset.begin.bracket.curly.nix
"}" @punctuation.definition.attrset.end.bracket.curly.nix

(identifier) @variable.other.nix

[
  (string_expression)
  (indented_string_expression)
] @string.quoted.double.nix

[
  (path_expression)
  (hpath_expression)
  (spath_expression)
] @string.unquoted.path.nix

(uri_expression) @string.other.uri.nix

; `${ … }` splices an expression into a string or path.
(interpolation
  "${" @punctuation.definition.template-expression.begin.nix
  "}" @punctuation.definition.template-expression.end.nix)
