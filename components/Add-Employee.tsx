"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { Button } from "@/components/ui/button";
// import { supabase } from "@/lib/initSupabase";

const employeeSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string(),
  last_name: z.string(),
  first_name: z.string(),
  middle_name: z.string().optional(),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

export default function RegisterEmployee() {

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
  });
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  // const onSubmit = async (data: EmployeeFormData) => {
  //   setLoading(true);
  //   setMessage("");
  //   try {
  //     // Step 1: Create the user in Supabase with extended user_metadata
  //     const { data: supabaseData, error: supabaseError } = await supabase.auth.admin.createUser({
  //       email: data.email,
  //       password: data.password,
  //       user_metadata: {
  //         firstName: data.first_name,
  //         middleName: data.middle_name,
  //         lastName: data.last_name,
  //         role: data.role,
  //       },
  //       email_confirm: true,
  //     });
  
  //     if (supabaseError) {
  //       throw new Error("Failed to create user: " + supabaseError.message);
  //     }
  
  //     // Step 2: Call your API endpoint to add employee information
  //     const response = await fetch("/api/employee", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(data),
  //     });
  
  //     if (!response.ok) {
  //       throw new Error("Failed to create employee");
  //     }
  
  //     const result = await response.json();
  //     setMessage("Employee created successfully!");
  //   } catch (error: any) {
  //     setMessage(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  

  const onSubmit = async (data: EmployeeFormData) => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/employee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create employee");
      }

      const result = await response.json();
      setMessage("Employee created successfully!");
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ml-72 mr-72 mt-20 p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Register New Employee</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            {...register("email")}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>
        
        <div className="mb-4 relative">
          <label className="block text-gray-700">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            className="w-full px-3 py-2 border rounded pr-10"
          />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
          <div
            className="absolute right-3 top-11 transform -translate-y-1/2 cursor-pointer text-xl text-gray-500"
            onClick={handleTogglePassword}
          >
            {showPassword ? <VscEyeClosed /> : <VscEye />}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Role</label>
          <select
            {...register("role")}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select Role</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Admin">Admin</option>
            <option value="Staff">Staff</option>
          </select>
          {errors.role && <p className="text-red-500">{errors.role.message}</p>}
        </div>

        <div className="flex space-x-4 mb-4">
          <div className="w-1/3">
            <label className="block text-gray-700">Last Name</label>
            <input
              type="text"
              {...register("last_name")}
              className="w-full px-3 py-2 border rounded"
            />
            {errors.last_name && <p className="text-red-500">{errors.last_name.message}</p>}
          </div>
          <div className="w-1/3">
            <label className="block text-gray-700">First Name</label>
            <input
              type="text"
              {...register("first_name")}
              className="w-full px-3 py-2 border rounded"
            />
            {errors.first_name && <p className="text-red-500">{errors.first_name.message}</p>}
          </div>
          <div className="w-1/3">
            <label className="block text-gray-700">Middle Name</label>
            <input
              type="text"
              {...register("middle_name")}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>

        {message && <p className="text-green-500 mb-4">{message}</p>}
        <Button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 rounded"
        >
          {loading ? "Submitting..." : "Register Employee"}
        </Button>
      </form>
    </div>
  );
}
