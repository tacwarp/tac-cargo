'use client'

import { PageLayout } from '@/components/dashboard/page-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { SaveIcon } from 'lucide-react'

export default function SettingsPage() {
  return (
    <PageLayout
      title='Settings'
      description='Manage your account and application preferences'
    >
      <div className='grid gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Company Profile</CardTitle>
            <CardDescription>Update your company information</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='companyName'>Company Name</Label>
                <Input id='companyName' defaultValue='TAC Cargo Services' />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='gstNumber'>GST Number</Label>
                <Input id='gstNumber' defaultValue='14AABCT1332Q1ZV' />
              </div>
            </div>
            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='email'>Business Email</Label>
                <Input id='email' type='email' defaultValue='admin@taccargo.com' />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='phone'>Phone Number</Label>
                <Input id='phone' defaultValue='+91 98765 43210' />
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='address'>Address</Label>
              <Input id='address' defaultValue='Paona Bazar, Imphal, Manipur - 795001' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hub Configuration</CardTitle>
            <CardDescription>Configure your default hub settings</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='defaultHub'>Default Hub</Label>
                <Select defaultValue='imphal'>
                  <SelectTrigger>
                    <SelectValue placeholder='Select hub' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='imphal'>Imphal Hub</SelectItem>
                    <SelectItem value='guwahati'>Guwahati Hub</SelectItem>
                    <SelectItem value='delhi'>Delhi Hub</SelectItem>
                    <SelectItem value='kolkata'>Kolkata Hub</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='timezone'>Timezone</Label>
                <Select defaultValue='ist'>
                  <SelectTrigger>
                    <SelectValue placeholder='Select timezone' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='ist'>IST (UTC+5:30)</SelectItem>
                    <SelectItem value='utc'>UTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoice Settings</CardTitle>
            <CardDescription>Configure invoice generation preferences</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='invoicePrefix'>Invoice Prefix</Label>
                <Input id='invoicePrefix' defaultValue='INV' />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='currency'>Currency</Label>
                <Select defaultValue='inr'>
                  <SelectTrigger>
                    <SelectValue placeholder='Select currency' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='inr'>INR (₹)</SelectItem>
                    <SelectItem value='usd'>USD ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='paymentTerms'>Default Payment Terms</Label>
                <Select defaultValue='30'>
                  <SelectTrigger>
                    <SelectValue placeholder='Select terms' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='7'>Net 7</SelectItem>
                    <SelectItem value='15'>Net 15</SelectItem>
                    <SelectItem value='30'>Net 30</SelectItem>
                    <SelectItem value='45'>Net 45</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='taxRate'>Default Tax Rate (%)</Label>
                <Input id='taxRate' type='number' defaultValue='18' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <div className='flex justify-end'>
          <Button>
            <SaveIcon className='mr-2 size-4' />
            Save Changes
          </Button>
        </div>
      </div>
    </PageLayout>
  )
}
