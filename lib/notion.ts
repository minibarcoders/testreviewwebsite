import { Client } from '@notionhq/client';

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

export async function getPublishedArticles() {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
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

    return response.results;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

export async function getArticleBySlug(slug: string) {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Slug',
        rich_text: {
          equals: slug,
        },
      },
    });

    return response.results[0];
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

export async function getAllArticles() {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: 'Date',
          direction: 'descending',
        },
      ],
    });

    return response.results;
  } catch (error) {
    console.error('Error fetching all articles:', error);
    return [];
  }
}
