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
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userData", JSON.stringify(user));
        localStorage.setItem("token", token);
        setIsAuthenticated(true);
        navigate("/sales", { replace: true });
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

  const handleChoiceClick = () => {
    navigate("/followup", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-4 font-sans" dir="rtl">
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
          />
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm flex flex-col items-center border border-gray-200">
          <img
            src={iconLogin}
            alt="Login Icon"
            className="w-20 h-20 mb-4"
          />
          <h3 className="text-sm font-semibold text-gray-500 mb-1">نظام فواتير cbc</h3>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">تسجيل الدخول لبوابة النظام</h2>

          <form onSubmit={handleSubmit} className="space-y-5 w-full">
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              placeholder=" رقم الهاتف "
              className="w-full border border-gray-300 rounded-lg pr-10 pl-4 py-3 text-right"
            />

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="كلمة المرور"
              className="w-full border border-gray-300 rounded-lg pr-10 pl-4 py-3 text-right"
            />

            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-500 to-green-600 hover:from-teal-600 hover:to-green-700 text-white font-semibold px-6 py-3 rounded-lg"
            >
              {loading ? "جارٍ الدخول..." : "تسجيل الدخول"}
            </button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={handleChoiceClick}
                className="text-teal-500 hover:underline"
              >
                اختر قسمك
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
