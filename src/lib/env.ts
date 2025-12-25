/**
 * Environment Variables Validation
 * 
 * Bu dosya, tüm environment variable'ların varlığını ve tipini kontrol eder.
 * Eksik veya hatalı değişkenlerde uygulama başlamadan hata verir.
 */

// Basit validation (Zod eklenene kadar)
function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

function getEnvOptional(key: string, defaultValue?: string): string | undefined {
  return process.env[key] || defaultValue
}

function getEnvBoolean(key: string, defaultValue = false): boolean {
  const value = process.env[key]
  if (!value) return defaultValue
  return value === 'true'
}

function getEnvNumber(key: string, defaultValue?: number): number {
  const value = process.env[key]
  if (!value && defaultValue === undefined) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value ? parseInt(value, 10) : (defaultValue ?? 0)
}

// Environment Variables
export const env = {
  // Environment
  NODE_ENV: getEnv('NODE_ENV', 'development') as 'development' | 'production' | 'test',
  NEXT_PUBLIC_APP_URL: getEnv('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),

  // Database
  DATABASE_URL: getEnv('DATABASE_URL'),

  // Authentication
  JWT_SECRET: getEnv('JWT_SECRET'),
  JWT_REFRESH_SECRET: getEnv('JWT_REFRESH_SECRET'),
  JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN', '15m'),
  JWT_REFRESH_EXPIRES_IN: getEnv('JWT_REFRESH_EXPIRES_IN', '7d'),

  // Email
  SMTP_HOST: getEnv('SMTP_HOST'),
  SMTP_PORT: getEnvNumber('SMTP_PORT', 587),
  SMTP_SECURE: getEnvBoolean('SMTP_SECURE', false),
  EMAIL: getEnv('EMAIL'),
  EMAIL_PASSWORD: getEnv('EMAIL_PASSWORD'),

  // Security
  RECAPTCHA_SITE_KEY: getEnv('RECAPTCHA_SITE_KEY'),
  RECAPTCHA_SECRET_KEY: getEnv('RECAPTCHA_SECRET_KEY'),

  // Docker (Development Only)
  POSTGRES_USER: getEnvOptional('POSTGRES_USER', 'parisyolcusu'),
  POSTGRES_PASSWORD: getEnvOptional('POSTGRES_PASSWORD'),
  POSTGRES_DB: getEnvOptional('POSTGRES_DB', 'parisyolcusu_dev'),
  POSTGRES_PORT: getEnvNumber('POSTGRES_PORT', 5432),
  PGADMIN_EMAIL: getEnvOptional('PGADMIN_EMAIL'),
  PGADMIN_PASSWORD: getEnvOptional('PGADMIN_PASSWORD'),
  PGADMIN_PORT: getEnvNumber('PGADMIN_PORT', 5050),

  // Cloudinary (Optional)
  CLOUDINARY_CLOUD_NAME: getEnvOptional('CLOUDINARY_CLOUD_NAME'),
  CLOUDINARY_API_KEY: getEnvOptional('CLOUDINARY_API_KEY'),
  CLOUDINARY_API_SECRET: getEnvOptional('CLOUDINARY_API_SECRET'),

  // Analytics (Future)
  ENABLE_TRAFFIC_LOGGING: getEnvBoolean('ENABLE_TRAFFIC_LOGGING', true),
  TRAFFIC_LOG_RETENTION_DAYS: getEnvNumber('TRAFFIC_LOG_RETENTION_DAYS', 90),

  // Cron Jobs (Optional - Vercel Cron Jobs için)
  CRON_SECRET: getEnvOptional('CRON_SECRET'),

  // Supabase (Image Storage)
  SUPABASE_URL: getEnvOptional('SUPABASE_URL'),
  SUPABASE_SERVICE_ROLE_KEY: getEnvOptional('SUPABASE_SERVICE_ROLE_KEY'),
} as const

// Validation on module load (sadece runtime'da, build sırasında değil)
// Build sırasında environment variable'lar henüz set edilmemiş olabilir
if (env.NODE_ENV === 'production' && typeof window === 'undefined') {
  // Sadece server-side'da kontrol et (build sırasında değil)
  try {
    const requiredInProduction = [
      'DATABASE_URL',
      'JWT_SECRET',
      'JWT_REFRESH_SECRET',
      'SMTP_HOST',
      'EMAIL',
      'EMAIL_PASSWORD',
      'RECAPTCHA_SECRET_KEY',
    ]

    for (const key of requiredInProduction) {
      if (!process.env[key]) {
        console.warn(`⚠️  Missing required environment variable in production: ${key}`)
        // Build sırasında hata verme, sadece uyarı ver
        // Runtime'da zaten getEnv() hata verecek
      }
    }
  } catch (error) {
    // Build sırasında hata verme
    console.warn('Environment variable validation skipped during build')
  }
}


