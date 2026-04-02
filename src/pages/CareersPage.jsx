
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useCareers } from '@/hooks/useCareers';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import AdSenseContainer from '@/components/ads/AdSenseContainer';
import AdSenseResponsive from '@/components/ads/AdSenseResponsive';
import { useAdSense } from '@/contexts/AdSenseProvider';

const CareersPage = () => {
    const { fetchJobPostings } = useCareers();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { shouldShowAds } = useAdSense();

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await fetchJobPostings({ status: 'active' });
                if (data) setJobs(data);
            } catch (error) {
                console.error("Failed to load job postings:", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [fetchJobPostings]);

    return (
        <div className="min-h-screen bg-background">
            <Helmet>
                <title>Careers at a2z Utility Hub</title>
                <meta name="description" content="Join our team and help build the future of digital utilities. Explore open positions." />
            </Helmet>

            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
                <div className="container text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Join Our Mission</h1>
                    <p className="text-xl max-w-2xl mx-auto opacity-90">We're building tools that help millions of people be more productive. Come build with us.</p>
                </div>
            </div>

            {shouldShowAds && (
                <AdSenseContainer className="mt-8 container">
                    <AdSenseResponsive slot="careers_top" />
                </AdSenseContainer>
            )}

            <div className="container py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Open Positions</h2>
                    <p className="text-muted-foreground">Find the role that fits your unique skills.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary"/></div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-12 bg-muted/30 rounded-lg">
                        <h3 className="text-xl font-medium mb-2">No Openings Right Now</h3>
                        <p className="text-muted-foreground">Check back later or follow us on social media for updates.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map((job) => (
                            <motion.div key={job.id} whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
                                <Card className="h-full flex flex-col">
                                    <CardHeader>
                                        <div className="flex justify-between items-start mb-2">
                                            <Badge>{job.job_type}</Badge>
                                        </div>
                                        <CardTitle className="text-xl">{job.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                            <MapPin className="h-4 w-4" /> {job.location}
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{job.description?.replace(/<[^>]*>/g, '')}</p>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className="w-full">Apply Now <ArrowRight className="ml-2 h-4 w-4"/></Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CareersPage;
