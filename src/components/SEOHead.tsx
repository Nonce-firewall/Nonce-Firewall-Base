import React from 'react'
import { Helmet } from 'react-helmet-async'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  tags?: string[]
  author?: string
  siteName?: string
  twitterHandle?: string
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'Nonce Firewall - Expert Full-Stack Developer | React, Next.js & Node.js',
  description = 'Professional full-stack developer specializing in React, Next.js, Node.js, and modern web technologies. Custom web applications, e-commerce solutions, and scalable development services.',
  keywords = 'full-stack developer, react developer, web development, javascript, typescript, node.js, Next.js, frontend developer, backend developer',
  image = '/android-chrome-512x512.png',
  url = '/',
  type = 'website',
  publishedTime,
  modifiedTime,
  tags = [],
  author = 'Nonce Firewall',
  siteName = 'Nonce Firewall Portfolio',
  twitterHandle = '@noncefirewall'
}) => {
  const baseUrl = 'https://noncefirewall.dev'
  const fullUrl = `${baseUrl}${url}`
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />

      {/* Article-specific tags */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {type === 'article' && tags.length > 0 && (
        <>
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      
      {/* Language and Region */}
      <meta httpEquiv="content-language" content="en-US" />
      <meta name="geo.region" content="US" />
      <meta name="geo.placename" content="United States" />
      
      {/* Mobile Optimization */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* Performance Hints */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//images.pexels.com" />
      
      {/* Structured Data for Organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Nonce Firewall",
          "jobTitle": "Full-Stack Developer",
          "description": description,
          "url": baseUrl,
          "image": fullImageUrl,
          "sameAs": [
            "https://github.com/noncefirewall",
            "https://linkedin.com/in/noncefirewall",
            "https://twitter.com/noncefirewall"
          ],
          "knowsAbout": [
            "React",
            "Next.js",
            "Node.js",
            "TypeScript",
            "JavaScript",
            "Full-Stack Development",
            "Web Development",
            "Frontend Development",
            "Backend Development"
          ],
          "hasOccupation": {
            "@type": "Occupation",
            "name": "Full-Stack Developer",
            "occupationLocation": {
              "@type": "Place",
              "name": "Remote"
            },
            "skills": "React, Next.js, Node.js, TypeScript, JavaScript, MongoDB, PostgreSQL, Supabase"
          }
        })}
      </script>
    </Helmet>
  )
}

export default SEOHead