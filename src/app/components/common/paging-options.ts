export class PagingOptions {
    public skip = 0;
    public limit = 10;
    public sort = '';
    public order = 0;
    public keyword: string = '';

    constructor() {
    }
    /**
     * Pass skip limit sort  order and keyword to to get the query string for paginatied data.
     * @param skip 
     * @param limit 
     * @param sort 
     * @param order 
     */
    getQueryString(skip: number = 0, limit: number = 10, sort: string = '', order: number = 1, keyword: string = '') {
        let query = '';
        if (skip >= 0) {
            query += "skip=" + skip
        }

        if (limit > 0) {
            query += "&limit=" + limit
        }

        if (sort.length > 0) {
            query += "&sort=" + sort
        }

        if (order === 1 || order === -1) {
            query += "&order=" + order
        }

        if (keyword.length > 0) {
            query += "&keyword=" + keyword
        }

        return query;
    }
}   