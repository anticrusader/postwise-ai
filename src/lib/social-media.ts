import { supabase } from './supabase';

type SocialPlatform = 'twitter' | 'linkedin' | 'instagram';

interface SocialMediaPost {
  content: string;
  platform: SocialPlatform;
  mediaUrls?: string[];
}

export const publishToSocialMedia = async (post: SocialMediaPost) => {
  try {
    // Get platform-specific API keys
    const { data: secrets } = await supabase
      .from('secrets')
      .select('secret')
      .in('name', [`${post.platform.toUpperCase()}_API_KEY`]);

    const apiKey = secrets?.[0]?.secret;
    if (!apiKey) {
      throw new Error(`API key not found for ${post.platform}`);
    }

    // Platform-specific publishing logic
    switch (post.platform) {
      case 'twitter':
        return await publishToTwitter(post, apiKey);
      case 'linkedin':
        return await publishToLinkedIn(post, apiKey);
      case 'instagram':
        return await publishToInstagram(post, apiKey);
      default:
        throw new Error('Unsupported platform');
    }
  } catch (error) {
    console.error(`Error publishing to ${post.platform}:`, error);
    throw error;
  }
};

const publishToTwitter = async (post: SocialMediaPost, apiKey: string) => {
  // Twitter API v2 endpoint
  const response = await fetch('https://api.twitter.com/2/tweets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: post.content,
    }),
  });

  if (!response.ok) {
    throw new Error(`Twitter API error: ${await response.text()}`);
  }

  return await response.json();
};

const publishToLinkedIn = async (post: SocialMediaPost, apiKey: string) => {
  // LinkedIn API endpoint
  const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      author: 'urn:li:person:{PERSON_ID}',
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: post.content
          },
          shareMediaCategory: 'NONE'
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      }
    }),
  });

  if (!response.ok) {
    throw new Error(`LinkedIn API error: ${await response.text()}`);
  }

  return await response.json();
};

const publishToInstagram = async (post: SocialMediaPost, apiKey: string) => {
  // Instagram Graph API endpoint
  const response = await fetch('https://graph.instagram.com/me/media', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      caption: post.content,
      media_type: post.mediaUrls ? 'IMAGE' : 'CAROUSEL',
      media_url: post.mediaUrls?.[0],
    }),
  });

  if (!response.ok) {
    throw new Error(`Instagram API error: ${await response.text()}`);
  }

  return await response.json();
};