import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useFooterCMS } from '@/hooks/useFooterCMS';
import { useCareers } from '@/hooks/useCareers';
import { Loader2, GraduationCap, Briefcase, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Breadcrumbs from '@/components/Breadcrumbs';

const InternshipPage = () => {
    const { fetchPages } = useFooterCMS();
    const { fetchJobPostings } = useCareers();
    const [page, setPage] = useState(null);
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await fetchPages({ slug: 'internship' });
                if (data) setPage(data);
                
                const { data: jobs } = await fetchJobPostings({ job_type: 'internship', status: 'active' });
                if (jobs) setInternships(jobs);
            } catch (error) {
                console.error("Failed to load internship page:", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [fetchPages, fetchJobPostings]);

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>;

    return (
        <div className="min-h-screen bg-background">
            <Helmet>
                <title>Internship Program | a2z Utility Hub</title>
                <meta name="description" content="Kickstart your career with our internship program." />
            </Helmet>

            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
                <div className="container text-center">
                    <GraduationCap className="h-16 w-16 mx-auto mb-4 opacity-90" />
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Student Internship Program</h1>
                    <p className="text-xl opacity-90 max-w-2xl mx-auto">Gain real-world experience, mentorship, and skills to launch your career in tech.</p>
                </div>
            </div>

            <div className="container py-12">
                <Breadcrumbs items={[{ title: "Internship", to: "/internship" }]} className="mb-12" />

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <Card>
                        <CardContent className="pt-6">
                            <Briefcase className="h-10 w-10 text-orange-500 mb-4" />
                            <h3 className="text-xl font-bold mb-2">Real Projects</h3>
                            <p className="text-muted-foreground">Work on production code and real features used by thousands.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <Users className="h-10 w-10 text-orange-500 mb-4" />
                            <h3 className="text-xl font-bold mb-2">Mentorship</h3>
                            <p className="text-muted-foreground">One-on-one guidance from senior engineers and product managers.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <GraduationCap className="h-10 w-10 text-orange-500 mb-4" />
                            <h3 className="text-xl font-bold mb-2">Career Growth</h3>
                            <p className="text-muted-foreground">Possibility of full-time offers and career recommendations.</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-center">Open Positions</h2>
                    {internships.length === 0 ? (
                        <div className="text-center p-12 bg-muted rounded-lg">
                            <p className="text-lg text-muted-foreground">No internship positions currently open. Please check back later.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {internships.map(job => (
                                <Card key={job.id}>
                                    <CardHeader>
                                        <CardTitle>{job.title}</CardTitle>
                                        <div className="text-sm text-muted-foreground">{job.location} • {job.job_type}</div>
                                    </CardHeader>
                                    <CardContent>
                                        <Button className="w-full">Apply Now</Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                <div 
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: page?.content || "<p>Learn more about our internship program by contacting us.</p>" }} 
                />
            </div>
        </div>
    );
};

export default InternshipPage;