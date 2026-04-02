import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Link } from '@tiptap/extension-link';
import { useFooterCMS } from '@/hooks/useFooterCMS';
import { Loader2, Save, ArrowLeft, Globe } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminPageEditor = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { fetchPages, savePage, loading } = useFooterCMS();
    const [page, setPage] = useState(null);
    const { toast } = useToast();

    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({ openOnClick: false }),
        ],
        content: '',
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px] p-4 border rounded-md shadow-sm',
            },
        },
    });

    useEffect(() => {
        const load = async () => {
            const { data } = await fetchPages({ slug });
            if (data) {
                setPage(data);
                if (editor) {
                    editor.commands.setContent(data.content || '');
                }
            } else {
                toast({ title: "Error", description: "Page not found", variant: "destructive" });
                navigate('/admin/pages');
            }
        };
        load();
    }, [slug, editor, fetchPages, navigate, toast]);

    const handleSave = async () => {
        if (!editor || !page) return;
        
        const content = editor.getHTML();
        const { error } = await savePage({
            ...page,
            content,
            updated_at: new Date()
        });
        
        if (!error) {
            toast({ title: "Saved", description: "Page content updated successfully." });
        }
    };

    if (loading && !page) return <div className="flex justify-center p-20"><Loader2 className="animate-spin"/></div>;
    if (!page) return null;

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] gap-6">
            <div className="flex justify-between items-center bg-card p-4 rounded-lg border shadow-sm">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/admin/pages')}>
                        <ArrowLeft className="h-5 w-5"/>
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold">{page.title}</h1>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Globe className="h-3 w-3"/> /{page.slug}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Select 
                        value={page.status} 
                        onValueChange={(v) => setPage({...page, status: v})}
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Status"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4"/>}
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="flex-1 bg-card rounded-lg border shadow-sm overflow-hidden flex flex-col">
                <div className="border-b p-2 flex gap-2 overflow-x-auto bg-muted/30">
                    <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBold().run()} className={editor?.isActive('bold') ? 'bg-muted' : ''}>Bold</Button>
                    <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor?.isActive('italic') ? 'bg-muted' : ''}>Italic</Button>
                    <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor?.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}>H2</Button>
                    <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor?.isActive('heading', { level: 3 }) ? 'bg-muted' : ''}>H3</Button>
                    <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor?.isActive('bulletList') ? 'bg-muted' : ''}>Bullet List</Button>
                    <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleLink({ href: window.prompt('URL') }).run()} className={editor?.isActive('link') ? 'bg-muted' : ''}>Link</Button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 bg-white">
                    <EditorContent editor={editor} />
                </div>
            </div>
        </div>
    );
};

export default AdminPageEditor;