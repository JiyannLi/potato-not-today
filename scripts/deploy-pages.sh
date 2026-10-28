#!/usr/bin/env bash
# Deploy only the built public files. Never force-push an existing Pages branch.
set -euo pipefail
project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$project_dir"
npm run build
publish_dir="$(mktemp -d /tmp/potato-pages.XXXXXX)"
trap 'rm -rf "$publish_dir"' EXIT
repository_url='https://github.com/JiyannLi/potato-not-today.git'
remote_head="$(git ls-remote "$repository_url" refs/heads/gh-pages)"
if [[ -n "$remote_head" ]]; then
  git clone --depth 1 --branch gh-pages "$repository_url" "$publish_dir"
  # This is a temporary deployment checkout, containing only previous public build files.
  git -C "$publish_dir" rm -rf --ignore-unmatch .
else
  git -C "$publish_dir" init -q -b gh-pages
  git -C "$publish_dir" remote add origin "$repository_url"
fi
cp -R dist/. "$publish_dir/"
touch "$publish_dir/.nojekyll"
git -C "$publish_dir" config user.name 'Potato Pages'
git -C "$publish_dir" config user.email 'pages@users.noreply.github.com'
git -C "$publish_dir" add -A
if git -C "$publish_dir" diff --cached --quiet; then
  echo 'Pages build unchanged.'
else
  source_commit="$(git rev-parse --short HEAD)"
  git -C "$publish_dir" commit -m "Deploy Potato Not Today from $source_commit"
  git -C "$publish_dir" push origin HEAD:refs/heads/gh-pages
fi
