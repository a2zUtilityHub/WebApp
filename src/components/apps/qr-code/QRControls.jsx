import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Link, Text, Wifi, Mail, MessageSquare, User, CreditCard, Instagram, Youtube, MessageCircle } from 'lucide-react';

const QRControls = ({ qrType, setQrType, qrData, setQrData }) => {

  const handleInputChange = (field, value) => {
    setQrData(prev => ({ ...prev, [field]: value }));
  };

  const renderContent = () => {
    switch (qrType) {
      case 'wifi':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wifi-ssid">Network Name (SSID)</Label>
              <Input id="wifi-ssid" value={qrData.ssid || ''} onChange={e => handleInputChange('ssid', e.target.value)} placeholder="MyWiFiNetwork" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wifi-password">Password</Label>
              <Input id="wifi-password" type="password" value={qrData.password || ''} onChange={e => handleInputChange('password', e.target.value)} placeholder="Your network password" />
            </div>
             <p className="text-xs text-muted-foreground">Encryption is set to WPA/WPA2. Hidden networks are not supported.</p>
          </div>
        );
      case 'vcard':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vcard-fn">Full Name</Label>
              <Input id="vcard-fn" value={qrData.fullName || ''} onChange={e => handleInputChange('fullName', e.target.value)} placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vcard-org">Organization</Label>
              <Input id="vcard-org" value={qrData.organization || ''} onChange={e => handleInputChange('organization', e.target.value)} placeholder="ACME Inc." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vcard-title">Title</Label>
              <Input id="vcard-title" value={qrData.title || ''} onChange={e => handleInputChange('title', e.target.value)} placeholder="Software Engineer" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vcard-tel">Phone</Label>
              <Input id="vcard-tel" type="tel" value={qrData.phone || ''} onChange={e => handleInputChange('phone', e.target.value)} placeholder="+1234567890" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="vcard-email">Email</Label>
              <Input id="vcard-email" type="email" value={qrData.email || ''} onChange={e => handleInputChange('email', e.target.value)} placeholder="john.doe@example.com" />
            </div>
             <div className="space-y-2 md:col-span-2">
              <Label htmlFor="vcard-url">Website</Label>
              <Input id="vcard-url" type="url" value={qrData.website || ''} onChange={e => handleInputChange('website', e.target.value)} placeholder="https://example.com" />
            </div>
          </div>
        );
      case 'email':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-to">Recipient Email</Label>
              <Input id="email-to" type="email" value={qrData.email || ''} onChange={e => handleInputChange('email', e.target.value)} placeholder="recipient@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-subject">Subject</Label>
              <Input id="email-subject" value={qrData.subject || ''} onChange={e => handleInputChange('subject', e.target.value)} placeholder="Email Subject" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-body">Message</Label>
              <Textarea id="email-body" value={qrData.body || ''} onChange={e => handleInputChange('body', e.target.value)} placeholder="Your pre-filled message..." />
            </div>
          </div>
        );
      case 'sms':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sms-number">Phone Number</Label>
              <Input id="sms-number" type="tel" value={qrData.phone || ''} onChange={e => handleInputChange('phone', e.target.value)} placeholder="+1234567890" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sms-body">Message</Label>
              <Textarea id="sms-body" value={qrData.body || ''} onChange={e => handleInputChange('body', e.target.value)} placeholder="Your pre-filled SMS message..." />
            </div>
          </div>
        );
      case 'social':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Social Media Platform</Label>
              <Tabs value={qrData.platform || 'instagram'} onValueChange={val => handleInputChange('platform', val)} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="instagram"><Instagram className="h-4 w-4 mr-2" />Instagram</TabsTrigger>
                  <TabsTrigger value="youtube"><Youtube className="h-4 w-4 mr-2" />YouTube</TabsTrigger>
                  <TabsTrigger value="whatsapp"><MessageCircle className="h-4 w-4 mr-2" />WhatsApp</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="space-y-2">
              <Label htmlFor="social-handle">Username or URL</Label>
              <Input id="social-handle" value={qrData.handle || ''} onChange={e => handleInputChange('handle', e.target.value)} placeholder="e.g., hostinger" />
            </div>
          </div>
        );
      case 'payment':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Payment Platform</Label>
              <Tabs value={qrData.platform || 'upi'} onValueChange={val => handleInputChange('platform', val)} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="upi">UPI</TabsTrigger>
                  <TabsTrigger value="paypal">PayPal</TabsTrigger>
                  <TabsTrigger value="stripe">Stripe</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment-id">Payment ID or Link</Label>
              <Input id="payment-id" value={qrData.paymentId || ''} onChange={e => handleInputChange('paymentId', e.target.value)} placeholder="e.g., yourname@bank or paypal.me/yourname" />
            </div>
          </div>
        );
      case 'text':
        return (
          <div className="space-y-2">
            <Label htmlFor="qr-text">Your Text</Label>
            <Textarea id="qr-text" value={qrData.text || ''} onChange={e => handleInputChange('text', e.target.value)} placeholder="Enter any text you want to encode..." rows={5} />
          </div>
        );
      default: // url
        return (
          <div className="space-y-2">
            <Label htmlFor="qr-url">Website URL</Label>
            <Input id="qr-url" type="url" value={qrData.url || ''} onChange={e => handleInputChange('url', e.target.value)} placeholder="https://hostinger.com" />
          </div>
        );
    }
  };

  return (
    <Tabs value={qrType} onValueChange={setQrType} className="w-full">
      <TabsList className="grid w-full grid-cols-3 md:grid-cols-7">
        <TabsTrigger value="url"><Link className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline">URL</span></TabsTrigger>
        <TabsTrigger value="text"><Text className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline">Text</span></TabsTrigger>
        <TabsTrigger value="wifi"><Wifi className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline">WiFi</span></TabsTrigger>
        <TabsTrigger value="vcard"><User className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline">vCard</span></TabsTrigger>
        <TabsTrigger value="email"><Mail className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline">Email</span></TabsTrigger>
        <TabsTrigger value="sms"><MessageSquare className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline">SMS</span></TabsTrigger>
        <TabsTrigger value="social"><Instagram className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline">Social</span></TabsTrigger>
      </TabsList>
      <div className="pt-6">
        {renderContent()}
      </div>
    </Tabs>
  );
};

export default QRControls;