export async function notionToHtml(blocks: any[]) {
  let html = '';

  for (const block of blocks) {
    switch (block.type) {
      case 'paragraph':
        html += `<p>${transformRichText(block.paragraph.rich_text)}</p>`;
        break;
      case 'heading_1':
        html += `<h1>${transformRichText(block.heading_1.rich_text)}</h1>`;
        break;
      case 'heading_2':
        html += `<h2>${transformRichText(block.heading_2.rich_text)}</h2>`;
        break;
      case 'heading_3':
        html += `<h3>${transformRichText(block.heading_3.rich_text)}</h3>`;
        break;
      case 'bulleted_list_item':
        html += `<li>${transformRichText(block.bulleted_list_item.rich_text)}</li>`;
        break;
      case 'numbered_list_item':
        html += `<li>${transformRichText(block.numbered_list_item.rich_text)}</li>`;
        break;
      case 'image':
        const imageUrl = block.image.type === 'external' ? block.image.external.url : block.image.file.url;
        html += `<img src="${imageUrl}" alt="Article image" class="my-4 rounded-lg" />`;
        break;
      case 'code':
        html += `<pre><code class="language-${block.code.language}">${block.code.rich_text[0].plain_text}</code></pre>`;
        break;
      case 'quote':
        html += `<blockquote>${transformRichText(block.quote.rich_text)}</blockquote>`;
        break;
      case 'divider':
        html += '<hr />';
        break;
    }
  }

  return html;
}

function transformRichText(richText: any[]) {
  return richText
    .map((text) => {
      let content = text.plain_text;

      if (text.annotations.bold) {
        content = `<strong>${content}</strong>`;
      }
      if (text.annotations.italic) {
        content = `<em>${content}</em>`;
      }
      if (text.annotations.strikethrough) {
        content = `<del>${content}</del>`;
      }
      if (text.annotations.underline) {
        content = `<u>${content}</u>`;
      }
      if (text.annotations.code) {
        content = `<code>${content}</code>`;
      }
      if (text.href) {
        content = `<a href="${text.href}" target="_blank" rel="noopener noreferrer">${content}</a>`;
      }

      return content;
    })
    .join('');
}
