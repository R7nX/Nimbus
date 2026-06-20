# Nimbus project bash additions
# ─────────────────────────────────────────────────────────────────────────────
# Adds git alias tab completion and branch fuzzy switcher.
#
# HOW TO USE:
#   Add this to your ~/.bashrc:
#
#   source /path/to/Nimbus/devtools/bash_additions.sh
#
#   Or run:  bash /path/to/Nimbus/devtools/setup.sh
# ─────────────────────────────────────────────────────────────────────────────

# ─── Git alias tab completion ─────────────────────────────────────────────────
# Makes tab completion work on all git aliases the same way as the full commands.
# Includes remote branch completion — run `git f` first to update remote refs.
if type __git_complete &>/dev/null; then
  __git_complete sw  _git_switch
  __git_complete ch  _git_checkout
  __git_complete cm  _git_commit
  __git_complete ps  _git_push
  __git_complete psf _git_push
  __git_complete pl  _git_pull
  __git_complete f   _git_fetch
  __git_complete b   _git_branch
  __git_complete r   _git_rebase
  __git_complete l   _git_log
  __git_complete lo  _git_log
fi

# ─── gsw: fzf branch switcher ────────────────────────────────────────────────
# Fuzzy search all local + remote branches with a log preview.
# Run `git f` first to pull in branches teammates pushed.
#
# Usage: gsw
#   Type part of a branch name to filter, Enter to switch.
#   Ctrl+J / Ctrl+K to move up and down.
function gsw() {
  if ! command -v fzf &>/dev/null; then
    echo "gsw requires fzf. Install it with: sudo pacman -S fzf  (or your package manager)"
    return 1
  fi

  local branch
  branch=$(git branch -a \
    | grep -v HEAD \
    | sed 's|remotes/origin/||' \
    | sort -u \
    | tr -d '* ' \
    | fzf \
      --preview 'git log --oneline -10 {}' \
      --preview-window=right:50%:wrap \
      --bind=ctrl-j:down,ctrl-k:up \
      --prompt="branch > ")
  [ -n "$branch" ] && git switch "$branch"
}
