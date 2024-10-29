import prisma from "@/lib/db";
import { supabase } from "@/lib/initSupabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();
    
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })
          
        return NextResponse.json(data);

    } catch (error) {
        console.error("Error logging in:", error);
        return NextResponse.json({ error: 'Failed to log in' }, { status: 500 });
    }
}

//JWT - JSON Web Token