import { describe, it, expect } from 'vitest'
import { shipmentSchema, manifestSchema, invoiceSchema, customerSchema } from '@/lib/schemas/shipment'

describe('Shipment Schema Validation', () => {
  describe('shipmentSchema', () => {
    it('validates correct shipment data', () => {
      const validData = {
        customer_id: '123e4567-e89b-12d3-a456-426614174000',
        reference: 'SHP-2026-001',
        origin_warehouse_id: '123e4567-e89b-12d3-a456-426614174000',
        destination_warehouse_id: '123e4567-e89b-12d3-a456-426614174001',
        transport_mode: 'air' as const,
        service_level_id: '123e4567-e89b-12d3-a456-426614174000',
        weight_kg: 100,
        pieces: 5,
        consignee_name: 'John Doe',
        consignee_phone: '+919876543210',
        consignee_email: 'john@example.com',
        consignee_address: '123 Main Street',
        consignee_city: 'Mumbai',
        consignee_state: 'Maharashtra',
        consignee_pincode: '400001',
      }

      const result = shipmentSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('rejects invalid reference format', () => {
      const invalidData = {
        customer_id: '123e4567-e89b-12d3-a456-426614174000',
        reference: 'INVALID',
        origin_warehouse_id: '123e4567-e89b-12d3-a456-426614174000',
        destination_warehouse_id: '123e4567-e89b-12d3-a456-426614174001',
        transport_mode: 'air' as const,
        service_level_id: '123e4567-e89b-12d3-a456-426614174000',
        weight_kg: 100,
        pieces: 5,
        consignee_name: 'John Doe',
        consignee_phone: '+919876543210',
        consignee_address: '123 Main Street',
        consignee_city: 'Mumbai',
        consignee_state: 'Maharashtra',
        consignee_pincode: '400001',
      }

      const result = shipmentSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('rejects weight exceeding 30 tons', () => {
      const invalidData = {
        customer_id: '123e4567-e89b-12d3-a456-426614174000',
        reference: 'SHP-2026-001',
        origin_warehouse_id: '123e4567-e89b-12d3-a456-426614174000',
        destination_warehouse_id: '123e4567-e89b-12d3-a456-426614174001',
        transport_mode: 'air' as const,
        service_level_id: '123e4567-e89b-12d3-a456-426614174000',
        weight_kg: 35000,
        pieces: 5,
        consignee_name: 'John Doe',
        consignee_phone: '+919876543210',
        consignee_address: '123 Main Street',
        consignee_city: 'Mumbai',
        consignee_state: 'Maharashtra',
        consignee_pincode: '400001',
      }

      const result = shipmentSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('validates Indian phone number format', () => {
      const validPhones = ['+919876543210', '+911234567890']
      const invalidPhones = ['123', '9876543210', 'invalid']

      validPhones.forEach(phone => {
        const data = {
          customer_id: '123e4567-e89b-12d3-a456-426614174000',
          reference: 'SHP-2026-001',
          origin_warehouse_id: '123e4567-e89b-12d3-a456-426614174000',
          destination_warehouse_id: '123e4567-e89b-12d3-a456-426614174001',
          transport_mode: 'air' as const,
          service_level_id: '123e4567-e89b-12d3-a456-426614174000',
          weight_kg: 100,
          pieces: 5,
          consignee_name: 'John Doe',
          consignee_phone: phone,
          consignee_address: '123 Main Street',
          consignee_city: 'Mumbai',
          consignee_state: 'Maharashtra',
          consignee_pincode: '400001',
        }
        expect(shipmentSchema.safeParse(data).success).toBe(true)
      })

      invalidPhones.forEach(phone => {
        const data = {
          customer_id: '123e4567-e89b-12d3-a456-426614174000',
          reference: 'SHP-2026-001',
          origin_warehouse_id: '123e4567-e89b-12d3-a456-426614174000',
          destination_warehouse_id: '123e4567-e89b-12d3-a456-426614174001',
          transport_mode: 'air' as const,
          service_level_id: '123e4567-e89b-12d3-a456-426614174000',
          weight_kg: 100,
          pieces: 5,
          consignee_name: 'John Doe',
          consignee_phone: phone,
          consignee_address: '123 Main Street',
          consignee_city: 'Mumbai',
          consignee_state: 'Maharashtra',
          consignee_pincode: '400001',
        }
        expect(shipmentSchema.safeParse(data).success).toBe(false)
      })
    })
  })

  describe('customerSchema', () => {
    it('validates GST number format', () => {
      const validGST = '27AAPFU0939F1ZV'
      const invalidGST = 'INVALID'

      const validData = {
        name: 'Test Company',
        gst_number: validGST,
        contact_person: 'John Doe',
        contact_email: 'john@test.com',
        contact_phone: '+919876543210',
        billing_address: '123 Main St',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
      }

      expect(customerSchema.safeParse(validData).success).toBe(true)

      const invalidData = { ...validData, gst_number: invalidGST }
      expect(customerSchema.safeParse(invalidData).success).toBe(false)
    })

    it('validates pincode format', () => {
      const validPincodes = ['400001', '110001', '560001']
      const invalidPincodes = ['1234', '12345678', 'ABCDEF']

      validPincodes.forEach(pincode => {
        const data = {
          name: 'Test Company',
          contact_person: 'John Doe',
          contact_email: 'john@test.com',
          contact_phone: '+919876543210',
          billing_address: '123 Main St',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode,
        }
        expect(customerSchema.safeParse(data).success).toBe(true)
      })

      invalidPincodes.forEach(pincode => {
        const data = {
          name: 'Test Company',
          contact_person: 'John Doe',
          contact_email: 'john@test.com',
          contact_phone: '+919876543210',
          billing_address: '123 Main St',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode,
        }
        expect(customerSchema.safeParse(data).success).toBe(false)
      })
    })
  })
})
