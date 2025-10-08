export interface INoticeRepository<TList, TDetail, TSimple> {
    findAllSimple(page: number, limit: number): Promise<TList[]>;
    findPinnedSimple(): Promise<TSimple[]>;
    findOneDetail(id: string): Promise<TDetail | null>;
}
