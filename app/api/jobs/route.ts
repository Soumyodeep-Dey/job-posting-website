import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const session = await auth();

    if (!session?.user || !session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const data = await request.json();

        const job = await prisma.job.create({
            data: {
                ...data,
                postedById: session.user.id,
            },
        });

        return NextResponse.json(job);
    } catch (error) {
        console.error("Error creating job: ", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}

export async function GET() {
    try {
        const jobs = await prisma.job.findMany({
            include: {
                postedBy: {
                    select: {
                        name: true,
                        image: true,
                    },
                },
            },
            orderBy: {
                postedAt: "desc",
            },
        });

        return NextResponse.json(jobs);
    } catch (error) {
        console.error("Error fetching jobs: ", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
