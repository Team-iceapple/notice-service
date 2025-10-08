import axios, { AxiosResponse } from 'axios';

const DEFAULT_TIMEOUT = 15000;

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

export async function fetchMobilePage(page: number) {
    const url = `https://www.hanbat.ac.kr/bbs/BBSMSTR_000000001001/list.do?pageIndex=${page}`;
    try {
        const { data }: AxiosResponse<string> = await axios.get(url, {
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

export async function fetchMobileDetailPage(id: string) {
    const url = `https://www.hanbat.ac.kr/bbs/BBSMSTR_000000001001/view.do?nttId=${id}`;
    try {
        const { data }: AxiosResponse<string> = await axios.get(url, {
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

export async function fetchSwNoticeList(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const payload = {
        offset,
        limit,
        order: 'desc',
        sort: 'regDate',
        searchData: {
            searchCate: 'all',
            searchWord: '',
        },
    };

    try {
        const { data } = await axios.post(
            'https://sw.hanbat.ac.kr/community/notice/list',
            payload,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0',
                },
            },
        );

        return data.rows;
    } catch (err) {
        console.error('[fetchSwNoticeList] Error:', err);
        return [];
    }
}

export async function fetchSwNoticeDetailPage(
    boardSn: string,
): Promise<string> {
    try {
        const { data } = await axios.post(
            'https://sw.hanbat.ac.kr/community/noticeDetail',
            new URLSearchParams({
                boardType: 'NOTICE',
                boardSn,
                pageNum: '1',
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': 'Mozilla/5.0',
                },
            },
        );

        return data;
    } catch (error) {
        console.error(
            `[Crawler] fetchSwNoticeDetailPage(${boardSn}) 에러:`,
            error,
        );
        return '';
    }
}
