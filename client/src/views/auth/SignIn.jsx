import InputField from "components/fields/InputField";
import { useDispatch } from 'react-redux'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "features/user/userSlice";
import { changeWarehouse } from "features/warehouse/warehouseSlice";
// import { fetchUserPermissions } from "features/user/userSlice";

export default function SignIn() {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const navigate = useNavigate();
  const [password, setPassword] = useState('')
  const handleSubmit = async() => {
    const response = await fetch('http://localhost:5000/api/auth', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({email, password}), 
    });
    const data = await response.json()
    if (data.success) {
      document.cookie = `token=${data.token}; expires=Sun, 3 Sep 2023 12:00:00 UTC ; path=/`;
      localStorage.setItem('user', JSON.stringify(data.user))
      dispatch(login({token:data.token, user: data.user}))
      // dispatch(fetchUserPermissions({roleId: data.user.role}));
      let mainWH = data.user.warehouseId.find(item => item._id == "KHO12345")
      let currentWH = mainWH ? "KHO12345" : data.user.warehouseId[0]._id
      localStorage.setItem('currentWH', currentWH)
      dispatch(changeWarehouse(currentWH))
      navigate(`/admin/`)
    } else {
      alert(data.error)
    }
  }
  return (
    <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      {/* Sign in section */}
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Đăng nhập
        </h4>
        {/* Email */}
        <InputField
          variant="auth"
          extra="mb-3"
          label="Email*"
          placeholder="mail@simmmple.com"
          id="email"
          type="email"
          value={email}
          handleChangeValue={setEmail}
        />

        {/* Password */}
        <InputField
          variant="auth"
          extra="mb-3"
          label="Mật khẩu*"
          placeholder="Min 5 characters"
          id="password"
          type="password"
          value={password}
          handleChangeValue={setPassword}
        />
        {/* Checkbox */}
        <button className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200" onClick={handleSubmit}>
          Đăng nhập
        </button>
      </div>
    </div>
  );
}
