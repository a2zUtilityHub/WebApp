-- =========
-- HOUSEKEEPING & SCHEMA CORRECTION
-- =========

-- Drop old functions and triggers that are no longer needed.
DROP TRIGGER IF EXISTS trigger_sync_to_subtables ON public.categories;
DROP FUNCTION IF EXISTS public.sync_to_subtables();
DROP FUNCTION IF EXISTS public.sync_from_subtable();

-- Drop obsolete or confusing category-related junction tables to start fresh.
DROP TABLE IF EXISTS public.app_category_map CASCADE;
DROP TABLE IF EXISTS public.app_categories_junction CASCADE;
DROP TABLE IF EXISTS public.app_category_joins CASCADE;

-- Drop obsolete columns from tables.
ALTER TABLE public.categories DROP COLUMN IF EXISTS sub_category_id;
ALTER TABLE public.categories DROP COLUMN IF EXISTS long_description;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS locale;

-- Ensure categories slug is unique per type.
ALTER TABLE public.categories DROP CONSTRAINT IF EXISTS categories_slug_key;
ALTER TABLE public.categories ADD CONSTRAINT categories_slug_type_unique UNIQUE (slug, type);

-- Ensure all SEO columns exist on the 'apps' table.
ALTER TABLE public.apps ADD COLUMN IF NOT EXISTS og_title TEXT;
ALTER TABLE public.apps ADD COLUMN IF NOT EXISTS og_description TEXT;
ALTER TABLE public.apps ADD COLUMN IF NOT EXISTS twitter_card TEXT;

-- Ensure all SEO columns exist on the 'blog_posts' table.
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS og_title TEXT;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS og_description TEXT;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS twitter_card TEXT;

-- Ensure all SEO columns exist on the 'coupons' table.
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS og_title TEXT;
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS og_description TEXT;
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS twitter_card TEXT;
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS canonical_url TEXT;

-- Add a database-level check constraint to enforce the 'Production' status rule.
ALTER TABLE public.apps DROP CONSTRAINT IF EXISTS check_production_status_requires_url;
ALTER TABLE public.apps
ADD CONSTRAINT check_production_status_requires_url
CHECK (NOT (status = 'Production' AND (url IS NULL OR url = '')));

-- Create required junction tables
CREATE TABLE IF NOT EXISTS public.apps_categories (
    app_id bigint NOT NULL REFERENCES public.apps(id) ON DELETE CASCADE,
    category_id bigint NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    PRIMARY KEY (app_id, category_id)
);

CREATE TABLE IF NOT EXISTS public.blogs_categories (
    blog_id bigint NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    category_id bigint NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    PRIMARY KEY (blog_id, category_id)
);

CREATE TABLE IF NOT EXISTS public.coupons_categories (
    coupon_id bigint NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
    category_id bigint NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    PRIMARY KEY (coupon_id, category_id)
);


-- =========
-- DATA UPDATES & SEEDING
-- =========

-- Update existing apps that are functional to 'Production' status with their correct URLs.
UPDATE public.apps SET status = 'Production', url = '/apps/qr-code-generator' WHERE name = 'QR Code Generator';
UPDATE public.apps SET status = 'Production', url = '/apps/url-shortener' WHERE name = 'URL Shortener';
UPDATE public.apps SET status = 'Production', url = '/apps/task-manager' WHERE name = 'Task Manager';
UPDATE public.apps SET status = 'Production', url = '/apps/product-profit-calculator' WHERE name = 'Product Profit Calculator';
UPDATE public.apps SET status = 'Production', url = '/apps/barcode-generator-and-scanner' WHERE name = 'Barcode Generator and Scanner';
UPDATE public.apps SET status = 'Production', url = '/apps/online-file-converter' WHERE name = 'Online File Converter';

-- Seed some initial categories for the 'App' type.
INSERT INTO public.categories (name, slug, type, description) VALUES
('Productivity', 'productivity', 'App', 'Tools to help you get things done faster.'),
('Business & Finance', 'business-finance', 'App', 'Applications for managing your business and finances.'),
('Marketing', 'marketing-app', 'App', 'Utilities to boost your marketing efforts.'),
('Development', 'development', 'App', 'Tools and utilities for developers.')
ON CONFLICT (slug, type) DO NOTHING;

-- Assign the existing apps to their new categories using the correct junction table.
DO $$
DECLARE
    productivity_id bigint;
    business_id bigint;
    marketing_id bigint;
    dev_id bigint;
    app_rec record;
BEGIN
    SELECT id INTO productivity_id FROM public.categories WHERE slug = 'productivity' AND type = 'App';
    SELECT id INTO business_id FROM public.categories WHERE slug = 'business-finance' AND type = 'App';
    SELECT id INTO marketing_id FROM public.categories WHERE slug = 'marketing-app' AND type = 'App';
    SELECT id INTO dev_id FROM public.categories WHERE slug = 'development' AND type = 'App';

    -- Clear existing mappings to prevent duplicates on re-run.
    TRUNCATE public.apps_categories;

    -- Assign apps to categories safely.
    FOR app_rec IN SELECT id, name FROM public.apps LOOP
        IF app_rec.name = 'Task Manager' THEN
            INSERT INTO public.apps_categories (app_id, category_id) VALUES (app_rec.id, productivity_id) ON CONFLICT DO NOTHING;
        ELSIF app_rec.name = 'Product Profit Calculator' THEN
            INSERT INTO public.apps_categories (app_id, category_id) VALUES (app_rec.id, business_id) ON CONFLICT DO NOTHING;
        ELSIF app_rec.name = 'QR Code Generator' THEN
            INSERT INTO public.apps_categories (app_id, category_id) VALUES (app_rec.id, marketing_id) ON CONFLICT DO NOTHING;
        ELSIF app_rec.name = 'URL Shortener' THEN
            INSERT INTO public.apps_categories (app_id, category_id) VALUES (app_rec.id, marketing_id) ON CONFLICT DO NOTHING;
        ELSIF app_rec.name = 'Barcode Generator and Scanner' THEN
            INSERT INTO public.apps_categories (app_id, category_id) VALUES (app_rec.id, business_id) ON CONFLICT DO NOTHING;
        ELSIF app_rec.name = 'Online File Converter' THEN
            INSERT INTO public.apps_categories (app_id, category_id) VALUES (app_rec.id, productivity_id) ON CONFLICT DO NOTHING;
        ELSIF app_rec.name = 'Video Editor' THEN
            INSERT INTO public.apps_categories (app_id, category_id) VALUES (app_rec.id, marketing_id) ON CONFLICT DO NOTHING;
        END IF;
    END LOOP;
END $$;