import { API_URL, apiGet, apiPost } from "@/lib/api";


export async function fetchBatchResults(
    start:string,
    semester:string,
    examHeld:string,
    year:string
    ){
    
        try {

            const res = await apiGet(
                `/api/public/result/batch-result?reg=${start}&semester=${semester}&examHeld=${encodeURIComponent(examHeld)}&year=${year}`
            )
        
            // apiGet already returns JSON
            return res
        
          } catch (err:any) {
        
            console.error("Batch API error:", err.message)
            throw err
        
          }
    
    
    }
