import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const sizes = [16, 32, 48, 64, 128, 256]

async function generateFavicon() {
  // Light mode version
  const lightSvgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="256" height="256">
      <!-- Base grid -->
      <rect width="20" height="20" x="2" y="2" rx="1" fill="white" />
      
      <!-- Highlighted cells -->
      <rect x="2" y="12" width="5" height="5" fill="rgb(24, 24, 27)" />
      <rect x="7" y="12" width="5" height="5" fill="rgb(24, 24, 27)" />
      <rect x="12" y="12" width="5" height="5" fill="rgb(24, 24, 27)" />
      <rect x="17" y="12" width="5" height="5" fill="rgb(24, 24, 27)" />
      <rect x="12" y="7" width="5" height="5" fill="rgb(24, 24, 27)" />
      <rect x="12" y="17" width="5" height="5" fill="rgb(24, 24, 27)" />
      
      <!-- Grid lines -->
      <path d="M2 7h20" stroke="rgb(226, 232, 240)" stroke-width="0.5" />
      <path d="M2 12h20" stroke="rgb(226, 232, 240)" stroke-width="0.5" />
      <path d="M2 17h20" stroke="rgb(226, 232, 240)" stroke-width="0.5" />
      <path d="M7 2v20" stroke="rgb(226, 232, 240)" stroke-width="0.5" />
      <path d="M12 2v20" stroke="rgb(226, 232, 240)" stroke-width="0.5" />
      <path d="M17 2v20" stroke="rgb(226, 232, 240)" stroke-width="0.5" />
      
      <!-- Border -->
      <rect width="20" height="20" x="2" y="2" rx="1" stroke="rgb(226, 232, 240)" stroke-width="0.5" fill="none" />
    </svg>
  `

  // Dark mode version
  const darkSvgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="256" height="256">
      <!-- Base grid -->
      <rect width="20" height="20" x="2" y="2" rx="1" fill="rgb(24, 24, 27)" />
      
      <!-- Highlighted cells -->
      <rect x="2" y="12" width="5" height="5" fill="white" />
      <rect x="7" y="12" width="5" height="5" fill="white" />
      <rect x="12" y="12" width="5" height="5" fill="white" />
      <rect x="17" y="12" width="5" height="5" fill="white" />
      <rect x="12" y="7" width="5" height="5" fill="white" />
      <rect x="12" y="17" width="5" height="5" fill="white" />
      
      <!-- Grid lines -->
      <path d="M2 7h20" stroke="rgb(63, 63, 70)" stroke-width="0.5" />
      <path d="M2 12h20" stroke="rgb(63, 63, 70)" stroke-width="0.5" />
      <path d="M2 17h20" stroke="rgb(63, 63, 70)" stroke-width="0.5" />
      <path d="M7 2v20" stroke="rgb(63, 63, 70)" stroke-width="0.5" />
      <path d="M12 2v20" stroke="rgb(63, 63, 70)" stroke-width="0.5" />
      <path d="M17 2v20" stroke="rgb(63, 63, 70)" stroke-width="0.5" />
      
      <!-- Border -->
      <rect width="20" height="20" x="2" y="2" rx="1" stroke="rgb(63, 63, 70)" stroke-width="0.5" fill="none" />
    </svg>
  `

  const publicDir = path.join(process.cwd(), 'public')
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir)
  }

  // Generate light mode favicons
  for (const size of sizes) {
    await sharp(Buffer.from(lightSvgContent))
      .resize(size, size)
      .png()
      .toFile(path.join(publicDir, `favicon-light-${size}x${size}.png`))
  }

  // Generate dark mode favicons
  for (const size of sizes) {
    await sharp(Buffer.from(darkSvgContent))
      .resize(size, size)
      .png()
      .toFile(path.join(publicDir, `favicon-dark-${size}x${size}.png`))
  }

  // Generate default favicon.ico using light mode
  await sharp(Buffer.from(lightSvgContent))
    .resize(32, 32)
    .toFile(path.join(publicDir, 'favicon.ico'))
}

generateFavicon() 