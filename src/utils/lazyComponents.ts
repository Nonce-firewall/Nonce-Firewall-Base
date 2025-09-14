import { lazy } from 'react'

// Lazy load heavy components to reduce initial bundle size
export const LazyReactQuill = lazy(() => 
  import('react-quill').then(module => ({ default: module.default }))
)

export const LazyCodeBlock = lazy(() => import('../components/CodeBlock'))

export const LazyYouTubeEmbed = lazy(() => import('../components/YouTubeEmbed'))

// Preload critical components
export const preloadCriticalComponents = () => {
  // Preload components that are likely to be needed soon
  import('../components/ProjectCard')
  import('../components/ReviewCard')
  import('../components/TeamMemberCard')
}

// Preload admin components when user navigates to admin
export const preloadAdminComponents = () => {
  import('../admin/AdminDashboard')
  import('../admin/AdminSettings')
  import('../admin/AdminProjects')
  import('../admin/AdminReviews')
  import('../admin/AdminSkills')
  import('../admin/AdminProducts')
  import('../admin/AdminTeamMembers')
  import('../admin/AdminBlogPosts')
  import('../admin/AdminNewsletter')
  import('react-quill')
}

// Preload review components for better UX
export const preloadReviewComponents = () => {
  import('../components/ReviewCard')
  import('../components/BlogComments')
  import('../components/NewsletterSignup')
}