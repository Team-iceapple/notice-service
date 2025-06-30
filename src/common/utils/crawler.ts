import axios, {AxiosResponse} from 'axios';

const DEFAULT_TIMEOUT = 15000; // 15초

function handleAxiosError(prefix: string, error: unknown) {
    if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
            console.error(`${prefix} 타임아웃:`, error.message);
        } else if (error.response) {
            console.error(
                `${prefix} 서버 응답 에러:`,
                error.response.status,
                error.response.statusText,
            );
        } else {
            console.error(`${prefix} 네트워크 에러:`, error.message);
        }
    } else {
        console.error(`${prefix} 알 수 없는 에러:`, error);
    }
}

export async function fetchMobilePage(page: number = 1): Promise<string> {
    const url = `https://www.hanbat.ac.kr/bbs/BBSMSTR_000000001001/list.do?page=${page}`;
    try {
        const {data}: AxiosResponse<string> = await axios.get(url, {
            responseType: 'text',
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
                    '(KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',
            },
            timeout: DEFAULT_TIMEOUT,
            validateStatus: (status) => status >= 200 && status < 400,
        });
        return data;
    } catch (error) {
        handleAxiosError(`[Crawler] fetchNoticesPage(page=${page})`, error);
        return '';
    }
}

export async function fetchMobileDetailPage(id: string): Promise<string> {
    const url = `https://www.hanbat.ac.kr/bbs/BBSMSTR_000000001001/view.do?nttId=${id}`;
    try {
        const {data}: AxiosResponse<string> = await axios.get(url, {
            responseType: 'text',
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
                    '(KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',
            },
            timeout: DEFAULT_TIMEOUT,
            validateStatus: (status) => status >= 200 && status < 400,
        });
        return data;
    } catch (error) {
        handleAxiosError(`[Crawler] fetchNoticeDetailPage(id=${id})`, error);
        return '';
    }
}
