describe("language-nix editing defaults", () => {
  let editor;
  beforeEach(async () => {
    jasmine.useRealClock();
    await lumine.packages.activatePackage("language-source");
    await lumine.packages.activatePackage("language-nix");
    await lumine.packages.activatePackage("bracket-matcher");
    editor = await lumine.workspace.open();
    editor.setGrammar(lumine.grammars.grammarForScopeName("source.nix"));
    editor.setText("{ foo-bar = 1; }");
    await editor.whenGrammarSettled();
  });
  afterEach(() => editor?.destroy());

  it("uses the correct comment operation in source.nix", async () => {
    editor.setGrammar(lumine.grammars.grammarForScopeName("source.nix"));
    editor.setText("{ foo-bar = 1; }");
    await editor.whenGrammarSettled();
    await editor.toggleLineCommentsForBufferRows(0, editor.getLastBufferRow());
    await editor.whenGrammarSettled();
    expect(editor.lineTextForBufferRow(0)).toBe("# { foo-bar = 1; }");
    await editor.toggleLineCommentsForBufferRows(0, editor.getLastBufferRow());
    await editor.whenGrammarSettled();
    expect(editor.getText()).toBe("{ foo-bar = 1; }");
  });

  it("provides real block delimiters to snippet and comment consumers", async () => {
    const delimiters = await editor.getCommentDelimitersForBufferPosition([0, 0]);
    expect(delimiters.block).toEqual(["/*", "*/"]);
    expect(delimiters.line).toBe("#");
  });

  it("selects a complete language identifier without including adjacent syntax", () => {
    const index = editor.getText().indexOf("foo-bar");
    editor.setCursorBufferPosition(editor.getBuffer().positionForCharacterIndex(index + 2));
    editor.selectWordsContainingCursors();
    expect(editor.getSelectedText()).toBe("foo-bar");
  });
  it("keeps explicit user word-boundary overrides", () => {
    const options = { scopeSelector: ".source.nix" };
    try {
      lumine.config.set("editor.nonWordCharacters", "-", options);
      const index = editor.getText().indexOf("foo-bar");
      editor.setCursorBufferPosition(editor.getBuffer().positionForCharacterIndex(index + 2));
      editor.selectWordsContainingCursors();
      expect(editor.getSelectedText()).not.toBe("foo-bar");
    } finally {
      lumine.config.unset("editor.nonWordCharacters", options);
    }
  });

  it("does not insert a second apostrophe for an operator or unpaired token", async () => {
    editor.setText("");
    await editor.whenGrammarSettled();
    editor.setCursorBufferPosition([0, Infinity]);
    await editor.insertText("'");
    await editor.whenGrammarSettled();
    expect(editor.getText()).toBe("'");
  });
  it("still pairs a clear opening parenthesis and honors user quote pairs", async () => {
    editor.setText("");
    await editor.whenGrammarSettled();
    await editor.insertText("(");
    await editor.whenGrammarSettled();
    expect(editor.getText()).toBe("()");
    const options = { scopeSelector: ".source.nix" };
    try {
      lumine.config.set("bracket-matcher.autocompleteCharacters", ["''"], options);
      lumine.config.set("bracket-matcher.autocompleteDisabledCharacters", [], options);
      editor.setText("");
      await editor.whenGrammarSettled();
      editor.setCursorBufferPosition([0, 0]);
      await editor.insertText("'");
      await editor.whenGrammarSettled();
      expect(editor.getText()).toBe("''");
    } finally {
      lumine.config.unset("bracket-matcher.autocompleteCharacters", options);
      lumine.config.unset("bracket-matcher.autocompleteDisabledCharacters", options);
    }
  });
});
