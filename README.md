# language-nix

Nix language support.

## Features

- **Grammars**: provides Tree-sitter grammars, built from [tree-sitter-nix](https://github.com/cstrahan/tree-sitter-nix).
- **Syntax highlighting**: full tree-sitter grammar coverage for Nix files.
- **Folding**: folds blocks from the parse tree rather than by indentation.

## Installation

To install `language-nix` search for it in the Install pane of the Lumine settings, or run the command `lumine --install lumine-code/language-nix`.

## Services

- `hyperlink.injection`: consumed to highlight URLs inside Nix files as clickable links.
- `todo.injection`: consumed to highlight `TODO`-style markers inside comments.

## Contributing

Got ideas to make this package better, found a bug, or want to help add new features? Just drop your thoughts on GitHub. Any feedback is welcome!
