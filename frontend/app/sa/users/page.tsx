"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { apiGet, apiPut, apiPatch } from "@/lib/api";

interface Users{
  _id: string;
  name: string;
  email: string;
  semester: string;
  branch: string;
  mobile: string;
  reg_no?: string;
  role: "user" | "admin" | "superalpha";
  is_verified: boolean;
  created_at: string;
  admin_userid?: string;
}


export default function AllUsersPage(){
    const router = useRouter();
    const { user, loading } = useAuth();

    const [users, setusers] = useState<Users[]>([]);

    const [selectedUser, setSelectedUser] = useState<Users | null>(null);
    const [targetRole, setTargetRole] = useState<"user" | "admin" | null>(null);
    const [loadingAction, setLoadingAction] = useState(false);

    const [search, setSearch] = useState("");
    const [filterRole, setFilterRole] = useState<"all" | "admin">("all");



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
    
  }, [filterRole, search, loading, user]
  );

  function find_users(){

      const params = new URLSearchParams();

      if (filterRole === "admin") params.set("role", "admin");
      if (search.trim()) params.set("q", search.trim());

        apiGet(`/sa/users?${params.toString()}`)
        .then(res => {
            setusers(res.data)
        })
        .catch(err => {
          console.error("Failed to fetch users", err);
          setusers([]);
        });
    }

  function ChangeRole(){
    setLoadingAction(true);
     apiPatch(
      `/sa/users/${selectedUser._id}/role`,
      { role: targetRole }
    )
    .then(json => {
      setLoadingAction(false)
      setSelectedUser(null)
      setTargetRole(null)
    
    find_users()
  })
    .catch(err => {
      console.error("Failed to Change Role", err);
      setusers([]);
    });
  }

  return (


    <div className="min-h-screen bg-[#0B0F1A] text-slate-200">


          <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">


            <div className="flex gap-5 center items-center">

              <div className="mx-auto flex gap-5">
                <button
                  className={filterRole === "all" ? "text-white" : "text-slate-400"}
                  onClick={() => setFilterRole("all")}
                >
                  Users
                </button>

                <button
                  className={filterRole === "admin" ? "text-white" : "text-slate-400"}
                  onClick={() => setFilterRole("admin")}
                >
                  Admins
                </button>
                </div>

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, email, branch, reg no"
                  className="ml-auto bg-[#0F1629] px-3 py-2 rounded text-sm"
                />
            </div>



            
            <Table headers={["Name", "Email", "Semester", "Branch", "Reg No.", "Role", "Date", "Id", "Actions"]}>
                {users.map(u => (
                  <tr  key={u.email}>
                    <td>  {u.name}  </td>
                    <td>  {u.email} </td>
                    <td>  {u.semester}  </td>
                    <td>  {u.branch}  </td>
                    <td>  {u.reg_no}  </td>
                    <td>  {u.role}  </td>
                    {/* <td> {u.created_at}</td> */}
                    <td>{new Date(u.created_at).toLocaleDateString()}</td>
                    <td> {u.admin_userid}</td>
                    <td>
                    {u.role === "user" && (
                          <button
                            className="text-indigo-400 hover:underline"
                            onClick={() => {
                              setSelectedUser(u);
                              setTargetRole("admin");
                            }}
                          >
                            Make Admin
                          </button>
                        )}

                        {u.role === "admin" && (
                          <button
                            className="text-red-400 hover:underline"
                            onClick={() => {
                              setSelectedUser(u);
                              setTargetRole("user");
                            }}
                          >
                            Make User
                          </button>
                        )}
                      </td>
                  </tr>
                  ))}
            </Table>

          </main>


{/*   Role chage confirmation model as pop-up */}
                {selectedUser && targetRole && (
                        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
                          <div className="bg-[#11172C] p-6 rounded-lg w-[420px]">
                            <h3 className="text-lg font-semibold text-white">
                              Confirm Role Change
                            </h3>

                            <p className="text-sm text-slate-400 mt-2">
                              Change <b>{selectedUser.email}</b> to <b>{targetRole}</b>?
                            </p>

                            <div className="flex justify-end gap-3 mt-6">
                              <button
                                onClick={() => {
                                  setSelectedUser(null);
                                  setTargetRole(null);
                                }}
                                className="px-4 py-2 text-sm text-slate-300"
                              >
                                Cancel
                              </button>

                              <button
                                disabled={loadingAction}
                                onClick={ChangeRole}
                                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded"
                              >
                                Confirm
                              </button>
                            </div>
                          </div>
                        </div>
                      )}




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

