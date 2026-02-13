import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import path from 'path';
import { existsSync, mkdirSync } from 'fs';

// POST /api/public/apply
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const jobId = formData.get('jobId') as string;
        const fullName = formData.get('fullName') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const cv = formData.get('cv') as File;
        const coverLetter = formData.get('coverLetter') as string;

        if (!jobId || !fullName || !email || !cv) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Validate Job existence
        const job = await prisma.job.findUnique({ where: { id: jobId } });
        if (!job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        // Create filename and path
        const fileName = `${Date.now()}-${cv.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
        const relativePath = `/uploads/cv/${fileName}`;

        // Save file locally (for dev/demo purpose)
        try {
            const bytes = await cv.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Ensure directory exists
            const uploadDir = path.join(process.cwd(), 'public/uploads/cv');
            if (!existsSync(uploadDir)) {
                mkdirSync(uploadDir, { recursive: true });
            }

            const filePath = path.join(uploadDir, fileName);
            await writeFile(filePath, buffer);
        } catch (err) {
            console.error('Error saving file:', err);
            // Continue even if save fails (for demo), or return error?
            // Better to return error if this is critical
            return NextResponse.json({ error: 'Failed to upload CV' }, { status: 500 });
        }

        const mockCvUrl = relativePath;

        // Create Candidate
        const candidate = await prisma.candidate.create({
            data: {
                jobId,
                name: fullName,
                email,
                phone,
                cvUrl: mockCvUrl,
                notes: coverLetter,
                status: 'NEW',
                source: 'WEBSITE', // Assuming 'WEBSITE' is valid enum or string
                rating: 0,
            },
        });

        // Optional: Create initial activity log
        await prisma.candidateActivity.create({
            data: {
                candidateId: candidate.id,
                type: 'STATUS_CHANGE',
                title: 'Ứng tuyển mới',
                content: `Ứng viên nộp hồ sơ qua Website cho vị trí ${job.title}`,
                createdBy: 'System',
            },
        });

        return NextResponse.json({ message: 'Application submitted successfully', id: candidate.id }, { status: 201 });
    } catch (error) {
        console.error('POST /api/public/apply error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
