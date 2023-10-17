# Customizing direnv cache location

## Background

My default new project setup is to run this command, it creates a `flake.nix` flake and an `.envrc` file for `nix` and `direnv` respectively.

```bash
nix flake new -t github:nix-community/nix-direnv .
echo ".direnv/" >> .gitignore
```

If you're familiar with these tools you probably understand why, if not, well it's complicated. Just know it's nice and doing things "the old way" feels weird to me now.

## The Issue

With the above setup project level executables and config are put in the `.direnv/` folder. I like this as it means the project's stuff is all bundled in the directory where I'd intuitively look for it, and when it comes times to delete it, it all goes together.

But I was playing with `lume` (a static site generator written in `deno`) and it's file watcher kept picking up files in that folder and throwing errors. I'm not sure exactly why, but removing the `.direnv/` directory fixes the problem.

## The Solution

In [the direnv wiki it describes how to move the directory in question out of the project's directory](https://github.com/direnv/direnv/wiki/Customizing-cache-location).

```bash
: ${XDG_CACHE_HOME:=$HOME/.cache}
declare -A direnv_layout_dirs
direnv_layout_dir() {
	echo "${direnv_layout_dirs[$PWD]:=$(
		echo -n "$XDG_CACHE_HOME"/direnv/layouts/
		echo -n "$PWD" | sha1sum | cut -d ' ' -f 1
	)}"
}
```

I didn't want to set this globally (for reasons mentioned above), but dropping it into the project's `.envrc` works perfectly.
