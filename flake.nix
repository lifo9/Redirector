{
  description = "Redirector — Safari/Chrome web extension for custom site redirects";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      nixpkgs,
      flake-utils,
      ...
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShells.default = pkgs.mkShell {
          packages = [
            pkgs.nodejs_24
            pkgs.corepack
          ];

          shellHook = ''
            # corepack writes its package-manager shims here; keep them inside the
            # project so nothing lands in the read-only Nix store or the user's home.
            # The exact Yarn version is resolved from package.json's "packageManager".
            export COREPACK_HOME="$PWD/.corepack"
          '';
        };
      }
    );
}
