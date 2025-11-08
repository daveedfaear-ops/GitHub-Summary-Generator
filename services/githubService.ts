
import { GitHubUrlParts, GitHubContentResponse } from '../types';

const GITHUB_API_BASE = 'https://api.github.com/repos';

function parseGitHubUrl(url: string): GitHubUrlParts | null {
  const issueRegex = /https?:\/\/github\.com\/([^\/]+)\/([^\/]+)\/issues\/(\d+)/;
  const prRegex = /https?:\/\/github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)/;
  const fileRegex = /https?:\/\/github\.com\/([^\/]+)\/([^\/]+)\/blob\/[^\/]+\/(.+)/;
  const repoRegex = /https?:\/\/github\.com\/([^\/]+)\/([^\/]+)(?:\/)?$/;
  const generalRepoRegex = /https?:\/\/github\.com\/([^\/]+)\/([^\/]+)/; // Fallback

  let match;

  if (match = url.match(issueRegex)) {
    return { owner: match[1], repo: match[2], type: 'issue', id: match[3] };
  }
  if (match = url.match(prRegex)) {
    return { owner: match[1], repo: match[2], type: 'pr', id: match[3] };
  }
  if (match = url.match(fileRegex)) {
    return { owner: match[1], repo: match[2], type: 'file', path: match[3] };
  }
  if (match = url.match(repoRegex)) {
    return { owner: match[1], repo: match[2], type: 'repo' };
  }
  if (match = url.match(generalRepoRegex)) {
    return { owner: match[1], repo: match[2], type: 'repo' };
  }

  return null;
}

async function fetchFromApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${GITHUB_API_BASE}/${endpoint}`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null; // Return null for 404s to handle gracefully (e.g., no README)
    }
    const errorData = await response.json().catch(() => ({ message: 'Failed to fetch from GitHub API.' }));
    throw new Error(`GitHub API Error: ${response.status} ${response.statusText}. ${errorData.message || ''}`);
  }
  // For 204 No Content, which can happen.
  if (response.status === 204) {
    return null;
  }
  return response.json();
}

async function getFileContent(owner: string, repo: string, path: string): Promise<{ content: string; name: string; type: 'file' }> {
  const fileData = await fetchFromApi<GitHubContentResponse>(`${owner}/${repo}/contents/${path}`);
  if (!fileData || fileData.encoding !== 'base64') {
    throw new Error('Could not retrieve file content or unsupported encoding.');
  }
  const decodedContent = atob(fileData.content);
  return { content: decodedContent, name: fileData.path, type: 'file' };
}

async function getRepoContent(owner: string, repo: string): Promise<{ content: string; name: string; type: 'repo' }> {
  const [readmeData, issuesData] = await Promise.all([
    fetchFromApi<GitHubContentResponse>(`${owner}/${repo}/readme`),
    fetchFromApi<any[]>(`${owner}/${repo}/issues?state=open&per_page=10&sort=updated`)
  ]);

  const readmeContent = readmeData ? atob(readmeData.content) : "No README file found.";
  const issuesList = issuesData && issuesData.length > 0
    ? issuesData.map(issue => `- Issue #${issue.number}: ${issue.title}`).join('\n')
    : "No recent open issues found.";
  
  const combinedContent = `
--- REPO README ---
${readmeContent}
--- END REPO README ---

--- RECENTLY UPDATED OPEN ISSUES ---
${issuesList}
--- END RECENTLY UPDATED OPEN ISSUES ---
  `;

  return { content: combinedContent, name: `${owner}/${repo}`, type: 'repo' };
}

async function getDiscussionContent(owner: string, repo: string, id: string, type: 'issue' | 'pr'): Promise<{ content: string; name: string; type: 'issue' | 'pr' }> {
  const endpoint = type === 'issue' ? 'issues' : 'pulls';
  const [mainData, commentsData] = await Promise.all([
    fetchFromApi<any>(`${owner}/${repo}/${endpoint}/${id}`),
    fetchFromApi<any[]>(`${owner}/${repo}/issues/${id}/comments?per_page=15&sort=created`)
  ]);

  if (!mainData) {
    throw new Error(`Could not fetch the ${type} details. It might be private or the URL is incorrect.`);
  }

  const commentsList = commentsData && commentsData.length > 0
    ? commentsData.map(c => `Comment by ${c.user.login}:\n${c.body}`).join('\n\n---\n')
    : "No comments on this thread.";

  const combinedContent = `
--- ${type.toUpperCase()} #${id}: ${mainData.title} ---
Opened by: ${mainData.user.login}
State: ${mainData.state}

--- BODY ---
${mainData.body || "No description provided."}
--- END BODY ---

--- COMMENTS ---
${commentsList}
--- END COMMENTS ---
  `;

  return { content: combinedContent, name: `${type.charAt(0).toUpperCase() + type.slice(1)} #${id} in ${owner}/${repo}`, type };
}


export async function getContent(url: string): Promise<{ content: string; name: string; type: GitHubUrlParts['type'] }> {
  const parts = parseGitHubUrl(url);

  if (!parts) {
    throw new Error('Invalid GitHub URL format. Please use a valid URL for a repository, file, issue, or pull request.');
  }

  switch(parts.type) {
    case 'repo':
      return getRepoContent(parts.owner, parts.repo);
    case 'file':
      if (!parts.path) throw new Error('File path not found in URL');
      return getFileContent(parts.owner, parts.repo, parts.path);
    case 'issue':
    case 'pr':
      if (!parts.id) throw new Error(`${parts.type} ID not found in URL`);
      return getDiscussionContent(parts.owner, parts.repo, parts.id, parts.type);
    default:
      throw new Error('Unsupported GitHub URL type.');
  }
}
