describe("Nix shell literal injections", () => {
  let editor;
  beforeEach(async () => {
    await lumine.packages.activatePackage("language-shellscript");
    await lumine.packages.activatePackage("language-nix");
    editor = await lumine.workspace.open("shell.nix");
  });
  afterEach(() => editor.destroy());

  it("recognizes phases, hooks and standard shell writers without ordinary values", async () => {
    editor.setText(`{
  buildPhase = ''echo phase'';
  preBuild = ''echo hook'';
  customScript = ''echo script'';
  ordinary = ''ordinary text'';
  writer = pkgs.writeShellScript "demo" ''echo writer'';
  command = pkgs.runCommand "demo" {} ''echo command'';
  app = pkgs.writeShellApplication { name = "demo"; text = ''echo app''; };
}`);
    expect(await editor.whenGrammarSettled()).toBe(true);
    expect(editor.languageMode.tree.rootNode.hasError).toBe(false);
    for (const row of [1, 2, 3, 5, 6, 7]) {
      const col = editor.lineTextForBufferRow(row).indexOf("echo");
      expect(editor.scopeDescriptorForBufferPosition([row, col]).getScopesArray()).toContain(
        "source.shell",
      );
    }
    expect(editor.scopeDescriptorForBufferPosition([4, 18]).getScopesArray()).not.toContain(
      "source.shell",
    );
  });

  it("leaves interpolated Nix expressions outside shell content", async () => {
    editor.setText("{ buildPhase = ''echo ${name}''; }");
    expect(await editor.whenGrammarSettled()).toBe(true);
    const line = editor.getText();
    expect(
      editor.scopeDescriptorForBufferPosition([0, line.indexOf("echo")]).getScopesArray(),
    ).toContain("source.shell");
    expect(
      editor.scopeDescriptorForBufferPosition([0, line.indexOf("name")]).getScopesArray(),
    ).not.toContain("source.shell");
  });
});
