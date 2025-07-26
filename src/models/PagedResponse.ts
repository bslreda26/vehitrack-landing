export interface PagedResponse<T>{
    meta:{
        total:number,
        per_page:number,
        current_page: number,
        last_page: number
       
    },
    data: T[]
}