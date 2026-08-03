# Assertions live in the comments: `<- scope` checks the marker's own column
# on the previous non-comment line, `^ scope` checks the caret's. Scopes
# match by prefix, so the trailing `.nix` segment is left off.

{ pkgs }:
# <- punctuation.definition.attrset.begin.bracket.curly

  name = "demo";
#      ^ punctuation.separator.key-value
#         ^ string
#              ^ punctuation.terminator.statement

  deps = [ 1 2 ];
#        ^ punctuation.definition.list.begin.bracket.square
#          ^ constant.numeric

# a comment
# <- comment
