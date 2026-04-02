import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Bot, User, MessageSquare, Code, Cpu, Layers } from 'lucide-react';

export const StatusBadge = ({ status }) => {
    const variants = {
        active: 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200',
        inactive: 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200',
        archived: 'bg-red-100 text-red-800 hover:bg-red-200 border-red-200',
    };
    return (
        <Badge variant="outline" className={`${variants[status] || variants.inactive} capitalize`}>
            {status}
        </Badge>
    );
};

export const TypeBadge = ({ type }) => {
    const icons = {
        'AI': <Cpu className="w-3 h-3 mr-1" />,
        'rule-based': <Code className="w-3 h-3 mr-1" />,
        'hybrid': <Layers className="w-3 h-3 mr-1" />
    };
    const variants = {
        'AI': 'bg-blue-100 text-blue-800 border-blue-200',
        'rule-based': 'bg-purple-100 text-purple-800 border-purple-200',
        'hybrid': 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return (
        <Badge variant="outline" className={`${variants[type] || variants.hybrid} capitalize flex items-center w-fit`}>
            {icons[type]} {type}
        </Badge>
    );
};

export const SenderTypeBadge = ({ type }) => {
     return type === 'user' ? (
        <Badge variant="secondary" className="flex items-center gap-1"><User className="w-3 h-3"/> User</Badge>
     ) : (
        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-1"><Bot className="w-3 h-3"/> Bot</Badge>
     );
};