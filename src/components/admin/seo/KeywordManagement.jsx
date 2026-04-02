import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useAdminSEO } from '@/hooks/useAdminSEO';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

const KeywordManagement = () => {
    const { fetchKeywords, deleteKeyword, loading } = useAdminSEO();
    const [keywords, setKeywords] = useState([]);

    useEffect(() => {
        fetchKeywords().then(res => setKeywords(res.data || []));
    }, []);

    return (
        <div className="space-y-4">
             <div className="flex justify-between">
                <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search keywords..." className="pl-8" />
                </div>
                <Button><Plus className="mr-2 h-4 w-4"/> Track Keyword</Button>
            </div>
            <div className="rounded-xl border bg-card shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Keyword</TableHead>
                            <TableHead>Volume</TableHead>
                            <TableHead>Difficulty</TableHead>
                            <TableHead>Intent</TableHead>
                            <TableHead>Position</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {keywords.length > 0 ? keywords.map(k => (
                            <TableRow key={k.id}>
                                <TableCell className="font-medium">{k.keyword_name}</TableCell>
                                <TableCell>{k.search_volume}</TableCell>
                                <TableCell>
                                    <Badge variant={k.difficulty > 70 ? 'destructive' : 'secondary'}>{k.difficulty}</Badge>
                                </TableCell>
                                <TableCell className="capitalize">{k.intent}</TableCell>
                                <TableCell className="font-bold text-blue-600">#{k.ranking_position}</TableCell>
                                <TableCell>
                                    <Button size="icon" variant="ghost" className="text-destructive"><Trash2 className="h-4 w-4"/></Button>
                                </TableCell>
                            </TableRow>
                        )) : <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No keywords tracked yet.</TableCell></TableRow>}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default KeywordManagement;