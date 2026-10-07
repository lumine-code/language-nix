describe("Nix upstream builtin classification", () => {
  let editor;

  beforeEach(async () => {
    await lumine.packages.activatePackage("language-nix");
    editor = await lumine.workspace.open();
    editor.setGrammar(lumine.grammars.grammarForScopeName("source.nix"));
  });

  afterEach(() => editor?.destroy());

  it("keeps attributes named like builtins in their member scopes", async () => {
    editor.setText("{ map = 1; builtins = 2; }\n");
    expect(await editor.whenGrammarSettled()).toBe(true);
    const mapScopes = editor.scopeDescriptorForBufferPosition([0, 3]).getScopesArray();
    const builtinScopes = editor.scopeDescriptorForBufferPosition([0, 12]).getScopesArray();
    expect(mapScopes).toContain("variable.other.member.nix");
    expect(mapScopes).not.toContain("support.function.builtin.nix");
    expect(builtinScopes).toContain("variable.other.member.nix");
    expect(builtinScopes).not.toContain("variable.language.nix");
  });

  it("classifies an applied builtin function from its call position", async () => {
    editor.setText("map (x: x) [1]\n");
    expect(await editor.whenGrammarSettled()).toBe(true);
    expect(editor.scopeDescriptorForBufferPosition([0, 1]).getScopesArray()).toContain(
      "support.function.builtin.nix",
    );
  });
});
