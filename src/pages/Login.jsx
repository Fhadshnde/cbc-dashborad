import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import iconLogin from "../assets/iconLogin.png";
import folderLogin from "../assets/folderLogin.png";

const Login = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({ phoneNumber: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const selectedDepartment = localStorage.getItem("selectedDepartment");

      if (selectedDepartment === "followup") {
        if (formData.phoneNumber !== "0909" || formData.password !== "4321") {
          setError("مسموح الدخول لقسم المتابعة فقط للمستخدم المصرح.");
          setLoading(false);
          return;
        }
      }

      const response = await axios.post(
        "https://hawkama.cbc-api.app/api/auth/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const { token, user } = response.data;

        if (selectedDepartment === "sales") {
          if (user.role !== "supervisor") {
            setError("مسموح الدخول لقسم المبيعات فقط للمشرفين.");
            setLoading(false);
            return;
          }
        }

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userData", JSON.stringify(user));
        localStorage.setItem("token", token);
        setIsAuthenticated(true);

        if (selectedDepartment === "sales") {
          navigate("/", { replace: true });
        } else if (selectedDepartment === "followup") {
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/choice", { replace: true });
        }
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "حدث خطأ أثناء تسجيل الدخول");
      } else if (err.request) {
        setError("لا يوجد اتصال بالخادم");
      } else {
        setError("حدث خطأ غير متوقع");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br flex items-center justify-center p-4 font-sans"
      dir="rtl"
    >
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-around gap-8">
        <div className="flex flex-col items-center lg:items-end text-right space-y-6 lg:max-w-xl">
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight drop-shadow-lg">
            تطبيق مخصص لعرض الطلبات
            <br />
            ومتابعتها من خلال
            <span className="text-teal-400"> الاشعارات الفورية !</span>
          </h1>
          <img
            src={folderLogin}
            alt="Folder Icon"
            className="w-full max-w-xs md:max-w-md h-auto mt-8 drop-shadow-2xl"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/300x200/cccccc/333333?text=Folder+Image+Missing";
            }}
          />
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm flex flex-col items-center border border-gray-200">
          <img
            src={iconLogin}
            alt="Login Icon"
            className="w-20 h-20 mb-4"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/80x80/cccccc/333333?text=Login+Icon";
            }}
          />
          <h3 className="text-sm font-semibold text-gray-500 mb-1">نظام فواتير cbc</h3>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            تسجيل الدخول لبوابة النظام
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5 w-full">
            <div className="relative">
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                placeholder=" رقم الهاتف "
                className="w-full border border-gray-300 rounded-lg pr-10 pl-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 text-right text-gray-700 placeholder-gray-400"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>

            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="كلمة المرور"
                className="w-full border border-gray-300 rounded-lg pr-10 pl-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 text-right text-gray-700 placeholder-gray-400"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>

            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-500 to-green-600 hover:from-teal-600 hover:to-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "جارٍ الدخول..." : "تسجيل الدخول"}
            </button>

            <div className="text-center mt-4">
              <Link to="/choice" className="text-teal-500 hover:underline">
                اختر قسمك
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
