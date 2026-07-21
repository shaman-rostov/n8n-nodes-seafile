import {
	type ILoadOptionsFunctions,
	type INodeListSearchItems,
	type INodeListSearchResult,
	type IRequestOptions,
} from 'n8n-workflow';

type Dirent = {
	name: string;
	type: 'dir' | 'file';
	parent_dir: string;
};

/**
 * Split what the user typed in the resource locator search box into the
 * directory that should be listed and a term to filter that directory by.
 *
 * The part up to (and including) the last slash is treated as the directory to
 * browse, the remainder is the filter term. This lets a user drill down lazily
 * just by typing a path, e.g. `/invoices/2024/inv` lists `/invoices/2024/` and
 * filters for `inv` - only ever loading a single level at a time.
 */
function splitFilter(filter?: string): { dir: string; term: string } {
	const value = filter ?? '';
	const lastSlash = value.lastIndexOf('/');
	if (lastSlash === -1) {
		return { dir: '/', term: value.toLowerCase() };
	}

	let dir = value.substring(0, lastSlash + 1);
	if (!dir.startsWith('/')) {
		dir = '/' + dir;
	}
	return { dir, term: value.substring(lastSlash + 1).toLowerCase() };
}

function joinPath(dir: string, name: string): string {
	return dir === '/' ? `/${name}` : `${dir.replace(/\/$/, '')}/${name}`;
}

/**
 * List a single directory level (non-recursive). Returns an empty list for
 * paths that do not (yet) exist so the resource locator keeps working while the
 * user is still typing a path.
 */
async function listDir(
	this: ILoadOptionsFunctions,
	repo: string,
	dir: string,
): Promise<Dirent[]> {
	const credentials = await this.getCredentials('seafileLazyApi');
	const baseURL = credentials?.domain;

	const options: IRequestOptions = {
		method: 'GET',
		qs: {
			p: dir,
		},
		uri: `${baseURL}/api/v2.1/repos/${repo}/dir/`,
		json: true,
	};

	try {
		const response = await this.helpers.requestWithAuthentication.call(
			this,
			'seafileLazyApi',
			options,
		);
		return (response?.dirent_list ?? []) as Dirent[];
	} catch {
		return [];
	}
}

/**
 * The resource locator's own search box is always empty when it is reopened -
 * n8n does not remember what was previously typed or selected. Without this,
 * reopening the dropdown would restart browsing at the library root every
 * time, making it impossible to drill down past one level. So when the box is
 * empty, fall back to the field's own currently selected value (tried under
 * each of its possible parameter names, since that name differs per
 * operation) and continue browsing from there instead of the root.
 */
function currentOwnValue(this: ILoadOptionsFunctions, candidates: string[]): string | undefined {
	for (const name of candidates) {
		let raw: unknown;
		try {
			raw = this.getCurrentNodeParameter(name);
		} catch {
			continue;
		}
		if (raw && typeof raw === 'object' && 'value' in raw) {
			const value = (raw as { value?: unknown }).value;
			if (typeof value === 'string' && value) return value;
		} else if (typeof raw === 'string' && raw) {
			return raw;
		}
	}
	return undefined;
}

async function browse(
	this: ILoadOptionsFunctions,
	repoParameterName: string,
	filter: string | undefined,
	include: 'folders' | 'files',
	ownParameterCandidates: string[],
): Promise<INodeListSearchResult> {
	const repo = this.getCurrentNodeParameter(repoParameterName) as string;
	if (!repo) {
		return { results: [] };
	}

	const effectiveFilter = filter || currentOwnValue.call(this, ownParameterCandidates);
	const { dir, term } = splitFilter(effectiveFilter);
	const entries = await listDir.call(this, repo, dir);

	const folders: INodeListSearchItems[] = [];
	const files: INodeListSearchItems[] = [];

	for (const entry of entries) {
		if (term && !entry.name.toLowerCase().includes(term)) {
			continue;
		}

		const fullPath = joinPath(dir, entry.name);
		if (entry.type === 'dir') {
			// Keep the trailing slash so a selected folder value stays a folder
			// path, and so typing it back navigates one level deeper.
			folders.push({ name: `${fullPath}/`, value: `${fullPath}/` });
		} else if (include === 'files') {
			files.push({ name: fullPath, value: fullPath });
		}
	}

	folders.sort((a, b) => a.name.localeCompare(b.name));
	files.sort((a, b) => a.name.localeCompare(b.name));

	const results: INodeListSearchItems[] = [];
	// Let the user pick the directory they are currently browsing (the root, or
	// whichever folder path they have typed so far).
	if (include === 'folders' && !term) {
		results.push({ name: dir, value: dir });
	}
	results.push(...folders, ...files);

	return { results };
}

export async function getFoldersList(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	return browse.call(this, 'repo', filter, 'folders', ['folder_path', 'search_path', 'target_path']);
}

export async function getTargetFoldersList(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	return browse.call(this, 'target_repo', filter, 'folders', ['target_path']);
}

export async function getFilesList(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	return browse.call(this, 'repo', filter, 'files', ['file_path']);
}
