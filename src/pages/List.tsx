import { useEffect, useState } from "react";
import axios from "axios";
// type /interface
type Course = {
  id: number;
  name: string;
  credit: number;
  category: string;
  teacher: string;
};

function ListPage() {
  // 1. state
  const [courses, setCourses] = useState<Course[]>([]);
  // 2. call api

  useEffect(() => {
    // axios async await + try catch
    const getAll = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/courses");
        console.log(data);
        setCourses(data);
      } catch (error) {
        console.log(error);
      }
    };
    getAll();
  }, []);

  // 3. xoa 1 item
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Danh sách</h1>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border border-gray-300 text-center">ID</th>
              <th className="px-4 py-2 border border-gray-300 text-center">
                Name
              </th>
              <th className="px-4 py-2 border border-gray-300 text-center">
                Credit
              </th>
               <th className="px-4 py-2 border border-gray-300 text-center">
                Category
              </th>
              <th className="px-4 py-2 border border-gray-300 text-center">
                Teacher
              </th>
              <th className="px-4 py-2 border border-gray-300 text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {courses.map((item) => (
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2 border border-gray-300">{item.id}</td>
                <td className="px-4 py-2 border border-gray-300">{item.name}</td>
                <td className="px-4 py-2 border border-gray-300">{item.credit}</td>
                <td className="px-4 py-2 border border-gray-300"> {item.category}</td>
                <td className="px-4 py-2 border border-gray-300">
                  {item.teacher}
                </td>
                <button className="px-3 py-1 bg-blue-500 text-white rounded">
                    Edit
                  </button>
                  <button className="px-3 py-1 bg-red-500 text-white rounded">
                    Delete
                  </button>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListPage;