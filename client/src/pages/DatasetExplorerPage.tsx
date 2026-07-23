import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown, ChevronUp, Download, Filter, ArrowUpDown } from 'lucide-react';
import { api } from '../services/api';
import type { DatasetResponse, DatasetSummary, Student } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function DatasetExplorerPage() {
  const [data, setData] = useState<DatasetResponse | null>(null);
  const [summary, setSummary] = useState<DatasetSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof Student | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), page_size: '20', search });
    try {
      const [res, sum] = await Promise.all([
        api.get<DatasetResponse>(`/dataset?${params}`),
        api.get<DatasetSummary>('/dataset/summary'),
      ]);
      setData(res);
      setSummary(sum);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSort = (key: keyof Student) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const sortedStudents = data?.data ? [...data.data].sort((a, b) => {
    if (!sortKey) return 0;
    const av = a[sortKey], bv = b[sortKey];
    if (typeof av === 'string' && typeof bv === 'string') {
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    }
    return sortAsc ? Number(av) - Number(bv) : Number(bv) - Number(av);
  }) : [];

  const exportCSV = () => {
    if (!data?.data.length) return;
    const headers = Object.keys(data.data[0]).join(',');
    const rows = data.data.map((s) => Object.values(s).join(',')).join('\n');
    const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'edupredict_dataset.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const SortHeader = ({ label, field }: { label: string; field: keyof Student }) => (
    <th className="p-3 text-left text-xs font-medium text-navy-400 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort(field)}>
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown className="w-3 h-3" />
      </div>
    </th>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Dataset Explorer</h2>
          <p className="text-navy-400 mt-1">Browse and explore the student performance dataset.</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-all">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Total Students', value: summary.total_students },
            { label: 'Features', value: summary.total_features },
            { label: 'Target', value: 'Performance' },
            { label: 'Missing Cells', value: summary.missing_cells },
            { label: 'Memory', value: summary.memory_usage },
          ].map((s) => (
            <div key={s.label} className="bg-navy-800/30 border border-white/5 rounded-lg p-4 text-center">
              <p className="text-xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-navy-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-navy-800/50 border border-white/5 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
            <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search students..." 
              className="w-full pl-9 pr-4 py-2 bg-navy-900/50 border border-white/10 rounded-lg text-white text-sm placeholder-navy-500 focus:outline-none focus:border-emerald-500/50" />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-navy-900/30">
                <tr>
                  <SortHeader label="ID" field="id" />
                  <SortHeader label="Name" field="name" />
                  <SortHeader label="Age" field="age" />
                  <SortHeader label="Gender" field="gender" />
                  <SortHeader label="KCPE Marks" field="kcpe_marks" />
                  <SortHeader label="KCSE Grade" field="kcse_grade" />
                  <SortHeader label="Study Hrs/Wk" field="study_hours_per_week" />
                  <SortHeader label="Attendance" field="attendance_percentage" />
                  <SortHeader label="Prev Grade" field="university_previous_grade" />
                  <SortHeader label="Predicted" field="predicted_grade" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sortedStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 text-navy-400 font-mono text-xs">{s.id}</td>
                    <td className="p-3 text-white font-medium">{s.name}</td>
                    <td className="p-3 text-navy-300">{s.age}</td>
                    <td className="p-3 text-navy-300">{s.gender}</td>
                    <td className="p-3 text-navy-300">{s.kcpe_marks}/500</td>
                    <td className="p-3 text-navy-300 font-mono">{s.kcse_grade}</td>
                    <td className="p-3 text-navy-300">{s.study_hours_per_week}h</td>
                    <td className="p-3 text-navy-300">{s.attendance_percentage}%</td>
                    <td className="p-3 text-navy-300">{s.university_previous_grade}</td>
                    <td className="p-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        s.predicted_grade === 'A' ? 'bg-emerald-500/10 text-emerald-400' :
                        s.predicted_grade === 'B' ? 'bg-blue-500/10 text-blue-400' :
                        s.predicted_grade === 'C' ? 'bg-amber-500/10 text-amber-400' :
                        s.predicted_grade === 'D' ? 'bg-orange-500/10 text-orange-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>{s.predicted_grade}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {data && (
          <div className="p-4 border-t border-white/5 flex items-center justify-between">
            <p className="text-sm text-navy-400">
              Showing page {data.page} of {data.total_pages} ({data.total} total records)
            </p>
            <div className="flex items-center gap-2">
              <button disabled={page <= 1} onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 bg-navy-700 hover:bg-navy-600 disabled:opacity-30 text-white text-sm rounded-lg transition-all">Previous</button>
              <button disabled={page >= (data.total_pages)} onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 bg-navy-700 hover:bg-navy-600 disabled:opacity-30 text-white text-sm rounded-lg transition-all">Next</button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
