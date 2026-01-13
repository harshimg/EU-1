"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { apiGet, apiPut } from "@/lib/api";

interface Users{
  name: string;
  email: string;
  semester: string;
  branch: string;
  mobile: string;
  reg_no: string;
  role: "user" | "admin" | "superalpha";
  is_verified: boolean;
  created_at: string;
  admin_userid: string;
}


export default function AllUsersPage(){
    const router = useRouter();
    const { user, loading } = useAuth();

    const [users, setusers] = useState<Users[]>([]);

     // 🔐 Guard
  useEffect(() => {
    if (!loading && (!user || user.role !== "superalpha")) {
      router.replace("/");
    }
  }, [user, loading, router]);


  useEffect(() => {
    if (loading) return;
    if (!user || user?.role !== "superalpha") return;
        find_users();
    
  }, [user, loading]
  );


    function find_users(){
        apiGet("/sa/users")
        .then(json => {
            setusers(json.data)
        })
        .catch(err => {
          console.error("Failed to fetch users", err);
          setusers([]);
        });
    }

  return (


    <div className="min-h-screen bg-[#0B0F1A] text-slate-200">

          <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
            <Table headers={["Name", "Email", "Semester", "Branch", "Reg No.", "Role", "Date", "Id"]}>
                {users.map(u => (
                  <tr  key={u.email}>
                    <td>  {u.name}  </td>
                    <td>  {u.email} </td>
                    <td>  {u.semester}  </td>
                    <td>  {u.branch}  </td>
                    <td>  {u.reg_no}  </td>
                    <td>  {u.role}  </td>
                    <td> {u.created_at}</td>
                    <td> {u.admin_userid}</td>
                  </tr>
                  ))}
            </Table>

          </main>
    </div>
  );

}




// -------------Helper funtion-------------------
const Table = ({ headers, children }: {
  headers: string[];
  children: React.ReactNode;
}) => (
  <div className="overflow-x-auto border border-white/10 rounded-lg">
    <table className="w-full text-sm">
      <thead className="bg-[#0F1629]">
        <tr>{headers.map((h: string) => <th key={h} className="px-4 py-3 text-left">{h}</th>)}</tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);