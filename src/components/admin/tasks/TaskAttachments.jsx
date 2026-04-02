import React, { useEffect, useState, useRef } from 'react';
import { useTaskManagement } from '@/hooks/useTaskManagement';
import { Button } from '@/components/ui/button';
import { FileImage as FileIcon, Upload, Trash2, Download } from 'lucide-react';

const TaskAttachments = ({ taskId }) => {
    const { fetchAttachments, uploadAttachment, deleteAttachment } = useTaskManagement();
    const [attachments, setAttachments] = useState([]);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const loadAttachments = async () => {
        const data = await fetchAttachments(taskId);
        setAttachments(data || []);
    };

    useEffect(() => {
        if(taskId) loadAttachments();
    }, [taskId]);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        await uploadAttachment(taskId, file);
        await loadAttachments();
        setUploading(false);
    };

    const handleDelete = async (id, fileName) => {
        if (window.confirm('Delete this attachment?')) {
            await deleteAttachment(id, fileName);
            loadAttachments();
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleUpload} 
                    className="hidden" 
                />
                <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                    <Upload className="mr-2 h-4 w-4" /> 
                    {uploading ? 'Uploading...' : 'Upload File'}
                </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {attachments.map(file => (
                    <div key={file.id} className="flex items-center p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                        <FileIcon className="h-8 w-8 text-blue-500 mr-3" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate" title={file.file_name}>{file.file_name}</p>
                            <p className="text-xs text-muted-foreground">{(file.file_size / 1024).toFixed(1)} KB • {new Date(file.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-1">
                             <Button size="icon" variant="ghost" asChild>
                                <a href={file.file_url} target="_blank" rel="noopener noreferrer" download>
                                    <Download className="h-4 w-4" />
                                </a>
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => handleDelete(file.id, file.file_name)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                    </div>
                ))}
                {attachments.length === 0 && <div className="col-span-full text-center py-8 text-muted-foreground">No attachments yet.</div>}
            </div>
        </div>
    );
};

export default TaskAttachments;