describe("Nix builtin scope precedence", () => {
  let editor;

  beforeEach(async () => {
    await lumine.packages.activatePackage("language-nix");
    editor = await lumine.workspace.open("builtin-scopes.nix");
  });

  afterEach(() => editor.destroy());

  it("preserves builtin captures without adding an ordinary variable scope over them", async () => {
    editor.setText("[ builtins true (map (x: x) [1]) ordinary ]\n");
    expect(await editor.whenGrammarSettled()).toBe(true);
    const scopes = (name) =>
      editor
        .scopeDescriptorForBufferPosition([0, editor.lineTextForBufferRow(0).indexOf(name)])
        .getScopesArray();
    for (const name of ["builtins", "true"]) {
      expect(scopes(name)).toContain("variable.language.nix");
      expect(scopes(name)).not.toContain("variable.other.nix");
    }
    expect(scopes("map")).toContain("support.function.builtin.nix");
    expect(scopes("map")).not.toContain("variable.other.nix");
    expect(scopes("ordinary")).toContain("variable.other.nix");
  });
});
