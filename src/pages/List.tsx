import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

type Course = {
  id: number;
  name: string;
  credit: number;
  category: string;
  teacher: string;
};

function ListPage() {
  const [courses, setCourses] = useState<Course[]>([]);

  // search & filter
  const [keyword, setKeyword] = useState("");
  const [teacher, setTeacher] = useState("");

  // pagination
  const [page, setPage] = useState(1);
  const limit = 5;

  useEffect(() => {
    const getAll = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/courses");
        setCourses(data);
      } catch (error) {
        console.log(error);
      }
    };
    getAll();
  }, []);

  const handleDelete = async (id: number) => {
  const confirmDelete = window.confirm("Bạn có chắc muốn xóa không?");
  if (!confirmDelete) return;

  try {
    await axios.delete(`http://localhost:3000/courses/${id}`);
    setCourses((prev) => prev.filter((item) => item.id !== id));
  } catch (error) {
    console.log(error);
  }
};


// search
  const filteredCourses = courses.filter((item) => {
    const matchName = item.name
      .toLowerCase()
      .includes(keyword.toLowerCase());

    const matchTeacher = teacher
      ? item.teacher === teacher
      : true;

    return matchName && matchTeacher;
  });


  const totalPage = Math.ceil(filteredCourses.length / limit);
  const start = (page - 1) * limit;
  const end = page * limit;
  const paginatedCourses = filteredCourses.slice(start, end);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Danh sách</h1>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Tìm theo tên..."
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setPage(1);
          }}
          className="border px-3 py-2 rounded w-1/3"
        />

        <select
          value={teacher}
          onChange={(e) => {
            setTeacher(e.target.value);
            setPage(1);
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="">-- Tất cả giảng viên --</option>
          {[...new Set(courses.map((c) => c.teacher))].map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <table className="w-full border border-gray-300 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border text-center">ID</th>
            <th className="px-4 py-2 border text-center">Name</th>
            <th className="px-4 py-2 border text-center">Credit</th>
            <th className="px-4 py-2 border text-center">Category</th>
            <th className="px-4 py-2 border text-center">Teacher</th>
            <th className="px-4 py-2 border text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginatedCourses.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border text-center">{item.id}</td>
              <td className="px-4 py-2 border">{item.name}</td>
              <td className="px-4 py-2 border text-center">{item.credit}</td>
              <td className="px-4 py-2 border">{item.category}</td>
              <td className="px-4 py-2 border">{item.teacher}</td>
              <td className="px-4 py-2 border text-center">
                <div className="flex gap-3 justify-center">
                  <Link
                    to={`/edit/${item.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </td>

            </tr>
          ))}

          {paginatedCourses.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-4">
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex gap-2 justify-center mt-4">
        {Array.from({ length: totalPage }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              page === i + 1
                ? "bg-blue-600 text-white"
                : "bg-white"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ListPage;
