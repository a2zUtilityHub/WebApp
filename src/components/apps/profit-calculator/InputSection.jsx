import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Percent, Package, Truck, Megaphone, Banknote } from 'lucide-react';

const InputField = ({ id, label, value, onChange, placeholder, type = 'number', icon: Icon, children }) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="flex items-center">
      {Icon && <Icon className="h-4 w-4 mr-2 text-muted-foreground" />}
      {label}
    </Label>
    <div className="relative">
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="pl-8"
      />
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
        $
      </div>
      {children}
    </div>
  </div>
);

const InputSection = ({ inputs, setInputs }) => {
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleSwitchChange = (checked) => {
    setInputs((prev) => ({ ...prev, taxEnabled: checked }));
  };

  const handleSelectChange = (value) => {
    setInputs((prev) => ({ ...prev, platformFeeType: value }));
  };

  return (
    <div className="space-y-6">
      <Card className="bg-muted/20">
        <CardHeader>
          <CardTitle className="text-xl">Costs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <InputField
            id="productCost"
            label="Product Cost"
            value={inputs.productCost}
            onChange={handleInputChange}
            placeholder="e.g., 15.50"
            icon={Package}
          />
          <InputField
            id="shippingCost"
            label="Shipping Cost"
            value={inputs.shippingCost}
            onChange={handleInputChange}
            placeholder="e.g., 5.00"
            icon={Truck}
          />
          <InputField
            id="packagingCost"
            label="Packaging Cost"
            value={inputs.packagingCost}
            onChange={handleInputChange}
            placeholder="e.g., 1.25"
            icon={Package}
          />
        </CardContent>
      </Card>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Additional Expenses</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <InputField
              id="marketingCost"
              label="Marketing / Ads"
              value={inputs.marketingCost}
              onChange={handleInputChange}
              placeholder="e.g., 2.00"
              icon={Megaphone}
            />
            <InputField
              id="platformFee"
              label="Platform Fees"
              value={inputs.platformFee}
              onChange={handleInputChange}
              placeholder={inputs.platformFeeType === 'percentage' ? 'e.g., 10' : 'e.g., 2.99'}
              icon={Banknote}
            >
              <div className="absolute inset-y-0 right-0 flex items-center">
                <Select value={inputs.platformFeeType} onValueChange={handleSelectChange}>
                  <SelectTrigger className="w-[80px] rounded-l-none border-l-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">%</SelectItem>
                    <SelectItem value="fixed">$</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </InputField>
            <InputField
              id="additionalCost"
              label="Other Costs"
              value={inputs.additionalCost}
              onChange={handleInputChange}
              placeholder="e.g., 0.75"
              icon={DollarSign}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Card className="bg-muted/20">
        <CardHeader>
          <CardTitle className="text-xl">Pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <InputField
            id="sellingPrice"
            label="Selling Price"
            value={inputs.sellingPrice}
            onChange={handleInputChange}
            placeholder="e.g., 49.99"
            icon={DollarSign}
          />
          <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <Label>Include Tax (GST/VAT)</Label>
              <p className="text-xs text-muted-foreground">
                Enable if your selling price includes tax.
              </p>
            </div>
            <Switch
              checked={inputs.taxEnabled}
              onCheckedChange={handleSwitchChange}
            />
          </div>
          {inputs.taxEnabled && (
            <InputField
              id="taxRate"
              label="Tax Rate"
              value={inputs.taxRate}
              onChange={handleInputChange}
              placeholder="e.g., 20"
              icon={Percent}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InputSection;