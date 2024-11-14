import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/initSupabase";

export async function GET(req: Request) {
  try {
    // Fetch employees and include any related data as needed
    const employees = await prisma.employee.findMany();

    // Format the data, if necessary
    const formattedEmployees = employees.map((employee) => ({
      id: employee.id,
      email: employee.email,
      role: employee.role,
      last_name: employee.last_name,
      first_name: employee.first_name,
      middle_name: employee.middle_name || null,
      status: employee.status,
      // Additional formatted data if included (e.g., department or role details)
      // department: employee.department ? employee.department.name : "No Department",
    }));

    return NextResponse.json(formattedEmployees);
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch employees." }), {
      status: 500,
    });
  }
}

export async function POST(req: Request) {
  const { email, password, first_name, middle_name, last_name, role } = await req.json();

  try {
    // Step 1: Create the user in Supabase with admin privileges
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        firstName: first_name,
        middleName: middle_name,
        lastName: last_name,
        role,
      },
      email_confirm: true,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const { user } = authData;

    if (!user) {
      return NextResponse.json({ error: "User creation failed" }, { status: 500 });
    }

    // Step 2: Add additional employee data to the database
    const employee = await prisma.employee.create({
      data: {
        id: user.id, // Link to Supabase user ID
        email,
        role,
        first_name,
        middle_name: middle_name || null,
        last_name,
        status: 'Active', // Assuming a default status
      },
    });

    return NextResponse.json({ message: "User and employee created successfully", employee });
  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 });
  }
}


// export async function POST(request: NextRequest) {
//   try {
//     const { email, password, role, last_name, first_name, middle_name } = await request.json();

//     // Step 1: Sign up the user in Supabase
//     const { data: authData, error: authError } = await supabase.auth.signUp({
//       email,
//       password,
//     });

//     if (authError) {
//       console.error("Error signing up:", authError);
//       return NextResponse.json({ error: 'Failed to create user in Supabase' }, { status: 500 });
//     }

//     // Step 2: Store additional user data in the `employee` table
//     const { user } = authData;

//     if (!user) {
//       return NextResponse.json({ error: 'User creation failed' }, { status: 500 });
//     }

//     // Insert employee details in the database
//     const employee = await prisma.employee.create({
//       data: {
//         id: user.id, // Link to auth.users.id
//         email,
//         role,
//         last_name,
//         first_name,
//         middle_name: middle_name || null,
//         status: 'Active',
//       },
//     });

//     return NextResponse.json(employee, { status: 201 });

//   } catch (error) {
//     console.error("Error creating employee:", error);
//     return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 });
//   }
// }
