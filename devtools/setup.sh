#!/usr/bin/env bash
# Nimbus devtools setup script
# ─────────────────────────────────────────────────────────────────────────────
# Adds the shared gitconfig and bash additions to your personal config files.
# Safe to run multiple times — checks for existing entries before adding.
#
# Usage: bash devtools/setup.sh
# ─────────────────────────────────────────────────────────────────────────────

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GITCONFIG="$SCRIPT_DIR/gitconfig"
BASH_ADDITIONS="$SCRIPT_DIR/bash_additions.sh"

echo ""
echo "Nimbus devtools setup"
echo "─────────────────────"

# ─── Step 1: gitconfig ───────────────────────────────────────────────────────

GLOBAL_GITCONFIG="$HOME/.gitconfig"
INCLUDE_LINE="path = $GITCONFIG"

if grep -qF "$INCLUDE_LINE" "$GLOBAL_GITCONFIG" 2>/dev/null; then
  echo "[gitconfig] Already included — skipping."
else
  # Append [include] block to ~/.gitconfig
  printf "\n[include]\n\tpath = %s\n" "$GITCONFIG" >> "$GLOBAL_GITCONFIG"
  echo "[gitconfig] Added include to $GLOBAL_GITCONFIG"
fi

# Prompt for name and email if not already set
GIT_NAME=$(git config --global user.name 2>/dev/null || true)
GIT_EMAIL=$(git config --global user.email 2>/dev/null || true)

if [ -z "$GIT_NAME" ]; then
  read -rp "Enter your git name: " input_name
  git config --global user.name "$input_name"
  echo "[gitconfig] Set user.name = $input_name"
else
  echo "[gitconfig] user.name already set: $GIT_NAME"
fi

if [ -z "$GIT_EMAIL" ]; then
  read -rp "Enter your git email: " input_email
  git config --global user.email "$input_email"
  echo "[gitconfig] Set user.email = $input_email"
else
  echo "[gitconfig] user.email already set: $GIT_EMAIL"
fi

# ─── Step 2: bashrc ──────────────────────────────────────────────────────────

BASHRC="$HOME/.bashrc"
SOURCE_LINE="source $BASH_ADDITIONS"

if grep -qF "$SOURCE_LINE" "$BASHRC" 2>/dev/null; then
  echo "[bashrc]    Already sourced — skipping."
else
  printf "\n# Nimbus devtools\n%s\n" "$SOURCE_LINE" >> "$BASHRC"
  echo "[bashrc]    Added source line to $BASHRC"
fi

# ─── Done ────────────────────────────────────────────────────────────────────

echo ""
echo "Done. Reload your shell to apply:"
echo "  source ~/.bashrc"
echo ""
echo "Aliases available:"
echo "  git sw, cm, nwb, psf, lo, ane, chg, graph, cleanup, nimlog ..."
echo "  gsw  — fzf branch switcher (run \`git f\` first to see remote branches)"
echo ""
