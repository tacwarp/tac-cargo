'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

interface ApiKey {
  id: string
  name: string
  key_prefix: string
  scopes: string[]
  expires_at?: string
  last_used_at?: string
  is_active: boolean
  created_at: string
}

interface CreateApiKeyData {
  name: string
  scopes?: string[]
  expiresInDays?: number
}

interface CreateApiKeyResponse {
  id: string
  key: string
  message: string
}

export function useApiKeys() {
  return useQuery({
    queryKey: ['api-keys'],
    queryFn: async () => {
      const response = await fetch('/api/api-keys')
      if (!response.ok) {
        throw new Error('Failed to fetch API keys')
      }
      const data = await response.json()
      return data.apiKeys as ApiKey[]
    },
  })
}

export function useCreateApiKey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateApiKeyData): Promise<CreateApiKeyResponse> => {
      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create API key')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] })
    },
  })
}

export function useDeleteApiKey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/api-keys?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete API key')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] })
    },
  })
}
