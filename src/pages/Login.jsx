import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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
        "http://31.97.35.42:5000/api/auth/login", 
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
        navigate("/");
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "حدث خطأ أثناء تسجيل الدخول"); 
      } else if (err.request) {
        setError("لا يوجد اتصال بالخادم. يرجى التحقق من تشغيل الخادم.");
      } else {
        setError("حدث خطأ غير متوقع.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow font-sans text-right">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">تسجيل الدخول</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-gray-600">البريد الإلكتروني</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="example@mail.com"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-600">كلمة المرور</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="••••••••"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded shadow transition"
        >
          {loading ? "جارٍ الدخول..." : "تسجيل الدخول"}
        </button>
      </form>
    </div>
  );
};

export default Login;