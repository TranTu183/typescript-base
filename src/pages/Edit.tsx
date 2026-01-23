import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";

type FormValues = {
  name: string;
  credit: number;
  category: string;
  teacher: string;
};

const validate = z.object({
  name: z.string().min(3, "Tên phải trên 3 ký tự"),
  credit: z
    .number()
    .min(1, "Credit phải > 0"),
  category: z.string().min(1, "Vui lòng chọn category"),
  teacher: z.string().min(3, "Tên giảng viên phải trên 3 ký tự"),
});

function EditPage() {
  const { id } = useParams();
  const nav = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(validate),
  });

  useEffect(() => {
    const getDetail = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3000/courses/${id}`
        );
        reset(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (id) getDetail();
  }, [id, reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (id) {
        await axios.put(`http://localhost:3000/courses/${id}`, values);
        toast.success("Cập nhật thành công");
      } else {
        await axios.post("http://localhost:3000/courses", values);
        toast.success("Thêm mới thành công");
      }
      nav("/list");
    } catch (error) {
      toast.error("Thất bại: " + (error as AxiosError).message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">
        {id ? "Cập nhật khóa học" : "Thêm mới khóa học"}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block font-medium mb-1">Tên khóa học</label>
          <input
            {...register("name")}
            className="w-full border px-3 py-2 rounded"
          />
          <p className="text-red-500 text-sm">{errors.name?.message}</p>
        </div>

        <div>
          <label className="block font-medium mb-1">Credit</label>
          <input
            type="number"
            {...register("credit", { valueAsNumber: true })}
            className="w-full border px-3 py-2 rounded"
          />
          <p className="text-red-500 text-sm">{errors.credit?.message}</p>
        </div>

        <div>
          <label className="block font-medium mb-1">Category</label>
          <select
            {...register("category")}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">-- Chọn --</option>
            <option value="Chuyên ngành">Chuyên ngành</option>
            <option value="Cơ sở">Cơ sở</option>
            <option value="Tự chọn">Tự chọn</option>
            <option value="Đại cương">Đại cương</option>
          </select>
          <p className="text-red-500 text-sm">{errors.category?.message}</p>
        </div>

        <div>
          <label className="block font-medium mb-1">Giảng viên</label>
          <select
            {...register("teacher")}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">-- Chọn --</option>
            <option value="Nguyễn Văn A">Nguyễn Văn A</option>
            <option value="Trần Thị B">Trần Thị B</option>
            <option value="Lê Văn C">Lê Văn C</option>
            <option value="Phạm Văn D">Phạm Văn D</option>
          </select>
          <p className="text-red-500 text-sm">{errors.teacher?.message}</p>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          Lưu
        </button>
      </form>
    </div>
  );
}

export default EditPage;
