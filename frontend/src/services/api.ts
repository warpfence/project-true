/** API 클라이언트 기본 설정.
 *
 * fetch 래퍼로 JWT Authorization 헤더 자동 첨부 및 에러 처리를 담당한다.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/** API 에러 클래스 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public detail: string,
  ) {
    super(detail);
    this.name = "ApiError";
  }
}

/** 서버사이드에서 세션의 accessToken을 가져오는 함수 (옵션) */
let getAccessToken: (() => Promise<string | null>) | null = null;

export function setAccessTokenGetter(
  getter: () => Promise<string | null>,
): void {
  getAccessToken = getter;
}

/** 인증 헤더가 포함된 fetch 래퍼 */
async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // 액세스 토큰 자동 첨부
  if (getAccessToken) {
    const token = await getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let detail = "알 수 없는 오류가 발생했습니다.";
    try {
      const errorBody = await response.json();
      detail = errorBody.detail || detail;
    } catch {
      // JSON 파싱 실패 시 기본 메시지 사용
    }
    throw new ApiError(response.status, detail);
  }

  return response;
}

/** GET 요청 */
export async function apiGet<T>(endpoint: string): Promise<T> {
  const response = await fetchWithAuth(endpoint);
  return response.json();
}

/** POST 요청 */
export async function apiPost<T>(
  endpoint: string,
  body?: unknown,
): Promise<T> {
  const response = await fetchWithAuth(endpoint, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
  return response.json();
}

/** PATCH 요청 */
export async function apiPatch<T>(
  endpoint: string,
  body?: unknown,
): Promise<T> {
  const response = await fetchWithAuth(endpoint, {
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
  });
  return response.json();
}

/** SSE 스트리밍 POST 요청 (ReadableStream 반환) */
export async function apiPostStream(
  endpoint: string,
  body?: unknown,
): Promise<Response> {
  return fetchWithAuth(endpoint, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export { API_BASE_URL };
