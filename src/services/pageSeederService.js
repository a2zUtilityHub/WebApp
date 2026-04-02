import { supabase } from '@/lib/customSupabaseClient';
import { DEFAULT_PAGE_CONTENT } from '@/constants/defaultPageContent';

export const pageSeederService = {
    async seedAllPages() {
        console.log("Starting page seeding...");
        const slugs = Object.keys(DEFAULT_PAGE_CONTENT);
        
        for (const slug of slugs) {
            await this.seedPage(slug, DEFAULT_PAGE_CONTENT[slug]);
        }
        
        await this.seedCopyright();
        console.log("Page seeding complete.");
    },

    async seedPage(slug, data) {
        try {
            // Check if page exists
            const { data: existing } = await supabase
                .from('pages')
                .select('id')
                .eq('slug', slug)
                .maybeSingle();

            if (!existing) {
                // Create page
                const { data: page, error } = await supabase
                    .from('pages')
                    .insert({
                        slug,
                        title: data.title,
                        content: data.content,
                        status: 'published',
                        meta_description: data.seo.description
                    })
                    .select()
                    .single();

                if (error) throw error;
                
                // Seed SEO settings
                await supabase.from('seo_settings').insert({
                    page_id: page.id,
                    title: data.seo.title,
                    description: data.seo.description
                });
                
                console.log(`Seeded page: ${slug}`);
            }
        } catch (error) {
            console.error(`Error seeding page ${slug}:`, error);
        }
    },

    async seedCopyright() {
        try {
            const { data: existing } = await supabase.from('copyright_info').select('id').maybeSingle();
            if (!existing) {
                await supabase.from('copyright_info').insert({
                    company_name: 'a2z Utility Hub',
                    copyright_year: new Date().getFullYear(),
                    copyright_text: `© ${new Date().getFullYear()} a2z Utility Hub. All rights reserved.`
                });
                console.log("Seeded copyright info");
            }
        } catch (error) {
            console.error("Error seeding copyright:", error);
        }
    }
};