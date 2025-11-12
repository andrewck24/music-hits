#!/bin/bash

# Worker API 測試腳本
# 使用方法：./test-worker-apis.sh

BASE_URL="http://localhost:8787"

echo "🧪 測試 Cloudflare Worker API 端點"
echo "=================================="
echo ""

# 顏色定義
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 測試函數
test_endpoint() {
  local name=$1
  local method=${2:-GET}
  local endpoint=$3

  echo -e "${YELLOW}測試: $name${NC}"
  echo "方法: $method"
  echo "端點: $endpoint"
  echo ""

  if [ "$method" = "POST" ]; then
    response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL$endpoint")
  else
    response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint")
  fi

  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')

  if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
    echo -e "${GREEN}✓ 狀態碼: $http_code${NC}"
  else
    echo -e "${RED}✗ 狀態碼: $http_code${NC}"
  fi

  # 檢查是否為 JSON
  if echo "$body" | jq . >/dev/null 2>&1; then
    echo -e "${GREEN}✓ 回應格式: JSON${NC}"
    echo "$body" | jq .
  else
    echo -e "${RED}✗ 回應格式: 非 JSON (可能是 HTML)${NC}"
    echo "$body" | head -n 5
  fi

  echo ""
  echo "---"
  echo ""
}

# 1. Token API
test_endpoint "Token API" "POST" "/api/spotify/token"

# 2. Tracks API
test_endpoint "Tracks API (成功)" "GET" "/api/spotify/tracks/0VjIjW4GlUZAMYd2vXMi3b"
test_endpoint "Tracks API (格式錯誤)" "GET" "/api/spotify/tracks/invalid"

# 3. Artists API
test_endpoint "Artists API (成功)" "GET" "/api/spotify/artists/6eUKZXaKkcviH0Ku9w2n3V"

# 4. Audio Features API (單一)
test_endpoint "Audio Features API - 單一 (成功)" "GET" "/api/spotify/audio-features/0VjIjW4GlUZAMYd2vXMi3b"

# 5. Audio Features API (批次)
test_endpoint "Audio Features API - 批次 (成功)" "GET" "/api/spotify/audio-features?ids=0VjIjW4GlUZAMYd2vXMi3b,3n3Ppam7vgaVa1iaRUc9Lp,6habFhsOp2NvshLv26DqMb"

echo "=================================="
echo -e "${GREEN}✓ 測試完成${NC}"
