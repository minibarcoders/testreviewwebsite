'use client';

import { Client } from '@notionhq/client';
import { cache } from 'react';
import { unstable_cache } from 'next/cache';

if (!process.env.NOTION_API_KEY) {
  throw new Error('Missing NOTION_API_KEY environment variable');
}

if (!process.env.NOTION_DATABASE_ID) {
  throw new Error('Missing NOTION_DATABASE_ID environment variable');
}

export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export const databaseId = process.env.NOTION_DATABASE_ID;

// Cache duration: 1 hour
const CACHE_DURATION = 60 * 60;

export type Review = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string;
  author: {
    name: string;
    avatar: string;
  };
  content: any;
  performance: {
    score: number;
    pros: string[];
    cons: string[];
  };
};

// Cached database query function
export const queryDatabase = unstable_cache(
  async (filter?: any) => {
    try {
      const response = await notion.databases.query({
        database_id: databaseId,
        ...filter,
      });
      return response;
    } catch (error: any) {
      console.error('Error querying Notion database:', error);
      throw new Error(error.message || 'Failed to query Notion database');
    }
  },
  ['notion-database-query'],
  { revalidate: CACHE_DURATION }
);

// Get published articles function
export const getPublishedArticles = cache(async () => {
  try {
    const response = await queryDatabase({
      filter: {
        and: [
          {
            property: 'Status',
            status: {
              equals: 'Published',
            },
          },
          {
            property: 'Type',
            select: {
              equals: 'Article',
            },
          },
        ],
      },
      sorts: [
        {
          property: 'PublishedAt',
          direction: 'descending',
        },
      ],
    });

    return response.results.map((page: any) => ({
      id: page.id,
      title: page.properties.Title.title[0]?.plain_text || '',
      slug: page.properties.Slug.rich_text[0]?.plain_text || '',
      excerpt: page.properties.Excerpt.rich_text[0]?.plain_text || '',
      coverImage: page.properties.CoverImage.files[0]?.file?.url || '',
      publishedAt: page.properties.PublishedAt.date?.start || '',
      author: {
        name: page.properties.Author.rich_text[0]?.plain_text || '',
        avatar: page.properties.AuthorAvatar.files[0]?.file?.url || '',
      },
      content: page.properties.Content.rich_text[0]?.plain_text || '',
    }));
  } catch (error: any) {
    console.error('Error fetching published articles:', error);
    throw new Error(error.message || 'Failed to fetch published articles');
  }
});

// Cached page retrieval function
export const getPage = unstable_cache(
  async (pageId: string) => {
    try {
      const response = await notion.pages.retrieve({ page_id: pageId });
      return response;
    } catch (error: any) {
      console.error('Error retrieving Notion page:', error);
      throw new Error(error.message || 'Failed to retrieve Notion page');
    }
  },
  ['notion-page'],
  { revalidate: CACHE_DURATION }
);

// Cached block children retrieval function
export const getBlocks = unstable_cache(
  async (blockId: string) => {
    try {
      const response = await notion.blocks.children.list({
        block_id: blockId,
        page_size: 100,
      });
      return response;
    } catch (error: any) {
      console.error('Error retrieving Notion blocks:', error);
      throw new Error(error.message || 'Failed to retrieve Notion blocks');
    }
  },
  ['notion-blocks'],
  { revalidate: CACHE_DURATION }
);

// React cache for client-side data
export const getReviews = cache(async () => {
  try {
    const response = await queryDatabase({
      filter: {
        property: 'Status',
        status: {
          equals: 'Published',
        },
      },
      sorts: [
        {
          property: 'Date',
          direction: 'descending',
        },
      ],
    });

    return response.results.map((page: any) => {
      const properties = page.properties;
      return {
        id: page.id,
        slug: properties.Slug?.rich_text[0]?.plain_text || '',
        title: properties.Title?.title[0]?.plain_text || '',
        excerpt: properties.Excerpt?.rich_text[0]?.plain_text || '',
        coverImage: properties.CoverImage?.files[0]?.file?.url || '',
        publishedAt: properties.Date?.date?.start || '',
        author: {
          name: properties.Author?.rich_text[0]?.plain_text || '',
          avatar: properties.AuthorAvatar?.files[0]?.file?.url || '',
        },
        performance: {
          score: properties.Score?.number || 0,
          pros: properties.Pros?.multi_select?.map((item: any) => item.name) || [],
          cons: properties.Cons?.multi_select?.map((item: any) => item.name) || [],
        },
      };
    });
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    throw new Error(error.message || 'Failed to fetch reviews');
  }
});
