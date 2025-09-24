import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Логируем запрос для отладки
  console.log(`Incoming request: ${pathname}${search}`);

  // Если путь вида `/secureproxy.php/<...>`, переписываем в `/api/secureproxy?e=/<...>`
  if (pathname.startsWith('/secureproxy.php/')) {
    const url = request.nextUrl.clone();
    url.pathname = '/api/secureproxy';

    const suffix = pathname.substring('/secureproxy.php'.length); // включает ведущий '/'
    const params = url.searchParams;
    const fullPathWithQuery = suffix + (search || '');
    params.set('e', fullPathWithQuery);
    url.search = params.toString() ? `?${params.toString()}` : '';

    return NextResponse.rewrite(url);
  }

  // Если путь заканчивается на `.php`, перенаправляем на `/api/secureproxy`
  if (pathname.endsWith('.php')) {
    const url = request.nextUrl.clone();

    // Устанавливаем новый путь на `/api/secureproxy`
    url.pathname = '/api/secureproxy';
    url.search = search; // Сохраняем параметры запроса

    // Возвращаем rewrite (внутренний редирект)
    return NextResponse.rewrite(url);
  }

  // Проксируем пути `/prefetch/**` и `/fp/**` через `/api/secureproxy?e=...`
  if (pathname.startsWith('/prefetch') || pathname.startsWith('/fp')) {
    const url = request.nextUrl.clone();
    url.pathname = '/api/secureproxy';

    // Добавляем/заменяем параметр e на полный путь + оригинальные query
    const params = url.searchParams;
    const fullPathWithQuery = pathname + (search || '');
    params.set('e', fullPathWithQuery);
    url.search = params.toString() ? `?${params.toString()}` : '';

    return NextResponse.rewrite(url);
  }

  // Все остальные запросы проходят как есть
  return NextResponse.next();
}

// Указываем matcher для применения middleware только к .php запросам
export const config = {
  matcher: ['/secureproxy.php', '/secureproxy.php/:path*', '/prefetch/:path*', '/fp/:path*'],
};
