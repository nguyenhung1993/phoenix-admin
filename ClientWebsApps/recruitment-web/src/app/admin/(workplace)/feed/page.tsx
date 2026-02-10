
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { mockPosts, mockEvents, Post } from '@/lib/mocks';
import {
    Heart,
    MessageCircle,
    Share2,
    Image as ImageIcon,
    Send,
    MoreHorizontal,
    Gift,
    UserPlus,
    Calendar,
} from 'lucide-react';
import { toast } from 'sonner';

export default function WorkplaceFeedPage() {
    const [posts, setPosts] = useState<Post[]>(mockPosts);
    const [newPostContent, setNewPostContent] = useState('');

    const handlePost = () => {
        if (!newPostContent.trim()) return;

        const newPost: Post = {
            id: Date.now().toString(),
            authorId: 'CURRENT_USER',
            authorName: 'Tôi (Admin)', // Hardcoded for demo
            authorRole: 'Admin',
            content: newPostContent,
            type: 'SOCIAL',
            likes: 0,
            comments: 0,
            createdAt: new Date().toISOString(),
        };

        setPosts([newPost, ...posts]);
        setNewPostContent('');
        toast.success('Đã đăng bài viết mới!');
    };

    const handleLike = (postId: string) => {
        setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            {/* MAIN CONTENT - FEED */}
            <div className="flex-1 space-y-6">
                {/* CREATE POST BOX */}
                <Card>
                    <CardContent className="p-4 space-y-4">
                        <div className="flex gap-4">
                            <Avatar>
                                <AvatarFallback>ME</AvatarFallback>
                            </Avatar>
                            <Textarea
                                placeholder="Bạn đang nghĩ gì? Chia sẻ với đồng nghiệp ngay..."
                                className="resize-none min-h-[80px]"
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <Button variant="ghost" size="sm" className="text-muted-foreground">
                                <ImageIcon className="mr-2 h-4 w-4" />
                                Ảnh/Video
                            </Button>
                            <Button onClick={handlePost} disabled={!newPostContent.trim()}>
                                <Send className="mr-2 h-4 w-4" />
                                Đăng bài
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* POST LIST */}
                <div className="space-y-4">
                    {posts.map((post) => (
                        <Card key={post.id} className="overflow-hidden">
                            <CardHeader className="p-4 flex flex-row items-center gap-4 space-y-0">
                                <Avatar>
                                    <AvatarFallback>{post.authorName[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">{post.authorName}</span>
                                        {post.authorRole && (
                                            <span className="text-xs text-muted-foreground">• {post.authorRole}</span>
                                        )}
                                    </div>
                                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                                        <span>{new Date(post.createdAt).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                                        {post.type === 'ANNOUNCEMENT' && (
                                            <Badge variant="destructive" className="h-4 px-1 text-[10px]">THÔNG BÁO</Badge>
                                        )}
                                        {post.type === 'EVENT' && (
                                            <Badge variant="secondary" className="h-4 px-1 text-[10px]">SỰ KIỆN</Badge>
                                        )}
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 space-y-4">
                                <p className="whitespace-pre-wrap">{post.content}</p>
                                {post.images && post.images.length > 0 && (
                                    <div className="grid gap-2">
                                        {post.images.map((img, idx) => (
                                            <img
                                                key={idx}
                                                src={img}
                                                alt="Post content"
                                                className="rounded-lg object-cover w-full max-h-[400px]"
                                            />
                                        ))}
                                    </div>
                                )}
                                <Separator />
                                <div className="flex justify-between items-center pt-1">
                                    <Button variant="ghost" size="sm" onClick={() => handleLike(post.id)}>
                                        <Heart className={`mr-2 h-4 w-4 ${post.likes > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                                        {post.likes > 0 ? post.likes : 'Thích'}
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                        <MessageCircle className="mr-2 h-4 w-4" />
                                        {post.comments > 0 ? `${post.comments} Bình luận` : 'Bình luận'}
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                        <Share2 className="mr-2 h-4 w-4" />
                                        Chia sẻ
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* RIGHT SIDEBAR - WIDGETS */}
            <div className="w-full lg:w-80 space-y-6">
                {/* BIRTHDAYS */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <Gift className="h-4 w-4 text-pink-500" />
                            Sinh nhật tháng này
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {mockEvents.filter(e => e.type === 'BIRTHDAY').map(evt => (
                            <div key={evt.id} className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-pink-100 text-pink-600">🎂</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 text-sm">
                                    <div className="font-medium">{evt.title}</div>
                                    <div className="text-muted-foreground text-xs">{new Date(evt.date).toLocaleDateString('vi-VN')}</div>
                                </div>
                                <Button variant="outline" size="sm" className="h-7 text-xs">
                                    Chúc mừng
                                </Button>
                            </div>
                        ))}
                        {mockEvents.filter(e => e.type === 'BIRTHDAY').length === 0 && (
                            <div className="text-sm text-muted-foreground text-center">Không có sinh nhật nào sắp tới.</div>
                        )}
                    </CardContent>
                </Card>

                {/* NEW HIRES */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <UserPlus className="h-4 w-4 text-blue-500" />
                            Thành viên mới
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {mockEvents.filter(e => e.type === 'NEW_HIRE').map(evt => (
                            <div key={evt.id} className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-blue-100 text-blue-600">👋</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 text-sm">
                                    <div className="font-medium">{evt.title}</div>
                                    <div className="text-muted-foreground text-xs">Gia nhập: {new Date(evt.date).toLocaleDateString('vi-VN')}</div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* UPCOMING EVENTS */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-orange-500" />
                            Sự kiện công ty
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {mockEvents.filter(e => e.type === 'COMPANY_EVENT').map(evt => (
                            <div key={evt.id} className="text-sm border-l-2 border-orange-500 pl-3 py-1">
                                <div className="font-medium">{evt.title}</div>
                                <div className="text-muted-foreground text-xs mb-1">{new Date(evt.date).toLocaleDateString('vi-VN')}</div>
                                {evt.description && <div className="text-xs italic">{evt.description}</div>}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
