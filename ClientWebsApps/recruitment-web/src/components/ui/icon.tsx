import {
    LayoutDashboard,
    MessageCircle,
    Clock,
    GitPullRequest,
    FileCheck,
    Briefcase,
    Users,
    Calendar,
    UserPlus,
    User,
    FileText,
    Building,
    Award,
    UserMinus,
    CalendarOff,
    Timer,
    Shield,
    Banknote,
    GraduationCap,
    FolderOpen,
    History,
    FileQuestion,
    PlayCircle,
    Target,
    ClipboardList,
    BarChart3,
    Monitor,
    Settings,
    BadgePercent,
    Calculator,
    Menu,
    ChevronRight,
    type LucideIcon,
} from 'lucide-react';

export const Icons: Record<string, LucideIcon> = {
    LayoutDashboard,
    MessageCircle,
    Clock,
    GitPullRequest,
    FileCheck,
    Briefcase,
    Users,
    Calendar,
    UserPlus,
    User,
    FileText,
    Building,
    Award,
    UserMinus,
    CalendarOff,
    Timer,
    Shield,
    Banknote,
    GraduationCap,
    FolderOpen,
    History,
    FileQuestion,
    PlayCircle,
    Target,
    ClipboardList,
    BarChart3,
    Monitor,
    Settings,
    BadgePercent,
    Calculator,
    Menu,
    ChevronRight,
};

interface IconProps extends React.ComponentProps<LucideIcon> {
    name: string;
}

export const Icon = ({ name, ...props }: IconProps) => {
    const LucideIcon = Icons[name];

    if (!LucideIcon) {
        return null;
    }

    return <LucideIcon {...props} />;
};
