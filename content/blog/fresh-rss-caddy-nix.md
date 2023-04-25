---
title: Running FreshRSS on nixos with caddy
created: 2023-04-25
---

[FreshRSS](https://freshrss.org/) is an RSS aggregator that's packaged for NixOS already and it can be enabled like so.

```nix
{
  services.freshrss = {
    enable = true;
    passwordFile = "/path/to/a/password/file";
    baseUrl = "https://freshrss.example.com";
    virtualHost = "freshrss.example.com";
  };
}
```

And this works fine if you don't already have something running on port 80, i.e. a reverse proxy for other services. On my server I already had Caddy proxying [syncthing](https://syncthing.net/)'s gui and [silverbullet](https://github.com/silverbulletmd/silverbullet/) behind auth using [authelia](https://www.authelia.com/).

We have two problems to figure out to get this working:

1. how can we use caddy to host a php application directly
2. which parts of the nixos config need modification to work with caddy instead of nginx

Looking at the [freshrss service definition]() in nixpkgs we can see the nginx config we need for freshrss, and also what's getting enabled. Looking at [caddy docs]() we can see (approximately) how to translate nginx's php hosting into equivalent caddyfile config.

The end result is

```nix
{
  services.caddy.virtualHosts."freshrss.example.com" = {
    extraConfig = ''
      root * ${pkgs.freshrss}/p
      php_fastcgi unix/${config.services.phpfpm.pools.freshrss.socket} {
          env FRESHRSS_DATA_PATH ${config.services.freshrss.dataDir}
      }
      file_server
    '';
  };
  services.freshrss = {
    enable = true;
    passwordFile = "/path/to/a/password/file";
    baseUrl = "https://freshrss.example.com";
    virtualHost = null;
  };
  services.phpfpm.pools.freshrss.settings = {
    # use the provided phpfpm pool, but override permissions for caddy
    "listen.owner" = lib.mkForce "caddy";
    "listen.group" = lib.mkForce "caddy";
  };
}
```

In the caddyfile we:

- set the root to the expected directory, which we know from the nginx config
- tell caddy to use the phpfpm that is setup by nixos's builtin service
- disable nginx by setting `virtualHost = null` (as shown in docs)
- the override the phpfpm pool owner to `caddy` instead of `nginx` so it has access to use it (`mkForce` is necessary because the value is already set, and we get an error trying to set it to a conflicting value otherwise)
