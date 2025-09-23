import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Логируем запрос для отладки
  console.log(`Incoming request: ${pathname}${search}`);

  // Если путь заканчивается на `.php`, перенаправляем на `/api/secureproxy`
  if (pathname.endsWith('.php')) {
    const url = request.nextUrl.clone();

    // Устанавливаем новый путь на `/api/secureproxy`
    url.pathname = '/api/secureproxy';
    url.search = search; // Сохраняем параметры запроса

    // Возвращаем rewrite (внутренний редирект)
    return NextResponse.rewrite(url);
  }

  // Все остальные запросы проходят как есть
  return NextResponse.next();
}

// Указываем matcher для применения middleware только к .php запросам
export const config = {
  matcher: ['/secureproxy.php'],
};
