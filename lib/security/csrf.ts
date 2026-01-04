import crypto from 'crypto'

const CSRF_SECRET = process.env.CSRF_SECRET || 'tac-cargo-csrf-secret-key'
const TOKEN_EXPIRY = 3600000 // 1 hour

export function generateCSRFToken(): string {
  const timestamp = Date.now().toString()
  const random = crypto.randomBytes(16).toString('hex')
  const data = `${timestamp}:${random}`
  const signature = crypto
    .createHmac('sha256', CSRF_SECRET)
    .update(data)
    .digest('hex')
  
  return Buffer.from(`${data}:${signature}`).toString('base64')
}

export function validateCSRFToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString()
    const [timestamp, random, signature] = decoded.split(':')
    
    // Check expiry
    const tokenTime = parseInt(timestamp)
    if (Date.now() - tokenTime > TOKEN_EXPIRY) {
      return false
    }
    
    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', CSRF_SECRET)
      .update(`${timestamp}:${random}`)
      .digest('hex')
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  } catch {
    return false
  }
}

export function csrfMiddleware(request: Request): { valid: boolean; error?: string } {
  const method = request.method.toUpperCase()
  
  // Skip CSRF check for safe methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return { valid: true }
  }
  
  const token = request.headers.get('X-CSRF-Token')
  
  if (!token) {
    return { valid: false, error: 'Missing CSRF token' }
  }
  
  if (!validateCSRFToken(token)) {
    return { valid: false, error: 'Invalid or expired CSRF token' }
  }
  
  return { valid: true }
}
