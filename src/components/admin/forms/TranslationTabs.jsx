import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const supportedLngs = ['en', 'hi', 'ta', 'te', 'kn', 'ml', 'bn', 'mr'];
const langNames = {
    en: "English",
    hi: "Hindi",
    ta: "Tamil",
    te: "Telugu",
    kn: "Kannada",
    ml: "Malayalam",
    bn: "Bengali",
    mr: "Marathi",
};

const TranslationTabs = ({ item, setItem, fields, defaultValues, isTextarea = {} }) => {
    const [activeLang, setActiveLang] = useState('en');

    const handleFieldChange = (lang, field, value) => {
        const translations = item.translations || {};
        const langTranslations = translations[lang] || { ...defaultValues };

        setItem({
            ...item,
            translations: {
                ...translations,
                [lang]: {
                    ...langTranslations,
                    [field]: value
                }
            }
        });
    };

    return (
        <Tabs value={activeLang} onValueChange={setActiveLang}>
            <TabsList>
                {supportedLngs.map(lang => (
                    <TabsTrigger key={lang} value={lang}>{langNames[lang]}</TabsTrigger>
                ))}
            </TabsList>
            {supportedLngs.map(lang => (
                <TabsContent key={lang} value={lang} className="space-y-4">
                    {fields.map(field => {
                        const value = item.translations?.[lang]?.[field] ?? '';
                        return (
                            <div key={`${lang}-${field}`}>
                                <Label htmlFor={`${lang}-${field}`} className="capitalize">{field.replace('_', ' ')}</Label>
                                {isTextarea[field] ? (
                                    <Textarea
                                        id={`${lang}-${field}`}
                                        value={value}
                                        onChange={e => handleFieldChange(lang, field, e.target.value)}
                                        rows={field === 'content' ? 10 : 3}
                                    />
                                ) : (
                                    <Input
                                        id={`${lang}-${field}`}
                                        value={value}
                                        onChange={e => handleFieldChange(lang, field, e.target.value)}
                                    />
                                )}
                            </div>
                        );
                    })}
                </TabsContent>
            ))}
        </Tabs>
    );
};

export default TranslationTabs;