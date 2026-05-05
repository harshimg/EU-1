const BRANCH_SLUG_MAP: Record<string, string> = {
    "105": "cse",
    "101": "civil",
    "102": "me",
    "110": "eee",
  };
  
  export const getPosterPath = (semCode: string, branchCode: string) => {
    const slug = BRANCH_SLUG_MAP[branchCode];
    if (!slug) return "/images/fallback.png";
  
    // return `/images/pyq/${branchCode}/beu-sem-${semCode}-${slug}-pyq.png`;
    return `/images/pyq/${branchCode}/beu-sem-${semCode}-${slug}-pyq.png`;
  };