import { createClient } from '@supabase/supabase-js'
import type { RealtimeChannel } from '@supabase/supabase-js'
import type { BlogPostNavigation } from '../pages/BlogPost.tsx'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'portfolio-admin'
    }
  }
})

// Real-time subscription management
const subscriptions = new Map<string, RealtimeChannel>()

export const subscribeToTable = (
  tableName: string,
  callback: (payload: any) => void,
  filter?: string
) => {
  // Unsubscribe from existing subscription if it exists
  if (subscriptions.has(tableName)) {
    subscriptions.get(tableName)?.unsubscribe()
  }

  // Create new subscription
  let channel = supabase
    .channel(`${tableName}_changes`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: tableName,
        filter: filter
      },
      callback
    )
    .subscribe()

  subscriptions.set(tableName, channel)
  return channel
}

export const unsubscribeFromTable = (tableName: string) => {
  const subscription = subscriptions.get(tableName)
  if (subscription) {
    subscription.unsubscribe()
    subscriptions.delete(tableName)
  }
}

export const unsubscribeAll = () => {
  subscriptions.forEach((subscription) => {
    subscription.unsubscribe()
  })
  subscriptions.clear()
}

// Helper functions for database operations
export const db = {
  // Projects
  async getProjects(featured?: boolean, limit?: number, offset?: number) {
    let query = supabase.from('projects').select('*').order('created_at', { ascending: false })
    if (featured !== undefined) {
      query = query.eq('featured', featured)
    }
    if (limit !== undefined) {
      query = query.limit(limit)
    }
    if (offset !== undefined) {
      query = query.range(offset, offset + (limit || 10) - 1)
    }
    return query
  },

  async createProject(project: Omit<any, 'id' | 'created_at'>) {
    return supabase.from('projects').insert([project]).select()
  },

  async updateProject(id: string, updates: any) {
    return supabase.from('projects').update(updates).eq('id', id).select()
  },

  async deleteProject(id: string) {
    return supabase.from('projects').delete().eq('id', id)
  },

  // Reviews
  async getReviews(approved?: boolean, limit?: number, offset?: number) {
    let query = supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (approved !== undefined) {
      query = query.eq('approved', approved)
    }
    
    if (limit !== undefined) {
      query = query.limit(limit)
    }
    
    if (offset !== undefined) {
      query = query.range(offset, offset + (limit || 10) - 1)
    }
    
    return query
  },

  async createReview(review: Omit<any, 'id' | 'created_at'>) {
    return supabase
      .from('reviews')
      .insert([{
        ...review,
        project_id: review.project_id || null, // Ensure null instead of empty string
        client_company: review.client_company || null, // Ensure null instead of empty string
        approved: review.approved ?? false
      }])
      .select()
  },

  async updateReview(id: string, updates: any) {
    return supabase.from('reviews').update({
      ...updates,
      project_id: updates.project_id || null, // Ensure null instead of empty string
      client_company: updates.client_company || null // Ensure null instead of empty string
    }).eq('id', id).select()
  },

  async deleteReview(id: string) {
    return supabase.from('reviews').delete().eq('id', id)
  },

  // Skills
  async getSkills() {
    return supabase.from('skills').select('*').order('category', { ascending: true })
  },

  async createSkill(skill: Omit<any, 'id' | 'created_at'>) {
    return supabase.from('skills').insert([skill]).select()
  },

  async updateSkill(id: string, updates: any) {
    return supabase.from('skills').update(updates).eq('id', id).select()
  },

  async deleteSkill(id: string) {
    return supabase.from('skills').delete().eq('id', id)
  },

  // Site Settings
  async getSiteSettings() {
    return supabase.from('site_settings').select('*').single()
  },

  async updateSiteSettings(updates: any) {
    return supabase.from('site_settings').update(updates).eq('id', '1').select()
  },

  // Products
  async getProducts() {
    return supabase.from('products').select('*').order('created_at', { ascending: false })
  },

  async createProduct(product: Omit<any, 'id' | 'created_at'>) {
    return supabase.from('products').insert([product]).select()
  },

  async updateProduct(id: string, updates: any) {
    return supabase.from('products').update(updates).eq('id', id).select()
  },

  async deleteProduct(id: string) {
    return supabase.from('products').delete().eq('id', id)
  },

  // Team Members
  async getTeamMembers(activeOnly?: boolean) {
    let query = supabase
      .from('team_members')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: true })
    
    if (activeOnly !== undefined) {
      query = query.eq('active', activeOnly)
    }
    
    return query
  },

  async createTeamMember(teamMember: Omit<any, 'id' | 'created_at'>) {
    return supabase.from('team_members').insert([teamMember]).select()
  },

  async updateTeamMember(id: string, updates: any) {
    return supabase.from('team_members').update(updates).eq('id', id).select()
  },

  async deleteTeamMember(id: string) {
    return supabase.from('team_members').delete().eq('id', id)
  },

  // Blog Posts
  async getBlogPosts(published?: boolean, limit?: number, offset?: number) {
    let query = supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false })
      .order('created_at', { ascending: false })
    
    if (published !== undefined) {
      query = query.eq('published', published)
    }
    
    if (limit !== undefined) {
      query = query.limit(limit)
    }
    
    if (offset !== undefined) {
      query = query.range(offset, offset + (limit || 10) - 1)
    }
    
    return query
  },
  
  async getAllBlogPostsForNavigation(): Promise<{ data: BlogPostNavigation[] | null; error: any }> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('title, slug') // Explicitly select only what you need
      .order('published_at', { ascending: true });

    return { data, error };
  },

  async getBlogPostBySlug(slug: string) {
    return supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()
  },

  async createBlogPost(blogPost: Omit<any, 'id' | 'created_at' | 'updated_at'>) {
    return supabase.from('blog_posts').insert([blogPost]).select()
  },

  async updateBlogPost(id: string, updates: any) {
    return supabase.from('blog_posts').update(updates).eq('id', id).select()
  },

  async deleteBlogPost(id: string) {
    return supabase.from('blog_posts').delete().eq('id', id)
  },

  // Newsletter Subscribers
  async getNewsletterSubscribers(active?: boolean) {
    let query = supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false })
    
    if (active !== undefined) {
      query = query.eq('active', active)
    }
    
    return query
  },

  async subscribeToNewsletter(email: string) {
    return supabase
      .from('newsletter_subscribers')
      .insert([{ email }])
      .select()
  },

  async unsubscribeFromNewsletter(email: string) {
    return supabase
      .from('newsletter_subscribers')
      .update({ active: false })
      .eq('email', email)
      .select()
  },

  // Blog Comments
  async getBlogComments(postId: string, limit?: number, offset?: number) {
    let query = supabase
      .from('blog_comments')
      .select('*')
      .eq('post_id', postId)
      .is('parent_id', null) // Only top-level comments
      .order('created_at', { ascending: false })
    
    if (limit !== undefined) {
      query = query.limit(limit)
    }
    
    if (offset !== undefined) {
      query = query.range(offset, offset + (limit || 10) - 1)
    }
    
    return query
  },

  async getBlogCommentReplies(parentId: string) {
    return supabase
      .from('blog_comments')
      .select('*')
      .eq('parent_id', parentId)
      .order('created_at', { ascending: true })
  },

  async createBlogComment(comment: Omit<any, 'id' | 'created_at'>) {
    return supabase.from('blog_comments').insert([comment]).select()
  },

  async updateBlogComment(id: string, updates: any) {
    return supabase.from('blog_comments').update(updates).eq('id', id).select()
  },

  async deleteBlogComment(id: string) {
    return supabase.from('blog_comments').delete().eq('id', id)
  },

  async getCommentCount(postId: string) {
    return supabase
      .from('blog_comments')
      .select('id', { count: 'exact' })
      .eq('post_id', postId)
  },

  // Comment Usernames
  async checkUsername(username: string) {
    return supabase
      .from('comment_usernames')
      .select('username')
      .eq('username', username)
      .single()
  },

  async createUsername(username: string, browserId: string) {
    return supabase
      .from('comment_usernames')
      .insert([{ username, browser_id: browserId }])
      .select()
  },

  async getUsernameByBrowser(browserId: string) {
    return supabase
      .from('comment_usernames')
      .select('username')
      .eq('browser_id', browserId)
      .maybeSingle()
  },

  // File Upload
  async uploadAvatar(file: File, fileName: string) {
    return supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })
  },

  getAvatarUrl(fileName: string) {
    return supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)
  }
}
