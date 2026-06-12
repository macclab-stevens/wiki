# SSH Access

This page explains how to connect to MACC Lab compute resources using SSH.

!!! warning
    Do not publish real internal hostnames or access procedures on a public site unless approved. Replace `<cluster-hostname>` with the actual hostname only after receiving approval from your PI and the university security office.

## Basic connection

```bash
ssh <username>@<cluster-hostname>
```

Replace `<username>` with your assigned username and `<cluster-hostname>` with the address provided during account setup.

## First connection

On your first connection, SSH will ask you to verify the host fingerprint. Confirm this fingerprint matches the one provided by the lab administrator before accepting.

## SSH key setup (recommended)

Using SSH keys avoids repeated password entry.

Generate a key pair on your local machine:

```bash
ssh-keygen -t ed25519 -C "your_email@stevens.edu"
```

Copy your public key to the cluster:

```bash
ssh-copy-id <username>@<cluster-hostname>
```

## Config file shortcut

Add an entry to `~/.ssh/config` on your local machine for convenience:

```text
Host macc
    HostName <cluster-hostname>
    User <username>
    IdentityFile ~/.ssh/id_ed25519
```

Then connect with:

```bash
ssh macc
```

## Troubleshooting

If you cannot connect:

- Verify you are on the campus network or VPN
- Confirm your username and hostname are correct
- Check with the lab administrator that your account is active
