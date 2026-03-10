import prisma from '@/lib/prisma';
import { notificationService } from '@/lib/notification-service';
import { auditService } from '@/lib/audit-service';

interface WorkflowStep {
    order: number;
    role: string;
    label: string;
    status?: 'PENDING' | 'APPROVED' | 'REJECTED';
    approvedBy?: string;
    approvedAt?: string;
    comment?: string;
}

interface SubmitRequestOptions {
    type: string;
    requesterId: string;
    requesterName: string;
    department?: string;
    title: string;
    description?: string;
    metadata?: Record<string, unknown>;
}

class WorkflowEngine {
    /**
     * Submit a new approval request — auto-finds matching workflow and creates request with steps
     */
    async submitRequest(options: SubmitRequestOptions) {
        const { type, requesterId, requesterName, department, title, description, metadata } = options;

        // Find matching workflow
        const workflow = await prisma.approvalWorkflow.findFirst({
            where: { type: type as any },
        });

        // Default single-step if no workflow configured
        const workflowSteps: WorkflowStep[] = workflow?.steps
            ? (JSON.parse(JSON.stringify(workflow.steps)) as WorkflowStep[]).map(s => ({
                ...s,
                status: 'PENDING' as const,
            }))
            : [{ order: 1, role: 'HR_MANAGER', label: 'Quản lý HR', status: 'PENDING' }];

        // Generate unique code
        const count = await prisma.approvalRequest.count();
        const code = `REQ-${new Date().getFullYear()}${String(count + 1).padStart(5, '0')}`;

        const request = await prisma.approvalRequest.create({
            data: {
                code,
                type: type as any,
                requesterId,
                requesterName,
                department,
                title,
                description,
                metadata: (metadata || {}) as any,
                status: 'PENDING',
                currentStepOrder: 1,
                totalSteps: workflowSteps.length,
                steps: workflowSteps as any,
            },
        });

        // Notify first-step approvers
        await this.notifyStepApprovers(request.id, workflowSteps[0], title);

        // Audit log
        await auditService.log({
            userId: requesterId,
            userName: requesterName,
            action: 'CREATE',
            target: `approval-request/${request.code}`,
            details: title,
        });

        return request;
    }

    /**
     * Approve the current step of an approval request
     */
    async approveStep(requestId: string, userId: string, userName: string, comment?: string) {
        const request = await prisma.approvalRequest.findUnique({ where: { id: requestId } });
        if (!request) throw new Error('Request not found');
        if (request.status !== 'PENDING') throw new Error('Request is not pending');

        const steps = JSON.parse(JSON.stringify(request.steps)) as WorkflowStep[];
        const currentStep = steps.find(s => s.order === request.currentStepOrder);
        if (!currentStep) throw new Error('Current step not found');

        // Update current step
        currentStep.status = 'APPROVED';
        currentStep.approvedBy = userName;
        currentStep.approvedAt = new Date().toISOString();
        currentStep.comment = comment;

        const isLastStep = request.currentStepOrder >= request.totalSteps;

        const updated = await prisma.approvalRequest.update({
            where: { id: requestId },
            data: {
                steps: steps as any,
                currentStepOrder: isLastStep ? request.currentStepOrder : request.currentStepOrder + 1,
                status: isLastStep ? 'APPROVED' : 'PENDING',
            },
        });

        // If not last step, notify next approvers
        if (!isLastStep) {
            const nextStep = steps.find(s => s.order === request.currentStepOrder + 1);
            if (nextStep) {
                await this.notifyStepApprovers(requestId, nextStep, request.title);
            }
        } else {
            // Notify requester that request is fully approved
            await notificationService.notify({
                userId: request.requesterId,
                title: `Yêu cầu ${request.code} đã được duyệt ✅`,
                message: `"${request.title}" đã được duyệt hoàn tất bởi ${userName}.`,
                type: 'TASK_ASSIGNMENT',
                priority: 'HIGH',
                actionUrl: '/admin/approvals',
            });
        }

        // Audit
        await auditService.logApprove(userId, userName, `approval-request/${request.code}`, `Step ${request.currentStepOrder}/${request.totalSteps}`);

        return updated;
    }

    /**
     * Reject the current step — ends the entire request
     */
    async rejectStep(requestId: string, userId: string, userName: string, reason?: string) {
        const request = await prisma.approvalRequest.findUnique({ where: { id: requestId } });
        if (!request) throw new Error('Request not found');
        if (request.status !== 'PENDING') throw new Error('Request is not pending');

        const steps = JSON.parse(JSON.stringify(request.steps)) as WorkflowStep[];
        const currentStep = steps.find(s => s.order === request.currentStepOrder);
        if (currentStep) {
            currentStep.status = 'REJECTED';
            currentStep.approvedBy = userName;
            currentStep.approvedAt = new Date().toISOString();
            currentStep.comment = reason;
        }

        const updated = await prisma.approvalRequest.update({
            where: { id: requestId },
            data: {
                steps: steps as any,
                status: 'REJECTED',
            },
        });

        // Notify requester
        await notificationService.notify({
            userId: request.requesterId,
            title: `Yêu cầu ${request.code} bị từ chối ❌`,
            message: `"${request.title}" bị từ chối bởi ${userName}.${reason ? ` Lý do: ${reason}` : ''}`,
            type: 'TASK_ASSIGNMENT',
            priority: 'HIGH',
            actionUrl: '/admin/approvals',
        });

        // Audit
        await auditService.logReject(userId, userName, `approval-request/${request.code}`, reason);

        return updated;
    }

    /**
     * Notify approvers for a specific step
     */
    private async notifyStepApprovers(requestId: string, step: WorkflowStep, title: string) {
        // Find users with the matching role
        const users = await prisma.user.findMany({
            where: {
                status: 'ACTIVE',
                role: step.role as any,
            },
            select: { id: true },
        });

        if (users.length > 0) {
            await notificationService.notifyMany({
                userIds: users.map(u => u.id),
                title: `📋 Cần duyệt: ${title}`,
                message: `Bạn có yêu cầu mới cần xét duyệt (Bước ${step.order}: ${step.label}).`,
                type: 'TASK_ASSIGNMENT',
                priority: 'HIGH',
                actionUrl: '/admin/approvals',
            });
        }
    }
}

export const workflowEngine = new WorkflowEngine();
