import { PageLayout } from '@/components/dashboard/page-layout'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { SaveIcon } from 'lucide-react'

export default function SettingsPage() {
  return (
    <PageLayout title="Settings" description="Manage your account and preferences">
      <div className="grid gap-6">
        {/* Profile Settings */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold">Profile Information</h3>
          <p className="mt-1 text-sm text-muted-foreground">Update your personal information</p>
          <Separator className="my-6" />
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input id="full-name" placeholder="John Doe" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" disabled />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" placeholder="+91 98765 43210" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="warehouse">Default Warehouse</Label>
              <Select>
                <SelectTrigger id="warehouse">
                  <SelectValue placeholder="Select warehouse" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="imf">Imphal Warehouse</SelectItem>
                  <SelectItem value="del">Delhi Hub</SelectItem>
                  <SelectItem value="mum">Mumbai Depot</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-fit">
              <SaveIcon className="mr-2 size-4" />
              Save Changes
            </Button>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold">Notifications</h3>
          <p className="mt-1 text-sm text-muted-foreground">Configure how you receive notifications</p>
          <Separator className="my-6" />
          <div className="grid gap-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Shipment Updates</Label>
                <p className="text-sm text-muted-foreground">Get notified about shipment status changes</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Exception Alerts</Label>
                <p className="text-sm text-muted-foreground">Receive alerts for shipment exceptions</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Button className="w-fit">
              <SaveIcon className="mr-2 size-4" />
              Save Preferences
            </Button>
          </div>
        </Card>

        {/* Appearance Settings */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold">Appearance</h3>
          <p className="mt-1 text-sm text-muted-foreground">Customize how the dashboard looks</p>
          <Separator className="my-6" />
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="theme">Theme</Label>
              <Select>
                <SelectTrigger id="theme">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-fit">
              <SaveIcon className="mr-2 size-4" />
              Save Appearance
            </Button>
          </div>
        </Card>
      </div>
    </PageLayout>
  )
}

