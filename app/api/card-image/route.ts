import { NextRequest, NextResponse } from 'next/server'
import { getLogoUrl, getProviderInfo } from '@/lib/cardProviders'

export async function GET(request: NextRequest) {
  const provider = request.nextUrl.searchParams.get('provider')

  if (!provider) {
    return NextResponse.json({ error: 'Missing provider' }, { status: 400 })
  }

  const info = getProviderInfo(provider)
  const logoUrl = getLogoUrl(provider)

  if (!logoUrl) {
    return NextResponse.json({ logoUrl: null, gradient: info.gradient, network: info.network })
  }

  // Verify the logo URL is reachable
  try {
    const res = await fetch(logoUrl, { method: 'HEAD', signal: AbortSignal.timeout(3000) })
    if (res.ok) {
      return NextResponse.json({ logoUrl, gradient: info.gradient, network: info.network })
    }
  } catch {
    // Logo not available
  }

  return NextResponse.json({ logoUrl: null, gradient: info.gradient, network: info.network })
}
