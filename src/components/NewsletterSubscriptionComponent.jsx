import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useNewsletter } from '@/hooks/useNewsletter';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const NewsletterSubscriptionComponent = () => {
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const { subscribe, loading } = useNewsletter();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        // Handled by HTML5 validation mostly, but safety check
        return;
    }
    if (!agreed) {
        alert("Please agree to the privacy policy.");
        return;
    }
    const success = await subscribe(email);
    if (success) setEmail('');
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubscribe} className="space-y-3">
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
            className="bg-white border-gray-300 text-gray-900"
          />
          <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-white font-bold">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Go!'}
          </Button>
        </div>
        <div className="flex items-start space-x-2">
          <Checkbox id="newsletter-terms" checked={agreed} onCheckedChange={setAgreed} className="mt-1 border-white/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
          <label
            htmlFor="newsletter-terms"
            className="text-xs text-gray-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the <Link to="/legal/privacy" className="underline hover:text-primary">Privacy Policy</Link> and to receive emails.
          </label>
        </div>
      </form>
    </div>
  );
};

export default NewsletterSubscriptionComponent;