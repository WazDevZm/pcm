"use client"

import { useState } from 'react'
import { Save, Database, Globe, Mail, Bell, Shield, Key, Settings as SettingsIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ScrollToBottom } from '@/components/ui/scroll-to-bottom'
import { toast } from 'sonner'

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    siteName: 'CBU SDA PCM',
    siteDescription: 'Campus Public Campus Ministries',
    contactEmail: 'info@cbusda.org',
    contactPhone: '(555) 123-4567',
    socialFacebook: '',
    socialTwitter: '',
    socialInstagram: '',
    notificationEmail: 'admin@cbusda.org',
    maintenanceMode: false,
    allowRegistrations: true
  })

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // In a real implementation, this would save to a settings table in Supabase
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Settings saved successfully')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-8">
      <ScrollToBottom targetId="settings-content" label="Scroll down" />
      
      <div id="settings-content" className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Site Settings</h1>
        <p className="text-white/70 text-sm md:text-base">Configure site-wide settings and preferences.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* General Settings */}
        <div className="bg-white/5 ring-1 ring-white/10 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Globe className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-lg font-semibold">General Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Site Name</label>
              <Input
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="bg-black/40 border-white/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Site Description</label>
              <Textarea
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                className="bg-black/40 border-white/20"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Contact Settings */}
        <div className="bg-white/5 ring-1 ring-white/10 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-green-500/20">
              <Mail className="w-5 h-5 text-green-400" />
            </div>
            <h2 className="text-lg font-semibold">Contact Information</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Contact Email</label>
              <Input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="bg-black/40 border-white/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Contact Phone</label>
              <Input
                type="tel"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="bg-black/40 border-white/20"
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white/5 ring-1 ring-white/10 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Bell className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="text-lg font-semibold">Social Media</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Facebook URL</label>
              <Input
                placeholder="https://facebook.com/your-page"
                value={settings.socialFacebook}
                onChange={(e) => setSettings({ ...settings, socialFacebook: e.target.value })}
                className="bg-black/40 border-white/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Twitter URL</label>
              <Input
                placeholder="https://twitter.com/your-handle"
                value={settings.socialTwitter}
                onChange={(e) => setSettings({ ...settings, socialTwitter: e.target.value })}
                className="bg-black/40 border-white/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Instagram URL</label>
              <Input
                placeholder="https://instagram.com/your-handle"
                value={settings.socialInstagram}
                onChange={(e) => setSettings({ ...settings, socialInstagram: e.target.value })}
                className="bg-black/40 border-white/20"
              />
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white/5 ring-1 ring-white/10 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-yellow-500/20">
              <SettingsIcon className="w-5 h-5 text-yellow-400" />
            </div>
            <h2 className="text-lg font-semibold">System Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">Notification Email</label>
              <Input
                type="email"
                value={settings.notificationEmail}
                onChange={(e) => setSettings({ ...settings, notificationEmail: e.target.value })}
                className="bg-black/40 border-white/20"
              />
              <p className="text-white/50 text-xs mt-1">Email address for system notifications</p>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
              <div>
                <div className="font-medium">Maintenance Mode</div>
                <div className="text-white/50 text-sm">Temporarily disable the site for maintenance</div>
              </div>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.maintenanceMode ? 'bg-red-500' : 'bg-white/20'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
              <div>
                <div className="font-medium">Allow New Registrations</div>
                <div className="text-white/50 text-sm">Enable/disable user registration</div>
              </div>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, allowRegistrations: !settings.allowRegistrations })}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.allowRegistrations ? 'bg-green-500' : 'bg-white/20'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.allowRegistrations ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Environment Variables Info */}
        <div className="bg-blue-500/10 ring-1 ring-blue-500/20 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Key className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="font-semibold">Environment Variables</h3>
          </div>
          <p className="text-white/70 text-sm mb-4">
            Critical configuration is managed via environment variables in <code className="bg-black/30 px-2 py-1 rounded">.env.local</code>:
          </p>
          <ul className="text-white/60 text-sm space-y-1">
            <li>• <code className="bg-black/30 px-2 py-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> - Supabase project URL</li>
            <li>• <code className="bg-black/30 px-2 py-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> - Supabase anonymous key</li>
            <li>• <code className="bg-black/30 px-2 py-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code> - Service role key (server-side)</li>
            <li>• <code className="bg-black/30 px-2 py-1 rounded">FRONTEND_ONLY</code> - Set to 'true' for frontend-only mode</li>
          </ul>
          <p className="text-white/50 text-xs mt-4">
            See <code className="bg-black/30 px-2 py-1 rounded">.env.example</code> for all required variables.
          </p>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  )
}
