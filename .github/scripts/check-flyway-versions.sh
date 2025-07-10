#!/bin/bash

set -e

MIGRATION_DIR="backend/src/main/resources/db/migration"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo "🔍 Checking Flyway migration versions between branches..."

# Extract version number from migration filename
get_version() {
    local file="$1"
    local basename=$(basename "$file")
    if [[ $basename =~ ^V([0-9]+)__.*\.sql$ ]]; then
        echo "${BASH_REMATCH[1]}"
    fi
}

# Get all migration versions from a branch
get_versions() {
    local branch="$1"
    local versions=()
    
    # Get migration files from the branch
    local files=$(git ls-tree -r --name-only "$branch" -- "$MIGRATION_DIR" 2>/dev/null | grep "V.*__.*\.sql$" || true)
    
    if [[ -n "$files" ]]; then
        while IFS= read -r file; do
            local version=$(get_version "$file")
            if [[ -n "$version" ]]; then
                versions+=("$version")
            fi
        done <<< "$files"
    fi
    
    # Sort numerically and return
    printf '%s\n' "${versions[@]}" | sort -n
}

# Get versions from base branch (target)
echo "📋 Getting versions from base branch ($GITHUB_BASE_REF)..."
base_versions=($(get_versions "origin/$GITHUB_BASE_REF"))
max_base_version=0
if [[ ${#base_versions[@]} -gt 0 ]]; then
    max_base_version=${base_versions[-1]}
    echo "   Highest version: V$max_base_version"
else
    echo "   No migrations found"
fi

# Get versions from PR branch (head)
echo "📋 Getting versions from PR branch..."
pr_versions=($(get_versions "HEAD"))
echo "   PR versions: ${pr_versions[*]}"

# Find NEW versions (in PR but not in base)
new_versions=()
for version in "${pr_versions[@]}"; do
    if [[ ! " ${base_versions[@]} " =~ " ${version} " ]]; then
        new_versions+=("$version")
    fi
done

if [[ ${#new_versions[@]} -eq 0 ]]; then
    echo -e "${GREEN}✅ No new migrations found${NC}"
    exit 0
fi

echo "   New versions: ${new_versions[*]}"

# Check rules
has_errors=false

# Rule 1: New versions must be higher than base
echo ""
echo "🔍 Checking: New versions must be higher than existing..."
bad_versions=()
for version in "${new_versions[@]}"; do
    if [[ "$version" -le "$max_base_version" ]]; then
        bad_versions+=("$version")
    fi
done

if [[ ${#bad_versions[@]} -gt 0 ]]; then
    echo -e "${RED}❌ Found versions ≤ existing highest (V$max_base_version): ${bad_versions[*]}${NC}"
    has_errors=true
else
    echo -e "${GREEN}✅ All new versions are higher${NC}"
fi

# Rule 2: New versions must be contiguous
echo ""
echo "🔍 Checking: New versions must be contiguous..."
sorted_new=($(printf '%s\n' "${new_versions[@]}" | sort -n))
expected=$((max_base_version + 1))
missing=()

for version in "${sorted_new[@]}"; do
    while [[ "$expected" -lt "$version" ]]; do
        missing+=("$expected")
        expected=$((expected + 1))
    done
    expected=$((version + 1))
done

if [[ ${#missing[@]} -gt 0 ]]; then
    echo -e "${RED}❌ Missing versions: ${missing[*]}${NC}"
    has_errors=true
else
    echo -e "${GREEN}✅ Versions are contiguous${NC}"
fi

# Rule 3: No duplicates in new versions
echo ""
echo "🔍 Checking: No duplicate versions..."
duplicates=($(printf '%s\n' "${new_versions[@]}" | sort | uniq -d))

if [[ ${#duplicates[@]} -gt 0 ]]; then
    echo -e "${RED}❌ Duplicate versions: ${duplicates[*]}${NC}"
    has_errors=true
else
    echo -e "${GREEN}✅ No duplicates${NC}"
fi

# Final result
echo ""
if [[ "$has_errors" == true ]]; then
    echo -e "${RED}❌ Migration version check FAILED${NC}"
    echo "Expected next version: V$((max_base_version + 1))"
    exit 1
else
    echo -e "${GREEN}✅ All migration version checks passed!${NC}"
fi