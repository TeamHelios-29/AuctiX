#!/bin/bash
set -e
MIGRATION_DIR="backend/src/main/resources/db/migration"
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'
echo "🔍 Checking Flyway migration versions..."

get_version() {
    local file=$(basename "$1")
    [[ $file =~ ^V([0-9]+)__.*\.sql$ ]] && echo "${BASH_REMATCH[1]}"
}

get_versions() {
    local branch="$1"
    git ls-tree -r --name-only "$branch" -- "$MIGRATION_DIR" 2>/dev/null \
    | grep -E '^.*V[0-9]+__.*\.sql$' \
    | while read -r file; do get_version "$file"; done \
    | sort -n
}

# Get only NEW migration files added in PR
get_new_pr_versions() {
    git diff --name-only "origin/$GITHUB_BASE_REF"...HEAD -- "$MIGRATION_DIR" \
    | grep -E '^.*V[0-9]+__.*\.sql$' \
    | while read -r file; do get_version "$file"; done \
    | sort -n
}

# Load versions
echo "📋 Getting versions from base branch ($GITHUB_BASE_REF)..."
base_versions=($(get_versions "origin/$GITHUB_BASE_REF"))
pr_versions=($(get_new_pr_versions))  # Only NEW versions

# Handle case where base has no migrations
if [[ ${#base_versions[@]} -eq 0 ]]; then
    max_base=0
    echo "   No migrations found in base branch"
else
    max_base=${base_versions[-1]}
    echo "   Base versions found: V${base_versions[*]}"
    echo "   Highest base version: V$max_base"
fi

# If no new migrations in PR, exit successfully
if [[ ${#pr_versions[@]} -eq 0 ]]; then
    echo -e "${GREEN}✅ No new migrations in PR${NC}"
    exit 0
fi

echo "   New migrations in PR: V${pr_versions[*]}"


# Check for reuse (should be 0 since we only get NEW versions)
echo ""
echo "🔍 Checking: reused versions from base..."
reused=()
for v in "${pr_versions[@]}"; do
    if [[ " ${base_versions[*]} " =~ " $v " ]]; then
        reused+=("$v")
    fi
done
if [[ ${#reused[@]} -gt 0 ]]; then
    echo -e "${RED}❌ Reused versions from base: ${reused[*]}${NC}"
    exit 1
else
    echo -e "${GREEN}✅ No reused versions${NC}"
fi

# Check for duplicates
echo ""
echo "🔍 Checking: duplicate versions in PR..."
dupes=$(printf "%s\n" "${pr_versions[@]}" | sort | uniq -d)
if [[ -n "$dupes" ]]; then
    echo -e "${RED}❌ Duplicate versions in PR: $dupes${NC}"
    exit 1
else
    echo -e "${GREEN}✅ No duplicates in PR${NC}"
fi

# Check new versions > base max
echo ""
echo "🔍 Checking: new versions are higher than base..."
bad_versions=()
for v in "${pr_versions[@]}"; do
    if (( v <= max_base )); then
        bad_versions+=("$v")
    fi
done
if [[ ${#bad_versions[@]} -gt 0 ]]; then
    echo -e "${RED}❌ New versions not higher than V$max_base: ${bad_versions[*]}${NC}"
    exit 1
else
    echo -e "${GREEN}✅ All new versions are higher${NC}"
fi

# Check contiguous versions
echo ""
echo "🔍 Checking: versions are contiguous from V$((max_base + 1))..."
expected=$((max_base + 1))
for v in "${pr_versions[@]}"; do
    if (( v != expected )); then
        echo -e "${RED}❌ Missing version: expected V$expected, found V$v${NC}"
        exit 1
    fi
    expected=$((expected + 1))
done
echo -e "${GREEN}✅ Versions are contiguous${NC}"

echo ""
echo -e "${GREEN}✅ Flyway migration version check PASSED${NC}"
echo "   Base branch versions: V${base_versions[*]:-none}"
echo "   PR versions: V${pr_versions[*]}"
echo "   Validated ${#pr_versions[@]} new migration(s)"

exit 0