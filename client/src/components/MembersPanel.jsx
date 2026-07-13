import { useEffect, useMemo, useState } from 'react'
import { Search, ShieldCheck, UserRound } from 'lucide-react'
import { membersAPI } from '../services/api'

function MembersPanel({ token }) {
  const [members, setMembers] = useState([])
  const [selectedMember, setSelectedMember] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    const fetchMembers = async () => {
      setError(null)
      try {
        const response = await membersAPI.getMembers(token)
        setMembers(response.data)
        setSelectedMember(response.data[0] || null)
      } catch (requestError) {
        setError(requestError.response?.data?.detail || 'Failed to load members')
      } finally {
        setLoading(false)
      }
    }

    fetchMembers()
  }, [token])

  const filteredMembers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()
    if (!normalizedSearch) return members

    return members.filter((member) =>
      [member.full_name, member.email].some((value) =>
        value?.toLowerCase().includes(normalizedSearch),
      ),
    )
  }, [members, searchTerm])

  if (loading) {
    return <p className="text-gray-400">Loading members...</p>
  }

  if (error) {
    return <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-red-300">{error}</div>
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <section className="rounded-xl border border-gray-700 bg-gray-800">
        <div className="flex flex-col gap-4 border-b border-gray-700 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Members</h2>
            <p className="mt-1 text-sm text-gray-400">{members.length} registered member{members.length === 1 ? '' : 's'}</p>
          </div>
          <label className="relative block sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search members"
              className="w-full rounded-lg border border-gray-600 bg-gray-900 py-2 pl-9 pr-3 text-sm text-white outline-none transition focus:border-blue-400"
            />
          </label>
        </div>
        <div className="divide-y divide-gray-700">
          {filteredMembers.length === 0 ? (
            <p className="p-5 text-gray-400">No members match your search.</p>
          ) : (
            filteredMembers.map((member) => (
              <button
                key={member.id}
                type="button"
                onClick={() => setSelectedMember(member)}
                className={`flex w-full items-center gap-4 p-5 text-left transition hover:bg-gray-700/60 ${selectedMember?.id === member.id ? 'bg-gray-700/50' : ''}`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-blue-300">
                  <UserRound className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-medium text-white">{member.full_name}</span>
                  <span className="block truncate text-sm text-gray-400">{member.email}</span>
                </span>
                <span className={`ml-auto rounded-full px-2.5 py-1 text-xs ${member.is_active ? 'bg-emerald-500/15 text-emerald-300' : 'bg-gray-600 text-gray-300'}`}>
                  {member.is_active ? 'Active' : 'Inactive'}
                </span>
              </button>
            ))
          )}
        </div>
      </section>

      <aside className="h-fit rounded-xl border border-gray-700 bg-gray-800 p-6">
        {selectedMember ? (
          <>
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/15 text-blue-300">
                <UserRound className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold">{selectedMember.full_name}</h2>
                <p className="truncate text-sm text-gray-400">Member #{selectedMember.id}</p>
              </div>
            </div>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-gray-500">Email</dt>
                <dd className="mt-1 break-words text-gray-200">{selectedMember.email}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Account status</dt>
                <dd className="mt-1 text-gray-200">{selectedMember.is_active ? 'Active' : 'Inactive'}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Role</dt>
                <dd className="mt-1 flex items-center gap-2 text-gray-200"><ShieldCheck className="h-4 w-4 text-blue-300" /> Member</dd>
              </div>
            </dl>
          </>
        ) : (
          <p className="text-gray-400">Select a member to view their information.</p>
        )}
      </aside>
    </div>
  )
}

export default MembersPanel
