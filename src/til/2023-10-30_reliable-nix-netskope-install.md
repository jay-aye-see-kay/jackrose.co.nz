# Reliably installing and using nix on a macOS system with Netskope installed

## Background

Netskope is security software that man-in-the-middles all or most traffic on a computer, it's relatively common in corporate workstations including my own. Personally I think it creates more security issues that it solves, not to mention the operational issues it creates. But my company has done their risk profile and decided it makes sense for them so be it.

Making nix and all the software it installs aware of Netskope's CA certificate so they have network access can be a bit of a dance, but I've got a setup I'm very happy with so am sharing.

## The install script (sh/bash/zsh)

```bash
NETSKOPE_DATA_DIR="/Library/Application Support/Netskope/STAgent/data/"

security find-certificate -a -p \
  /System/Library/Keychains/SystemRootCertificates.keychain \
  /Library/Keychains/System.keychain \
  >/tmp/nscacert_combined.pem

sudo cp /tmp/nscacert_combined.pem "$NETSKOPE_DATA_DIR"

curl --proto '=https' --tlsv1.2 -sSf -L https://install.determinate.systems/nix |
  sh -s -- install \
    --extra-conf "trusted-users = root $(whoami)" \
    --ssl-cert-file "$NETSKOPE_DATA_DIR/nscacert_combined.pem"
```

## Explanation of the script

First we generate a combined system CA certificate and put it in the location suggested by Netskope's docs. This is very likely a safe directory for the cert to live permanently because Netskope own that folder, and have suggested it be saved there. It's also a good idea to keep the name they suggest so you can search error messages and find others with similar problems in future.

Then we install nix using the [Determinate Systems nix-installer]() because it sets some IMO good defaults, we also add two extra flags to the install:

- setting `trusted-users` allows your current user to set substituters in `~/.config/nix/nix.confg`
- the `ssl-cert-file` option tells it to use your combined system cert

If you've already installed nix and just want to make it work with Netskope, add this line to you `/etc/nix/nix.conf` file

```bash
ssl-cert-file = /Library/Application Support/Netskope/STAgent/data/nscacert_combined.pem
```
