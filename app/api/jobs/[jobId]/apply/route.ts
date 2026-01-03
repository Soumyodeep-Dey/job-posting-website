import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ jobId: string }> }
) {
    const session = await auth();

    if (!session?.user || !session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobId } = await params;

    try {
        // Check if job exists
        const job = await prisma.job.findUnique({
            where: { id: jobId },
        });

        if (!job) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }

        // Check if user already applied
        const existingApplication = await prisma.application.findUnique({
            where: {
                jobId_userId: {
                    jobId: jobId,
                    userId: session.user.id,
                },
            },
        });

        if (existingApplication) {
            return NextResponse.json(
                { error: "You have already applied for this job" },
                { status: 400 }
            );
        }

        // Create the application
        const application = await prisma.application.create({
            data: {
                jobId: jobId,
                userId: session.user.id,
            },
        });

        return NextResponse.json(application);
    } catch (error) {
        console.error("Error applying for job: ", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
