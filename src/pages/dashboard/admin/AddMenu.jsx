import { useForm } from "react-hook-form";
import { FaUtensils } from "react-icons/fa";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useTheme } from "../../../hooks/ThemeContext";
import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

const AddMenu = () => {
  const { register, handleSubmit, reset } = useForm();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);

  const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
  const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", data.image[0]);

      const hostingImg = await axiosPublic.post(image_hosting_api, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (hostingImg.data.success) {
        const menuItem = {
          name: data.name,
          category: data.category,
          price: parseFloat(data.price),
          recipe: data.recipe,
          image: hostingImg.data.data.display_url,
        };

        const menuRes = await axiosSecure.post("/menu", menuItem);
        if (menuRes.status === 200) {
          reset();
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: `${data.name} is added to the menu.`,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    } catch (error) {
      console.error("Error uploading image or adding menu item:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`w-full md:w-[870px] mx-auto px-4 font-patrick ${
        isDarkMode ? "bg-black" : "bg-white"
      } relative`}
    >
      <h2
        className={`text-2xl font-semibold my-4 ${
          isDarkMode ? "text-white" : "text-black"
        }`}
      >
        Upload A New <span className="text-green">Menu Item</span>
      </h2>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control w-full my-6">
            <label className="label">
              <span
                className={`label-text ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                Recipe Name*
              </span>
            </label>
            <input
              type="text"
              placeholder="Recipe Name"
              {...register("name", { required: true })}
              required
              className={`input input-bordered w-full ${
                isDarkMode
                  ? "bg-gray-800 border-gray-600 placeholder-gray-400 text-white"
                  : "bg-white border-gray-300 placeholder-gray-500 text-black"
              }`}
            />
          </div>
          <div className="flex gap-6">
            <div className="form-control w-full my-6">
              <label className="label">
                <span
                  className={`label-text ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  Category*
                </span>
              </label>
              <select
                defaultValue="default"
                {...register("category", { required: true })}
                className={`select select-bordered w-full ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-600 text-gray-300"
                    : "bg-white border-gray-300 text-black"
                }`}
              >
                <option
                  disabled
                  value="default"
                  className={`${
                    isDarkMode ? "text-gray-500" : "text-gray-700"
                  }`}
                >
                  Select a category
                </option>
                <option
                  value="salad"
                  className={`${isDarkMode ? "text-gray-300" : "text-black"}`}
                >
                  Chinese
                </option>
                <option
                  value="pizza"
                  className={`${isDarkMode ? "text-gray-300" : "text-black"}`}
                >
                  Paratha
                </option>
                <option
                  value="soup"
                  className={`${isDarkMode ? "text-gray-300" : "text-black"}`}
                >
                  Bread Omelette
                </option>
                <option
                  value="dessert"
                  className={`${isDarkMode ? "text-gray-300" : "text-black"}`}
                >
                  Dessert
                </option>
                <option
                  value="drinks"
                  className={`${isDarkMode ? "text-gray-300" : "text-black"}`}
                >
                  Drinks
                </option>
                <option
                  value="popular"
                  className={`${isDarkMode ? "text-gray-300" : "text-black"}`}
                >
                  Rice
                </option>
              </select>
            </div>

            <div className="form-control w-full my-6">
              <label className="label">
                <span
                  className={`label-text ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  Price*
                </span>
              </label>
              <input
                type="number"
                placeholder="Price"
                {...register("price", { required: true })}
                className={`input input-bordered w-full ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-600 placeholder-gray-400 text-white"
                    : "bg-white border-gray-300 placeholder-gray-500 text-black"
                }`}
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span
                className={`label-text ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                Recipe Details
              </span>
            </label>
            <textarea
              {...register("recipe")}
              className={`textarea textarea-bordered h-24 ${
                isDarkMode
                  ? "bg-gray-800 border-gray-600 placeholder-gray-400 text-white"
                  : "bg-white border-gray-300 placeholder-gray-500 text-black"
              }`}
              placeholder="Recipe details"
            ></textarea>
          </div>

          <div className="form-control w-full my-6">
            <input
              {...register("image", { required: true })}
              type="file"
              className={`file-input w-full max-w-xs ${
                isDarkMode
                  ? "bg-gray-800 border-gray-600 text-gray-300"
                  : "bg-white border-gray-300 text-black"
              }`}
            />
          </div>

          <button
            className="btn bg-green text-white px-6 hover:bg-green-600"
            disabled={loading}
          >
            Add Item <FaUtensils />
          </button>
        </form>
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="flex items-center gap-4 bg-white p-6 rounded-lg shadow-lg">
              <ClipLoader color="#36d7b7" loading={loading} size={50} />
              <span className="text-lg text-gray-800">
                Adding Menu Item, Please Wait...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddMenu;
