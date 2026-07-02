'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PublishConfigSchema } from '@/lib/validators';

interface PublishConfig {
  id: string;
  fullWebsiteUrl?: string; customDomain?: string; subdomain?: string; urlSlug?: string;
  projectName?: string; appName?: string; androidPackageName?: string; iosBundleIdentifier?: string;
  websiteTitle?: string; seoTitle?: string; metaDescription?: string; keywords?: string;
  logoUrl?: string; splashScreenUrl?: string; iconUrl?: string; themeColor?: string;
  privacyPolicyUrl?: string; termsConditionsUrl?: string;
}

export default function PublishCenter({ projectId, initialConfig }: { projectId: string, initialConfig: PublishConfig | null }) {
  const [config, setConfig] = useState<PublishConfig | Partial<PublishConfig>>(initialConfig || {});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setIsSaving(true); setErrors({});
    const result = PublishConfigSchema.safeParse(config);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => { if (issue.path[0]) fieldErrors[issue.path[0] as string] = issue.message; });
      setErrors(fieldErrors); setIsSaving(false); return;
    }
    try {
      await fetch(`/api/project/${projectId}/publish`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(result.data)
      });
      alert('Publish settings saved successfully!');
    } catch { alert('Error saving settings.'); } 
    finally { setIsSaving(false); }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Publish Center</h2>
        <p className="text-gray-500 dark:text-gray-400">Configure your deployment settings. These remain editable until you confirm publishing.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2 dark:border-gray-700">General</h3>
          <Input label="Full Website URL" name="fullWebsiteUrl" value={config.fullWebsiteUrl || ''} onChange={handleChange} error={errors.fullWebsiteUrl} />
          <Input label="Custom Domain" name="customDomain" value={config.customDomain || ''} onChange={handleChange} error={errors.customDomain} />
          <Input label="Subdomain" name="subdomain" value={config.subdomain || ''} onChange={handleChange} error={errors.subdomain} />
          <Input label="URL Slug" name="urlSlug" value={config.urlSlug || ''} onChange={handleChange} error={errors.urlSlug} />
          <Input label="Project Name" name="projectName" value={config.projectName || ''} onChange={handleChange} error={errors.projectName} />
          <Input label="App Name" name="appName" value={config.appName || ''} onChange={handleChange} error={errors.appName} />
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2 dark:border-gray-700">Mobile Identifiers</h3>
          <Input label="Android Package Name" name="androidPackageName" placeholder="com.example.app" value={config.androidPackageName || ''} onChange={handleChange} error={errors.androidPackageName} />
          <Input label="iOS Bundle Identifier" name="iosBundleIdentifier" placeholder="com.example.app" value={config.iosBundleIdentifier || ''} onChange={handleChange} error={errors.iosBundleIdentifier} />
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2 dark:border-gray-700">SEO & Metadata</h3>
          <Input label="Website Title" name="websiteTitle" value={config.websiteTitle || ''} onChange={handleChange} error={errors.websiteTitle} />
          <Input label="SEO Title" name="seoTitle" value={config.seoTitle || ''} onChange={handleChange} error={errors.seoTitle} />
          <Input label="Meta Description" name="metaDescription" value={config.metaDescription || ''} onChange={handleChange} error={errors.metaDescription} />
          <Input label="Keywords" name="keywords" value={config.keywords || ''} onChange={handleChange} error={errors.keywords} />
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2 dark:border-gray-700">Assets & Branding</h3>
          <Input label="Logo URL" name="logoUrl" value={config.logoUrl || ''} onChange={handleChange} error={errors.logoUrl} />
          <Input label="Theme Color" name="themeColor" type="color" value={config.themeColor || '#000000'} onChange={handleChange} error={errors.themeColor} />
        </div>
        <div className="space-y-4 md:col-span-2">
          <h3 className="text-lg font-semibold border-b pb-2 dark:border-gray-700">Legal</h3>
          <Input label="Privacy Policy URL" name="privacyPolicyUrl" value={config.privacyPolicyUrl || ''} onChange={handleChange} error={errors.privacyPolicyUrl} />
          <Input label="Terms & Conditions URL" name="termsConditionsUrl" value={config.termsConditionsUrl || ''} onChange={handleChange} error={errors.termsConditionsUrl} />
        </div>
      </div>
      <div className="flex justify-end gap-4 pt-4 border-t dark:border-gray-700">
        <Button variant="ghost">Cancel</Button>
        <Button onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Configuration'}</Button>
      </div>
    </div>
  );
        }
